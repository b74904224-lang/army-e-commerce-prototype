"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

const translations = {
  ua: {
    title: "Кошик",
    empty: "Ваш кошик порожній",
    emptyDesc: "Додайте товари, щоб продовжити",
    startShopping: "Перейти до каталогу",
    product: "Товар",
    price: "Ціна",
    quantity: "Кількість",
    total: "Сума",
    orderSummary: "Разом",
    subtotal: "Сума товарів",
    checkout: "Оформити замовлення",
    continueShopping: "Продовжити покупки",
    remove: "Видалити",
  },
  ru: {
    title: "Корзина",
    empty: "Ваша корзина пуста",
    emptyDesc: "Добавьте товары, чтобы продолжить",
    startShopping: "Перейти в каталог",
    product: "Товар",
    price: "Цена",
    quantity: "Количество",
    total: "Сумма",
    orderSummary: "Итого",
    subtotal: "Сумма товаров",
    checkout: "Оформить заказ",
    continueShopping: "Продолжить покупки",
    remove: "Удалить",
  },
  en: {
    title: "Cart",
    empty: "Your cart is empty",
    emptyDesc: "Add some products to continue",
    startShopping: "Browse catalog",
    product: "Product",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    orderSummary: "Summary",
    subtotal: "Subtotal",
    checkout: "Proceed to checkout",
    continueShopping: "Continue shopping",
    remove: "Remove",
  },
}

export function CartView() {
  const { language, cart, cartTotal, updateQuantity, removeFromCart } = useStore()
  const t = translations[language]

  const getProductName = (item: (typeof cart)[0]) => {
    switch (language) {
      case "ua":
        return item.product.nameUa
      case "ru":
        return item.product.nameRu
      default:
        return item.product.name
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.empty}</h1>
          <p className="text-muted-foreground mb-8">{t.emptyDesc}</p>
          <Link
            href={routes.catalog}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors uppercase tracking-wide"
          >
            {t.startShopping}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 tracking-tight">{t.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 bg-card border border-border rounded-lg p-4"
              >
                <Link
                  href={routes.product(item.product.slug)}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-muted overflow-hidden rounded-md"
                >
                  <img
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={getProductName(item)}
                    className={`w-full h-full ${
                      item.product.category === "roll-mats" ? "object-contain p-2 bg-card" : "object-cover"
                    }`}
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    href={routes.product(item.product.slug)}
                    className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {getProductName(item)}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.product.price} грн
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-foreground hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-medium text-foreground tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-foreground hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-foreground tabular-nums">
                        {item.product.price * item.quantity} грн
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={t.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.orderSummary}</h2>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">{t.subtotal}</span>
                <span className="font-medium text-foreground tabular-nums">{cartTotal} грн</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="font-semibold text-foreground">{t.total}</span>
                <span className="text-xl font-bold text-foreground tabular-nums">{cartTotal} грн</span>
              </div>
              <Link
                href={routes.checkout}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors uppercase tracking-wide"
              >
                {t.checkout}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={routes.catalog}
                className="mt-3 w-full inline-flex items-center justify-center py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
