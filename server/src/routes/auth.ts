// /api/auth — register, login, and the authenticated profile endpoints.
// Returns { token, user } matching the frontend AuthResponse contract.

import { Router } from "express"
import rateLimit from "express-rate-limit"
import { registerSchema, loginSchema, updateProfileSchema } from "../lib/validation.js"
import { validateBody } from "../middleware/validate.js"
import { requireAuth } from "../middleware/requireAuth.js"
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js"
import { createUser, findUserByEmail, findUserById, updateUser } from "../store/users.js"

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
  const { name, email, password, phone } = req.body

  if (findUserByEmail(email)) {
    return res.status(409).json({ success: false, message: "A user with this email already exists" })
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser({ name, email, passwordHash, phone })
  const token = signToken({ sub: user.id, email: user.email, name: user.name })

  res.status(201).json({ token, user: { name: user.name, email: user.email, phone: user.phone } })
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
  res.json({ token, user: { name: user.name, email: user.email, phone: user.phone } })
})

// GET /api/auth/me — return the current authenticated profile.
authRouter.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.user!.sub)
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" })
  }
  res.json({ user: { name: user.name, email: user.email, phone: user.phone } })
})

// PATCH /api/auth/me — update mutable profile fields (name, phone).
authRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), async (req, res) => {
  const updated = await updateUser(req.user!.sub, {
    name: req.body.name,
    phone: req.body.phone,
  })
  if (!updated) {
    return res.status(404).json({ success: false, message: "User not found" })
  }
  res.json({ user: { name: updated.name, email: updated.email, phone: updated.phone } })
})
