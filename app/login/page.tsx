import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Вхід до акаунту | ARMY",
  description: "Увійдіть до свого акаунту ARMY, щоб переглядати замовлення та статистику покупок.",
  alternates: { canonical: canonical("/login") },
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
