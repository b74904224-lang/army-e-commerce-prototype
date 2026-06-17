"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import { fetchMyOrders, type AccountOrder } from "@/lib/api"
import { isApiConfigured } from "@/lib/api-client"
import { Package, ChevronDown, Loader2, ShoppingBag } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const translations = {
  ua: {
    title: "Мої замовлення",
    subtitle: "Історія ваших замовлень.",
    empty: "У вас ще немає замовлень.",
    startShopping: "Перейти до каталогу",
    order: "Замовлення",
    items: "товарів",
    total: "Сума",
    quickOrder: "Швидке замовлення",
    checkout: "Оформлення",
    shipping: "Доставка",
    subtotal: "Сума товарів",
    comment: "Коментар",
    unavailable: "Дані замовлень недоступні.",
  },
  ru: {
    title: "Мои заказы",
    subtitle: "История ваших заказов.",
    empty: "У вас ещё нет заказов.",
    startShopping: "Перейти в каталог",
    order: "Заказ",
    items: "товаров",
    total: "Сумма",
    quickOrder: "Быстрый заказ",
    checkout: "Оформление",
    shipping: "Доставка",
    subtotal: "Сумма товаров",
    comment: "Комментарий",
    unavailable: "Данные заказов недоступны.",
  },
  en: {
    title: "My orders",
    subtitle: "Your order history.",
    empty: "You have no orders yet.",
    startShopping: "Go to catalog",
    order: "Order",
    items: "items",
    total: "Total",
    quickOrder: "Quick order",
    checkout: "Checkout",
    shipping: "Shipping",
    subtotal: "Subtotal",
    comment: "Comment",
    unavailable: "Order data is unavailable.",
  },
}

function formatPrice(value: number, language: string) {
  if (!value || value <= 0) {
    if (language === "ru") return "уточняется менеджером"
    if (language === "en") return "to be confirmed by manager"
    return "уточнюється менеджером"
  }
  return new Intl.NumberFormat(language === "en" ? "en-US" : "uk-UA").format(value) + " ₴"
}

function formatDate(iso: string, language: string) {
  try {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const statusColors: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  processing: "bg-amber-500/10 text-amber-600",
  completed: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-destructive/10 text-destructive",
}

export function AccountOrders() {
  const { language } = useStore()
  const t = translations[language]
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    let active = true
    fetchMyOrders()
      .then((data) => active && setOrders(data))
      .catch(() => active && setOrders([]))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center bg-card border border-border rounded-lg py-16 px-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-6">{t.empty}</p>
          <Link
            href={routes.catalog}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
          >
            {t.startShopping}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const open = expanded === order.orderNumber
          return (
            <div key={order.orderNumber} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(open ? null : order.orderNumber)}
                className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">
                      {t.order} #{order.orderNumber}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        statusColors[order.status] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.type === "quick_order" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {t.quickOrder}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatDate(order.createdAt, language)} · {order.items.length} {t.items}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground">{formatPrice(order.totals.total, language)}</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-4 sm:p-5 space-y-3">
                      <ul className="divide-y divide-border">
                        {order.items.map((item, index) => (
                          <li key={`${item.productId}-${index}`} className="flex items-center justify-between py-2 text-sm">
                            <span className="text-foreground">
                              {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                              {item.variant && (
                                <span className="block text-xs text-muted-foreground">{item.variant}</span>
                              )}
                            </span>
                            <span className="text-foreground font-medium">
                              {formatPrice(item.lineTotal, language)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="space-y-1 text-sm border-t border-border pt-3">
                        <div className="flex justify-between text-muted-foreground">
                          <span>{t.subtotal}</span>
                          <span>{formatPrice(order.totals.subtotal, language)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>{t.shipping}</span>
                          <span>{formatPrice(order.totals.shipping, language)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground pt-1">
                          <span>{t.total}</span>
                          <span>{formatPrice(order.totals.total, language)}</span>
                        </div>
                      </div>
                      {order.comment && (
                        <p className="text-sm text-muted-foreground border-t border-border pt-3">
                          <span className="font-medium text-foreground">{t.comment}:</span> {order.comment}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
