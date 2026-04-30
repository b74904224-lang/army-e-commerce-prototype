"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { 
  ChevronLeft, 
  Truck, 
  MapPin, 
  Building2, 
  CreditCard, 
  Banknote, 
  Building,
  CheckCircle2,
  Package,
  Minus,
  Plus,
  Trash2
} from "lucide-react"

const translations = {
  ua: {
    checkout: "Оформлення замовлення",
    back: "Назад до кошика",
    contactInfo: "Контактна інформація",
    name: "Ім'я та прізвище",
    phone: "Телефон",
    email: "Email",
    shipping: "Доставка",
    novaPoshta: "Нова Пошта",
    novaPoshtaDesc: "Доставка до відділення",
    courier: "Кур'єр",
    courierDesc: "Доставка за адресою",
    selfPickup: "Самовивіз",
    selfPickupDesc: "Забрати зі складу",
    city: "Місто",
    branch: "Відділення",
    address: "Адреса доставки",
    payment: "Оплата",
    cardOnline: "Картка онлайн",
    cardOnlineDesc: "Visa, Mastercard, Apple Pay",
    cashOnDelivery: "Накладений платіж",
    cashOnDeliveryDesc: "Оплата при отриманні",
    iban: "IBAN переказ",
    ibanDesc: "Банківський переказ",
    orderSummary: "Ваше замовлення",
    subtotal: "Сума товарів",
    shippingCost: "Доставка",
    free: "Безкоштовно",
    total: "До сплати",
    placeOrder: "Підтвердити замовлення",
    orderSuccess: "Замовлення оформлено!",
    orderSuccessDesc: "Ми зв'яжемося з вами найближчим часом",
    orderNumber: "Номер замовлення",
    continueShopping: "Продовжити покупки",
    required: "Обов'язкове поле",
    selectCity: "Оберіть місто",
    selectBranch: "Оберіть відділення"
  },
  ru: {
    checkout: "Оформление заказа",
    back: "Назад в корзину",
    contactInfo: "Контактная информация",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    shipping: "Доставка",
    novaPoshta: "Новая Почта",
    novaPoshtaDesc: "Доставка в отделение",
    courier: "Курьер",
    courierDesc: "Доставка по адресу",
    selfPickup: "Самовывоз",
    selfPickupDesc: "Забрать со склада",
    city: "Город",
    branch: "Отделение",
    address: "Адрес доставки",
    payment: "Оплата",
    cardOnline: "Карта онлайн",
    cardOnlineDesc: "Visa, Mastercard, Apple Pay",
    cashOnDelivery: "Наложенный платеж",
    cashOnDeliveryDesc: "Оплата при получении",
    iban: "IBAN перевод",
    ibanDesc: "Банковский перевод",
    orderSummary: "Ваш заказ",
    subtotal: "Сумма товаров",
    shippingCost: "Доставка",
    free: "Бесплатно",
    total: "К оплате",
    placeOrder: "Подтвердить заказ",
    orderSuccess: "Заказ оформлен!",
    orderSuccessDesc: "Мы свяжемся с вами в ближайшее время",
    orderNumber: "Номер заказа",
    continueShopping: "Продолжить покупки",
    required: "Обязательное поле",
    selectCity: "Выберите город",
    selectBranch: "Выберите отделение"
  },
  en: {
    checkout: "Checkout",
    back: "Back to cart",
    contactInfo: "Contact Information",
    name: "Full Name",
    phone: "Phone",
    email: "Email",
    shipping: "Shipping",
    novaPoshta: "Nova Poshta",
    novaPoshtaDesc: "Delivery to branch",
    courier: "Courier",
    courierDesc: "Delivery to address",
    selfPickup: "Self-pickup",
    selfPickupDesc: "Pick up from warehouse",
    city: "City",
    branch: "Branch",
    address: "Delivery Address",
    payment: "Payment",
    cardOnline: "Card Online",
    cardOnlineDesc: "Visa, Mastercard, Apple Pay",
    cashOnDelivery: "Cash on Delivery",
    cashOnDeliveryDesc: "Pay upon receipt",
    iban: "IBAN Transfer",
    ibanDesc: "Bank transfer",
    orderSummary: "Your Order",
    subtotal: "Subtotal",
    shippingCost: "Shipping",
    free: "Free",
    total: "Total",
    placeOrder: "Place Order",
    orderSuccess: "Order Placed!",
    orderSuccessDesc: "We will contact you shortly",
    orderNumber: "Order Number",
    continueShopping: "Continue Shopping",
    required: "Required field",
    selectCity: "Select city",
    selectBranch: "Select branch"
  }
}

// Nova Poshta cities and branches mock data
const cities = {
  ua: ["Київ", "Харків", "Одеса", "Дніпро", "Львів", "Запоріжжя", "Вінниця", "Полтава", "Черкаси", "Чернігів"],
  ru: ["Киев", "Харьков", "Одесса", "Днепр", "Львов", "Запорожье", "Винница", "Полтава", "Черкассы", "Чернигов"],
  en: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv", "Zaporizhzhia", "Vinnytsia", "Poltava", "Cherkasy", "Chernihiv"]
}

const branches: Record<string, string[]> = {
  "Київ": ["Відділення №1, вул. Хрещатик 22", "Відділення №2, пр. Перемоги 15", "Відділення №3, вул. Велика Васильківська 100", "Відділення №5, вул. Саксаганського 45"],
  "Kyiv": ["Branch №1, Khreshchatyk St. 22", "Branch №2, Peremohy Ave. 15", "Branch №3, Velyka Vasylkivska St. 100", "Branch №5, Saksahanskogo St. 45"],
  "Киев": ["Отделение №1, ул. Крещатик 22", "Отделение №2, пр. Победы 15", "Отделение №3, ул. Большая Васильковская 100", "Отделение №5, ул. Саксаганского 45"],
  "Харків": ["Відділення №1, вул. Сумська 10", "Відділення №2, пр. Науки 25"],
  "Kharkiv": ["Branch №1, Sumska St. 10", "Branch №2, Nauky Ave. 25"],
  "Харьков": ["Отделение №1, ул. Сумская 10", "Отделение №2, пр. Науки 25"],
  "Одеса": ["Відділення №1, вул. Дерибасівська 5", "Відділення №2, пр. Шевченка 50"],
  "Odesa": ["Branch №1, Derybasivska St. 5", "Branch №2, Shevchenko Ave. 50"],
  "Одесса": ["Отделение №1, ул. Дерибасовская 5", "Отделение №2, пр. Шевченко 50"],
  "Дніпро": ["Відділення №1, пр. Дмитра Яворницького 100"],
  "Dnipro": ["Branch №1, Dmytro Yavornytskoho Ave. 100"],
  "Днепр": ["Отделение №1, пр. Дмитрия Яворницкого 100"],
  "Львів": ["Відділення №1, пл. Ринок 1", "Відділення №2, вул. Городоцька 15"],
  "Lviv": ["Branch №1, Rynok Square 1", "Branch №2, Horodotska St. 15"],
  "Львов": ["Отделение №1, пл. Рынок 1", "Отделение №2, ул. Городоцкая 15"]
}

type ShippingMethod = "novaPoshta" | "courier" | "selfPickup"
type PaymentMethod = "cardOnline" | "cashOnDelivery" | "iban"

export function CheckoutPage() {
  const { 
    language, 
    cart, 
    cartTotal, 
    clearCart, 
    setCurrentView, 
    setIsCartOpen,
    updateQuantity,
    removeFromCart
  } = useStore()
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    branch: "",
    address: ""
  })

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("novaPoshta")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cardOnline")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const getProductName = (item: typeof cart[0]) => {
    switch (language) {
      case "ua": return item.product.nameUa
      case "ru": return item.product.nameRu
      default: return item.product.name
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.phone.trim()) newErrors.phone = true
    if (!formData.email.trim()) newErrors.email = true
    
    if (shippingMethod === "novaPoshta") {
      if (!formData.city) newErrors.city = true
      if (!formData.branch) newErrors.branch = true
    } else if (shippingMethod === "courier") {
      if (!formData.city) newErrors.city = true
      if (!formData.address.trim()) newErrors.address = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Generate order number
    const orderNum = `ARMY-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(orderNum)
    setOrderPlaced(true)
    clearCart()
  }

  const handleBackToCart = () => {
    setIsCartOpen(true)
    setCurrentView("home")
  }

  const handleContinueShopping = () => {
    setCurrentView("home")
  }

  const shippingCost = shippingMethod === "courier" ? 80 : 0
  const total = cartTotal + shippingCost

  const availableCities = cities[language]
  const availableBranches = branches[formData.city] || []

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center px-4"
      >
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.orderSuccess}</h1>
          <p className="text-muted-foreground mb-4">{t.orderSuccessDesc}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {t.orderNumber}: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
          </p>
          <button
            onClick={handleContinueShopping}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.continueShopping}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToCart}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">{t.checkout}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <section className="bg-card border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t.contactInfo}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t.name} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t.phone} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+380"
                      className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="bg-card border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t.shipping}</h2>
                <div className="space-y-3">
                  {/* Nova Poshta */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    shippingMethod === "novaPoshta" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="novaPoshta"
                      checked={shippingMethod === "novaPoshta"}
                      onChange={() => setShippingMethod("novaPoshta")}
                      className="mt-1 accent-primary"
                    />
                    <Truck className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{t.novaPoshta}</span>
                      <p className="text-sm text-muted-foreground">{t.novaPoshtaDesc}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{t.free}</span>
                  </label>

                  {/* Courier */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    shippingMethod === "courier" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="courier"
                      checked={shippingMethod === "courier"}
                      onChange={() => setShippingMethod("courier")}
                      className="mt-1 accent-primary"
                    />
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{t.courier}</span>
                      <p className="text-sm text-muted-foreground">{t.courierDesc}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">₴80</span>
                  </label>

                  {/* Self-pickup */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    shippingMethod === "selfPickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="selfPickup"
                      checked={shippingMethod === "selfPickup"}
                      onChange={() => setShippingMethod("selfPickup")}
                      className="mt-1 accent-primary"
                    />
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{t.selfPickup}</span>
                      <p className="text-sm text-muted-foreground">{t.selfPickupDesc}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{t.free}</span>
                  </label>
                </div>

                {/* Shipping Details */}
                <AnimatePresence mode="wait">
                  {shippingMethod === "novaPoshta" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t.city} *
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.city ? "border-destructive" : "border-border"
                          }`}
                        >
                          <option value="">{t.selectCity}</option>
                          {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t.branch} *
                        </label>
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          disabled={!formData.city}
                          className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                            errors.branch ? "border-destructive" : "border-border"
                          }`}
                        >
                          <option value="">{t.selectBranch}</option>
                          {availableBranches.map(branch => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </select>
                        {errors.branch && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                      </div>
                    </motion.div>
                  )}

                  {shippingMethod === "courier" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t.city} *
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.city ? "border-destructive" : "border-border"
                          }`}
                        >
                          <option value="">{t.selectCity}</option>
                          {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t.address} *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.address ? "border-destructive" : "border-border"
                          }`}
                        />
                        {errors.address && <p className="text-sm text-destructive mt-1">{t.required}</p>}
                      </div>
                    </motion.div>
                  )}

                  {shippingMethod === "selfPickup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-muted/50"
                    >
                      <p className="text-sm text-muted-foreground">
                        {language === "ua" 
                          ? "Адреса складу: м. Київ, вул. Промислова 15, склад №3. Пн-Пт: 9:00-18:00" 
                          : language === "ru"
                          ? "Адрес склада: г. Киев, ул. Промышленная 15, склад №3. Пн-Пт: 9:00-18:00"
                          : "Warehouse address: Kyiv, Promyslova St. 15, Warehouse №3. Mon-Fri: 9:00-18:00"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Payment Method */}
              <section className="bg-card border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t.payment}</h2>
                <div className="space-y-3">
                  {/* Card Online */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "cardOnline" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cardOnline"
                      checked={paymentMethod === "cardOnline"}
                      onChange={() => setPaymentMethod("cardOnline")}
                      className="mt-1 accent-primary"
                    />
                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{t.cardOnline}</span>
                      <p className="text-sm text-muted-foreground">{t.cardOnlineDesc}</p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "cashOnDelivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cashOnDelivery"
                      checked={paymentMethod === "cashOnDelivery"}
                      onChange={() => setPaymentMethod("cashOnDelivery")}
                      className="mt-1 accent-primary"
                    />
                    <Banknote className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{t.cashOnDelivery}</span>
                      <p className="text-sm text-muted-foreground">{t.cashOnDeliveryDesc}</p>
                    </div>
                  </label>

                  {/* IBAN */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "iban" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="iban"
                      checked={paymentMethod === "iban"}
                      onChange={() => setPaymentMethod("iban")}
                      className="mt-1 accent-primary"
                    />
                    <Building className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">{t.iban}</span>
                      <p className="text-sm text-muted-foreground">{t.ibanDesc}</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === "iban" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-muted/50"
                  >
                    <p className="text-sm font-mono text-foreground">
                      IBAN: UA21 3052 9900 0000 2620 9300 0001
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "ua" 
                        ? "ТОВ \"АРМІ\", ЄДРПОУ: 12345678"
                        : language === "ru"
                        ? "ООО \"АРМИ\", ЕГРПОУ: 12345678"
                        : "ARMY LLC, EDRPOU: 12345678"}
                    </p>
                  </motion.div>
                )}
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {t.orderSummary}
                </h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={getProductName(item)}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {getProductName(item)}
                        </h4>
                        <p className="text-sm text-muted-foreground">₴{item.product.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.subtotal}</span>
                    <span className="text-foreground">₴{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.shippingCost}</span>
                    <span className={shippingCost === 0 ? "text-primary" : "text-foreground"}>
                      {shippingCost === 0 ? t.free : `₴${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>{t.total}</span>
                    <span>₴{total}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.placeOrder}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
