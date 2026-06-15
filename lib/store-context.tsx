"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface AuthUser {
  name: string
  email: string
}

interface StoredUser extends AuthUser {
  password: string
}

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
  specifications: Record<string, string>
  specificationsUa: Record<string, string>
  specificationsRu: Record<string, string>
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
  currentView: "home" | "product" | "about" | "blog" | "category" | "checkout"
  setCurrentView: (view: "home" | "product" | "about" | "blog" | "category" | "checkout") => void
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
  currentUser: AuthUser | null
  register: (name: string, email: string, password: string) => { success: boolean; error?: string }
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const StoreContext = createContext<StoreState | undefined>(undefined)

// Products with exact specifications from the provided documents
export const products: Product[] = [
  {
    id: "army-l0",
    name: "Army L0 Tourist Mat with Fixing Rubber Bands (Black 1800mm*550mm*10mm)",
    nameUa: "Килимок туристичний Army L0 з комплектом гумок фіксуючих (чорний 1800мм*550мм*10мм)",
    nameRu: "Коврик туристический Army L0 с комплектом резинок фиксирующих (черный 1800мм*550мм*10мм)",
    price: 450,
    originalPrice: 550,
    category: "roll-mats",
    categoryUa: "Каремати рулонні Army",
    categoryRu: "Карематы рулонные Army",
    description: "Tourist mat made of foamed polyethylene, which has a high level of thermal insulation and does not absorb moisture at all. The increased density of the main material prevents shrinkage under prolonged load on its surface. Additional rubber fasteners allow you to quickly and conveniently fix the product in a rolled form. The mat is intended for use in any field conditions: recreation, fishing, training, etc.",
    descriptionUa: "Килимок туристичний виготовлений із спіненого поліетилену, завдяки чому має високий рівень теплоізоляційної властивості та повністю не поглинає вологу. Збільшена щільність основного матеріалу перешкоджає усадці при довготривалому навантаженні на його поверхню. Додаткові гумові кріплення дозволяють швидко та зручно фіксувати виріб у згорнутому вигляді. Килимок призначений для використання у будь яких польових умовах: відпочинок, рибальство, тренування, тощо.",
    descriptionRu: "Коврик туристический изготовлен из вспененного полиэтилена, благодаря чему имеет высокий уровень теплоизоляционных свойств и полностью не впитывает влагу. Увеличенная плотность основного материала препятствует усадке при длительной нагрузке на его поверхность. Дополнительные резиновые крепления позволяют быстро и удобно фиксировать изделие в свернутом виде. Коврик предназначен для использования в любых полевых условиях: отдых, рыбалка, тренировки и т.д.",
    specifications: {
      "Density": "30-35 kg/m³",
      "Geometric Size": "1800×550×10mm (±10%)",
      "Color": "Black",
      "Material": "Foamed Polyethylene",
      "Surface Type": "Non-laminated",
      "Max Tensile Load (length)": "100 N/5cm",
      "Max Tensile Load (width)": "77 N/5cm",
      "Water Absorption": "0%",
      "Thermal Conductivity": "0.035 W/(m·K)",
      "Fire Resistance": "Moderately resistant",
      "Max Operating Temperature": "+70°C",
      "Min Operating Temperature": "-40°C",
      "Residual Deformation": "12%",
      "Product Weight with Fasteners": "350 grams"
    },
    specificationsUa: {
      "Щільність": "30-35 кг/м³",
      "Геометричний розмір": "1800×550×10мм (±10%)",
      "Колір": "Чорний",
      "Матеріал": "Спінений поліетилен",
      "Вид поверхні": "Не ламінована",
      "Макс. розривне навантаження (довжина)": "100 Н/5см",
      "Макс. розривне навантаження (ширина)": "77 Н/5см",
      "Водопоглинання": "0%",
      "Коефіцієнт теплоізоляції": "0,035 Вт/(м·К)",
      "Стійкість до горіння": "Помірно стійка",
      "Макс. температура експлуатації": "+70°С",
      "Мін. температура експлуатації": "-40°С",
      "Залишкова деформація": "12%",
      "Вага виробу з кріпленням": "350 грам"
    },
    specificationsRu: {
      "Плотность": "30-35 кг/м³",
      "Геометрический размер": "1800×550×10мм (±10%)",
      "Цвет": "Черный",
      "Материал": "Вспененный полиэтилен",
      "Тип поверхности": "Не ламинированная",
      "Макс. разрывная нагрузка (длина)": "100 Н/5см",
      "Макс. разрывная нагрузка (ширина)": "77 Н/5см",
      "Водопоглощение": "0%",
      "Коэффициент теплоизоляции": "0,035 Вт/(м·К)",
      "Огнестойкость": "Умеренно стойкая",
      "Макс. температура эксплуатации": "+70°С",
      "Мин. температура эксплуатации": "-40°С",
      "Остаточная деформация": "12%",
      "Вес изделия с креплением": "350 грамм"
    },
    images: [
      "/images/products/army-l0-main.jpg",
      "/images/products/army-l0-unrolled.jpg",
      "/images/products/army-l0-detail.jpg",
      "/images/products/army-l0-outdoor.jpg"
    ],
    isNew: true,
    inStock: true
  },
  {
    id: "army-l1",
    name: "Army L1 Tourist Mat (Olive 1900mm*600mm*12mm)",
    nameUa: "Килимок туристичний Army L1 (олива 1900мм*600мм*12мм)",
    nameRu: "Коврик туристический Army L1 (олива 1900мм*600мм*12мм)",
    price: 520,
    category: "roll-mats",
    categoryUa: "Каремати рулонні Army",
    categoryRu: "Карематы рулонные Army",
    description: "Enhanced tourist mat with improved cushioning. Made of foamed polyethylene with increased density for extended field operations.",
    descriptionUa: "Покращений туристичний килимок з підвищеною амортизацією. Виготовлений із спіненого поліетилену зі збільшеною щільністю для тривалих польових операцій.",
    descriptionRu: "Улучшенный туристический коврик с повышенной амортизацией. Изготовлен из вспененного полиэтилена с увеличенной плотностью для длительных полевых операций.",
    specifications: {
      "Density": "35-40 kg/m³",
      "Geometric Size": "1900×600×12mm",
      "Material": "Foamed Polyethylene",
      "Weight": "420 grams"
    },
    specificationsUa: {
      "Щільність": "35-40 кг/м³",
      "Геометричний розмір": "1900×600×12мм",
      "Матеріал": "Спінений поліетилен",
      "Вага": "420 грам"
    },
    specificationsRu: {
      "Плотность": "35-40 кг/м³",
      "Геометрический размер": "1900×600×12мм",
      "Материал": "Вспененный полиэтилен",
      "Вес": "420 грамм"
    },
    images: [
      "/images/products/army-l0-main.jpg",
      "/images/products/army-l0-unrolled.jpg",
      "/images/products/army-l0-detail.jpg",
      "/images/products/army-l0-outdoor.jpg"
    ],
    isNew: true,
    inStock: true
  },
  {
    id: "field-seat-01",
    name: "Field Seat FS-01 Insulating",
    nameUa: "Сидіння польове ізоляційне FS-01",
    nameRu: "Сиденье полевое изоляционное FS-01",
    price: 180,
    category: "field-seats",
    categoryUa: "Сидіння польові ізоляційні Army",
    categoryRu: "Сиденья полевые изоляционные Army",
    description: "Compact field seat for tactical operations. Foldable design with quick deployment. Provides thermal insulation from cold surfaces.",
    descriptionUa: "Компактне польове сидіння для тактичних операцій. Складна конструкція зі швидким розгортанням. Забезпечує теплоізоляцію від холодних поверхонь.",
    descriptionRu: "Компактное полевое сиденье для тактических операций. Складная конструкция с быстрым развертыванием. Обеспечивает теплоизоляцию от холодных поверхностей.",
    specifications: {
      "Density": "40 kg/m³",
      "Geometric Size": "400×300×20mm",
      "Material": "EVA foam",
      "Weight": "120 grams"
    },
    specificationsUa: {
      "Щільність": "40 кг/м³",
      "Геометричний розмір": "400×300×20мм",
      "Матеріал": "EVA пінка",
      "Вага": "120 грам"
    },
    specificationsRu: {
      "Плотность": "40 кг/м³",
      "Геометрический размер": "400×300×20мм",
      "Материал": "EVA пена",
      "Вес": "120 грамм"
    },
    images: [
      "/images/categories/sidinnia-polovi.jpg",
      "/images/products/army-l0-outdoor.jpg",
      "/images/products/army-l0-detail.jpg",
      "/images/hero-outdoor.jpg"
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
    categoryUa: "Каремати та матраци розкладні Army",
    categoryRu: "Карематы и матрацы раскладные Army",
    description: "Premium folding mattress for maximum comfort. Multi-layer construction for superior insulation. Perfect for camping and outdoor activities.",
    descriptionUa: "Преміальний розкладний матрац для максимального комфорту. Багатошарова конструкція для чудової ізоляції. Ідеально підходить для кемпінгу та активного відпочинку.",
    descriptionRu: "Премиальный раскладной матрац для максимального комфорта. Многослойная конструкция для превосходной изоляции. Идеально подходит для кемпинга и активного отдыха.",
    specifications: {
      "Density": "45-50 kg/m³",
      "Geometric Size": "2000×650×25mm (folded: 650×500×100mm)",
      "Material": "Multi-layer foam composite",
      "Weight": "850 grams"
    },
    specificationsUa: {
      "Щільність": "45-50 кг/м³",
      "Геометричний розмір": "2000×650×25мм (складений: 650×500×100мм)",
      "Матеріал": "Багатошаровий пінний композит",
      "Вага": "850 грам"
    },
    specificationsRu: {
      "Плотность": "45-50 кг/м³",
      "Геометрический размер": "2000×650×25мм (сложенный: 650×500×100мм)",
      "Материал": "Многослойный пенный композит",
      "Вес": "850 грамм"
    },
    images: [
      "/images/categories/karematy-rozkladni.jpg",
      "/images/products/army-l0-outdoor.jpg",
      "/images/hero-outdoor.jpg",
      "/images/products/army-l0-unrolled.jpg"
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
    categoryUa: "Спальні мішки Army",
    categoryRu: "Спальные мешки Army",
    description: "Military-grade sleeping bag rated for extreme conditions. Temperature range: -20°C to +10°C. Compact and lightweight for field use.",
    descriptionUa: "Військовий спальний мішок для екстремальних умов. Температурний діапазон: -20°C до +10°C. Компактний та легкий для польового використання.",
    descriptionRu: "Военный спальный мешок для экстремальных условий. Температурный диапазон: -20°C до +10°C. Компактный и легкий для полевого использования.",
    specifications: {
      "Temperature Range": "-20°C to +10°C",
      "Geometric Size": "2200×800mm (compressed: 400×200mm)",
      "Material": "Ripstop nylon, synthetic insulation",
      "Weight": "1.8 kg"
    },
    specificationsUa: {
      "Температурний діапазон": "-20°C до +10°C",
      "Геометричний розмір": "2200×800мм (стиснутий: 400×200мм)",
      "Матеріал": "Ріпстоп нейлон, синтетичний утеплювач",
      "Вага": "1,8 кг"
    },
    specificationsRu: {
      "Температурны���� диапазон": "-20°C до +10°C",
      "Геометрический размер": "2200×800мм (сжатый: 400×200мм)",
      "Материал": "Рипстоп нейлон, синтетический утеплитель",
      "Вес": "1,8 кг"
    },
    images: [
      "/images/categories/spalni-mishky.jpg",
      "/images/hero-outdoor.jpg",
      "/images/nature-atmosphere.jpg",
      "/images/products/army-l0-outdoor.jpg"
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
    categoryUa: "Спальні мішки Army",
    categoryRu: "Спальные мешки Army",
    description: "Lightweight patrol sleeping bag for mild conditions. Quick-dry fabric with compact storage.",
    descriptionUa: "Легкий патрульний спальний мішок для м'яких умов. Швидковисихаюча тканина з компактним зберіганням.",
    descriptionRu: "Легкий патрульный спальный мешок для мягких условий. Быстросохнущая ткань с компактным хранением.",
    specifications: {
      "Temperature Range": "-5°C to +15°C",
      "Geometric Size": "2100×750mm (compressed: 300×150mm)",
      "Material": "Polyester, hollow fiber",
      "Weight": "1.2 kg"
    },
    specificationsUa: {
      "Температурний діапазон": "-5°C до +15°C",
      "Геометричний розмір": "2100×750мм (стиснутий: 300×150мм)",
      "Матеріал": "Поліестер, порожнисте волокно",
      "Вага": "1,2 кг"
    },
    specificationsRu: {
      "Температурный диапазон": "-5°C до +15°C",
      "Геометрический размер": "2100×750мм (сжатый: 300×150мм)",
      "Материал": "Полиэстер, полое волокно",
      "Вес": "1,2 кг"
    },
    images: [
      "/images/categories/spalni-mishky.jpg",
      "/images/nature-atmosphere.jpg",
      "/images/hero-outdoor.jpg",
      "/images/products/army-l0-outdoor.jpg"
    ],
    inStock: true
  }
]

export const categories = [
  { 
    id: "roll-mats", 
    name: "Roll Mats Army", 
    nameUa: "Каремати рулонні Army", 
    nameRu: "Карематы рулонные Army", 
    image: "/images/categories/karematy-rulonni.jpg" 
  },
  { 
    id: "field-seats", 
    name: "Field Seats Army", 
    nameUa: "Сидіння польові ізоляційні Army", 
    nameRu: "Сиденья полевые изоляционные Army", 
    image: "/images/categories/sidinnia-polovi.jpg" 
  },
  { 
    id: "folding-mats", 
    name: "Folding Mats & Mattresses Army", 
    nameUa: "Каремати та матраци розкладні Army", 
    nameRu: "Карематы и матрацы раскладные Army", 
    image: "/images/categories/karematy-rozkladni.jpg" 
  },
  { 
    id: "sleeping-bags", 
    name: "Sleeping Bags Army", 
    nameUa: "Спальні мішки Army", 
    nameRu: "Спальные мешки Army", 
    image: "/images/categories/spalni-mishky.jpg" 
  }
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"ua" | "ru" | "en">("ua")
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"home" | "product" | "about" | "blog" | "category" | "checkout">("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  // Hydrate the logged-in session from localStorage on mount (mock "database")
  useEffect(() => {
    try {
      const session = localStorage.getItem("army_current_user")
      if (session) {
        setCurrentUser(JSON.parse(session))
      }
    } catch {
      // ignore corrupted storage
    }
  }, [])

  const getStoredUsers = (): StoredUser[] => {
    try {
      const raw = localStorage.getItem("army_users")
      return raw ? (JSON.parse(raw) as StoredUser[]) : []
    } catch {
      return []
    }
  }

  const register = (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    if (users.some(u => u.email === normalizedEmail)) {
      return {
        success: false,
        error:
          language === "ua"
            ? "Користувач з таким email вже існує"
            : language === "ru"
            ? "Пользователь с таким email уже существует"
            : "A user with this email already exists"
      }
    }
    const newUser: StoredUser = { name: name.trim(), email: normalizedEmail, password }
    const updatedUsers = [...users, newUser]
    localStorage.setItem("army_users", JSON.stringify(updatedUsers))

    const session: AuthUser = { name: newUser.name, email: newUser.email }
    localStorage.setItem("army_current_user", JSON.stringify(session))
    setCurrentUser(session)
    showNotification(
      language === "ua"
        ? `Вітаємо, ${session.name}! Акаунт створено.`
        : language === "ru"
        ? `Добро пожаловать, ${session.name}! Аккаунт создан.`
        : `Welcome, ${session.name}! Account created.`
    )
    return { success: true }
  }

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    const match = users.find(u => u.email === normalizedEmail && u.password === password)
    if (!match) {
      return {
        success: false,
        error:
          language === "ua"
            ? "Невірний email або пароль"
            : language === "ru"
            ? "Неверный email или пароль"
            : "Invalid email or password"
      }
    }
    const session: AuthUser = { name: match.name, email: match.email }
    localStorage.setItem("army_current_user", JSON.stringify(session))
    setCurrentUser(session)
    showNotification(
      language === "ua"
        ? `Привіт, ${session.name}!`
        : language === "ru"
        ? `Привет, ${session.name}!`
        : `Hi, ${session.name}!`
    )
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("army_current_user")
    setCurrentUser(null)
    showNotification(
      language === "ua"
        ? "Ви вийшли з акаунту"
        : language === "ru"
        ? "Вы вышли из аккаунта"
        : "You have logged out"
    )
  }

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
        showNotification,
        currentUser,
        register,
        login,
        logout
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
