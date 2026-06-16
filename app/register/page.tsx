import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"
import { canonical } from "@/lib/site-routes"

export const metadata: Metadata = {
  title: "Реєстрація | ARMY",
  description: "Створіть акаунт ARMY, щоб зберігати історію замовлень та переглядати статистику покупок.",
  alternates: { canonical: canonical("/register") },
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return <AuthForm mode="register" />
}
