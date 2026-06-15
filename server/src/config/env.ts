// Loads, validates and exposes typed environment configuration.
// The process refuses to boot in production with an insecure/missing JWT secret.

import "dotenv/config"
import { z } from "zod"

const booleanish = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1")

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().default(""),
  JWT_EXPIRES_IN: z.string().default("7d"),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: booleanish,
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  ORDER_NOTIFICATION_FROM: z.string().default("ARMYTAK <orders@armytak.com>"),
  ORDER_NOTIFICATION_TO: z.string().default("orders@armytak.com"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("[config] Invalid environment configuration:")
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

const data = parsed.data

// In production a strong JWT secret is mandatory.
if (data.NODE_ENV === "production" && data.JWT_SECRET.length < 32) {
  console.error(
    "[config] JWT_SECRET must be at least 32 characters in production. Generate one with: openssl rand -base64 48",
  )
  process.exit(1)
}

export const env = {
  ...data,
  isProduction: data.NODE_ENV === "production",
  // In dev we tolerate a missing secret with a clearly-labeled fallback.
  jwtSecret: data.JWT_SECRET || "dev-insecure-secret-change-me",
  corsOrigins: data.CORS_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  smtpEnabled: data.SMTP_HOST.length > 0,
}
