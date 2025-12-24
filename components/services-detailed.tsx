"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Circle, Droplet, Gauge, SettingsIcon, ClipboardCheck, Truck, Wind, Disc, CheckCircle, FileCheck, FlaskConical, Sparkles, Battery, ArrowRight, Clock, Shield, Wrench, CheckCircle2, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useContent } from "@/lib/use-content"
import { QuoteModal } from "@/components/quote-modal"
import Image from "next/image"

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

// Extended service details with features, benefits, and process
const serviceDetails: { [key: string]: {
  features: string[]
  benefits: string[]
  process: string[]
  estimatedTime?: string
  warranty?: string
} } = {
  diagnostics: {
    features: [
      "Advanced computer diagnostics",
      "Engine code reading and clearing",
      "Real-time data monitoring",
      "Performance analysis"
    ],
    benefits: [
      "Quick problem identification",
      "Prevents costly repairs",
      "Improves fuel efficiency",
      "Extends vehicle lifespan"
    ],
    process: [
      "Connect diagnostic equipment",
      "Run comprehensive system scan",
      "Analyze error codes and data",
      "Provide detailed report and recommendations"
    ],
    estimatedTime: "30-60 minutes",
    warranty: "90 days on diagnostic services"
  },
  tire: {
    features: [
      "Tire installation and replacement",
      "Wheel balancing and alignment",
      "Tire rotation services",
      "Pressure monitoring system"
    ],
    benefits: [
      "Improved safety and handling",
      "Extended tire life",
      "Better fuel economy",
      "Reduced road noise"
    ],
    process: [
      "Inspect current tire condition",
      "Remove and mount new tires",
      "Balance wheels for smooth ride",
      "Test drive and final inspection"
    ],
    estimatedTime: "45-90 minutes",
    warranty: "12 months on labor"
  },
  oil: {
    features: [
      "Full synthetic and conventional oil",
      "Oil filter replacement",
      "Fluid level checks",
      "Multi-point inspection"
    ],
    benefits: [
      "Extended engine life",
      "Improved performance",
      "Better fuel efficiency",
      "Reduced engine wear"
    ],
    process: [
      "Drain old oil completely",
      "Replace oil filter",
      "Add fresh premium oil",
      "Check all fluid levels"
    ],
    estimatedTime: "30-45 minutes",
    warranty: "6 months"
  },
  suspension: {
    features: [
      "Shock and strut replacement",
      "Spring inspection and repair",
      "Alignment services",
      "Steering component repair"
    ],
    benefits: [
      "Smoother ride quality",
      "Better vehicle control",
      "Reduced tire wear",
      "Improved safety"
    ],
    process: [
      "Comprehensive suspension inspection",
      "Identify worn components",
      "Replace or repair as needed",
      "Align wheels and test drive"
    ],
    estimatedTime: "2-4 hours",
    warranty: "24 months on parts and labor"
  },
  transmission: {
    features: [
      "Transmission fluid service",
      "Complete rebuild services",
      "Torque converter repair",
      "Electronic transmission control"
    ],
    benefits: [
      "Smooth shifting performance",
      "Extended transmission life",
      "Prevents breakdowns",
      "Maintains resale value"
    ],
    process: [
      "Diagnose transmission issues",
      "Drain and replace fluid",
      "Repair or replace components",
      "Test and verify operation"
    ],
    estimatedTime: "4-8 hours",
    warranty: "36 months on rebuilds"
  },
  dot: {
    features: [
      "DOT annual inspections",
      "Safety compliance checks",
      "Emissions testing",
      "Documentation and certification"
    ],
    benefits: [
      "Legal compliance",
      "Safety assurance",
      "Fleet management support",
      "Peace of mind"
    ],
    process: [
      "Complete visual inspection",
      "Test all safety systems",
      "Check emissions compliance",
      "Issue official certification"
    ],
    estimatedTime: "60-90 minutes",
    warranty: "Inspection valid 12 months"
  },
  roadside: {
    features: [
      "24/7 emergency service",
      "Tire changes on-site",
      "Fuel delivery",
      "Jump starts and battery service"
    ],
    benefits: [
      "Minimize downtime",
      "Quick response times",
      "Expert assistance anywhere",
      "Cost-effective solutions"
    ],
    process: [
      "Receive emergency call",
      "Dispatch service vehicle",
      "Arrive at location",
      "Complete repair or tow as needed"
    ],
    estimatedTime: "30-60 minutes response",
    warranty: "Service guarantee"
  },
  ac: {
    features: [
      "AC system diagnosis",
      "Refrigerant recharge",
      "Compressor repair/replacement",
      "Cabin filter replacement"
    ],
    benefits: [
      "Comfortable cabin temperature",
      "Improved air quality",
      "Better driver focus",
      "System efficiency"
    ],
    process: [
      "Test AC system performance",
      "Check for leaks",
      "Recharge or repair system",
      "Verify cool air output"
    ],
    estimatedTime: "1-3 hours",
    warranty: "12 months on repairs"
  },
  brake: {
    features: [
      "Brake pad and shoe replacement",
      "Rotor and drum resurfacing",
      "Brake fluid flush",
      "ABS system service"
    ],
    benefits: [
      "Optimal stopping power",
      "Increased safety",
      "Smooth braking",
      "Reduced noise"
    ],
    process: [
      "Inspect brake system",
      "Measure brake components",
      "Replace or resurface as needed",
      "Test brake performance"
    ],
    estimatedTime: "2-4 hours",
    warranty: "18 months on parts"
  },
  pm: {
    features: [
      "Preventive maintenance checks",
      "Fluid top-offs",
      "Component inspections",
      "Maintenance scheduling"
    ],
    benefits: [
      "Prevents breakdowns",
      "Reduces repair costs",
      "Extends vehicle life",
      "Maintains warranty"
    ],
    process: [
      "Comprehensive vehicle inspection",
      "Service all fluid systems",
      "Check belts and hoses",
      "Document findings and recommendations"
    ],
    estimatedTime: "60-90 minutes",
    warranty: "Service coverage"
  },
  carb: {
    features: [
      "CARB inspection services",
      "Emissions compliance verification",
      "Documentation assistance",
      "Renewal support"
    ],
    benefits: [
      "California compliance",
      "Legal operation",
      "Environmental responsibility",
      "Fleet compliance"
    ],
    process: [
      "Review compliance requirements",
      "Perform necessary inspections",
      "Complete documentation",
      "Submit to CARB"
    ],
    estimatedTime: "90-120 minutes",
    warranty: "Inspection certification"
  },
  def: {
    features: [
      "DEF system service",
      "Tank cleaning and repair",
      "Injector service",
      "Sensor replacement"
    ],
    benefits: [
      "Emission compliance",
      "Improved performance",
      "Reduced downtime",
      "System reliability"
    ],
    process: [
      "Diagnose DEF system",
      "Clean or repair components",
      "Replace sensors if needed",
      "Test system operation"
    ],
    estimatedTime: "2-3 hours",
    warranty: "12 months on repairs"
  },
  dpf: {
    features: [
      "DPF cleaning services",
      "Regeneration support",
      "Filter replacement",
      "System diagnostics"
    ],
    benefits: [
      "Restored engine power",
      "Better fuel economy",
      "Emission compliance",
      "Extended filter life"
    ],
    process: [
      "Inspect DPF condition",
      "Perform cleaning or regeneration",
      "Test system performance",
      "Verify emissions compliance"
    ],
    estimatedTime: "3-5 hours",
    warranty: "6 months on cleaning"
  },
  jumpstart: {
    features: [
      "Battery testing",
      "Jump start service",
      "Battery replacement",
      "Charging system check"
    ],
    benefits: [
      "Quick vehicle recovery",
      "Prevents being stranded",
      "Identifies battery issues",
      "Reliable starting"
    ],
    process: [
      "Test battery voltage",
      "Jump start if needed",
      "Check charging system",
      "Replace battery if necessary"
    ],
    estimatedTime: "15-30 minutes",
    warranty: "36 months on batteries"
  },
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

export function ServicesDetailed() {
  const { getTranslation: getContent } = useContent()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [services, setServices] = useState(defaultServices)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    const elements = document.querySelectorAll("[data-service-detail-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el))
      observerRef.current?.disconnect()
    }
  }, [services])

  useEffect(() => {
    loadServices()
    
    const handleUpdate = () => {
      loadServices()
    }

    window.addEventListener("servicesUpdated", handleUpdate)
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'servicesLastUpdated') {
        loadServices()
      }
    }
    window.addEventListener("storage", handleStorageChange)
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadServices()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    
    window.addEventListener("focus", loadServices)
    
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
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()
      if (result.success && result.data.length > 0) {
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
        setServices(defaultServices)
      }
    } catch (error) {
      console.error("Error loading services:", error)
      setServices(defaultServices)
    }
  }

  const handleGetQuote = (serviceId: string) => {
    setSelectedService(serviceId)
    setIsModalOpen(true)
  }

  return (
    <section id="services-detailed" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background w-full">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-6 animate-pulse">
            <span className="text-lg font-semibold text-primary">{getContent("ourServices")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {getContent("comprehensiveTruckServices")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {getContent("servicesDescription")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-32">
          {services.map((service, index) => {
            const Icon = service.icon
            const details = serviceDetails[service.serviceId] || {
              features: [],
              benefits: [],
              process: [],
            }
            const isEven = index % 2 === 0
            
            // Check if sale is active
            const now = new Date()
            const saleStart = service.saleStartDate ? new Date(service.saleStartDate) : null
            const saleEnd = service.saleEndDate ? new Date(service.saleEndDate) : null
            const isSaleActive = service.discountPercent && saleStart && saleEnd && now >= saleStart && now <= saleEnd
            
            // Calculate discounted price
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
              <div
                key={index}
                id={`service-detail-${service.serviceId}-${index}`}
                data-service-detail-animate
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  isVisible[`service-detail-${service.serviceId}-${index}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                } transition-all duration-1000`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image Section */}
                <div className={`w-full lg:w-1/2 ${!isEven ? 'lg:order-2' : ''}`}>
                  <Card className="relative overflow-hidden group h-[500px] lg:h-[600px] border-2 hover:border-primary/50 transition-all duration-500 shadow-2xl">
                    {/* Sale Badge */}
                    {isSaleActive && (
                      <div className="absolute top-6 right-6 z-20 bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-xl animate-pulse">
                        -{service.discountPercent}% OFF
                      </div>
                    )}
                    <div className="absolute inset-0">
                      {service.image && service.image.trim() ? (
                        <Image
                          src={service.image}
                          alt={service.title || getContent(service.titleKey)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Icon className="w-32 h-32 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-xl">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                            {service.title || getContent(service.titleKey)}
                          </h3>
                          {details.estimatedTime && (
                            <div className="flex items-center gap-2 text-white/90">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{details.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Content Section */}
                <div className={`w-full lg:w-1/2 ${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <p className="text-lg text-foreground leading-relaxed">
                        {service.description || getContent(service.descKey)}
                      </p>
                    </div>

                    {/* Features */}
                    {details.features.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Star className="w-5 h-5 text-primary" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {details.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits */}
                    {details.benefits.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Shield className="w-5 h-5 text-primary" />
                          Benefits
                        </h4>
                        <ul className="space-y-3">
                          {details.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Process */}
                    {details.process.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Wrench className="w-5 h-5 text-primary" />
                          Our Process
                        </h4>
                        <div className="space-y-4">
                          {details.process.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-muted-foreground pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and CTA */}
                    <div className="pt-6 border-t border-border">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          {service.priceType === "call" ? (
                            <p className="text-2xl font-bold text-primary">{getContent("callForPrice")}</p>
                          ) : (
                            <div>
                              {isSaleActive && discountedPrice ? (
                                <div className="space-y-2">
                                  {service.priceType === "starting" && (
                                    <p className="text-sm text-muted-foreground">{getContent("startingAt")}</p>
                                  )}
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <p className="text-xs text-muted-foreground line-through">{service.price}</p>
                                    <p className="text-4xl font-bold text-red-600">{discountedPrice}</p>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                      -{service.discountPercent}%
                                    </span>
                                  </div>
                                  <p className="text-sm text-green-600 font-semibold">Special Sale Price!</p>
                                </div>
                              ) : (
                                <div>
                                  {service.priceType === "starting" && (
                                    <p className="text-sm text-muted-foreground mb-1">{getContent("startingAt")}</p>
                                  )}
                                  <p className="text-3xl font-bold text-foreground">{service.price}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {details.warranty && (
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              {details.warranty}
                            </p>
                          )}
                        </div>
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group"
                          onClick={() => handleGetQuote(service.serviceId)}
                        >
                          {getContent("getAQuote")}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action Section */}
        <div className="mt-32 text-center">
          <Card className="p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us today to schedule your service or get a free quote. Our expert team is ready to help keep your fleet running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
                onClick={() => handleGetQuote("")}
              >
                Request a Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold px-8 py-6 text-lg"
                onClick={() => {
                  window.location.href = "/#contact"
                }}
              >
                Contact Us
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedService={selectedService} />
    </section>
  )
}

