// Bearer-token auth guard. Attaches the decoded JWT payload to req.user.

import type { Request, Response, NextFunction } from "express"
import { verifyToken, type JwtPayload } from "../lib/auth.js"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" })
  }

  req.user = payload
  next()
}
