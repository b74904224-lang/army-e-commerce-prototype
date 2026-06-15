// ARMY Store API — Express + TypeScript entrypoint.
// Security: helmet, configurable CORS allow-list, global rate limiting, JSON
// body size limits, gzip compression and request logging.

import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import rateLimit from "express-rate-limit"

import { env } from "./config/env.js"
import { productsRouter } from "./routes/products.js"
import { ordersRouter } from "./routes/orders.js"
import { authRouter } from "./routes/auth.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js"

const app = express()

// Trust the reverse proxy (Nginx) so rate-limiting sees real client IPs.
app.set("trust proxy", 1)

app.use(helmet())
app.use(compression())
app.use(morgan(env.isProduction ? "combined" : "dev"))

// CORS allow-list — only the configured frontend origins may call the API.
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin header) and any allow-listed origin.
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
)

app.use(express.json({ limit: "256kb" }))

// Global, lenient rate limit as a baseline safety net.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// Health check (used by Docker / load balancers).
app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }))

// API routes.
app.use("/api/products", productsRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/auth", authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`[server] ARMY Store API listening on port ${env.PORT} (${env.NODE_ENV})`)
  if (!env.smtpEnabled) {
    console.log("[server] SMTP not configured — order emails will be logged to console.")
  }
})
