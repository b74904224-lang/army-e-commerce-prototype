"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { isApiConfigured } from "./api-client"
import { registerRequest, loginRequest, logoutRequest, fetchMe, updateMe } from "./api"
import { ApiError, getToken } from "./api-client"
import {
  products,
  categories,
  cartItemKey,
  type Product,
  type Category,
  type Language,
  type SelectedVariant,
} from "./catalog"

// Re-export catalog types/data so existing imports from "@/lib/store-context"
// keep working after the data was extracted to a server-safe module.
export { products, categories }
export type { Product, Category, Language, SelectedVariant }

export interface AuthUser {
  name: string
  email: string
  phone?: string
}

export interface CartItem {
  /** Stable line key: product id + chosen variant option ids. */
  key: string
  product: Product
  quantity: number
  /** Chosen variant selections (color/thickness). Absent for simple products. */
  variants?: SelectedVariant[]
}

interface StoreState {
  language: Language
  setLanguage: (lang: Language) => void
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, variants?: SelectedVariant[]) => void
  removeFromCart: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  cartTotal: number
  cartCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isBuyNowOpen: boolean
  setIsBuyNowOpen: (open: boolean) => void
  /** Product shown inside the "buy in 1 click" modal. */
  buyNowProduct: Product | null
  /** Variants pre-selected on the product page when opening the buy-now modal. */
  buyNowVariants: SelectedVariant[] | undefined
  openBuyNow: (product: Product, variants?: SelectedVariant[]) => void
  notification: string | null
  showNotification: (message: string) => void
  currentUser: AuthUser | null
  authReady: boolean
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (input: { name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
}

const StoreContext = createContext<StoreState | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ua")
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false)
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null)
  const [buyNowVariants, setBuyNowVariants] = useState<SelectedVariant[] | undefined>(undefined)
  const [notification, setNotification] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate cart + favorites from localStorage and, if a JWT exists, restore
  // the session by asking the backend who we are (the password is never stored).
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("army_cart")
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) {
          // Backfill a stable key for carts saved before variants existed.
          const normalized = parsed
            .filter((item) => item && item.product && item.product.id)
            .map((item) => ({
              ...item,
              key: item.key || cartItemKey(item.product.id, item.variants),
            }))
          setCart(normalized)
        }
      }
    } catch {
      // ignore corrupted cart storage
    }
    try {
      const storedFavorites = localStorage.getItem("army_favorites")
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites)
        if (Array.isArray(parsed)) setFavorites(parsed)
      }
    } catch {
      // ignore corrupted favorites storage
    }
    setHydrated(true)

    // Restore the auth session from the stored JWT (no password persisted).
    if (isApiConfigured && getToken()) {
      fetchMe()
        .then((user) => setCurrentUser({ name: user.name, email: user.email, phone: user.phone }))
        .catch(() => {
          // Token expired/invalid — clear it.
          logoutRequest()
        })
        .finally(() => setAuthReady(true))
    } else {
      setAuthReady(true)
    }
  }, [])

  // Persist the cart whenever it changes (after the initial hydration).
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem("army_cart", JSON.stringify(cart))
    } catch {
      // storage may be full or unavailable — fail silently
    }
  }, [cart, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem("army_favorites", JSON.stringify(favorites))
    } catch {
      // fail silently
    }
  }, [favorites, hydrated])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const register = async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!isApiConfigured) return { success: false, error: authUnavailableMessage() }
    try {
      const { user } = await registerRequest(name.trim(), normalizedEmail, password)
      setCurrentUser({ name: user.name, email: user.email, phone: user.phone })
      showNotification(
        language === "ua"
          ? `Вітаємо, ${user.name}! Акаунт створено.`
          : language === "ru"
          ? `Добро пожаловать, ${user.name}! Аккаунт создан.`
          : `Welcome, ${user.name}! Account created.`,
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: resolveAuthError(err) }
    }
  }

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!isApiConfigured) return { success: false, error: authUnavailableMessage() }
    try {
      const { user } = await loginRequest(normalizedEmail, password)
      setCurrentUser({ name: user.name, email: user.email, phone: user.phone })
      showNotification(
        language === "ua"
          ? `Привіт, ${user.name}!`
          : language === "ru"
          ? `Привет, ${user.name}!`
          : `Hi, ${user.name}!`,
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: resolveAuthError(err) }
    }
  }

  const updateProfile = async (input: { name?: string; phone?: string }) => {
    if (!isApiConfigured) return { success: false, error: authUnavailableMessage() }
    try {
      const user = await updateMe(input)
      setCurrentUser({ name: user.name, email: user.email, phone: user.phone })
      showNotification(
        language === "ua" ? "Профіль оновлено" : language === "ru" ? "Профиль обновлён" : "Profile updated",
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: resolveAuthError(err) }
    }
  }

  const authUnavailableMessage = (): string =>
    language === "ua"
      ? "Авторизація тимчасово недоступна. Оформлення замовлення працює без реєстрації."
      : language === "ru"
      ? "Авторизация временно недоступна. Оформление заказа работает без регистрации."
      : "Authentication is temporarily unavailable. Checkout works without registration."

  const resolveAuthError = (err: unknown): string => {
    if (err instanceof ApiError && err.message && err.status !== 0) {
      return err.message
    }
    return language === "ua"
      ? "Помилка з'єднання з сервером. Спробуйте пізніше."
      : language === "ru"
      ? "Ошибка соединения с сервером. Попробуйте позже."
      : "Server connection error. Please try again later."
  }

  const logout = () => {
    logoutRequest()
    setCurrentUser(null)
    showNotification(
      language === "ua" ? "Ви вийшли з акаунту" : language === "ru" ? "Вы вышли из аккаунта" : "You have logged out",
    )
  }

  const addToCart = (product: Product, quantity = 1, variants?: SelectedVariant[]) => {
    const key = cartItemKey(product.id, variants)
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { key, product, quantity, variants }]
    })
    showNotification(language === "ua" ? "Додано до кошика!" : language === "ru" ? "Добавлено в корзину!" : "Added to cart!")
  }

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key))
  }

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(key)
      return
    }
    setCart((prev) => prev.map((item) => (item.key === key ? { ...item, quantity } : item)))
  }

  const clearCart = () => setCart([])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  const openBuyNow = (product: Product, variants?: SelectedVariant[]) => {
    setBuyNowProduct(product)
    setBuyNowVariants(variants)
    setIsBuyNowOpen(true)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        favorites,
        toggleFavorite,
        isFavorite,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isBuyNowOpen,
        setIsBuyNowOpen,
        buyNowProduct,
        buyNowVariants,
        openBuyNow,
        notification,
        showNotification,
        currentUser,
        authReady,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}
