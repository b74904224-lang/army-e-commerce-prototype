"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

const translations = {
  ua: {
    title: "Кошик",
    empty: "Ваш кошик порожній",
    continueShopping: "Продовжити покупки",
    total: "Всього",
    checkout: "Оформити замовлення",
    remove: "Видалити"
  },
  ru: {
    title: "Корзина",
    empty: "Ваша корзина пуста",
    continueShopping: "Продолжить покупки",
    total: "Итого",
    checkout: "Оформить заказ",
    remove: "Удалить"
  },
  en: {
    title: "Cart",
    empty: "Your cart is empty",
    continueShopping: "Continue Shopping",
    total: "Total",
    checkout: "Checkout",
    remove: "Remove"
  }
}

export function CartDrawer() {
  const {
    language,
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    setCurrentView,
    setSelectedCategory
  } = useStore()
  const t = translations[language]

  const getProductName = (item: typeof cart[0]) => {
    switch (language) {
      case "ua": return item.product.nameUa
      case "ru": return item.product.nameRu
      default: return item.product.name
    }
  }

  const handleContinueShopping = () => {
    setIsCartOpen(false)
    setSelectedCategory(null)
    setCurrentView("category")
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setCurrentView("checkout")
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {t.title}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">{t.empty}</p>
                  <button
                    onClick={handleContinueShopping}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 p-3 bg-muted/50 rounded"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={getProductName(item)}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {getProductName(item)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.price} грн
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t.remove}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>{t.total}</span>
                  <span>{cartTotal} грн</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
