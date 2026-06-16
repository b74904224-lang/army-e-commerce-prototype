"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import { LayoutDashboard, User, Package, BarChart3, LogOut, Loader2 } from "lucide-react"

const translations = {
  ua: {
    account: "Мій акаунт",
    overview: "Огляд",
    profile: "Профіль",
    orders: "Замовлення",
    statistics: "Статистика",
    logout: "Вийти",
    loading: "Завантаження...",
    greeting: "Вітаємо",
  },
  ru: {
    account: "Мой аккаунт",
    overview: "Обзор",
    profile: "Профиль",
    orders: "Заказы",
    statistics: "Статистика",
    logout: "Выйти",
    loading: "Загрузка...",
    greeting: "Здравствуйте",
  },
  en: {
    account: "My account",
    overview: "Overview",
    profile: "Profile",
    orders: "Orders",
    statistics: "Statistics",
    logout: "Log out",
    loading: "Loading...",
    greeting: "Welcome",
  },
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const { language, currentUser, authReady, logout } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const t = translations[language]

  // Redirect unauthenticated users to login once the session check is done.
  useEffect(() => {
    if (authReady && !currentUser) {
      router.replace(routes.login)
    }
  }, [authReady, currentUser, router])

  if (!authReady || !currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t.loading}</span>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: routes.account, label: t.overview, icon: LayoutDashboard, exact: true },
    { href: routes.accountProfile, label: t.profile, icon: User },
    { href: routes.accountOrders, label: t.orders, icon: Package },
    { href: routes.accountStatistics, label: t.statistics, icon: BarChart3 },
  ]

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  const handleLogout = () => {
    logout()
    router.push(routes.home)
  }

  return (
    <div className="bg-background min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{t.account}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.greeting}, <span className="font-medium text-foreground">{currentUser.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors lg:mt-2"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {t.logout}
              </button>
            </nav>
          </aside>

          {/* Content */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
