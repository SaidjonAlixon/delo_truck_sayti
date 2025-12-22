"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Testimonials } from "@/components/testimonials"
import { Map } from "@/components/map"
import { Footer } from "@/components/footer"
import { SiteFooter } from "@/components/site-footer"
import { Snow } from "@/components/snow"
import { LanguageProvider } from "@/lib/language-context"
import { ThemeProvider } from "@/lib/theme-context"

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <main className="min-h-screen">
          <Snow />
          <Header />
          <Hero />
          <Footer />
          <Services />
          <About />
          <Contact />
          <Testimonials />
          <Map />
          <SiteFooter />
        </main>
      </LanguageProvider>
    </ThemeProvider>
  )
}
