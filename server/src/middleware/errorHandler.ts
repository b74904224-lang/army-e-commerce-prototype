// Centralized 404 + error handlers.

import type { Request, Response, NextFunction } from "express"
import { env } from "../config/env.js"

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Not found" })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[error]", err)
  const message =
    !env.isProduction && err instanceof Error ? err.message : "Internal server error"
  res.status(500).json({ success: false, message })
}
