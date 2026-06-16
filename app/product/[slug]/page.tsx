import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPage } from "@/components/product-page"
import { products, getProductBySlug } from "@/lib/catalog"
import { canonical, getSiteUrl } from "@/lib/site-routes"

interface ProductRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}

  const url = canonical(`/product/${product.slug}`)
  return {
    title: `${product.name} — ARMY`,
    description: product.description.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      url,
      type: "website",
      images: product.images.map((src) => ({
        url: src.startsWith("http") ? src : `${getSiteUrl()}${src}`,
      })),
    },
  }
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  // Product structured data for rich search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => (src.startsWith("http") ? src : `${getSiteUrl()}${src}`)),
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonical(`/product/${product.slug}`),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPage product={product} />
    </>
  )
}
