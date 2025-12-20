"use client"

import { useState, useEffect } from "react"
import { Search, Circle, Droplet, Gauge, SettingsIcon, ClipboardCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { QuoteModal } from "@/components/quote-modal"

const iconMap: { [key: string]: any } = {
  diagnostics: Search,
  tire: Circle,
  oil: Droplet,
  suspension: Gauge,
  transmission: SettingsIcon,
  dot: ClipboardCheck,
}

const defaultServices = [
    {
      icon: Search,
      titleKey: "computerDiagnostics" as const,
      descKey: "computerDiagnosticsDesc" as const,
      price: "$150",
      priceType: "starting" as const,
      serviceId: "diagnostics",
      image: "/services/diagnostics.jpg",
    },
    {
      icon: Circle,
      titleKey: "tireService" as const,
      descKey: "tireServiceDesc" as const,
      price: "$80",
      priceType: "starting" as const,
      serviceId: "tire",
      image: "/services/tire-service.jpg",
    },
    {
      icon: Droplet,
      titleKey: "oilChange" as const,
      descKey: "oilChangeDesc" as const,
      price: "$200",
      priceType: "starting" as const,
      serviceId: "oil",
      image: "/services/oil-change.jpg",
    },
    {
      icon: Gauge,
      titleKey: "suspensionSteering" as const,
      descKey: "suspensionSteeringDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "suspension",
      image: "/services/suspension.jpg",
    },
    {
      icon: SettingsIcon,
      titleKey: "transmissionRepair" as const,
      descKey: "transmissionRepairDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "transmission",
      image: "/services/transmission.jpg",
    },
    {
      icon: ClipboardCheck,
      titleKey: "dotCarbInspections" as const,
      descKey: "dotCarbInspectionsDesc" as const,
      price: "$100",
      priceType: "fixed" as const,
      serviceId: "dot",
      image: "/services/dot-inspection.jpg",
    },
  ]

export function Services() {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    // Load services from localStorage
    const saved = localStorage.getItem("adminServices")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Map icon names to actual icon components
        const mapped = parsed.map((s: any) => ({
          ...s,
          icon: iconMap[s.serviceId] || Search,
        }))
        setServices(mapped)
      } catch (e) {
        console.error("Error loading services:", e)
      }
    }

    // Listen for updates
    const handleUpdate = () => {
      const saved = localStorage.getItem("adminServices")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const mapped = parsed.map((s: any) => ({
            ...s,
            icon: iconMap[s.serviceId] || Search,
          }))
          setServices(mapped)
        } catch (e) {
          console.error("Error loading services:", e)
        }
      }
    }

    window.addEventListener("servicesUpdated", handleUpdate)
    return () => window.removeEventListener("servicesUpdated", handleUpdate)
  }, [])

  const handleGetQuote = (serviceId: string) => {
    setSelectedService(serviceId)
    setIsModalOpen(true)
  }

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">{getTranslation(language, "ourServices")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
            {getTranslation(language, "comprehensiveTruckServices")}
          </h2>
          <p className="text-lg text-foreground leading-relaxed">{getTranslation(language, "servicesDescription")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                id={`service-${service.serviceId}`}
                className="relative p-8 hover:shadow-xl transition-all bg-card border-border overflow-hidden group min-h-[450px]"
              >
                {/* Background Image with Blur */}
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-85 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px)",
                    transform: "scale(1.05)",
                  }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Service Title - Visible until hover */}
                <div className="relative z-10 flex items-center justify-center h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center">
                    {getTranslation(language, service.titleKey)}
                  </h3>
                </div>

                {/* Full Content - Hidden until hover */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div>
                    <div className="w-16 h-16 bg-primary/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border-2 border-primary/70 shadow-lg">
                      <Icon className="w-8 h-8 text-primary drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {getTranslation(language, service.titleKey)}
                    </h3>
                    <p className="text-white leading-relaxed mb-6 min-h-[72px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                      {getTranslation(language, service.descKey)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/50">
                      {service.priceType === "call" ? (
                        <p className="text-xl font-bold text-blue-400 drop-shadow-lg">{getTranslation(language, "callForPrice")}</p>
                      ) : (
                        <div>
                          {service.priceType === "starting" && (
                            <p className="text-sm text-white/90 mb-1 font-medium drop-shadow-md">{getTranslation(language, "startingAt")}</p>
                          )}
                          <p className="text-2xl font-bold text-blue-400 drop-shadow-lg">{service.price}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-red-700 hover:bg-red-800 text-white font-bold border-2 border-white/30 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => handleGetQuote(service.serviceId)}
                    >
                      {getTranslation(language, "getAQuote")}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedService={selectedService} />
    </section>
  )
}
