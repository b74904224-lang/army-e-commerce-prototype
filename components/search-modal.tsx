"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore, type Product } from "@/lib/store-context"
import { useProducts } from "@/lib/use-products"
import { routes } from "@/lib/site-routes"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

const translations = {
  ua: {
    placeholder: "Пошук товарів...",
    noResults: "Нічого не знайдено",
    recentSearches: "Нещодавні пошуки"
  },
  ru: {
    placeholder: "Поиск товаров...",
    noResults: "Ничего не найдено",
    recentSearches: "Недавние поиски"
  },
  en: {
    placeholder: "Search products...",
    noResults: "No results found",
    recentSearches: "Recent searches"
  }
}

export function SearchModal() {
  const {
    language,
    isSearchOpen,
    setIsSearchOpen
  } = useStore()
  const { products } = useProducts()
  const router = useRouter()
  const t = translations[language]
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [setIsSearchOpen])

  const getProductName = (product: Product) => {
    switch (language) {
      case "ua": return product.nameUa
      case "ru": return product.nameRu
      default: return product.name
    }
  }

  const getProductCategory = (product: Product) => {
    switch (language) {
      case "ua": return product.categoryUa
      case "ru": return product.categoryRu
      default: return product.category
    }
  }

  const filteredProducts = query.length > 0
    ? products.filter(product => {
        const name = getProductName(product).toLowerCase()
        const category = getProductCategory(product).toLowerCase()
        const searchQuery = query.toLowerCase()
        return name.includes(searchQuery) || category.includes(searchQuery)
      })
    : []

  const handleProductClick = (product: Product) => {
    router.push(routes.product(product.slug))
    setIsSearchOpen(false)
    setQuery("")
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-foreground/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
            <div className="max-w-2xl mx-auto bg-background rounded shadow-xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length > 0 ? (
                  filteredProducts.length > 0 ? (
                    <div className="p-2">
                      {filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-muted rounded transition-colors text-left"
                        >
                          <img
                            src={product.images[0]}
                            alt={getProductName(product)}
                            className="w-14 h-14 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {getProductName(product)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getProductCategory(product)}
                            </p>
                          </div>
                          <span className="font-semibold text-foreground">
                            {product.price} грн
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      {t.noResults}
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    {t.recentSearches}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
