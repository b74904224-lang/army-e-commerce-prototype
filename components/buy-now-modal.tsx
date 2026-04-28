"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { X, Zap, CheckCircle } from "lucide-react"

const translations = {
  ua: {
    title: "Швидке замовлення",
    name: "Ваше ім'я",
    phone: "Номер телефону",
    submit: "Замовити",
    success: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
    close: "Закрити"
  },
  ru: {
    title: "Быстрый заказ",
    name: "Ваше имя",
    phone: "Номер телефона",
    submit: "Заказать",
    success: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    close: "Закрыть"
  },
  en: {
    title: "Quick Order",
    name: "Your Name",
    phone: "Phone Number",
    submit: "Order",
    success: "Thank you! We will contact you shortly.",
    close: "Close"
  }
}

export function BuyNowModal() {
  const { language, isBuyNowOpen, setIsBuyNowOpen, selectedProduct } = useStore()
  const t = translations[language]
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const getProductName = () => {
    if (!selectedProduct) return ""
    switch (language) {
      case "ua": return selectedProduct.nameUa
      case "ru": return selectedProduct.nameRu
      default: return selectedProduct.name
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setIsBuyNowOpen(false)
    setSubmitted(false)
    setName("")
    setPhone("")
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
                  <p className="text-lg text-foreground mb-6">{t.success}</p>
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
                        src={selectedProduct.images[0]}
                        alt={getProductName()}
                        className="w-16 h-16 object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{getProductName()}</p>
                        <p className="text-lg font-bold text-primary">
                          ₴{selectedProduct.price}
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t.name}
                    required
                    className="w-full px-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={t.phone}
                    required
                    className="w-full px-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <button
                    type="submit"
                    className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-wide hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    {t.submit}
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
