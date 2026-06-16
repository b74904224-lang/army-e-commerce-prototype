"use client"

import { Search, User, Heart, ShoppingBag, Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const translations = {
  ua: { new: "Новинки", about: "Про бренд", products: "Товар", blog: "Блог", hi: "Привіт", logout: "Вийти", login: "Вхід", register: "Реєстрація", account: "Кабінет" },
  ru: { new: "Новинки", about: "О бренде", products: "Товары", blog: "Блог", hi: "Привет", logout: "Выйти", login: "Вход", register: "Регистрация", account: "Кабинет" },
  en: { new: "New", about: "About", products: "Products", blog: "Blog", hi: "Hi", logout: "Log out", login: "Sign in", register: "Register", account: "Account" }
}

export function Header() {
  const {
    language,
    setLanguage,
    cartCount,
    favorites,
    setIsCartOpen,
    setIsSearchOpen,
    currentUser,
    logout
  } = useStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const t = translations[language]

  const closeMobile = () => setMobileMenuOpen(false)

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    router.push(routes.home)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link
            href={routes.home}
            className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            ARMY
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href={routes.catalog}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.new}
            </Link>
            <Link
              href={routes.about}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.about}
            </Link>
            <Link
              href={routes.catalog}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.products}
            </Link>
            <Link
              href={routes.blog}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {t.blog}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => setLanguage("ua")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "ua" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                UA
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage("ru")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "ru" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RU
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 transition-colors ${
                  language === "en" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>

            {/* Icons */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Account menu"
                >
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                    {t.hi}, {currentUser.name}
                  </span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase">
                    {currentUser.name.charAt(0)}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-56 bg-background border border-border rounded shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        <Link
                          href={routes.account}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t.account}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.logout}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={routes.login}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t.login}
                </Link>
                <span className="text-border">|</span>
                <Link
                  href={routes.register}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}
            {!currentUser && (
              <Link
                href={routes.login}
                className="sm:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link
              href={routes.account}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="px-4 py-4 flex flex-col gap-4">
              <Link
                href={routes.catalog}
                onClick={closeMobile}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.new}
              </Link>
              <Link
                href={routes.about}
                onClick={closeMobile}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.about}
              </Link>
              <Link
                href={routes.catalog}
                onClick={closeMobile}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.products}
              </Link>
              <Link
                href={routes.blog}
                onClick={closeMobile}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide py-2"
              >
                {t.blog}
              </Link>

              {/* Account links */}
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <Link
                      href={routes.account}
                      onClick={closeMobile}
                      className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {t.account}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMobile()
                      }}
                      className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={routes.login}
                      onClick={closeMobile}
                      className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {t.login}
                    </Link>
                    <Link
                      href={routes.register}
                      onClick={closeMobile}
                      className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {t.register}
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setLanguage("ua")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "ua" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  UA
                </button>
                <button
                  onClick={() => setLanguage("ru")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "ru" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
