// Server-safe route constants for SEO (sitemap/robots/canonical).
// Kept free of any "use client" imports so it can run in server components.

export const SITE_URL = "https://armytak.com"

/** Product detail slugs (mirrors the catalog ids in lib/store-context.tsx). */
export const PRODUCT_IDS = [
  "army-l0",
  "army-l1",
  "field-seat-01",
  "folding-mat-01",
  "sleeping-bag-01",
  "sleeping-bag-02",
] as const

/** Category slugs used by the storefront. */
export const CATEGORY_IDS = [
  "roll-mats",
  "field-seats",
  "folding-mats",
  "sleeping-bags",
] as const

/** Logical top-level pages of the storefront. */
export const STATIC_PATHS = [
  "/",
  "/catalog",
  "/about",
  "/blog",
  "/checkout",
  "/contacts",
  "/delivery-payment",
  "/privacy-policy",
  "/returns",
] as const
