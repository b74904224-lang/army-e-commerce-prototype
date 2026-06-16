"use client"

import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react"

const translations = {
  ua: {
    title: "Контакти",
    intro: "Зв'яжіться з нами зручним для вас способом — ми завжди раді допомогти.",
    home: "Головна",
    phone: "Телефон",
    email: "Електронна пошта",
    address: "Адреса",
    addressValue: "Україна, м. Київ",
    hours: "Графік роботи",
    hoursValue: "Пн–Пт: 9:00 – 18:00",
  },
  ru: {
    title: "Контакты",
    intro: "Свяжитесь с нами удобным для вас способом — мы всегда рады помочь.",
    home: "Главная",
    phone: "Телефон",
    email: "Электронная почта",
    address: "Адрес",
    addressValue: "Украина, г. Киев",
    hours: "График работы",
    hoursValue: "Пн–Пт: 9:00 – 18:00",
  },
  en: {
    title: "Contacts",
    intro: "Get in touch with us in whatever way is most convenient — we're always happy to help.",
    home: "Home",
    phone: "Phone",
    email: "Email",
    address: "Address",
    addressValue: "Ukraine, Kyiv",
    hours: "Working hours",
    hoursValue: "Mon–Fri: 9:00 – 18:00",
  },
}

export function ContactsView() {
  const { language } = useStore()
  const t = translations[language]

  const items = [
    { icon: Phone, label: t.phone, value: "+380 (50) 123-45-67", href: "tel:+380501234567" },
    { icon: Mail, label: t.email, value: "orders@armytak.com", href: "mailto:orders@armytak.com" },
    { icon: MapPin, label: t.address, value: t.addressValue },
    { icon: Clock, label: t.hours, value: t.hoursValue },
  ]

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href={routes.home} className="hover:text-foreground transition-colors">
                {t.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-foreground font-medium">{t.title}</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">{t.intro}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = item.icon
            const inner = (
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-5 h-full">
                <span className="w-11 h-11 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            )
            return item.href ? (
              <a key={item.label} href={item.href} className="block hover:border-primary transition-colors">
                {inner}
              </a>
            ) : (
              <div key={item.label}>{inner}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
