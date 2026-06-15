// Order persistence: in-memory list + durable append-only JSONL backup file.
//
// The JSONL backup (data/orders.jsonl) guarantees an order is never lost if
// email delivery fails or the process restarts. NEVER write cards/CVV/passwords
// here — the API does not collect them in the first place.

import { promises as fs } from "node:fs"
import path from "node:path"
import type { OrderInput } from "../lib/validation.js"
import { priceOrder, type PricedItem } from "../lib/pricing.js"

export interface StoredOrder {
  orderNumber: string
  status: "received"
  createdAt: string
  type: OrderInput["type"]
  source: OrderInput["source"]
  language: OrderInput["language"]
  customer: OrderInput["customer"]
  delivery: OrderInput["delivery"]
  payment: OrderInput["payment"]
  comment?: string
  /** Server-recomputed line items (authoritative prices). */
  items: PricedItem[]
  /** Server-recomputed totals (authoritative). */
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  /** What the browser claimed — kept only for audit/debugging. */
  clientTotals: OrderInput["totals"]
}

const orders: StoredOrder[] = []

const DATA_DIR = path.resolve(process.cwd(), "data")
const BACKUP_FILE = path.join(DATA_DIR, "orders.jsonl")

/** Generates a readable order number, e.g. ARMY-LK3J9F-2026. */
export function generateOrderNumber(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  const year = new Date().getFullYear()
  return `ARMY-${random}-${year}`
}

/**
 * Builds a StoredOrder with server-authoritative pricing. Throws PricingError
 * (handled as HTTP 422 by the route) if any item is invalid/out of stock.
 */
export function buildOrder(input: OrderInput): StoredOrder {
  const priced = priceOrder(input)
  return {
    orderNumber: generateOrderNumber(),
    status: "received",
    createdAt: new Date().toISOString(),
    type: input.type,
    source: input.source,
    language: input.language,
    customer: input.customer,
    delivery: input.delivery,
    payment: input.payment,
    comment: input.comment,
    items: priced.items,
    totals: {
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      total: priced.total,
    },
    clientTotals: input.totals,
  }
}

/**
 * Persists the order to the durable JSONL backup before anything else.
 * Must succeed before the API confirms the order to the customer.
 */
export async function saveOrderBackup(order: StoredOrder): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.appendFile(BACKUP_FILE, JSON.stringify(order) + "\n", "utf8")
  orders.push(order)
}
