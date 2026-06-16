import type { Metadata } from "next"
import { AboutPage } from "@/components/about-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "About — ARMY Tactical & Outdoor",
  description:
    "Learn about ARMY: Ukrainian-made tactical and outdoor equipment built on a Minimalism Outdoor philosophy.",
  alternates: { canonical: canonical("/about") },
}

export default function AboutRoute() {
  return <AboutPage />
}
