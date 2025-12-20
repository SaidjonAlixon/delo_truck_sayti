"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">{getTranslation(language, "phone")}</p>
              <p className="text-lg font-bold text-background">+1 (555) 123-4567</p>
              <p className="text-lg font-bold text-background">+1 (555) 123-4568</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">Mon - Fri</p>
              <p className="text-lg font-bold text-background">8:30 am - 5:00 pm</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">{getTranslation(language, "address")}</p>
              <p className="text-lg font-bold text-background">123 Truck Service Road,</p>
              <p className="text-lg font-bold text-background">New York, NY 10001</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">{getTranslation(language, "email")}</p>
              <p className="text-lg font-bold text-background">info@delotruckcenter.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
