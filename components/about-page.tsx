"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { Shield, Droplets, Feather, Mountain } from "lucide-react"

const translations = {
  ua: {
    title: "Про бренд ARMY",
    subtitle: "Створено для тих, хто обирає якість",
    story: {
      title: "Наша історія",
      p1: "Торгівельна марка ARMY була заснована у 2022 році — у часи серйозних випробувань та переосмислення базових потреб. Саме тоді особливо гостро постала необхідність у надійному, практичному та доступному спорядженні для використання в польових умовах. Починаючи з відповіді на запити військових, бренд поступово сформував філософію якості, витривалості та універсальності.",
      p2: "Від самого початку ми зробили свідомий вибір: не зупинятися на досягнутому, а постійно вдосконалювати продукцію, підвищуючи її функціональність і комфорт. Сьогодні ARMY — це не лише про витримку в складних умовах, а й про зручність у повсякденному використанні.",
      p3: "Асортимент бренду охоплює каремати, спальні мішки, а також різні модифікації туристичних і польових сидінь. Усі вироби поєднують у собі ключові властивості, що цінуються як у польових умовах, так і під час активного відпочинку.",
      p4: "Сьогодні продукція ARMY впевнено виходить за межі суто польового застосування. Її обирають туристи, мандрівники, поціновувачі кемпінгу та відпочинку на природі. Окремий напрям — спортивна сфера: каремати активно використовуються на уроках фізичної культури в школах, під час занять фітнесом, тренувань у спортивних клубах та студіях.",
      p5: "ARMY — це приклад того, як практичність, витривалість і продуманий дизайн можуть служити різним людям і різним цілям. Незалежно від того, чи це подорож, тренування, активний відпочинок або заняття спортом, наша продукція створена для комфорту, на який можна покластися."
    },
    features: [
      { icon: Shield, title: "Термоізоляція", description: "Захищає від холоду ґрунту" },
      { icon: Droplets, title: "Водостійкість", description: "Не пропускає вологу" },
      { icon: Feather, title: "Легкість і міцність", description: "Стійкість до проколів і зношування" },
      { icon: Mountain, title: "Універсальність", description: "Від підстилки до нестандартних сценаріїв" }
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
      p1: "Торговая марка ARMY была основана в 2022 году — во времена серьезных испытаний и переосмысления базовых потребностей. Именно тогда особенно остро встала необходимость в надежном, практичном и доступном снаряжении для использования в полевых условиях. Начиная с ответа на запросы военных, бренд постепенно сформировал философию качества, выносливости и универсальности.",
      p2: "С самого начала мы сделали осознанный выбор: не останавливаться на достигнутом, а постоянно совершенствовать продукцию, повышая её функциональность и комфорт. Сегодня ARMY — это не только о выдержке в сложных условиях, но и об удобстве в повседневном использовании.",
      p3: "Ассортимент бренда охватывает карематы, спальные мешки, а также различные модификации туристических и полевых сидений. Все изделия сочетают в себе ключевые свойства, ценимые как в полевых условиях, так и во время активного отдыха.",
      p4: "Сегодня продукция ARMY уверенно выходит за рамки исключительно полевого применения. Её выбирают туристы, путешественники, ценители кемпинга и отдыха на природе. Отдельное направление — спортивная сфера: карематы активно используются на уроках физической культуры в школах, во время занятий фитнесом, тренировок в спортивных клубах и студиях.",
      p5: "ARMY — это пример того, как практичность, выносливость и продуманный дизайн могут служить разным людям и разным целям. Независимо от того, путешествие это, тренировка, активный отдых или занятия спортом, наша продукция создана для комфорта, на который можно положиться."
    },
    features: [
      { icon: Shield, title: "Теплоизоляция", description: "Защищает от холода почвы" },
      { icon: Droplets, title: "Водостойкость", description: "Не пропускает влагу" },
      { icon: Feather, title: "Легкость и прочность", description: "Стойкость к проколам и износу" },
      { icon: Mountain, title: "Универсальность", description: "От подстилки до нестандартных сценариев" }
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
      p1: "The ARMY trademark was founded in 2022 — during times of serious trials and rethinking of basic needs. It was then that the need for reliable, practical and affordable equipment for field use became especially acute. Starting with responding to military requests, the brand gradually formed a philosophy of quality, endurance and versatility.",
      p2: "From the very beginning, we made a conscious choice: not to stop at what we have achieved, but to constantly improve our products, increasing their functionality and comfort. Today ARMY is not only about endurance in difficult conditions, but also about convenience in everyday use.",
      p3: "The brand's range covers sleeping mats, sleeping bags, as well as various modifications of tourist and field seats. All products combine key properties that are valued both in field conditions and during active recreation.",
      p4: "Today, ARMY products confidently go beyond purely field use. They are chosen by tourists, travelers, camping enthusiasts and outdoor recreation lovers. A separate direction is the sports sphere: sleeping mats are actively used in physical education classes at schools, during fitness classes, training in sports clubs and studios.",
      p5: "ARMY is an example of how practicality, endurance and thoughtful design can serve different people and different purposes. Whether it's a trip, training, active recreation or sports, our products are designed for comfort you can rely on."
    },
    features: [
      { icon: Shield, title: "Thermal Insulation", description: "Protects from ground cold" },
      { icon: Droplets, title: "Water Resistance", description: "Does not let moisture through" },
      { icon: Feather, title: "Lightweight & Durable", description: "Resistant to punctures and wear" },
      { icon: Mountain, title: "Versatility", description: "From mat to non-standard scenarios" }
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
          src="/images/nature-atmosphere.jpg"
          alt="ARMY brand outdoor equipment"
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
              <p>{t.story.p4}</p>
              <p>{t.story.p5}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Key product properties */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => {
              const Icon = feature.icon
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
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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

      {/* Atmospheric block */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="/images/hero-outdoor.jpg"
          alt="Created for nature"
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {language === "ua" ? "Створено для природи" : language === "ru" ? "Создано для природы" : "Created for Nature"}
            </h2>
            <p className="text-lg text-white/80">
              {language === "ua" 
                ? "Наша продукція створена для комфорту, на який можна покластися" 
                : language === "ru" 
                ? "Наша продукция создана для комфорта, на который можно положиться"
                : "Our products are designed for comfort you can rely on"}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
