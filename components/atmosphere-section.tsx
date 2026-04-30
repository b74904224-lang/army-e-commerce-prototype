"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"

const translations = {
  ua: {
    title: "Створено для природи",
    description: "Наша продукція створена для комфорту, на який можна покластися. Незалежно від того, чи це подорож, тренування, активний відпочинок або заняття спортом."
  },
  ru: {
    title: "Создано для природы",
    description: "Наша продукция создана для комфорта, на который можно положиться. Независимо от того, путешествие это, тренировка, активный отдых или занятия спортом."
  },
  en: {
    title: "Created for Nature",
    description: "Our products are designed for comfort you can rely on. Whether it's a trip, training, active recreation or sports."
  }
}

export function AtmosphereSection() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
      <img
        src="/images/nature-atmosphere.jpg"
        alt="ARMY equipment in nature"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {t.title}
          </h2>
          <p className="text-lg text-white/80 text-balance">
            {t.description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
