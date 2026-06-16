"use client"

import { motion } from "framer-motion"
import { useStore, categories } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"

const translations = {
  ua: { title: "Категорії", viewAll: "Переглянути все" },
  ru: { title: "Категории", viewAll: "Смотреть все" },
  en: { title: "Categories", viewAll: "View All" }
}

export function CategoryGrid() {
  const { language } = useStore()
  const t = translations[language]

  const getCategoryName = (category: typeof categories[0]) => {
    switch (language) {
      case "ua": return category.nameUa
      case "ru": return category.nameRu
      default: return category.name
    }
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10 sm:mb-12"
        >
          {t.title}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={routes.category(category.id)}
                className="group relative aspect-[4/5] overflow-hidden bg-muted text-left block"
              >
                <img
                  src={category.image}
                  alt={getCategoryName(category)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                    {getCategoryName(category)}
                  </h3>
                  <span className="mt-2 inline-block text-sm text-white/80 group-hover:text-white transition-colors">
                    {t.viewAll} →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
