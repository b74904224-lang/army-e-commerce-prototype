import type { Metadata } from "next"
import { CartView } from "@/components/cart-view"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Cart — ARMY",
  description: "Review the items in your shopping cart and proceed to checkout.",
  alternates: { canonical: canonical("/cart") },
  robots: { index: false, follow: true },
}

export default function CartPage() {
  return <CartView />
}
