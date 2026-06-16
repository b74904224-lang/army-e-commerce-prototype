"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import { fetchOrderStats, type OrderStats } from "@/lib/api"
import { isApiConfigured } from "@/lib/api-client"
import { Package, Wallet, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"

const translations = {
  ua: {
    welcome: "Огляд акаунту",
    subtitle: "Швидкий доступ до ваших замовлень та статистики.",
    totalOrders: "Усього замовлень",
    totalSpent: "Витрачено",
    totalItems: "Товарів придбано",
    viewOrders: "Переглянути замовлення",
    viewStats: "Детальна статистика",
    editProfile: "Редагувати профіль",
    noData: "Дані статистики недоступні.",
    lastOrder: "Останнє замовлення",
  },
  ru: {
    welcome: "Обзор аккаунта",
    subtitle: "Быстрый доступ к вашим заказам и статистике.",
    totalOrders: "Всего заказов",
    totalSpent: "Потрачено",
    totalItems: "Товаров куплено",
    viewOrders: "Посмотреть заказы",
    viewStats: "Подробная статистика",
    editProfile: "Редактировать профиль",
    noData: "Данные статистики недоступны.",
    lastOrder: "Последний заказ",
  },
  en: {
    welcome: "Account overview",
    subtitle: "Quick access to your orders and statistics.",
    totalOrders: "Total orders",
    totalSpent: "Total spent",
    totalItems: "Items purchased",
    viewOrders: "View orders",
    viewStats: "Detailed statistics",
    editProfile: "Edit profile",
    noData: "Statistics data is unavailable.",
    lastOrder: "Last order",
  },
}

function formatPrice(value: number, language: string) {
  return new Intl.NumberFormat(language === "en" ? "en-US" : "uk-UA").format(value) + " ₴"
}

export function AccountOverview() {
  const { language } = useStore()
  const t = translations[language]
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    let active = true
    fetchOrderStats()
      .then((s) => active && setStats(s))
      .catch(() => active && setStats(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const cards = [
    { label: t.totalOrders, value: stats ? String(stats.totalOrders) : "0", icon: Package },
    { label: t.totalSpent, value: stats ? formatPrice(stats.totalSpent, language) : formatPrice(0, language), icon: Wallet },
    { label: t.totalItems, value: stats ? String(stats.totalItems) : "0", icon: ShoppingBag },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t.welcome}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={routes.accountOrders}
          className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary transition-colors"
        >
          {t.viewOrders}
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          href={routes.accountStatistics}
          className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary transition-colors"
        >
          {t.viewStats}
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          href={routes.accountProfile}
          className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary transition-colors"
        >
          {t.editProfile}
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}
