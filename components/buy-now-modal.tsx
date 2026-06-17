"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { formatPrice, variantSummary } from "@/lib/catalog"
import { isApiConfigured } from "@/lib/api-client"
import { createOrder, type OrderPayload } from "@/lib/api"
import { X, Zap, CheckCircle } from "lucide-react"

const translations = {
  ua: {
    title: "Швидке замовлення",
    name: "Ваше ім'я",
    phone: "Номер телефону",
    submit: "Замовити",
    sending: "Відправляємо...",
    success: "Дякуємо! Ваше замовлення прийнято, менеджер зв'яжеться з вами найближчим часом.",
    orderNumber: "Номер замовлення",
    close: "Закрити",
    errName: "Введіть ім'я",
    errPhone: "Введіть коректний номер телефону",
    serverError:
      "Сервер замовлень тимчасово недоступний. Спробуйте пізніше або зв'яжіться з нами телефоном.",
  },
  ru: {
    title: "Быстрый заказ",
    name: "Ваше имя",
    phone: "Номер телефона",
    submit: "Заказать",
    sending: "Отправляем...",
    success: "Спасибо! Ваш заказ принят, менеджер свяжется с вами в ближайшее время.",
    orderNumber: "Номер заказа",
    close: "Закрыть",
    errName: "Введите имя",
    errPhone: "Введите корректный номер телефона",
    serverError:
      "Сервер заказов временно недоступен. Попробуйте позже или свяжитесь с нами по телефону.",
  },
  en: {
    title: "Quick Order",
    name: "Your Name",
    phone: "Phone Number",
    submit: "Order",
    sending: "Sending...",
    success: "Thank you! Your order has been received, our manager will contact you shortly.",
    orderNumber: "Order Number",
    close: "Close",
    errName: "Enter your name",
    errPhone: "Enter a valid phone number",
    serverError: "Order server is temporarily unavailable. Please try again later or contact us by phone.",
  },
}

export function BuyNowModal() {
  const { language, isBuyNowOpen, setIsBuyNowOpen, buyNowProduct: selectedProduct, buyNowVariants } = useStore()
  const t = translations[language]
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState("")

  const getProductName = () => {
    if (!selectedProduct) return ""
    switch (language) {
      case "ua":
        return selectedProduct.nameUa
      case "ru":
        return selectedProduct.nameRu
      default:
        return selectedProduct.name
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation — keep the modal open on any error.
    if (!name.trim()) {
      setError(t.errName)
      return
    }
    if (!/^\+?\d[\d\s-]{8,}$/.test(phone.trim())) {
      setError(t.errPhone)
      return
    }
    if (!selectedProduct) return

    // No backend configured = do not fake a successful order in production.
    if (!isApiConfigured) {
      setError(t.serverError)
      return
    }

    const payload: OrderPayload = {
      type: "quick_order",
      customer: {
        name: name.trim(),
        phone: phone.trim(),
      },
      delivery: {
        service: "not_required_for_quick_order",
        type: "not_required_for_quick_order",
      },
      payment: { method: "manager_confirmation" },
      items: [
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
          ...(buyNowVariants && buyNowVariants.length > 0
            ? {
                variant: variantSummary(buyNowVariants, language),
                variants: buyNowVariants.map((v) => ({
                  groupId: v.groupId,
                  groupLabel: v.groupLabelUa,
                  optionId: v.optionId,
                  optionLabel: v.optionLabelUa,
                })),
              }
            : {}),
        },
      ],
      totals: {
        subtotal: selectedProduct.price,
        shipping: 0,
        total: selectedProduct.price,
      },
      language,
      source: "buy_now_modal",
    }

    setSubmitting(true)
    try {
      const res = await createOrder(payload)
      if (!res?.success) {
        throw new Error(res?.message || "Order rejected by server")
      }
      setOrderNumber(res.orderNumber)
      setSubmitted(true)
    } catch {
      setError(t.serverError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsBuyNowOpen(false)
    setSubmitted(false)
    setName("")
    setPhone("")
    setError(null)
    setOrderNumber("")
  }

  return (
    <AnimatePresence>
      {isBuyNowOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-foreground/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-background rounded shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  {t.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg text-foreground mb-2 text-pretty">{t.success}</p>
                  {orderNumber && (
                    <p className="text-sm text-muted-foreground mb-6">
                      {t.orderNumber}:{" "}
                      <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
                    </p>
                  )}
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Product Info */}
                  {selectedProduct && (
                    <div className="flex items-center gap-4 p-3 bg-muted rounded">
                      <img
                        src={selectedProduct.images[0] || "/placeholder.svg"}
                        alt={getProductName()}
                        className="w-16 h-16 object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{getProductName()}</p>
                        {buyNowVariants && buyNowVariants.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {variantSummary(buyNowVariants, language)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">{formatPrice(selectedProduct.price, language)}</p>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.name}
                    className="w-full px-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phone}
                    className="w-full px-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-5 h-5" />
                    {submitting ? t.sending : t.submit}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
