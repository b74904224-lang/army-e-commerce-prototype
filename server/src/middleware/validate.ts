// Generic Zod body-validation middleware. On failure returns 422 with details.

import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      })
    }
    // Replace body with the parsed/normalized data.
    req.body = result.data
    next()
  }
}
