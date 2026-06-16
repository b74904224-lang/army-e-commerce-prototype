"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const translations = {
  ua: {
    title: "Про бренд",
    description: "Торгівельна марка ARMY була заснована у 2022 році — у часи серйозних випробувань та переосмислення базових потреб. Сьогодні ARMY — це не лише про витримку в складних умовах, а й про зручність у повсякденному використанні.",
    cta: "Дізнатися більше"
  },
  ru: {
    title: "О бренде",
    description: "Торговая марка ARMY была основана в 2022 году — во времена серьезных испытаний и переосмысления базовых потребностей. Сегодня ARMY — это не только о выдержке в сложных условиях, но и об удобстве в повседневном использовании.",
    cta: "Узнать больше"
  },
  en: {
    title: "About the Brand",
    description: "The ARMY trademark was founded in 2022 — during times of serious trials and rethinking of basic needs. Today ARMY is not only about endurance in difficult conditions, but also about convenience in everyday use.",
    cta: "Learn More"
  }
}

export function AboutPreview() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            {t.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 text-balance">
            {t.description}
          </p>
          <Link
            href={routes.about}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
