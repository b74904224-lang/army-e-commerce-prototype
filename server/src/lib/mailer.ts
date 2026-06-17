// Order notification email via Nodemailer.
//
// When SMTP is not configured (SMTP_HOST empty), orders are logged to the
// console instead of being emailed — handy for local development.

import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"
import { env } from "../config/env.js"
import type { StoredOrder } from "../store/orders.js"

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (!env.smtpEnabled) return null
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE, // true for 465, false for other ports
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  })
  return transporter
}

const serviceLabels: Record<string, string> = {
  nova_poshta: "Нова Пошта",
  ukr_poshta: "Укрпошта",
  meest: "Міст Пошта (Meest)",
  other: "Інша служба",
  not_required_for_quick_order: "Уточнюється менеджером",
}

const paymentLabels: Record<string, string> = {
  cod: "Післяплата (оплата при отриманні)",
  bank_transfer: "Оплата на реквізити",
  manager_confirmation: "Уточнення оплати менеджером",
}

/** Item-level price: 0 means the price list is pending → "за запитом". */
function itemPrice(value: number): string {
  return !value || value <= 0 ? "Ціна за запитом" : `${value} грн`
}

/** Order-level amount: 0 means it must be confirmed by a manager. */
function orderAmount(value: number): string {
  return !value || value <= 0 ? "уточнюється менеджером" : `${value} грн`
}

function renderOrderText(order: StoredOrder): string {
  const { customer, delivery, payment, items, totals } = order
  const address =
    delivery.type === "branch"
      ? `Відділення №${delivery.branchNumber ?? "-"}`
      : delivery.type === "home"
        ? `вул. ${delivery.street ?? "-"}, буд. ${delivery.building ?? "-"}, кв. ${delivery.apartment ?? "-"}`
        : "Не потребується (швидке замовлення)"

  const itemLines = items
    .map((i) => `  • ${i.name} ×${i.quantity} — ${itemPrice(i.price)}`)
    .join("\n")

  return [
    `НОВЕ ЗАМОВЛЕННЯ: ${order.orderNumber}`,
    `Тип: ${order.type === "quick_order" ? "Швидке замовлення" : "Повне оформлення"}`,
    `Джерело: ${order.source}`,
    `Дата: ${order.createdAt}`,
    "",
    "КЛІЄНТ",
    `  Ім'я: ${customer.name}`,
    `  Телефон: ${customer.phone}`,
    `  Email: ${customer.email ?? "-"}`,
    "",
    "ДОСТАВКА",
    `  Служба: ${serviceLabels[delivery.service] ?? delivery.service}`,
    `  Місто: ${delivery.city ?? "-"}`,
    `  Адреса: ${address}`,
    "",
    `ОПЛАТА: ${paymentLabels[payment.method] ?? payment.method}`,
    "",
    "ТОВАРИ",
    itemLines,
    "",
    `Сума товарів: ${orderAmount(totals.subtotal)}`,
    `Доставка: ${totals.shipping === 0 ? "за тарифами" : `${totals.shipping} грн`}`,
    `ЗАГАЛОМ: ${orderAmount(totals.total)}`,
    order.comment ? `\nКоментар: ${order.comment}` : "",
  ].join("\n")
}

/**
 * Sends the order notification email to the administrator.
 *
 * - SMTP configured: awaits delivery and THROWS on failure so the caller can
 *   refuse to confirm the order (the admin email is the primary deliverable).
 * - SMTP not configured: allowed only outside production — logs to console and
 *   resolves. In production a missing SMTP config is rejected upstream.
 */
export async function sendOrderNotification(order: StoredOrder): Promise<void> {
  const text = renderOrderText(order)
  const tx = getTransporter()

  if (!tx) {
    if (env.isProduction) {
      throw new Error("SMTP is not configured — cannot deliver order notification in production.")
    }
    console.log("[mailer] SMTP disabled (dev) — order notification:\n" + text)
    return
  }

  // Let delivery errors propagate to the route handler.
  await tx.sendMail({
    from: env.ORDER_NOTIFICATION_FROM,
    to: env.ORDER_NOTIFICATION_TO,
    subject: `Нове замовлення ${order.orderNumber} — ${orderAmount(order.totals.total)}`,
    text,
  })
}
