/**
 * Centralized site URL helper used by SEO surfaces (sitemap, robots, canonical
 * metadata). Kept free of client-only imports so it is safe to use in Server
 * Components and route handlers.
 */

/** Absolute site origin, e.g. https://armytak.com (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined)

  return (fromEnv ?? "https://armytak.com").replace(/\/$/, "")
}

/* -------------------------------------------------------------------------- */
/*  Route builders — single source of truth for in-app links.                */
/* -------------------------------------------------------------------------- */

export const routes = {
  home: "/",
  catalog: "/catalog",
  category: (id: string) => `/catalog/${id}`,
  product: (slug: string) => `/product/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  about: "/about",
  contacts: "/contacts",
  deliveryPayment: "/delivery-payment",
  returns: "/returns",
  privacyPolicy: "/privacy-policy",
  blog: "/blog",
  account: "/account",
  accountProfile: "/account/profile",
  accountOrders: "/account/orders",
  accountStatistics: "/account/statistics",
  login: "/login",
  register: "/register",
} as const

/** Absolute canonical URL for a given path (e.g. routes.product(slug)). */
export function canonical(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`
}
