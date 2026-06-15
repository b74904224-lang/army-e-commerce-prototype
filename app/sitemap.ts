import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-routes"

// The storefront is a single-route client app — navigation is driven by in-app
// state, not URLs — so the site root is the only crawlable page.
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
