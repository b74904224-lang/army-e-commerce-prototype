"use client"

import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const translations = {
  ua: { new: "Новинки", about: "Про бренд", products: "Товар", blog: "Блог" },
  ru: { new: "Новинки", about: "О бренде", products: "Товары", blog: "Блог" },
  en: { new: "New", about: "About", products: "Products", blog: "Blog" }
}

export function Header() {
  const {
    language,
    setLanguage,
    cartCount,
    favorites,
    setIsCartOpen,
    setIsSearchOpen,
    setIsLoginOpen,
    setCurrentView,
    setSelectedCategory
  } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = translations[language]

  const handleNavClick = (view: "home" | "product" | "about" | "blog" | "category") => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  const handleNewClick = () => {
    setSelectedCategory(null)
    setCurrentView("category")
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            ARMY
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={handleNewClick}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.new}
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.about}
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null)
                handleNavClick("category")
              }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.products}
            </button>
            <button
              onClick={() => handleNavClick("blog")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.blog}
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => setLanguage("ua")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "ua" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                UA
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage("ru")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "ru" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RU
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "en" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            {/* Icons */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null)
                setCurrentView("category")
              }}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="px-4 py-4 flex flex-col gap-4">
              <button
                onClick={handleNewClick}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.new}
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.about}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  handleNavClick("category")
                }}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.products}
              </button>
              <button
                onClick={() => handleNavClick("blog")}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.blog}
              </button>
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setLanguage("ua")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "ua" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  UA
                </button>
                <button
                  onClick={() => setLanguage("ru")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
