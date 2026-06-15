"use client"

import { motion } from "framer-motion"
import { useStore, products, Product } from "@/lib/store-context"
import { ShoppingBag } from "lucide-react"

const translations = {
  ua: {
    newArrivals: "Новинки",
    popularProducts: "Популярні товари",
    addToCart: "В кошик",
    new: "Новинка"
  },
  ru: {
    newArrivals: "Новинки",
    popularProducts: "Популярные товары",
    addToCart: "В корзину",
    new: "Новинка"
  },
  en: {
    newArrivals: "New Arrivals",
    popularProducts: "Popular Products",
    addToCart: "Add to Cart",
    new: "New"
  }
}

interface ProductsGridProps {
  type: "new" | "popular"
}

export function ProductsGrid({ type }: ProductsGridProps) {
  const { language, addToCart, setSelectedProduct, setCurrentView } = useStore()
  const t = translations[language]

  const filteredProducts = type === "new" 
    ? products.filter(p => p.isNew) 
    : products.slice(0, 4)

  const getName = (product: Product) => {
    switch (language) {
      case "ua": return product.nameUa
      case "ru": return product.nameRu
      default: return product.name
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setCurrentView("product")
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10 sm:mb-12"
        >
          {type === "new" ? t.newArrivals : t.popularProducts}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => handleProductClick(product)}
                className="relative aspect-square overflow-hidden bg-muted w-full text-left"
              >
                <img
                  src={product.images[0]}
                  alt={getName(product)}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                    product.category === "roll-mats" ? "object-contain p-3 bg-card" : "object-cover"
                  }`}
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide">
                    {t.new}
                  </span>
                )}
              </button>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => handleProductClick(product)}
                  className="block text-left"
                >
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {getName(product)}
                  </h3>
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-foreground">{product.price} грн</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice} грн</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    aria-label={t.addToCart}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
