"use client"

import { Header } from "@/components/header"
import { ServicesDetailed } from "@/components/services-detailed"
import { SiteFooter } from "@/components/site-footer"
import { Snow } from "@/components/snow"
import { LanguageProvider } from "@/lib/language-context"
import { ThemeProvider } from "@/lib/theme-context"
import { TranslationsProvider } from "@/lib/translations-provider"

export default function ServicesPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TranslationsProvider>
          <main className="min-h-screen">
            <Snow />
            <Header />
            <div className="pt-20">
              <ServicesDetailed />
            </div>
            <SiteFooter />
          </main>
        </TranslationsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
