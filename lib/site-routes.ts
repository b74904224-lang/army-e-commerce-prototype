/**
 * Centralized site URL helper used by SEO surfaces (sitemap, robots, canonical
 * metadata). Kept free of client-only imports so it is safe to use in Server
 * Components and route handlers.
 *
 * The storefront is a single-route client app (navigation is driven by in-app
 * state, not URLs), so the only crawlable page is the site root.
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
