"use client"

import { Phone, Mail, MapPin, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useContent } from "@/lib/use-content"
import { useState } from "react"

export function SiteFooter() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  // Barcha bo'limlarni doimiy ochiq qilib qo'yamiz
  const [hoveredSection] = useState<string | null>("all")

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-foreground text-background py-4 border-0">
      <div className="w-full pr-4 pl-0 md:pl-4 lg:pl-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-3 border-0">
          {/* Company Info */}
          <div className="flex-1 lg:max-w-[40%]">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-bold text-2xl text-background leading-tight mb-1">Delo Truck Center</h3>
                <p className="text-base text-background/70 mb-2">LLC</p>
                <div className="text-sm text-background/80 leading-relaxed space-y-0">
                  <p>{getContent("footerDescription1")}</p>
                  <p>{getContent("footerDescription2")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links - All in one row */}
          <div className="flex flex-wrap gap-6 lg:gap-8 items-start">
            {/* Services */}
            <div className="relative">
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-background hover:text-primary transition-colors">
                {getTranslation(language, "services")}
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1 text-xs text-background/80">
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("computerDiagnostics")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("tireService")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("oilChange")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("suspensionSteering")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("transmissionRepair")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("dotCarbInspections")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="relative">
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-background hover:text-primary transition-colors">
                Quick Links
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1 text-xs text-background/80">
                <li>
                  <button 
                    onClick={() => scrollToSection("services")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("services")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("about")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("about")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("contact")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {getContent("contact")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="relative">
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-background hover:text-primary transition-colors">
                Contact
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1.5 text-xs text-background/80">
                <li className="flex items-start gap-1.5">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>+1 929-522-9913</p>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>delotruckcenter@gmail.com</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>636 N Irwin St</p>
                    <p>Dayton, OH 45403</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-3 text-center border-t-0">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Delo Truck Center LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
