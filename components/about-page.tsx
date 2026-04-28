"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { Target, Users, Mountain, Heart } from "lucide-react"

const translations = {
  ua: {
    title: "Про бренд ARMY",
    subtitle: "Створено для тих, хто обирає якість",
    story: {
      title: "Наша історія",
      p1: "ARMY — український бренд тактичного та туристичного спорядження, заснований у 2022 році. Ми народилися в час, коли якісне вітчизняне спорядження стало необхідністю, а не просто альтернативою імпортним аналогам.",
      p2: "Наша команда — це інженери, дизайнери та практики, які знають, що означає працювати в складних умовах. Кожен продукт проходить ретельне тестування в реальних польових умовах перед тим, як потрапити до вас.",
      p3: "Ми використовуємо лише перевірені матеріали та сучасні технології виробництва. Наша мета — створювати спорядження, яке працює тоді, коли це найбільш потрібно."
    },
    values: [
      { icon: Target, title: "Якість", description: "Кожен продукт проходить суворий контроль якості" },
      { icon: Users, title: "Команда", description: "Досвідчені фахівці з пристрастю до своєї справи" },
      { icon: Mountain, title: "Надійність", description: "Спорядження, перевірене в екстремальних умовах" },
      { icon: Heart, title: "Турбота", description: "Підтримка клієнтів на кожному етапі" }
    ],
    stats: [
      { value: "2022", label: "Рік заснування" },
      { value: "10,000+", label: "Задоволених клієнтів" },
      { value: "50+", label: "Моделей продукції" },
      { value: "2 роки", label: "Гарантія" }
    ]
  },
  ru: {
    title: "О бренде ARMY",
    subtitle: "Создано для тех, кто выбирает качество",
    story: {
      title: "Наша история",
      p1: "ARMY — украинский бренд тактического и туристического снаряжения, основанный в 2022 году. Мы родились во время, когда качественное отечественное снаряжение стало необходимостью, а не просто альтернативой импортным аналогам.",
      p2: "Наша команда — это инженеры, дизайнеры и практики, которые знают, что значит работать в сложных условиях. Каждый продукт проходит тщательное тестирование в реальных полевых условиях перед тем, как попасть к вам.",
      p3: "Мы используем только проверенные материалы и современные технологии производства. Наша цель — создавать снаряжение, которое работает тогда, когда это больше всего нужно."
    },
    values: [
      { icon: Target, title: "Качество", description: "Каждый продукт проходит строгий контроль качества" },
      { icon: Users, title: "Команда", description: "Опытные специалисты со страстью к своему делу" },
      { icon: Mountain, title: "Надежность", description: "Снаряжение, проверенное в экстремальных условиях" },
      { icon: Heart, title: "Забота", description: "Поддержка клиентов на каждом этапе" }
    ],
    stats: [
      { value: "2022", label: "Год основания" },
      { value: "10,000+", label: "Довольных клиентов" },
      { value: "50+", label: "Моделей продукции" },
      { value: "2 года", label: "Гарантия" }
    ]
  },
  en: {
    title: "About ARMY Brand",
    subtitle: "Created for those who choose quality",
    story: {
      title: "Our Story",
      p1: "ARMY is a Ukrainian brand of tactical and outdoor equipment, founded in 2022. We were born at a time when quality domestic equipment became a necessity, not just an alternative to imported counterparts.",
      p2: "Our team consists of engineers, designers, and practitioners who know what it means to work in difficult conditions. Every product undergoes thorough testing in real field conditions before reaching you.",
      p3: "We use only proven materials and modern production technologies. Our goal is to create equipment that works when it&apos;s needed most."
    },
    values: [
      { icon: Target, title: "Quality", description: "Every product passes strict quality control" },
      { icon: Users, title: "Team", description: "Experienced specialists with passion for their work" },
      { icon: Mountain, title: "Reliability", description: "Equipment tested in extreme conditions" },
      { icon: Heart, title: "Care", description: "Customer support at every stage" }
    ],
    stats: [
      { value: "2022", label: "Year Founded" },
      { value: "10,000+", label: "Satisfied Customers" },
      { value: "50+", label: "Product Models" },
      { value: "2 Years", label: "Warranty" }
    ]
  }
}

export function AboutPage() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1920&q=80"
          alt="ARMY brand"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-white/80">{t.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
              {t.story.title}
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              <p>{t.story.p3}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
