"use client"

import { motion } from "framer-motion"
import { useStore, categories, type Product } from "@/lib/store-context"
import { useProducts } from "@/lib/use-products"
import { formatPrice } from "@/lib/catalog"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"

const translations = {
  ua: {
    allProducts: "Всі товари",
    new: "Новинка",
    addToCart: "В кошик",
    noProducts: "Товари не знайдено"
  },
  ru: {
    allProducts: "Все товары",
    new: "Новинка",
    addToCart: "В корзину",
    noProducts: "Товары не найдены"
  },
  en: {
    allProducts: "All Products",
    new: "New",
    addToCart: "Add to Cart",
    noProducts: "No products found"
  }
}

interface CategoryViewProps {
  /** Active category id, or null for the full catalog. */
  categoryId?: string | null
}

export function CategoryView({ categoryId = null }: CategoryViewProps) {
  const {
    language,
    addToCart,
    toggleFavorite,
    isFavorite
  } = useStore()
  const { products } = useProducts()
  const t = translations[language]

  const displayProducts = categoryId
    ? products.filter(p => p.category === categoryId)
    : products

  const getCategoryName = (category: typeof categories[0]) => {
    switch (language) {
      case "ua": return category.nameUa
      case "ru": return category.nameRu
      default: return category.name
    }
  }

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

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href={routes.catalog}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                categoryId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {t.allProducts}
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={routes.category(category.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  categoryId === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {getCategoryName(category)}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayProducts.map((product, index) => {
              const favorite = isFavorite(product.id)
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden mb-4">
                    <Link
                      href={routes.product(product.slug)}
                      className="block w-full h-full"
                    >
                      <img
                        src={product.images[0]}
                        alt={getProductName(product)}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                          product.category === "roll-mats" ? "object-contain p-3 bg-card" : "object-cover"
                        }`}
                      />
                    </Link>
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide">
                        {t.new}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favorite
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/90 text-foreground hover:bg-white"
                        }`}
                        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2.5 bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {t.addToCart}
                      </button>
                    </div>
                  </div>
                  <Link
                    href={routes.product(product.slug)}
                    className="text-left w-full block"
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {getProductCategory(product)}
                    </p>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {getProductName(product)}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-bold text-foreground">{formatPrice(product.price, language)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice, language)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t.noProducts}</p>
          </div>
        )}
      </div>
    </div>
  )
}
