"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/lib/store-context"
import { fetchOrderStats, fetchMyOrders, type OrderStats, type AccountOrder } from "@/lib/api"
import { isApiConfigured } from "@/lib/api-client"
import { Package, Wallet, ShoppingBag, Trophy, Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const translations = {
  ua: {
    title: "Статистика покупок",
    subtitle: "Огляд вашої активності в магазині.",
    totalOrders: "Усього замовлень",
    totalSpent: "Загальна сума",
    totalItems: "Товарів придбано",
    avgOrder: "Середній чек",
    mostPurchased: "Найчастіше купуєте",
    spendingByMonth: "Витрати за місяцями",
    times: "раз",
    noData: "Поки що немає даних для статистики.",
    unavailable: "Статистика недоступна.",
  },
  ru: {
    title: "Статистика покупок",
    subtitle: "Обзор вашей активности в магазине.",
    totalOrders: "Всего заказов",
    totalSpent: "Общая сумма",
    totalItems: "Товаров куплено",
    avgOrder: "Средний чек",
    mostPurchased: "Чаще всего покупаете",
    spendingByMonth: "Расходы по месяцам",
    times: "раз",
    noData: "Пока нет данных для статистики.",
    unavailable: "Статистика недоступна.",
  },
  en: {
    title: "Purchase statistics",
    subtitle: "An overview of your store activity.",
    totalOrders: "Total orders",
    totalSpent: "Total spent",
    totalItems: "Items purchased",
    avgOrder: "Average order",
    mostPurchased: "Most purchased",
    spendingByMonth: "Spending by month",
    times: "times",
    noData: "No statistics data yet.",
    unavailable: "Statistics are unavailable.",
  },
}

function formatPrice(value: number, language: string) {
  if (!value || value <= 0) {
    if (language === "ru") return "уточняется менеджером"
    if (language === "en") return "to be confirmed by manager"
    return "уточнюється менеджером"
  }
  return new Intl.NumberFormat(language === "en" ? "en-US" : "uk-UA").format(Math.round(value)) + " ₴"
}

const chartConfig = {
  total: { label: "₴", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AccountStatistics() {
  const { language } = useStore()
  const t = translations[language]
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    let active = true
    Promise.all([fetchOrderStats(), fetchMyOrders()])
      .then(([s, o]) => {
        if (!active) return
        setStats(s)
        setOrders(o)
      })
      .catch(() => {
        if (!active) return
        setStats(null)
        setOrders([])
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const monthly = useMemo(() => {
    const map = new Map<string, { label: string; total: number; sort: number }>()
    const locale = language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uk-UA"
    for (const order of orders) {
      const date = new Date(order.createdAt)
      if (Number.isNaN(date.getTime())) continue
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const label = new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(date)
      const sort = date.getFullYear() * 12 + date.getMonth()
      const existing = map.get(key)
      if (existing) existing.total += order.totals.total
      else map.set(key, { label, total: order.totals.total, sort })
    }
    return Array.from(map.values()).sort((a, b) => a.sort - b.sort)
  }, [orders, language])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    )
  }

  const avgOrder = stats && stats.totalOrders > 0 ? stats.totalSpent / stats.totalOrders : 0

  const cards = [
    { label: t.totalOrders, value: stats ? String(stats.totalOrders) : "0", icon: Package },
    { label: t.totalSpent, value: formatPrice(stats?.totalSpent ?? 0, language), icon: Wallet },
    { label: t.totalItems, value: stats ? String(stats.totalItems) : "0", icon: ShoppingBag },
    { label: t.avgOrder, value: formatPrice(avgOrder, language), icon: Trophy },
  ]

  const hasData = (stats?.totalOrders ?? 0) > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {!hasData ? (
        <div className="bg-card border border-border rounded-lg py-16 text-center text-muted-foreground">
          {t.noData}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          {stats?.mostPurchased && (
            <div className="bg-card border border-border rounded-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.mostPurchased}</p>
                <p className="font-semibold text-foreground">
                  {stats.mostPurchased.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    — {stats.mostPurchased.quantity} {t.times}
                  </span>
                </p>
              </div>
            </div>
          )}

          {monthly.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-4">{t.spendingByMonth}</h3>
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <BarChart data={monthly} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
