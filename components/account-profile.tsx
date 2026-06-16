"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Loader2, Check } from "lucide-react"

const translations = {
  ua: {
    title: "Профіль",
    subtitle: "Оновіть свої контактні дані.",
    name: "Ім'я та прізвище",
    email: "Email",
    emailNote: "Email не можна змінити.",
    phone: "Телефон",
    phonePlaceholder: "+380 (__) ___-__-__",
    save: "Зберегти зміни",
    saved: "Збережено",
    required: "Обов'язкове поле",
  },
  ru: {
    title: "Профиль",
    subtitle: "Обновите свои контактные данные.",
    name: "Имя и фамилия",
    email: "Email",
    emailNote: "Email нельзя изменить.",
    phone: "Телефон",
    phonePlaceholder: "+380 (__) ___-__-__",
    save: "Сохранить изменения",
    saved: "Сохранено",
    required: "Обязательное поле",
  },
  en: {
    title: "Profile",
    subtitle: "Update your contact details.",
    name: "Full name",
    email: "Email",
    emailNote: "Email cannot be changed.",
    phone: "Phone",
    phonePlaceholder: "+380 (__) ___-__-__",
    save: "Save changes",
    saved: "Saved",
    required: "Required field",
  },
}

export function AccountProfile() {
  const { language, currentUser, updateProfile } = useStore()
  const t = translations[language]

  const [name, setName] = useState(currentUser?.name ?? "")
  const [phone, setPhone] = useState(currentUser?.phone ?? "")
  const [error, setError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setServerError(null)
    setSavedAt(false)
    if (!name.trim()) {
      setError(t.required)
      return
    }
    setSaving(true)
    const result = await updateProfile({ name: name.trim(), phone: phone.trim() })
    setSaving(false)
    if (result.success) {
      setSavedAt(true)
      setTimeout(() => setSavedAt(false), 2500)
    } else {
      setServerError(result.error ?? "Error")
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {serverError && (
        <div className="px-4 py-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6" noValidate>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.email}</label>
          <input
            type="email"
            value={currentUser?.email ?? ""}
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
          <p className="text-xs text-muted-foreground mt-1">{t.emailNote}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t.phone}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder={t.phonePlaceholder}
            autoComplete="tel"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {savedAt && !saving && <Check className="w-4 h-4" />}
          {savedAt && !saving ? t.saved : t.save}
        </button>
      </form>
    </div>
  )
}
