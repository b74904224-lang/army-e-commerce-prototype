"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store-context"
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

const translations = {
  ua: {
    login: "Увійти",
    register: "Реєстрація",
    email: "Email",
    password: "Пароль",
    name: "Ім'я",
    confirmPassword: "Підтвердити пароль",
    forgotPassword: "Забули пароль?",
    noAccount: "Немає акаунту?",
    hasAccount: "Вже є акаунт?",
    loginButton: "Увійти",
    registerButton: "Зареєструватися",
    errName: "Введіть ваше ім'я",
    errEmail: "Введіть коректний email",
    errPassword: "Пароль має містити щонайменше 6 символів",
    errConfirm: "Паролі не співпадають"
  },
  ru: {
    login: "Войти",
    register: "Регистрация",
    email: "Email",
    password: "Пароль",
    name: "Имя",
    confirmPassword: "Подтвердить пароль",
    forgotPassword: "Забыли пароль?",
    noAccount: "Нет аккаунта?",
    hasAccount: "Уже есть аккаунт?",
    loginButton: "Войти",
    registerButton: "Зарегистрироваться",
    errName: "Введите ваше имя",
    errEmail: "Введите корректный email",
    errPassword: "Пароль должен содержать минимум 6 символов",
    errConfirm: "Пароли не совпадают"
  },
  en: {
    login: "Sign In",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    loginButton: "Sign In",
    registerButton: "Register",
    errName: "Please enter your name",
    errEmail: "Please enter a valid email",
    errPassword: "Password must be at least 6 characters",
    errConfirm: "Passwords do not match"
  }
}

export function LoginModal() {
  const { language, isLoginOpen, setIsLoginOpen, register, login } = useStore()
  const t = translations[language]
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError(null)
  }

  const close = () => {
    setIsLoginOpen(false)
    resetForm()
  }

  const switchMode = () => {
    setIsRegister(!isRegister)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

    if (isRegister && !name.trim()) {
      setError(t.errName)
      return
    }
    if (!emailValid) {
      setError(t.errEmail)
      return
    }
    if (password.length < 6) {
      setError(t.errPassword)
      return
    }
    if (isRegister && password !== confirmPassword) {
      setError(t.errConfirm)
      return
    }

    const result = isRegister
      ? register(name, email, password)
      : login(email, password)

    if (result.success) {
      close()
    } else {
      setError(result.error ?? null)
    }
  }

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-foreground/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-background rounded shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {isRegister ? t.register : t.login}
                </h2>
                <button
                  onClick={close}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                {isRegister && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t.name}
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.email}
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t.password}
                    className="w-full pl-10 pr-12 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isRegister && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPassword}
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                {!isRegister && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                >
                  {isRegister ? t.registerButton : t.loginButton}
                </button>

                <div className="text-center text-sm text-muted-foreground">
                  {isRegister ? t.hasAccount : t.noAccount}{" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-primary font-medium hover:underline"
                  >
                    {isRegister ? t.login : t.register}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
