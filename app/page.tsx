import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { ProductsGrid } from "@/components/products-grid"
import { AboutPreview } from "@/components/about-preview"
import { CategoryGrid } from "@/components/category-grid"
import { BenefitsSection } from "@/components/benefits-section"
import { AtmosphereSection } from "@/components/atmosphere-section"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  alternates: { canonical: canonical("/") },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsGrid type="new" />
      <AboutPreview />
      <CategoryGrid />
      <BenefitsSection />
      <ProductsGrid type="popular" />
      <AtmosphereSection />
    </>
  )
}
