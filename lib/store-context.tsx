"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface Product {
  id: string
  name: string
  nameUa: string
  nameRu: string
  price: number
  originalPrice?: number
  category: string
  categoryUa: string
  categoryRu: string
  description: string
  descriptionUa: string
  descriptionRu: string
  specifications: {
    density: string
    dimensions: string
    material: string
    weight: string
  }
  images: string[]
  isNew?: boolean
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

interface StoreState {
  language: "ua" | "ru" | "en"
  setLanguage: (lang: "ua" | "ru" | "en") => void
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  cartTotal: number
  cartCount: number
  currentView: "home" | "product" | "about" | "blog" | "category"
  setCurrentView: (view: "home" | "product" | "about" | "blog" | "category") => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isLoginOpen: boolean
  setIsLoginOpen: (open: boolean) => void
  isBuyNowOpen: boolean
  setIsBuyNowOpen: (open: boolean) => void
  notification: string | null
  showNotification: (message: string) => void
}

const StoreContext = createContext<StoreState | undefined>(undefined)

export const products: Product[] = [
  {
    id: "army-l0",
    name: "ARMY L0",
    nameUa: "ARMY L0",
    nameRu: "ARMY L0",
    price: 450,
    originalPrice: 550,
    category: "roll-mats",
    categoryUa: "Каремати рулонні",
    categoryRu: "Каремат рулонный",
    description: "Professional-grade roll mat for field conditions. Lightweight, durable, and provides excellent insulation.",
    descriptionUa: "Професійний рулонний каремат для польових умов. Легкий, міцний та забезпечує відмінну ізоляцію.",
    descriptionRu: "Профессиональный рулонный каремат для полевых условий. Легкий, прочный и обеспечивает отличную изоляцию.",
    specifications: {
      density: "30-35 kg/m³",
      dimensions: "1800×550×10mm",
      material: "Foamed polyethylene",
      weight: "250g"
    },
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
    ],
    isNew: true,
    inStock: true
  },
  {
    id: "army-l1",
    name: "ARMY L1",
    nameUa: "ARMY L1",
    nameRu: "ARMY L1",
    price: 520,
    category: "roll-mats",
    categoryUa: "Каремати рулонні",
    categoryRu: "Каремат рулонный",
    description: "Enhanced roll mat with improved cushioning. Perfect for extended field operations.",
    descriptionUa: "Покращений рулонний каремат з підвищеною амортизацією. Ідеальний для тривалих польових операцій.",
    descriptionRu: "Улучшенный рулонный каремат с повышенной амортизацией. Идеален для длительных полевых операций.",
    specifications: {
      density: "35-40 kg/m³",
      dimensions: "1900×600×12mm",
      material: "Foamed polyethylene",
      weight: "320g"
    },
    images: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
    ],
    isNew: true,
    inStock: true
  },
  {
    id: "field-seat-01",
    name: "Field Seat FS-01",
    nameUa: "Сидіння польове FS-01",
    nameRu: "Сидение полевое FS-01",
    price: 180,
    category: "field-seats",
    categoryUa: "Сидіння польові",
    categoryRu: "Сидения полевые",
    description: "Compact field seat for tactical operations. Foldable design with quick deployment.",
    descriptionUa: "Компактне польове сидіння для тактичних операцій. Складна конструкція зі швидким розгортанням.",
    descriptionRu: "Компактное полевое сиденье для тактических операций. Складная конструкция с быстрым развертыванием.",
    specifications: {
      density: "40 kg/m³",
      dimensions: "400×300×20mm",
      material: "EVA foam",
      weight: "120g"
    },
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
    ],
    inStock: true
  },
  {
    id: "folding-mat-01",
    name: "Folding Mat FM-01",
    nameUa: "Каремат розкладний FM-01",
    nameRu: "Каремат раскладной FM-01",
    price: 680,
    category: "folding-mats",
    categoryUa: "Каремати та матраци розкладні",
    categoryRu: "Карематы и матрацы раскладные",
    description: "Premium folding mattress for maximum comfort. Multi-layer construction for superior insulation.",
    descriptionUa: "Преміальний розкладний матрац для максимального комфорту. Багатошарова конструкція для чудової ізоляції.",
    descriptionRu: "Премиальный раскладной матрац для максимального комфорта. Многослойная конструкция для превосходной изоляции.",
    specifications: {
      density: "45-50 kg/m³",
      dimensions: "2000×650×25mm (folded: 650×500×100mm)",
      material: "Multi-layer foam composite",
      weight: "850g"
    },
    images: [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80"
    ],
    inStock: true
  },
  {
    id: "sleeping-bag-01",
    name: "Tactical Sleeping Bag TSB-01",
    nameUa: "Тактичний спальний мішок TSB-01",
    nameRu: "Тактический спальный мешок TSB-01",
    price: 1200,
    originalPrice: 1450,
    category: "sleeping-bags",
    categoryUa: "Спальні мішки",
    categoryRu: "Спальные мешки",
    description: "Military-grade sleeping bag rated for extreme conditions. Temperature range: -20°C to +10°C.",
    descriptionUa: "Військовий спальний мішок для екстремальних умов. Температурний діапазон: -20°C до +10°C.",
    descriptionRu: "Военный спальный мешок для экстремальных условий. Температурный диапазон: -20°C до +10°C.",
    specifications: {
      density: "N/A",
      dimensions: "2200×800mm (compressed: 400×200mm)",
      material: "Ripstop nylon, synthetic insulation",
      weight: "1.8kg"
    },
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
    ],
    isNew: true,
    inStock: true
  },
  {
    id: "sleeping-bag-02",
    name: "Patrol Sleeping Bag PSB-02",
    nameUa: "Патрульний спальний мішок PSB-02",
    nameRu: "Патрульный спальный мешок PSB-02",
    price: 890,
    category: "sleeping-bags",
    categoryUa: "Спальні мішки",
    categoryRu: "Спальные мешки",
    description: "Lightweight patrol sleeping bag for mild conditions. Quick-dry fabric with compact storage.",
    descriptionUa: "Легкий патрульний спальний мішок для м'яких умов. Швидковисихаюча тканина з компактним зберіганням.",
    descriptionRu: "Легкий патрульный спальный мешок для мягких условий. Быстросохнущая ткань с компактным хранением.",
    specifications: {
      density: "N/A",
      dimensions: "2100×750mm (compressed: 300×150mm)",
      material: "Polyester, hollow fiber",
      weight: "1.2kg"
    },
    images: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
    ],
    inStock: true
  }
]

export const categories = [
  { id: "roll-mats", name: "Roll Mats", nameUa: "Каремати рулонні", nameRu: "Карематы рулонные", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" },
  { id: "field-seats", name: "Field Seats", nameUa: "Сидіння польові", nameRu: "Сидения полевые", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&q=80" },
  { id: "folding-mats", name: "Folding Mats & Mattresses", nameUa: "Каремати та матраци розкладні", nameRu: "Карематы и матрацы раскладные", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80" },
  { id: "sleeping-bags", name: "Sleeping Bags", nameUa: "Спальні мішки", nameRu: "Спальные мешки", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80" }
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"ua" | "ru" | "en">("ua")
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"home" | "product" | "about" | "blog" | "category">("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    showNotification(language === "ua" ? "Додано до кошика!" : language === "ru" ? "Добавлено в корзину!" : "Added to cart!")
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

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
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isLoginOpen,
        setIsLoginOpen,
        isBuyNowOpen,
        setIsBuyNowOpen,
        notification,
        showNotification
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
