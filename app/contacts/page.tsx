import type { Metadata } from "next"
import { ContactsView } from "@/components/contacts-view"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Contacts — ARMY",
  description: "Contact ARMY by phone or email for orders and support.",
  alternates: { canonical: canonical("/contacts") },
}

export default function ContactsRoute() {
  return <ContactsView />
}
