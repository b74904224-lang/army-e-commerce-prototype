"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { Shield, Droplets, Feather, Mountain } from "lucide-react"

const translations = {
  ua: {
    benefits: [
      { icon: Shield, title: "Надійні матеріали", description: "Термоізоляція, що захищає від холоду ґрунту" },
      { icon: Droplets, title: "Вологостійкість", description: "Повністю не пропускає вологу" },
      { icon: Feather, title: "Легкість і компактність", description: "Стійкість до проколів і зношування" },
      { icon: Mountain, title: "Для будь-якої пригоди", description: "Універсальність використання" }
    ]
  },
  ru: {
    benefits: [
      { icon: Shield, title: "Надежные материалы", description: "Теплоизоляция, защищающая от холода почвы" },
      { icon: Droplets, title: "Влагостойкость", description: "Полностью не пропускает влагу" },
      { icon: Feather, title: "Легкость и компактность", description: "Стойкость к проколам и износу" },
      { icon: Mountain, title: "Для любого приключения", description: "Универсальность использования" }
    ]
  },
  en: {
    benefits: [
      { icon: Shield, title: "Reliable Materials", description: "Thermal insulation protecting from ground cold" },
      { icon: Droplets, title: "Water Resistance", description: "Completely does not absorb moisture" },
      { icon: Feather, title: "Light & Compact", description: "Resistant to punctures and wear" },
      { icon: Mountain, title: "For Any Adventure", description: "Versatility of use" }
    ]
  }
}

export function BenefitsSection() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <section className="py-16 sm:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {t.benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
