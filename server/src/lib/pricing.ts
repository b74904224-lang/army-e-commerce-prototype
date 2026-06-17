// Server-side order pricing — the backend NEVER trusts prices/totals sent by
// the browser. It re-reads each product from the local catalog, validates
// availability, and recomputes subtotal / shipping / total authoritatively.

import { products } from "../data/products.js"
import type { OrderInput } from "./validation.js"

/** Home (courier) delivery flat fee in UAH. Branch pickup is "by tariff" (0). */
export const HOME_DELIVERY_FEE = 80

export class PricingError extends Error {
  /** Items that could not be priced (missing from catalog or out of stock). */
  invalidItems: string[]
  constructor(message: string, invalidItems: string[]) {
    super(message)
    this.name = "PricingError"
    this.invalidItems = invalidItems
  }
}

export interface PricedItemVariant {
  groupId: string
  groupLabel: string
  optionId: string
  optionLabel: string
}

export interface PricedItem {
  productId: string
  name: string
  /** Authoritative unit price from the catalog (UAH). */
  price: number
  quantity: number
  lineTotal: number
  /** Human-readable variant summary (server-validated), e.g. "Колір: Olive Green". */
  variant?: string
  /** Server-validated variant selections (labels re-read from catalog). */
  variants?: PricedItemVariant[]
}

export interface PricedOrder {
  items: PricedItem[]
  subtotal: number
  shipping: number
  total: number
}

/**
 * Recomputes an order's pricing from the server catalog.
 * Throws PricingError (→ HTTP 422) when any item is unknown or out of stock.
 */
export function priceOrder(order: OrderInput): PricedOrder {
  const invalidItems: string[] = []
  const items: PricedItem[] = []

  for (const requested of order.items) {
    const product = products.find((p) => p.id === requested.productId)
    if (!product || !product.inStock) {
      invalidItems.push(requested.productId)
      continue
    }
    const quantity = Math.max(1, Math.floor(requested.quantity))
    const lineTotal = product.price * quantity
    // Variants don't affect price (price is authoritative from the catalog), but
    // we preserve the customer's validated selection so the manager sees it.
    const variants = requested.variants?.map((v) => ({
      groupId: v.groupId,
      groupLabel: v.groupLabel,
      optionId: v.optionId,
      optionLabel: v.optionLabel,
    }))
    const variant =
      requested.variant ||
      (variants && variants.length > 0
        ? variants.map((v) => `${v.groupLabel}: ${v.optionLabel}`).join(", ")
        : undefined)
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal,
      ...(variant ? { variant } : {}),
      ...(variants && variants.length > 0 ? { variants } : {}),
    })
  }

  if (invalidItems.length > 0 || items.length === 0) {
    throw new PricingError(
      "One or more items are unavailable or unknown.",
      invalidItems,
    )
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
  // Quick orders have no delivery selection yet; charge no shipping up front.
  const shipping =
    order.type === "checkout" && order.delivery.type === "home" ? HOME_DELIVERY_FEE : 0
  const total = subtotal + shipping

  return { items, subtotal, shipping, total }
}
