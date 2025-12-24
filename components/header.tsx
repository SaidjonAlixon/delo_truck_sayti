"use client"

import { Phone, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { QuoteModal } from "@/components/quote-modal"
import { useContent } from "@/lib/use-content"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()

  const scrollToSection = (id: string) => {
    // If we're on the services page, go to home first
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/services/logo_delo.png" 
                alt="Delo Truck Center Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Delo Truck Center</h1>
              <p className="text-xs text-muted-foreground">LLC</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {getContent("services")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {getContent("about")}
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setIsQuoteModalOpen(true)}
            >
              <Phone className="w-4 h-4 mr-2" />
              {getContent("callNow")}
            </Button>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {getContent("services")}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {getContent("about")}
              </Link>

              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
                onClick={() => {
                  setIsQuoteModalOpen(true)
                  setMobileMenuOpen(false)
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                {getContent("callNow")}
              </Button>
            </div>
          </nav>
        )}
      </div>

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </header>
  )
}
