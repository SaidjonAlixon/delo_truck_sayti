"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Circle, Droplet, Gauge, SettingsIcon, ClipboardCheck, Truck, Wind, Disc, CheckCircle, FileCheck, FlaskConical, Sparkles, Battery } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { QuoteModal } from "@/components/quote-modal"
import { useContent } from "@/lib/use-content"

// Countdown Timer Component
function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const difference = end - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (timeLeft.isExpired) {
    return (
      <div className="text-xs text-red-400 font-semibold">
        Aksiya tugagan
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-white font-bold">
        {String(timeLeft.days).padStart(2, '0')}d
      </div>
      <span className="text-white">:</span>
      <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-white font-bold">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <span className="text-white">:</span>
      <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-white font-bold">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <span className="text-white">:</span>
      <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-white font-bold">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  )
}

const iconMap: { [key: string]: any } = {
  diagnostics: Search,
  tire: Circle,
  oil: Droplet,
  suspension: Gauge,
  transmission: SettingsIcon,
  dot: ClipboardCheck,
  roadside: Truck,
  ac: Wind,
  brake: Disc,
  pm: CheckCircle,
  carb: FileCheck,
  def: FlaskConical,
  dpf: Sparkles,
  jumpstart: Battery,
}

const defaultServices = [
    {
      icon: Search,
      titleKey: "computerDiagnostics" as const,
      descKey: "computerDiagnosticsDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "diagnostics",
      image: "/services/diagnostics.jpg",
    },
    {
      icon: Circle,
      titleKey: "tireService" as const,
      descKey: "tireServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "tire",
      image: "/services/tire-service.jpg",
    },
    {
      icon: Droplet,
      titleKey: "oilChange" as const,
      descKey: "oilChangeDesc" as const,
      price: null,
      priceType: "call" as const,
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
      price: null,
      priceType: "call" as const,
      serviceId: "dot",
      image: "/services/dot-inspection.jpg",
    },
    {
      icon: Truck,
      titleKey: "roadsideService" as const,
      descKey: "roadsideServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "roadside",
      image: "/services/tire-service.jpg",
    },
    {
      icon: Wind,
      titleKey: "acService" as const,
      descKey: "acServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "ac",
      image: "/services/diagnostics.jpg",
    },
    {
      icon: Disc,
      titleKey: "brakeService" as const,
      descKey: "brakeServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "brake",
      image: "/services/dot-inspection.jpg",
    },
    {
      icon: CheckCircle,
      titleKey: "pmService" as const,
      descKey: "pmServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "pm",
      image: "/services/oil-change.jpg",
    },
    {
      icon: FileCheck,
      titleKey: "carbInspection" as const,
      descKey: "carbInspectionDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "carb",
      image: "/services/dot-inspection.jpg",
    },
    {
      icon: FlaskConical,
      titleKey: "defService" as const,
      descKey: "defServiceDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "def",
      image: "/services/oil-change.jpg",
    },
    {
      icon: Sparkles,
      titleKey: "dpfCleaning" as const,
      descKey: "dpfCleaningDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "dpf",
      image: "/services/diagnostics.jpg",
    },
    {
      icon: Battery,
      titleKey: "jumpStarts" as const,
      descKey: "jumpStartsDesc" as const,
      price: null,
      priceType: "call" as const,
      serviceId: "jumpstart",
      image: "/services/tire-service.jpg",
    },
  ]

export function Services() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [services, setServices] = useState(defaultServices)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Set up intersection observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const elements = document.querySelectorAll("[data-service-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el))
      observerRef.current?.disconnect()
    }
  }, [services])

  useEffect(() => {
    loadServices()
    
    // Listen for updates from admin panel
    const handleUpdate = () => {
      console.log('Services updated event received')
      loadServices()
    }

    // Listen to custom event
    window.addEventListener("servicesUpdated", handleUpdate)
    
    // Listen to storage events for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'servicesLastUpdated') {
        console.log('Services updated via storage event')
        loadServices()
      }
    }
    window.addEventListener("storage", handleStorageChange)
    
    // Check for updates when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadServices()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    
    // Reload on window focus (when user switches back to tab)
    window.addEventListener("focus", loadServices)
    
    // Poll localStorage for updates (for same-tab updates)
    const storageCheckInterval = setInterval(() => {
      const lastUpdated = localStorage.getItem('servicesLastUpdated')
      if (lastUpdated) {
        const saved = sessionStorage.getItem('lastServicesCheck')
        if (!saved || saved !== lastUpdated) {
          sessionStorage.setItem('lastServicesCheck', lastUpdated)
          loadServices()
        }
      }
    }, 1000)
    
    return () => {
      window.removeEventListener("servicesUpdated", handleUpdate)
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", loadServices)
      clearInterval(storageCheckInterval)
    }
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services', {
        cache: 'no-store', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        // Transform database format to component format
        const transformed = result.data.map((s: any) => ({
          id: s.id.toString(),
          titleKey: s.title_key as any,
          descKey: s.desc_key as any,
          title: s.title,
          description: s.description,
          price: s.price,
          priceType: s.price_type as "starting" | "call" | "fixed",
          serviceId: s.service_id,
          image: s.image,
          icon: iconMap[s.service_id] || Search,
          discountPercent: s.discount_percent,
          saleStartDate: s.sale_start_date,
          saleEndDate: s.sale_end_date,
          }))
        setServices(transformed)
      } else {
        // Fallback to default services if database is empty
        setServices(defaultServices)
      }
    } catch (error) {
      console.error("Error loading services:", error)
      // Fallback to default services on error
      setServices(defaultServices)
    }
  }

  const handleGetQuote = (serviceId: string) => {
    setSelectedService(serviceId)
    setIsModalOpen(true)
  }

  return (
    <section id="services" className="py-20 bg-muted/30 w-full">
      <div className="container mx-auto px-6 w-full max-w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4 animate-pulse">
            <span className="text-sm font-semibold text-primary">{getContent("ourServices")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {getContent("comprehensiveTruckServices")}
          </h2>
          <p className="text-lg text-foreground leading-relaxed">{getContent("servicesDescription")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-full">
          {services.map((service, index) => {
            const Icon = service.icon
            
            // Check if sale is active
            const now = new Date()
            const saleStart = service.saleStartDate ? new Date(service.saleStartDate) : null
            const saleEnd = service.saleEndDate ? new Date(service.saleEndDate) : null
            const isSaleActive = service.discountPercent && saleStart && saleEnd && now >= saleStart && now <= saleEnd
            
            // Calculate discounted price
            let originalPrice = service.price
            let discountedPrice = null
            if (isSaleActive && service.price && service.priceType !== "call") {
              const priceNum = parseFloat(service.price.replace(/[^0-9.]/g, ''))
              if (!isNaN(priceNum)) {
                const discount = priceNum * (service.discountPercent / 100)
                discountedPrice = priceNum - discount
                const priceSymbol = service.price.includes('$') ? '$' : ''
                discountedPrice = `${priceSymbol}${discountedPrice.toFixed(2)}`
              }
            }
            
            return (
              <Card
                key={index}
                id={`service-${service.serviceId}-${index}`}
                data-service-animate
                className={`relative p-8 hover:shadow-2xl transition-all duration-500 bg-card border-border overflow-hidden group min-h-[450px] w-full h-full hover:scale-105 hover:-translate-y-2 ${
                  isVisible[`service-${service.serviceId}-${index}`] 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Sale Badge - Top Right */}
                {isSaleActive && (
                  <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{service.discountPercent}%
                  </div>
                )}
                
                {/* Background Image with Blur */}
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-85 transition-opacity duration-300"
                  style={{
                    backgroundImage: service.image && service.image.trim() ? `url(${service.image})` : 'none',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px)",
                    transform: "scale(1.05)",
                    backgroundColor: service.image && service.image.trim() ? 'transparent' : '#1a1a1a',
                  }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Service Title - Visible until hover */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full opacity-100 group-hover:opacity-0 transition-all duration-500 transform group-hover:scale-110">
                  {/* Discounted Price on Top */}
                  {isSaleActive && discountedPrice && (
                    <div className="mb-4 text-center animate-bounce">
                      <div className="bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-red-400 shadow-lg transform hover:scale-105 transition-transform">
                        <p className="text-xs text-white/90 mb-1">Sale Price</p>
                        <p className="text-3xl font-bold text-white">{discountedPrice}</p>
                      </div>
                      <div className="mt-2">
                        <CountdownTimer endDate={service.saleEndDate!} />
                      </div>
                    </div>
                  )}
                  <div className="mb-4 transform group-hover:rotate-6 transition-transform duration-300">
                    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-primary/50 shadow-lg">
                      <Icon className="w-10 h-10 text-primary drop-shadow-lg" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center">
                    {service.title || getContent(service.titleKey)}
                  </h3>
                </div>

                {/* Full Content - Hidden until hover */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-95 z-10">
                  <div>
                    <div className="w-16 h-16 bg-primary/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border-2 border-primary/70 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transform group-hover:translate-x-2 transition-transform">
                      {service.title || getContent(service.titleKey)}
                    </h3>
                    <p className="text-white leading-relaxed mb-6 min-h-[72px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                      {service.description || getContent(service.descKey)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-white/30">
                    {/* Countdown Timer */}
                    {isSaleActive && saleEnd && (
                      <div className="bg-red-600/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-red-500/50">
                        <p className="text-xs text-white/90 mb-1 text-center">Sale Ends:</p>
                        <div className="flex justify-center">
                          <CountdownTimer endDate={service.saleEndDate!} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                    <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/50">
                      {service.priceType === "call" ? (
                          <p className="text-xl font-bold text-blue-400 drop-shadow-lg">{getContent("callForPrice")}</p>
                      ) : (
                        <div>
                            {isSaleActive && discountedPrice ? (
                              <>
                                <p className="text-xs text-white/70 line-through mb-1">{service.price}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-2xl font-bold text-green-400 drop-shadow-lg">{discountedPrice}</p>
                                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white font-bold">-{service.discountPercent}%</span>
                                </div>
                                {service.priceType === "starting" && (
                                  <p className="text-xs text-white/90 mt-1">{getContent("startingAt")}</p>
                                )}
                              </>
                            ) : (
                              <>
                          {service.priceType === "starting" && (
                                  <p className="text-sm text-white/90 mb-1 font-medium drop-shadow-md">{getContent("startingAt")}</p>
                          )}
                          <p className="text-2xl font-bold text-blue-400 drop-shadow-lg">{service.price}</p>
                              </>
                            )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-red-700 hover:bg-red-800 text-white font-bold border-2 border-white/30 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => handleGetQuote(service.serviceId)}
                    >
                        {getContent("getAQuote")}
                    </Button>
                    </div>
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
