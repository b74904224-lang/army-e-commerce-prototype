// In-memory order store + human-readable order number generation.
// Replace the persistence layer with a real database for production.

import type { OrderInput } from "../lib/validation.js"

export interface StoredOrder extends OrderInput {
  orderNumber: string
  status: "received"
  createdAt: string
}

const orders: StoredOrder[] = []

/** Generates a readable order number, e.g. ARMY-LK3J9F-2026. */
export function generateOrderNumber(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  const year = new Date().getFullYear()
  return `ARMY-${random}-${year}`
}

export function saveOrder(input: OrderInput): StoredOrder {
  const order: StoredOrder = {
    ...input,
    orderNumber: generateOrderNumber(),
    status: "received",
    createdAt: new Date().toISOString(),
  }
  orders.push(order)
  return order
}
