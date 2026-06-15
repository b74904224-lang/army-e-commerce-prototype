// POST /api/orders — validates, persists and emails a new order.
// Returns { success, orderNumber, status } matching the frontend OrderResponse.

import { Router } from "express"
import rateLimit from "express-rate-limit"
import { orderSchema } from "../lib/validation.js"
import { validateBody } from "../middleware/validate.js"
import { saveOrder } from "../store/orders.js"
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

ordersRouter.post("/", orderLimiter, validateBody(orderSchema), async (req, res) => {
  const order = saveOrder(req.body)

  // Fire the notification but don't block the response on email delivery.
  void sendOrderNotification(order)

  res.status(201).json({
    success: true,
    orderNumber: order.orderNumber,
    status: order.status,
    message: "Order received",
  })
})
