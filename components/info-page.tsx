"use client"

import { useStore } from "@/lib/store-context"
import { routes } from "@/lib/site-routes"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

interface InfoSection {
  heading: string
  body: string[]
}

export interface InfoPageContent {
  ua: { title: string; intro?: string; sections: InfoSection[] }
  ru: { title: string; intro?: string; sections: InfoSection[] }
  en: { title: string; intro?: string; sections: InfoSection[] }
}

const homeLabel = { ua: "Головна", ru: "Главная", en: "Home" }

export function InfoPage({ content, children }: { content: InfoPageContent; children?: ReactNode }) {
  const { language } = useStore()
  const t = content[language]

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href={routes.home} className="hover:text-foreground transition-colors">
                {homeLabel[language]}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-foreground font-medium">{t.title}</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight text-balance">
          {t.title}
        </h1>

        {t.intro && <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">{t.intro}</p>}

        <div className="space-y-8">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {children}
      </div>
    </div>
  )
}
