import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Checkout — ARMY",
  description: "Complete your ARMY order: contact details, delivery and payment method.",
  alternates: { canonical: canonical("/checkout") },
  robots: { index: false, follow: true },
}

export default function CheckoutRoute() {
  return <CheckoutPage />
}
