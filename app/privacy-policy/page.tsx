import type { Metadata } from "next"
import { InfoPage, type InfoPageContent } from "@/components/info-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Privacy Policy — ARMY",
  description: "How ARMY collects, uses and protects your personal data.",
  alternates: { canonical: canonical("/privacy-policy") },
}

const content: InfoPageContent = {
  ua: {
    title: "Політика конфіденційності",
    intro: "Ми поважаємо вашу приватність та захищаємо персональні дані, які ви нам надаєте.",
    sections: [
      {
        heading: "Які дані ми збираємо",
        body: [
          "Контактні дані: ім'я, номер телефону, електронна пошта.",
          "Дані доставки: місто, відділення або адреса.",
          "Інформація про замовлення та історію покупок.",
        ],
      },
      {
        heading: "Як ми використовуємо дані",
        body: [
          "Для обробки та доставки ваших замовлень.",
          "Для зв'язку щодо статусу замовлення.",
          "Для покращення якості обслуговування.",
        ],
      },
      {
        heading: "Захист даних",
        body: [
          "Ми не передаємо ваші персональні дані третім особам, окрім служб доставки в межах виконання замовлення.",
          "Дані зберігаються з дотриманням сучасних стандартів безпеки.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    intro: "Мы уважаем вашу приватность и защищаем персональные данные, которые вы нам предоставляете.",
    sections: [
      {
        heading: "Какие данные мы собираем",
        body: [
          "Контактные данные: имя, номер телефона, электронная почта.",
          "Данные доставки: город, отделение или адрес.",
          "Информация о заказах и истории покупок.",
        ],
      },
      {
        heading: "Как мы используем данные",
        body: [
          "Для обработки и доставки ваших заказов.",
          "Для связи по статусу заказа.",
          "Для улучшения качества обслуживания.",
        ],
      },
      {
        heading: "Защита данных",
        body: [
          "Мы не передаём ваши персональные данные третьим лицам, кроме служб доставки в рамках выполнения заказа.",
          "Данные хранятся с соблюдением современных стандартов безопасности.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro: "We respect your privacy and protect the personal data you share with us.",
    sections: [
      {
        heading: "Data we collect",
        body: [
          "Contact details: name, phone number, email.",
          "Delivery details: city, branch or address.",
          "Order information and purchase history.",
        ],
      },
      {
        heading: "How we use your data",
        body: [
          "To process and deliver your orders.",
          "To contact you about order status.",
          "To improve our service quality.",
        ],
      },
      {
        heading: "Data protection",
        body: [
          "We do not share your personal data with third parties, except delivery carriers as part of fulfilling your order.",
          "Data is stored in line with modern security standards.",
        ],
      },
    ],
  },
}

export default function PrivacyPolicyRoute() {
  return <InfoPage content={content} />
}
