"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { isApiConfigured } from "@/lib/api-client"
import { createOrder, type OrderPayload, type DeliveryService as PayloadService } from "@/lib/api"
import { routes } from "@/lib/site-routes"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Banknote,
  Landmark,
  PhoneCall,
  CheckCircle2,
  Package,
  Building2,
  Home,
} from "lucide-react"

const translations = {
  ua: {
    checkout: "Оформлення замовлення",
    back: "Назад до покупок",
    step: "Крок",
    contactInfo: "Контактна інформація",
    name: "Ім'я та прізвище",
    phone: "Телефон",
    email: "Email",
    delivery: "Спосіб доставки",
    deliveryService: "Служба доставки",
    branchDelivery: "Доставка у відділення",
    homeDelivery: "Адресна доставка кур'єром",
    city: "Місто",
    branchNumber: "Номер відділення",
    street: "Вулиця",
    building: "Будинок",
    apartment: "Квартира",
    payment: "Спосіб оплати",
    cod: "Оплата при отриманні / Післяплата",
    codDesc: "Сплатіть під час отримання посилки",
    bankTransfer: "Оплата на реквізити",
    bankTransferDesc: "Менеджер надішле реквізити після підтвердження",
    managerConfirmation: "Уточнення оплати менеджером",
    managerConfirmationDesc: "Менеджер зв'яжеться та уточнить зручний спосіб оплати",
    comment: "Коментар до замовлення",
    commentPlaceholder: "Додаткові побажання (необов'язково)",
    orderSummary: "Ваше замовлення",
    subtotal: "Сума товарів",
    shippingCost: "Доставка",
    free: "За тарифами",
    total: "До сплати",
    placeOrder: "Підтвердити замовлення",
    orderSuccess: "Дякуємо! Ваше замовлення прийнято",
    orderSuccessDesc: "Наш менеджер зв'яжеться з вами найближчим часом.",
    orderNumber: "Номер замовлення",
    continueShopping: "Продовжити покупки",
    required: "Обов'язкове поле",
    invalidEmail: "Невірний email",
    invalidPhone: "Невірний телефон",
    emptyCart: "Ваш кошик порожній",
    serverError:
      "Сервер замовлень тимчасово недоступний. Спробуйте пізніше або зв'яжіться з нами телефоном.",
    qty: "Кіл-ть",
  },
  ru: {
    checkout: "Оформление заказа",
    back: "Назад к покупкам",
    step: "Шаг",
    contactInfo: "Контактная информация",
    name: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    delivery: "Способ доставки",
    deliveryService: "Служба доставки",
    branchDelivery: "Доставка в отделение",
    homeDelivery: "Адресная доставка курьером",
    city: "Город",
    branchNumber: "Номер отделения",
    street: "Улица",
    building: "Дом",
    apartment: "Квартира",
    payment: "Способ оплаты",
    cod: "Оплата при получении / Наложенный платеж",
    codDesc: "Оплатите при получении посылки",
    bankTransfer: "Оплата на реквизиты",
    bankTransferDesc: "Менеджер пришлёт реквизиты после подтверждения",
    managerConfirmation: "Уточнение оплаты менеджером",
    managerConfirmationDesc: "Менеджер свяжется и уточнит удобный способ оплаты",
    comment: "Комментарий к заказу",
    commentPlaceholder: "Дополнительные пожелания (необязательно)",
    orderSummary: "Ваш заказ",
    subtotal: "Сумма товаров",
    shippingCost: "Доставка",
    free: "По тарифам",
    total: "К оплате",
    placeOrder: "Подтвердить заказ",
    orderSuccess: "Заказ оформлен!",
    orderSuccessDesc: "Мы свяжемся с вами в ближайшее время для подтверждения",
    orderNumber: "Номер заказа",
    continueShopping: "Продолжить покупки",
    required: "Обязательное поле",
    invalidEmail: "Неверный email",
    invalidPhone: "Неверный телефон",
    emptyCart: "Ваша корзина пуста",
    serverError:
      "Сервер заказов временно недоступен. Попробуйте позже или свяжитесь с нами по телефону.",
    qty: "Кол-во",
  },
  en: {
    checkout: "Checkout",
    back: "Back to shopping",
    step: "Step",
    contactInfo: "Contact Information",
    name: "Full Name",
    phone: "Phone",
    email: "Email",
    delivery: "Delivery Method",
    deliveryService: "Delivery Service",
    branchDelivery: "Branch Pickup",
    homeDelivery: "Courier Home Delivery",
    city: "City",
    branchNumber: "Branch Number",
    street: "Street",
    building: "Building",
    apartment: "Apartment",
    payment: "Payment Method",
    cod: "Cash on Delivery",
    codDesc: "Pay when you receive the parcel",
    bankTransfer: "Bank Transfer",
    bankTransferDesc: "Manager will send payment details after confirmation",
    managerConfirmation: "Manager Will Confirm Payment",
    managerConfirmationDesc: "Manager will contact you to arrange a convenient payment method",
    comment: "Order Comment",
    commentPlaceholder: "Additional notes (optional)",
    orderSummary: "Your Order",
    subtotal: "Subtotal",
    shippingCost: "Shipping",
    free: "By tariff",
    total: "Total",
    placeOrder: "Place Order",
    orderSuccess: "Order Placed!",
    orderSuccessDesc: "We will contact you shortly to confirm",
    orderNumber: "Order Number",
    continueShopping: "Continue Shopping",
    required: "Required field",
    invalidEmail: "Invalid email",
    invalidPhone: "Invalid phone",
    emptyCart: "Your cart is empty",
    serverError: "Order server is temporarily unavailable. Please try again later or contact us by phone.",
    qty: "Qty",
  },
}

const deliveryServices = [
  { id: "novaPoshta", name: "Нова Пошта", color: "#da291c" },
  { id: "ukrPoshta", name: "Укрпошта", color: "#ffd200" },
  { id: "meest", name: "Міст Пошта", color: "#0072ce" },
] as const

const cities = {
  ua: ["Київ", "Харків", "Одеса", "Дніпро", "Львів", "Запоріжжя", "Вінниця", "Полтава", "Черкаси", "Чернігів"],
  ru: ["Киев", "Харьков", "Одесса", "Днепр", "Львов", "Запорожье", "Винница", "Полтава", "Черкассы", "Чернигов"],
  en: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv", "Zaporizhzhia", "Vinnytsia", "Poltava", "Cherkasy", "Chernihiv"],
}

type DeliveryService = (typeof deliveryServices)[number]["id"]
type DeliveryType = "branch" | "home"
type PaymentMethod = "cod" | "bank_transfer" | "manager_confirmation"

// Map the frontend delivery service ids to the unified backend payload values.
const serviceToPayload: Record<DeliveryService, PayloadService> = {
  novaPoshta: "nova_poshta",
  ukrPoshta: "ukr_poshta",
  meest: "meest",
}

export function CheckoutPage() {
  const { language, cart, cartTotal, clearCart } = useStore()
  const router = useRouter()
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    branchNumber: "",
    street: "",
    building: "",
    apartment: "",
    comment: "",
  })

  const [deliveryService, setDeliveryService] = useState<DeliveryService>("novaPoshta")
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("branch")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = t.required
    if (!formData.phone.trim()) e.phone = t.required
    else if (!/^\+?\d[\d\s-]{8,}$/.test(formData.phone.trim())) e.phone = t.invalidPhone
    if (!formData.email.trim()) e.email = t.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = t.invalidEmail
    if (!formData.city) e.city = t.required

    if (deliveryType === "branch") {
      if (!formData.branchNumber.trim()) e.branchNumber = t.required
    } else {
      if (!formData.street.trim()) e.street = t.required
      if (!formData.building.trim()) e.building = t.required
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const shippingCost = deliveryType === "home" ? 80 : 0
  const total = cartTotal + shippingCost

  // Build the unified order payload sent to the OVHcloud backend (POST /api/orders).
  const buildOrderPayload = (): OrderPayload => ({
    type: "checkout",
    customer: {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
    },
    delivery: {
      service: serviceToPayload[deliveryService],
      type: deliveryType,
      city: formData.city || undefined,
      ...(deliveryType === "branch"
        ? { branchNumber: formData.branchNumber.trim() }
        : {
            street: formData.street.trim(),
            building: formData.building.trim(),
            apartment: formData.apartment.trim() || undefined,
          }),
    },
    payment: { method: paymentMethod },
    items: cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
    totals: {
      subtotal: cartTotal,
      shipping: shippingCost,
      total,
    },
    comment: formData.comment.trim() || undefined,
    language,
    source: "checkout_page",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (cart.length === 0) {
      setSubmitError(t.emptyCart)
      return
    }

    if (!validateForm()) {
      const firstError = document.querySelector("[data-error='true']")
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    // No backend configured = we must NOT fake a successful order in production.
    if (!isApiConfigured) {
      setSubmitError(t.serverError)
      return
    }

    setSubmitting(true)
    try {
      const res = await createOrder(buildOrderPayload())
      if (!res?.success) {
        throw new Error(res?.message || "Order rejected by server")
      }
      setOrderNumber(res.orderNumber)
      setOrderPlaced(true)
      clearCart()
    } catch {
      setSubmitError(t.serverError)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
      errors[field] ? "border-destructive" : "border-border"
    }`

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center px-4 py-20"
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
          <p className="text-muted-foreground mb-4 text-pretty">{t.orderSuccessDesc}</p>
          <p className="text-sm text-muted-foreground mb-8">
            {t.orderNumber}: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
          </p>
          <button
            onClick={() => router.push(routes.home)}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors uppercase tracking-wide"
          >
            {t.continueShopping}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Link
          href={routes.cart}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 tracking-tight">{t.checkout}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <section className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{t.contactInfo}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.name} *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      data-error={!!errors.name}
                      className={inputClass("name")}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.phone} *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+380 __ ___ __ __"
                      data-error={!!errors.phone}
                      className={inputClass("phone")}
                    />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.email} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@email.com"
                      data-error={!!errors.email}
                      className={inputClass("email")}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{t.delivery}</h2>
                </div>

                {/* Service tabs */}
                <p className="text-sm font-medium text-foreground mb-2">{t.deliveryService}</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {deliveryServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setDeliveryService(service.id)}
                      className={`relative flex flex-col items-center justify-center gap-2 p-4 border rounded-md transition-all ${
                        deliveryService === service.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-foreground"
                        style={{ backgroundColor: service.color }}
                      >
                        <Package className="w-4 h-4 text-background" />
                      </span>
                      <span className="text-xs font-medium text-foreground text-center leading-tight">
                        {service.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Delivery type toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("branch")}
                    className={`flex items-center gap-3 p-4 border rounded-md text-left transition-all ${
                      deliveryType === "branch"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{t.branchDelivery}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`flex items-center gap-3 p-4 border rounded-md text-left transition-all ${
                      deliveryType === "home"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Home className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{t.homeDelivery}</span>
                  </button>
                </div>

                {/* Dynamic delivery fields */}
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.city} *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      data-error={!!errors.city}
                      className={inputClass("city")}
                    >
                      <option value="">—</option>
                      {cities[language].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                  </div>

                  <AnimatePresence mode="wait">
                    {deliveryType === "branch" ? (
                      <motion.div
                        key="branch"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.branchNumber} *
                        </label>
                        <input
                          type="text"
                          name="branchNumber"
                          value={formData.branchNumber}
                          onChange={handleInputChange}
                          placeholder="№ ___"
                          data-error={!!errors.branchNumber}
                          className={inputClass("branchNumber")}
                        />
                        {errors.branchNumber && (
                          <p className="text-sm text-destructive mt-1">{errors.branchNumber}</p>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="home"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-foreground mb-1.5">{t.street} *</label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            data-error={!!errors.street}
                            className={inputClass("street")}
                          />
                          {errors.street && <p className="text-sm text-destructive mt-1">{errors.street}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">{t.building} *</label>
                          <input
                            type="text"
                            name="building"
                            value={formData.building}
                            onChange={handleInputChange}
                            data-error={!!errors.building}
                            className={inputClass("building")}
                          />
                          {errors.building && <p className="text-sm text-destructive mt-1">{errors.building}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">{t.apartment}</label>
                          <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            className={inputClass("apartment")}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">{t.payment}</h2>
                </div>

                <div className="space-y-3">
                  {(
                    [
                      { id: "cod", icon: Banknote, title: t.cod, desc: t.codDesc },
                      { id: "bank_transfer", icon: Landmark, title: t.bankTransfer, desc: t.bankTransferDesc },
                      {
                        id: "manager_confirmation",
                        icon: PhoneCall,
                        title: t.managerConfirmation,
                        desc: t.managerConfirmationDesc,
                      },
                    ] as const
                  ).map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-4 p-4 border rounded-md cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-primary"
                      />
                      <method.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-foreground block">{method.title}</span>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Optional order comment */}
                <div className="mt-5">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.comment}</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={t.commentPlaceholder}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t.orderSummary}</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={getProductName(item)}
                        className="w-16 h-16 object-cover rounded shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                          {getProductName(item)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t.qty}: {item.quantity} × {item.product.price} грн
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                        {item.product.price * item.quantity} грн
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t.subtotal}</span>
                    <span className="text-foreground">{cartTotal} грн</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t.shippingCost}</span>
                    <span className="text-foreground">
                      {deliveryType === "home" ? "80 грн" : t.free}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">{t.total}</span>
                  <span className="text-xl font-bold text-foreground">{total} грн</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground font-semibold rounded-md uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "..." : t.placeOrder}
                </button>

                {submitError && (
                  <p className="mt-3 text-sm text-destructive text-center" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
