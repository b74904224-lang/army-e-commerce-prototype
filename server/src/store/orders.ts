// Order persistence: in-memory list + durable append-only JSONL backup file.
//
// The JSONL backup (data/orders.jsonl) guarantees an order is never lost if
// email delivery fails or the process restarts. NEVER write cards/CVV/passwords
// here — the API does not collect them in the first place.

import { promises as fs } from "node:fs"
import fsSync from "node:fs"
import path from "node:path"
import type { OrderInput } from "../lib/validation.js"
import { priceOrder, type PricedItem } from "../lib/pricing.js"

export interface StoredOrder {
  orderNumber: string
  status: "received"
  createdAt: string
  /** Owner account id when the order was placed while authenticated. */
  userId?: string
  /** Owner email when known (authenticated user or provided at checkout). */
  userEmail?: string
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

// Load existing orders synchronously at boot so account history survives restarts.
function loadFromDisk() {
  try {
    if (!fsSync.existsSync(BACKUP_FILE)) return
    const raw = fsSync.readFileSync(BACKUP_FILE, "utf8")
    for (const line of raw.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        orders.push(JSON.parse(trimmed) as StoredOrder)
      } catch {
        // skip corrupted line
      }
    }
    console.log(`[orders] Loaded ${orders.length} order(s) from ${BACKUP_FILE}`)
  } catch (err) {
    console.error("[orders] Failed to load orders from disk:", err)
  }
}

loadFromDisk()

/** Generates a readable order number, e.g. ARMY-LK3J9F-2026. */
export function generateOrderNumber(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  const year = new Date().getFullYear()
  return `ARMY-${random}-${year}`
}

/**
 * Builds a StoredOrder with server-authoritative pricing. Throws PricingError
 * (handled as HTTP 422 by the route) if any item is invalid/out of stock.
 *
 * `owner` links the order to an authenticated account when present.
 */
export function buildOrder(
  input: OrderInput,
  owner?: { userId?: string; userEmail?: string },
): StoredOrder {
  const priced = priceOrder(input)
  return {
    orderNumber: generateOrderNumber(),
    status: "received",
    createdAt: new Date().toISOString(),
    userId: owner?.userId,
    userEmail: owner?.userEmail ?? input.customer.email,
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

/**
 * Returns orders that belong to a given user — matched by account id OR by the
 * email captured on the order (covers orders placed before login on the same
 * email). Newest first.
 */
export function getOrdersForUser(userId: string, email: string): StoredOrder[] {
  const normalizedEmail = email.toLowerCase()
  return orders
    .filter(
      (o) =>
        (o.userId && o.userId === userId) ||
        (o.userEmail && o.userEmail.toLowerCase() === normalizedEmail),
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

