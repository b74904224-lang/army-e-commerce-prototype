"use client"

import { StoreProvider, useStore } from "@/lib/store-context"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductsGrid } from "@/components/products-grid"
import { AboutPreview } from "@/components/about-preview"
import { CategoryGrid } from "@/components/category-grid"
import { BenefitsSection } from "@/components/benefits-section"
import { AtmosphereSection } from "@/components/atmosphere-section"
import { ProductPage } from "@/components/product-page"
import { CategoryView } from "@/components/category-view"
import { AboutPage } from "@/components/about-page"
import { BlogPage } from "@/components/blog-page"
import { CheckoutPage } from "@/components/checkout-page"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchModal } from "@/components/search-modal"
import { LoginModal } from "@/components/login-modal"
import { BuyNowModal } from "@/components/buy-now-modal"
import { Notification } from "@/components/notification"
import { Footer } from "@/components/footer"
import { AnimatePresence, motion } from "framer-motion"

function MainContent() {
  const { currentView, selectedProduct } = useStore()

  return (
    <AnimatePresence mode="wait">
      {currentView === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeroSection />
          <ProductsGrid type="new" />
          <AboutPreview />
          <CategoryGrid />
          <BenefitsSection />
          <ProductsGrid type="popular" />
          <AtmosphereSection />
        </motion.div>
      )}

      {currentView === "product" && selectedProduct && (
        <motion.div
          key="product"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProductPage product={selectedProduct} />
        </motion.div>
      )}

      {currentView === "category" && (
        <motion.div
          key="category"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CategoryView />
        </motion.div>
      )}

      {currentView === "about" && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AboutPage />
        </motion.div>
      )}

      {currentView === "blog" && (
        <motion.div
          key="blog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BlogPage />
        </motion.div>
      )}

      {currentView === "checkout" && (
        <motion.div
          key="checkout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CheckoutPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MainContent />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <LoginModal />
      <BuyNowModal />
      <Notification />
    </div>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}
