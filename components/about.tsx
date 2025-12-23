"use client"

import { Shield, Award, Users, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function About() {
  const { language } = useLanguage()

  const features = [
    {
      icon: Shield,
      titleKey: "certifiedTechnicians" as const,
      descKey: "certifiedTechniciansDesc" as const,
    },
    {
      icon: Award,
      titleKey: "qualityService" as const,
      descKey: "qualityServiceDesc" as const,
    },
    {
      icon: Users,
      titleKey: "customerFocused" as const,
      descKey: "customerFocusedDesc" as const,
    },
    {
      icon: Clock,
      titleKey: "fastTurnaround" as const,
      descKey: "fastTurnaroundDesc" as const,
    },
  ]

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto pr-4 pl-0 md:pl-2 lg:pl-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/professional-truck-mechanics-working-in-modern-ser.jpg"
                alt="About Delo Truck Center"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold text-accent-foreground mb-1">5+</p>
              <p className="text-sm text-accent-foreground/90">{getTranslation(language, "yearsOfExcellence")}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">{getTranslation(language, "aboutUs")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance text-foreground">
              {getTranslation(language, "trustedTruckServicePartner")}
            </h2>
            <p className="text-lg text-foreground leading-relaxed">{getTranslation(language, "aboutDescription1")}</p>
            <p className="text-lg text-foreground leading-relaxed">{getTranslation(language, "aboutDescription2")}</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-foreground">
                        {getTranslation(language, feature.titleKey)}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getTranslation(language, feature.descKey)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
