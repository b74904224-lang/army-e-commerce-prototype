import type { Metadata } from "next"
import { InfoPage, type InfoPageContent } from "@/components/info-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Returns & Exchange — ARMY",
  description: "ARMY return and exchange policy for tactical and outdoor equipment.",
  alternates: { canonical: canonical("/returns") },
}

const content: InfoPageContent = {
  ua: {
    title: "Обмін і повернення",
    intro: "Ви можете обміняти або повернути товар протягом 14 днів з моменту отримання.",
    sections: [
      {
        heading: "Умови повернення",
        body: [
          "Товар не був у використанні та зберіг товарний вигляд.",
          "Збережено оригінальне пакування та всі ярлики.",
          "Наявний документ, що підтверджує покупку.",
        ],
      },
      {
        heading: "Як оформити повернення",
        body: [
          "Зв'яжіться з нашим менеджером за телефоном або електронною поштою.",
          "Узгодьте спосіб повернення товару та відправте посилку.",
          "Після перевірки товару ми повернемо кошти або здійснимо обмін.",
        ],
      },
      {
        heading: "Повернення коштів",
        body: ["Кошти повертаються протягом 3–5 робочих днів після отримання та перевірки товару."],
      },
    ],
  },
  ru: {
    title: "Обмен и возврат",
    intro: "Вы можете обменять или вернуть товар в течение 14 дней с момента получения.",
    sections: [
      {
        heading: "Условия возврата",
        body: [
          "Товар не был в использовании и сохранил товарный вид.",
          "Сохранена оригинальная упаковка и все ярлыки.",
          "В наличии документ, подтверждающий покупку.",
        ],
      },
      {
        heading: "Как оформить возврат",
        body: [
          "Свяжитесь с нашим менеджером по телефону или электронной почте.",
          "Согласуйте способ возврата товара и отправьте посылку.",
          "После проверки товара мы вернём средства или произведём обмен.",
        ],
      },
      {
        heading: "Возврат средств",
        body: ["Средства возвращаются в течение 3–5 рабочих дней после получения и проверки товара."],
      },
    ],
  },
  en: {
    title: "Returns & Exchange",
    intro: "You can exchange or return an item within 14 days of receiving it.",
    sections: [
      {
        heading: "Return conditions",
        body: [
          "The item has not been used and retains its original appearance.",
          "Original packaging and all tags are preserved.",
          "Proof of purchase is available.",
        ],
      },
      {
        heading: "How to request a return",
        body: [
          "Contact our manager by phone or email.",
          "Agree on the return method and send the parcel.",
          "After we inspect the item, we will refund or exchange it.",
        ],
      },
      {
        heading: "Refunds",
        body: ["Refunds are issued within 3–5 business days after we receive and inspect the item."],
      },
    ],
  },
}

export default function ReturnsRoute() {
  return <InfoPage content={content} />
}
