import type { Metadata } from "next"
import { CategoryView } from "@/components/category-view"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Catalog — ARMY Tactical & Outdoor Equipment",
  description:
    "Browse the full ARMY catalog: roll mats, field seats, folding mats and sleeping bags made in Ukraine.",
  alternates: { canonical: canonical("/catalog") },
}

export default function CatalogPage() {
  return <CategoryView categoryId={null} />
}
