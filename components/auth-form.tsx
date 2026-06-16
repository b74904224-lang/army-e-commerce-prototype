"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type Mode = "login" | "register"

const translations = {
  ua: {
    loginTitle: "Вхід до акаунту",
    registerTitle: "Створення акаунту",
    loginSubtitle: "Увійдіть, щоб переглядати свої замовлення та статистику.",
    registerSubtitle: "Зареєструйтесь, щоб зберігати історію замовлень.",
    name: "Ім'я та прізвище",
    email: "Email",
    password: "Пароль",
    login: "Увійти",
    register: "Зареєструватися",
    noAccount: "Немає акаунту?",
    haveAccount: "Вже є акаунт?",
    toRegister: "Зареєструватися",
    toLogin: "Увійти",
    required: "Обов'язкове поле",
    invalidEmail: "Невірний email",
    shortPassword: "Мінімум 6 символів",
    showPassword: "Показати пароль",
    hidePassword: "Сховати пароль",
  },
  ru: {
    loginTitle: "Вход в аккаунт",
    registerTitle: "Создание аккаунта",
    loginSubtitle: "Войдите, чтобы просматривать свои заказы и статистику.",
    registerSubtitle: "Зарегистрируйтесь, чтобы сохранять историю заказов.",
    name: "Имя и фамилия",
    email: "Email",
    password: "Пароль",
    login: "Войти",
    register: "Зарегистрироваться",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    toRegister: "Зарегистрироваться",
    toLogin: "Войти",
    required: "Обязательное поле",
    invalidEmail: "Неверный email",
    shortPassword: "Минимум 6 символов",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
  },
  en: {
    loginTitle: "Sign in",
    registerTitle: "Create account",
    loginSubtitle: "Sign in to view your orders and statistics.",
    registerSubtitle: "Register to keep your order history.",
    name: "Full name",
    email: "Email",
    password: "Password",
    login: "Sign in",
    register: "Register",
    noAccount: "No account?",
    haveAccount: "Already have an account?",
    toRegister: "Register",
    toLogin: "Sign in",
    required: "Required field",
    invalidEmail: "Invalid email",
    shortPassword: "Minimum 6 characters",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
}

export function AuthForm({ mode }: { mode: Mode }) {
  const { language, login, register } = useStore()
  const router = useRouter()
  const t = translations[language]

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (mode === "register" && !form.name.trim()) e.name = t.required
    if (!form.email.trim()) e.email = t.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = t.invalidEmail
    if (!form.password) e.password = t.required
    else if (form.password.length < 6) e.password = t.shortPassword
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return

    setSubmitting(true)
    const result =
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password)
    setSubmitting(false)

    if (result.success) {
      router.push(routes.account)
    } else {
      setServerError(result.error ?? "Error")
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-background border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
      errors[field] ? "border-destructive" : "border-border"
    }`

  const title = mode === "login" ? t.loginTitle : t.registerTitle
  const subtitle = mode === "login" ? t.loginSubtitle : t.registerSubtitle

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mb-6 text-pretty">{subtitle}</p>

          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t.name}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass("name")}
                  autoComplete="name"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.email}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass("email")}
                autoComplete="email"
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass("password")} pr-12`}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? t.login : t.register}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                {t.noAccount}{" "}
                <Link href={routes.register} className="font-semibold text-primary hover:underline">
                  {t.toRegister}
                </Link>
              </>
            ) : (
              <>
                {t.haveAccount}{" "}
                <Link href={routes.login} className="font-semibold text-primary hover:underline">
                  {t.toLogin}
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
