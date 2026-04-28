"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { Calendar, ArrowRight } from "lucide-react"

const translations = {
  ua: {
    title: "Блог",
    subtitle: "Корисні статті про спорядження та активний відпочинок",
    readMore: "Читати далі",
    posts: [
      {
        id: 1,
        title: "Як обрати правильний каремат для походу",
        excerpt: "Детальний гід по вибору каремата залежно від умов використання, сезону та ваших потреб.",
        date: "15 березня 2024",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
      },
      {
        id: 2,
        title: "Догляд за туристичним спорядженням",
        excerpt: "Прості поради, які допоможуть продовжити термін служби вашого спорядження.",
        date: "10 березня 2024",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
      },
      {
        id: 3,
        title: "Підготовка до зимового походу",
        excerpt: "Що потрібно знати та мати з собою для безпечного зимового туризму.",
        date: "5 березня 2024",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80"
      }
    ]
  },
  ru: {
    title: "Блог",
    subtitle: "Полезные статьи о снаряжении и активном отдыхе",
    readMore: "Читать дальше",
    posts: [
      {
        id: 1,
        title: "Как выбрать правильный каремат для похода",
        excerpt: "Детальный гид по выбору каремата в зависимости от условий использования, сезона и ваших потребностей.",
        date: "15 марта 2024",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
      },
      {
        id: 2,
        title: "Уход за туристическим снаряжением",
        excerpt: "Простые советы, которые помогут продлить срок службы вашего снаряжения.",
        date: "10 марта 2024",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
      },
      {
        id: 3,
        title: "Подготовка к зимнему походу",
        excerpt: "Что нужно знать и иметь с собой для безопасного зимнего туризма.",
        date: "5 марта 2024",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80"
      }
    ]
  },
  en: {
    title: "Blog",
    subtitle: "Useful articles about equipment and outdoor activities",
    readMore: "Read More",
    posts: [
      {
        id: 1,
        title: "How to Choose the Right Sleeping Mat for Your Hike",
        excerpt: "A detailed guide to choosing a sleeping mat based on conditions, season, and your needs.",
        date: "March 15, 2024",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
      },
      {
        id: 2,
        title: "Caring for Your Outdoor Equipment",
        excerpt: "Simple tips to help extend the life of your gear.",
        date: "March 10, 2024",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
      },
      {
        id: 3,
        title: "Preparing for a Winter Hike",
        excerpt: "What you need to know and bring for safe winter hiking.",
        date: "March 5, 2024",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80"
      }
    ]
  }
}

export function BlogPage() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                {t.readMore}
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
