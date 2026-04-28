"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { Shield, Truck, Award, Leaf } from "lucide-react"

const translations = {
  ua: {
    benefits: [
      { icon: Shield, title: "Військова якість", description: "Протестовано в реальних польових умовах" },
      { icon: Truck, title: "Швидка доставка", description: "По всій Україні за 1-3 дні" },
      { icon: Award, title: "Гарантія 2 роки", description: "На всю продукцію бренду" },
      { icon: Leaf, title: "Екологічно", description: "Безпечні матеріали для людини та природи" }
    ]
  },
  ru: {
    benefits: [
      { icon: Shield, title: "Военное качество", description: "Протестировано в реальных полевых условиях" },
      { icon: Truck, title: "Быстрая доставка", description: "По всей Украине за 1-3 дня" },
      { icon: Award, title: "Гарантия 2 года", description: "На всю продукцию бренда" },
      { icon: Leaf, title: "Экологично", description: "Безопасные материалы для человека и природы" }
    ]
  },
  en: {
    benefits: [
      { icon: Shield, title: "Military Quality", description: "Tested in real field conditions" },
      { icon: Truck, title: "Fast Delivery", description: "Across Ukraine in 1-3 days" },
      { icon: Award, title: "2 Year Warranty", description: "On all brand products" },
      { icon: Leaf, title: "Eco-Friendly", description: "Safe materials for people and nature" }
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
