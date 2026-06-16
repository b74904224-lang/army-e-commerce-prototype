import type { Metadata } from "next"
import { BlogPage } from "@/components/blog-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Blog — ARMY",
  description: "Field notes, guides and stories from ARMY on tactical and outdoor gear.",
  alternates: { canonical: canonical("/blog") },
}

export default function BlogRoute() {
  return <BlogPage />
}
