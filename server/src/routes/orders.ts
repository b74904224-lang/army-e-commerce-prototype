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
import { requireAuth } from "../middleware/requireAuth.js"
import { buildOrder, saveOrderBackup, getOrdersForUser } from "../store/orders.js"
import { PricingError } from "../lib/pricing.js"
import { sendOrderNotification } from "../lib/mailer.js"
import { verifyToken } from "../lib/auth.js"

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
  // Optional auth: if a valid JWT is present, link the order to the account.
  // Orders without a token still work exactly as before (no account link).
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null
  const payload = token ? verifyToken(token) : null
  const owner = payload ? { userId: payload.sub, userEmail: payload.email } : undefined

  // 1 + 2. Build the order with server-authoritative pricing.
  let order
  try {
    order = buildOrder(req.body, owner)
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

// GET /api/orders/me — list the authenticated user's own orders (newest first).
ordersRouter.get("/me", requireAuth, (req, res) => {
  const orders = getOrdersForUser(req.user!.sub, req.user!.email)
  // Strip audit-only fields before returning to the client.
  const sanitized = orders.map((o) => ({
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt,
    type: o.type,
    source: o.source,
    language: o.language,
    customer: o.customer,
    items: o.items,
    totals: o.totals,
    comment: o.comment,
  }))
  res.json({ orders: sanitized })
})

// GET /api/orders/stats — basic per-user statistics derived from their orders.
ordersRouter.get("/stats", requireAuth, (req, res) => {
  const orders = getOrdersForUser(req.user!.sub, req.user!.email)

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + o.totals.total, 0)
  const totalItems = orders.reduce(
    (sum, o) => sum + o.items.reduce((q, i) => q + i.quantity, 0),
    0,
  )

  // Orders are returned newest-first, so the first element is the latest order.
  const latest = orders[0]
  const lastOrder = latest
    ? { orderNumber: latest.orderNumber, createdAt: latest.createdAt, total: latest.totals.total }
    : null

  // Most frequently purchased product (by total quantity across all orders).
  const quantityByProduct = new Map<string, { name: string; quantity: number }>()
  for (const order of orders) {
    for (const item of order.items) {
      const current = quantityByProduct.get(item.productId)
      if (current) current.quantity += item.quantity
      else quantityByProduct.set(item.productId, { name: item.name, quantity: item.quantity })
    }
  }
  let mostPurchased: { productId: string; name: string; quantity: number } | null = null
  for (const [productId, info] of quantityByProduct) {
    if (!mostPurchased || info.quantity > mostPurchased.quantity) {
      mostPurchased = { productId, name: info.name, quantity: info.quantity }
    }
  }

  res.json({
    stats: { totalOrders, totalSpent, totalItems, lastOrder, mostPurchased },
  })
})
