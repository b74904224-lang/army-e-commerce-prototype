"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { ArrowRight } from "lucide-react"

const translations = {
  ua: {
    title: "Спорядження для справжніх умов",
    subtitle: "Професійне тактичне та туристичне спорядження українського виробництва",
    cta: "Перейти до покупок"
  },
  ru: {
    title: "Снаряжение для настоящих условий",
    subtitle: "Профессиональное тактическое и туристическое снаряжение украинского производства",
    cta: "Перейти к покупкам"
  },
  en: {
    title: "Equipment for Real Conditions",
    subtitle: "Professional tactical and outdoor equipment made in Ukraine",
    cta: "Shop Now"
  }
}

export function HeroSection() {
  const { language, setCurrentView, setSelectedCategory } = useStore()
  const t = translations[language]

  const handleShopNow = () => {
    setSelectedCategory(null)
    setCurrentView("category")
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80"
          alt="Outdoor camping scene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 sm:mt-6 text-lg sm:text-xl text-white/80 leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShopNow}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-foreground font-semibold text-sm sm:text-base uppercase tracking-wide hover:bg-secondary transition-colors"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
