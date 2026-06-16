import type { Metadata } from "next"
import { InfoPage, type InfoPageContent } from "@/components/info-page"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Delivery & Payment — ARMY",
  description: "How ARMY ships orders across Ukraine and the available payment methods.",
  alternates: { canonical: canonical("/delivery-payment") },
}

const content: InfoPageContent = {
  ua: {
    title: "Доставка і оплата",
    intro: "Ми доставляємо замовлення по всій Україні зручними для вас службами доставки.",
    sections: [
      {
        heading: "Способи доставки",
        body: [
          "Нова Пошта — доставка у відділення або адресна доставка кур'єром (1–3 робочі дні).",
          "Укрпошта — доставка у відділення по всій території України.",
          "Міст Пошта — доставка у відділення та адресна доставка.",
        ],
      },
      {
        heading: "Вартість доставки",
        body: [
          "Доставка у відділення — за тарифами обраного перевізника.",
          "Адресна доставка кур'єром — додатково 80 грн до тарифів перевізника.",
        ],
      },
      {
        heading: "Способи оплати",
        body: [
          "Накладений платіж — оплата під час отримання посилки.",
          "Оплата на реквізити — менеджер надішле реквізити після підтвердження замовлення.",
          "Уточнення оплати менеджером — ми зв'яжемося та узгодимо зручний спосіб.",
        ],
      },
    ],
  },
  ru: {
    title: "Доставка и оплата",
    intro: "Мы доставляем заказы по всей Украине удобными для вас службами доставки.",
    sections: [
      {
        heading: "Способы доставки",
        body: [
          "Новая Почта — доставка в отделение или адресная доставка курьером (1–3 рабочих дня).",
          "Укрпочта — доставка в отделение по всей территории Украины.",
          "Мист Почта — доставка в отделение и адресная доставка.",
        ],
      },
      {
        heading: "Стоимость доставки",
        body: [
          "Доставка в отделение — по тарифам выбранного перевозчика.",
          "Адресная доставка курьером — дополнительно 80 грн к тарифам перевозчика.",
        ],
      },
      {
        heading: "Способы оплаты",
        body: [
          "Наложенный платёж — оплата при получении посылки.",
          "Оплата на реквизиты — менеджер пришлёт реквизиты после подтверждения заказа.",
          "Уточнение оплаты менеджером — мы свяжемся и согласуем удобный способ.",
        ],
      },
    ],
  },
  en: {
    title: "Delivery & Payment",
    intro: "We ship orders across Ukraine using the carriers most convenient for you.",
    sections: [
      {
        heading: "Delivery methods",
        body: [
          "Nova Poshta — branch pickup or courier home delivery (1–3 business days).",
          "Ukrposhta — branch delivery across all of Ukraine.",
          "Meest — branch and home delivery.",
        ],
      },
      {
        heading: "Delivery cost",
        body: [
          "Branch pickup — according to the selected carrier's tariffs.",
          "Courier home delivery — an additional 80 UAH on top of carrier tariffs.",
        ],
      },
      {
        heading: "Payment methods",
        body: [
          "Cash on delivery — pay when you receive the parcel.",
          "Bank transfer — the manager sends payment details after order confirmation.",
          "Manager confirmation — we contact you to arrange a convenient method.",
        ],
      },
    ],
  },
}

export default function DeliveryPaymentRoute() {
  return <InfoPage content={content} />
}
