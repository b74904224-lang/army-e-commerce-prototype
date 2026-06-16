"use client"

import type { ReactNode } from "react"
import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchModal } from "@/components/search-modal"
import { BuyNowModal } from "@/components/buy-now-modal"
import { Notification } from "@/components/notification"

/**
 * Client shell mounted once in the root layout. It provides the global store
 * (cart, favorites, language, auth/session) and renders the persistent header,
 * footer and overlay UI (cart drawer, search, quick-order modal, toasts) around
 * every routed page.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <BuyNowModal />
        <Notification />
      </div>
    </StoreProvider>
  )
}
