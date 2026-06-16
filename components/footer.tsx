"use client"

import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"

const translations = {
  ua: {
    description: "Професійне тактичне та туристичне спорядження українського виробництва у стилі Minimalism Outdoor.",
    navigation: "Навігація",
    home: "Головна",
    products: "Товари",
    about: "Про бренд",
    blog: "Блог",
    info: "Інформація",
    delivery: "Доставка і оплата",
    returns: "Обмін і повернення",
    privacy: "Політика конфіденційності",
    contact: "Контакти",
    address: "Київ, Україна",
    workingHours: "Пн-Пт: 9:00 - 18:00",
    rights: "Всі права захищено."
  },
  ru: {
    description: "Профессиональное тактическое и туристическое снаряжение украинского производства в стиле Minimalism Outdoor.",
    navigation: "Навигация",
    home: "Главная",
    products: "Товары",
    about: "О бренде",
    blog: "Блог",
    info: "Информация",
    delivery: "Доставка и оплата",
    returns: "Обмен и возврат",
    privacy: "Политика конфиденциальности",
    contact: "Контакты",
    address: "Киев, Украина",
    workingHours: "Пн-Пт: 9:00 - 18:00",
    rights: "Все права защищены."
  },
  en: {
    description: "Professional tactical and outdoor equipment made in Ukraine in Minimalism Outdoor style.",
    navigation: "Navigation",
    home: "Home",
    products: "Products",
    about: "About",
    blog: "Blog",
    info: "Information",
    delivery: "Delivery & Payment",
    returns: "Returns & Exchange",
    privacy: "Privacy Policy",
    contact: "Contact",
    address: "Kyiv, Ukraine",
    workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
    rights: "All rights reserved."
  }
}

export function Footer() {
  const { language } = useStore()
  const t = translations[language]

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">ARMY</h2>
            <p className="text-background/70 leading-relaxed mb-6">
              {t.description}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-background/10 hover:bg-background/20 rounded transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-background/10 hover:bg-background/20 rounded transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-background/10 hover:bg-background/20 rounded transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t.navigation}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.home}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.catalog}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.products}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.about}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.about}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.blog}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold mb-4">{t.info}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={routes.deliveryPayment}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.delivery}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.returns}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.returns}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.privacyPolicy}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.contacts}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5" />
                <span>+380 (50) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5" />
                <span>orders@armytak.com</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5" />
                <span>{t.address}</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-background/50">{t.workingHours}</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          <p>© {new Date().getFullYear()} ARMY. {t.rights}</p>
        </div>
      </div>
    </footer>
  )
}
