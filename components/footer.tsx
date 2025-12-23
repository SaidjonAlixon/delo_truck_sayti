"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useContent } from "@/lib/use-content"

export function Footer() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()

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
              <p className="text-sm text-background/70 mb-1">{getContent("phone")}</p>
              <p className="text-lg font-bold text-background">+1 929-522-9913</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">Mon - Fri</p>
              <p className="text-lg font-bold text-background">8:00am - 6:00pm</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">{getContent("address")}</p>
              <p className="text-lg font-bold text-background">636 N Irwin St,</p>
              <p className="text-lg font-bold text-background">Dayton, OH 45403</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-background/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-background" />
            </div>
            <div>
              <p className="text-sm text-background/70 mb-1">{getContent("email")}</p>
              <p className="text-lg font-bold text-background">delotruckcenter@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
