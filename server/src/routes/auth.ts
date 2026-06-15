// POST /api/auth/register and /api/auth/login.
// Returns { token, user } matching the frontend AuthResponse contract.

import { Router } from "express"
import rateLimit from "express-rate-limit"
import { registerSchema, loginSchema } from "../lib/validation.js"
import { validateBody } from "../middleware/validate.js"
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js"
import { createUser, findUserByEmail } from "../store/users.js"

export const authRouter = Router()

// Stricter rate limiting on auth endpoints to slow brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later." },
})

authRouter.post("/register", authLimiter, validateBody(registerSchema), async (req, res) => {
  const { name, email, password } = req.body

  if (findUserByEmail(email)) {
    return res.status(409).json({ success: false, message: "A user with this email already exists" })
  }

  const passwordHash = await hashPassword(password)
  const user = createUser({ name, email, passwordHash })
  const token = signToken({ sub: user.id, email: user.email, name: user.name })

  res.status(201).json({ token, user: { name: user.name, email: user.email } })
})

authRouter.post("/login", authLimiter, validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body

  const user = findUserByEmail(email)
  // Always run a comparison to reduce user-enumeration timing differences.
  const ok = user ? await verifyPassword(password, user.passwordHash) : false

  if (!user || !ok) {
    return res.status(401).json({ success: false, message: "Invalid email or password" })
  }

  const token = signToken({ sub: user.id, email: user.email, name: user.name })
  res.json({ token, user: { name: user.name, email: user.email } })
})
