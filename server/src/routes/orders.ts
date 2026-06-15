// POST /api/orders — validates, prices (server-side), backs up and emails a
// new order. Returns { success, orderNumber, status } matching the frontend
// OrderResponse.
//
// Production flow (all steps must succeed before success:true is returned):
//   1. validate body (Zod)
//   2. recompute prices/totals from the server catalog (reject unknown/OOS)
//   3. persist a durable backup to data/orders.jsonl
//   4. send the admin notification email (awaited)

import { Router } from "express"
import rateLimit from "express-rate-limit"
import { orderSchema } from "../lib/validation.js"
import { validateBody } from "../middleware/validate.js"
import { buildOrder, saveOrderBackup } from "../store/orders.js"
import { PricingError } from "../lib/pricing.js"
import { sendOrderNotification } from "../lib/mailer.js"

export const ordersRouter = Router()

// Throttle order submissions to reduce spam/abuse.
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many orders, please try again later." },
})

ordersRouter.post("/", orderLimiter, validateBody(orderSchema), async (req, res, next) => {
  // 1 + 2. Build the order with server-authoritative pricing.
  let order
  try {
    order = buildOrder(req.body)
  } catch (err) {
    if (err instanceof PricingError) {
      return res.status(422).json({
        success: false,
        message: "Some items are unavailable. Please review your cart.",
        invalidItems: err.invalidItems,
      })
    }
    return next(err)
  }

  // 3. Durable backup — must succeed before we confirm the order.
  try {
    await saveOrderBackup(order)
  } catch (err) {
    console.error("[orders] Failed to write order backup:", err)
    return res.status(503).json({
      success: false,
      message: "Could not save your order. Please try again shortly.",
    })
  }

  // 4. Notify the administrator. The email is the primary business outcome,
  // so a delivery failure means we must NOT report success to the customer.
  try {
    await sendOrderNotification(order)
  } catch (err) {
    console.error("[orders] Order saved but email delivery failed:", err)
    return res.status(502).json({
      success: false,
      orderNumber: order.orderNumber,
      message:
        "Your order was saved but we could not notify our team automatically. Please contact us to confirm.",
    })
  }

  res.status(201).json({
    success: true,
    orderNumber: order.orderNumber,
    status: order.status,
    message: "Order received",
  })
})
