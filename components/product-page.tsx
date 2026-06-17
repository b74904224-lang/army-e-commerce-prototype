"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore, Product } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import {
  getCategoryById,
  categoryName,
  formatPrice,
  makeSelectedVariant,
  type SelectedVariant,
} from "@/lib/catalog"
import Link from "next/link"
import { Heart, ShoppingBag, Zap, ChevronRight, Minus, Plus } from "lucide-react"

const translations = {
  ua: {
    addToCart: "Додати до кошика",
    buyNow: "Купити в 1 клік",
    addToFavorites: "В обране",
    inFavorites: "В обраному",
    description: "Опис",
    specifications: "Характеристики",
    inStock: "В наявності",
    outOfStock: "Немає в наявності",
    back: "Назад",
    new: "Новинка",
    quantity: "Кількість:",
    home: "Головна",
    catalog: "Каталог",
    chooseVariant: "Будь ласка, оберіть усі параметри товару"
  },
  ru: {
    addToCart: "Добавить в корзину",
    buyNow: "Купить в 1 клик",
    addToFavorites: "В избранное",
    inFavorites: "В избранном",
    description: "Описание",
    specifications: "Характеристики",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    back: "Назад",
    new: "Новинка",
    quantity: "Количество:",
    home: "Главная",
    catalog: "Каталог",
    chooseVariant: "Пожалуйста, выберите все параметры товара"
  },
  en: {
    addToCart: "Add to Cart",
    buyNow: "Buy in 1 Click",
    addToFavorites: "Add to Favorites",
    inFavorites: "In Favorites",
    description: "Description",
    specifications: "Specifications",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    back: "Back",
    new: "New",
    quantity: "Quantity:",
    home: "Home",
    catalog: "Catalog",
    chooseVariant: "Please select all product options"
  }
}

interface ProductPageProps {
  product: Product
}

export function ProductPage({ product }: ProductPageProps) {
  const {
    language,
    addToCart,
    toggleFavorite,
    isFavorite,
    openBuyNow
  } = useStore()
  const t = translations[language]
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description")
  const [quantity, setQuantity] = useState(1)
  // Map of variant groupId -> chosen optionId
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [variantError, setVariantError] = useState(false)
  const favorite = isFavorite(product.id)
  const category = getCategoryById(product.category)

  const variantGroups = product.variants ?? []
  const allVariantsChosen = variantGroups.every((g) => selectedOptions[g.id])

  const groupLabel = (g: (typeof variantGroups)[number]) =>
    language === "ru" ? g.labelRu : language === "en" ? g.labelEn : g.labelUa
  const optionLabel = (o: { labelUa: string; labelRu: string; labelEn: string }) =>
    language === "ru" ? o.labelRu : language === "en" ? o.labelEn : o.labelUa

  const buildSelectedVariants = (): SelectedVariant[] =>
    variantGroups
      .map((g) => makeSelectedVariant(g, selectedOptions[g.id]))
      .filter((v): v is SelectedVariant => v !== null)

  const selectOption = (groupId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: optionId }))
    setVariantError(false)
  }

  const getName = () => {
    switch (language) {
      case "ua": return product.nameUa
      case "ru": return product.nameRu
      default: return product.name
    }
  }

  const getDescription = () => {
    switch (language) {
      case "ua": return product.descriptionUa
      case "ru": return product.descriptionRu
      default: return product.description
    }
  }

  const getSpecifications = () => {
    switch (language) {
      case "ua": return product.specificationsUa
      case "ru": return product.specificationsRu
      default: return product.specifications
    }
  }

  const handleAddToCart = () => {
    if (!allVariantsChosen) {
      setVariantError(true)
      return
    }
    const variants = buildSelectedVariants()
    addToCart(product, quantity, variants.length ? variants : undefined)
  }

  const handleBuyNow = () => {
    if (!allVariantsChosen) {
      setVariantError(true)
      return
    }
    const variants = buildSelectedVariants()
    openBuyNow(product, variants.length ? variants : undefined)
  }

  const specs = getSpecifications()
  const specEntries = Object.entries(specs)
  // Real studio/field photos (roll mats) display best uncropped so they stay sharp
  const isPhoto = product.category === "roll-mats"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href={routes.home} className="hover:text-foreground transition-colors">
                {t.home}
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li>
              <Link href={routes.catalog} className="hover:text-foreground transition-colors">
                {t.catalog}
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li>
                  <Link
                    href={routes.category(category.id)}
                    className="hover:text-foreground transition-colors"
                  >
                    {categoryName(category, language)}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li className="text-foreground font-medium line-clamp-1 max-w-[200px] sm:max-w-none">
              {getName()}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-muted overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={getName()}
                loading="eager"
                decoding="async"
                className={`w-full h-full ${
                  isPhoto ? "object-contain p-4 bg-card" : "object-cover"
                } [image-rendering:auto]`}
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide">
                  {t.new}
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-primary"
                      : "ring-1 ring-border hover:ring-primary/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${getName()} - ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full ${
                      isPhoto ? "object-contain p-1 bg-card" : "object-cover"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {getName()}
              </h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                  {formatPrice(product.price, language)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, language)}
                  </span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${product.inStock ? "text-primary" : "text-destructive"}`}>
                {product.inStock ? t.inStock : t.outOfStock}
              </p>
            </div>

            {/* Variant Selectors */}
            {variantGroups.length > 0 && (
              <div className="space-y-5">
                {variantGroups.map((group) => {
                  const chosen = selectedOptions[group.id]
                  const showError = variantError && !chosen
                  return (
                    <div key={group.id}>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">{groupLabel(group)}:</span>
                        {chosen && (
                          <span className="text-sm text-muted-foreground">
                            {optionLabel(group.options.find((o) => o.id === chosen)!)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const active = chosen === option.id
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => selectOption(group.id, option.id)}
                              aria-pressed={active}
                              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                                active
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : showError
                                    ? "border-destructive text-foreground hover:border-primary"
                                    : "border-border text-foreground hover:border-primary"
                              }`}
                            >
                              {optionLabel(option)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {variantError && (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {t.chooseVariant}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {t.quantity}
              </span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {t.addToCart}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {t.buyNow}
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`w-full py-3 border font-medium transition-colors flex items-center justify-center gap-2 ${
                  favorite
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? "fill-current" : ""}`} />
                {favorite ? t.inFavorites : t.addToFavorites}
              </button>
            </div>

            {/* Tabs */}
            <div className="pt-6 border-t border-border">
              <div className="flex gap-6 border-b border-border">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === "description"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.description}
                  {activeTab === "description" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === "specifications"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.specifications}
                  {activeTab === "specifications" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="pt-4"
                >
                  {activeTab === "description" ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getDescription()}
                    </p>
                  ) : (
                    <dl className="space-y-3">
                      {specEntries.map(([key, value], index) => (
                        <div 
                          key={key} 
                          className={`flex justify-between py-2 ${index < specEntries.length - 1 ? "border-b border-border" : ""}`}
                        >
                          <dt className="text-muted-foreground">{key}</dt>
                          <dd className="font-medium text-foreground text-right">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
