import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryView } from "@/components/category-view"
import { categories, getCategoryById } from "@/lib/catalog"
import { canonical } from "@/lib/site-routes"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const found = getCategoryById(category)
  if (!found) return {}
  return {
    title: `${found.name} — ARMY`,
    description: `Shop ${found.name} from ARMY. Tactical and outdoor equipment made in Ukraine.`,
    alternates: { canonical: canonical(`/catalog/${found.id}`) },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  if (!getCategoryById(category)) notFound()
  return <CategoryView categoryId={category} />
}
