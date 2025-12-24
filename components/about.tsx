"use client"

import { Shield, Award, Users, Clock, Truck, CheckCircle, Wrench, Star, Building2, Target, Zap, Heart, HelpCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useContent } from "@/lib/use-content"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQItem {
  id: number
  question: string
  answer: string
  display_order: number
}

export function About() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [faqs, setFaqs] = useState<FAQItem[]>([])

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

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el))
      observerRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    loadFAQs()
    
    // Listen for updates from admin panel
    const handleUpdate = () => {
      console.log('FAQ updated event received')
      loadFAQs()
    }

    window.addEventListener("faqUpdated", handleUpdate)
    
    return () => {
      window.removeEventListener("faqUpdated", handleUpdate)
    }
  }, [])

  const loadFAQs = async () => {
    try {
      const response = await fetch('/api/faq', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        setFaqs(result.data)
      }
    } catch (error) {
      console.error("Error loading FAQs:", error)
    }
  }

  const stats = [
    { value: "5+", label: getContent("yearsOfExcellence"), icon: Clock },
    { value: "1000+", label: "Satisfied Customers", icon: Users },
    { value: "5000+", label: "Vehicles Serviced", icon: Truck },
    { value: "ASE", label: "Certified Technicians", icon: Shield },
  ]

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

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We build lasting relationships through trust and exceptional service.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for perfection in every repair, maintenance service, and customer interaction.",
    },
    {
      icon: Building2,
      title: "Integrity",
      description: "Honest, transparent service with fair pricing and clear communication every step of the way.",
    },
    {
      icon: Star,
      title: "Innovation",
      description: "Staying ahead with the latest technology and techniques in commercial vehicle service.",
    },
  ]

  const galleryImages = [
    "/professional-truck-mechanics-working-in-modern-ser.jpg",
    "/services/diagnostics.jpg",
    "/services/tire-service.jpg",
    "/services/oil-change.jpg",
    "/services/suspension.jpg",
    "/services/transmission.jpg",
  ]

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div 
            id="about-hero"
            data-animate
            className={`max-w-4xl mx-auto text-center space-y-6 transition-all duration-1000 ${
              isVisible["about-hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-primary">{getContent("aboutUs")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {getContent("trustedTruckServicePartner")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Delo Truck Center LLC is your premier destination for comprehensive commercial truck repair, maintenance, and inspection services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  id={`stat-${index}`}
                  data-animate
                  className={`text-center transition-all duration-700 ${
                    isVisible[`stat-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main About Section */}
    <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              id="about-image"
              data-animate
              className={`relative transition-all duration-1000 ${
                isVisible["about-image"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <img
                src="/professional-truck-mechanics-working-in-modern-ser.jpg"
                alt="About Delo Truck Center"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <p className="text-4xl font-bold text-accent-foreground mb-1">5+</p>
                <p className="text-sm text-accent-foreground/90">{getContent("yearsOfExcellence")}</p>
          </div>
            </div>

            <div 
              id="about-content"
              data-animate
              className={`space-y-6 transition-all duration-1000 ${
                isVisible["about-content"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance text-foreground">
                  Serving the Commercial Trucking Industry with Excellence
            </h2>
                <p className="text-lg text-foreground leading-relaxed">
                  {getContent("aboutDescription1")}
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  {getContent("aboutDescription2")}
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  Our state-of-the-art facility spans thousands of square feet and is equipped with cutting-edge diagnostic equipment. We pride ourselves on maintaining the highest standards of safety, quality, and efficiency in every project we undertake.
                </p>
              </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-foreground">
                          {getContent(feature.titleKey)}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {getContent(feature.descKey)}
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

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              id="mission-card"
              data-animate
              className={`p-8 bg-card border-2 hover:border-primary/50 transition-all duration-300 ${
                isVisible["mission-card"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-foreground leading-relaxed">
                To provide exceptional commercial truck repair and maintenance services that keep fleets running safely, efficiently, and profitably. We are committed to delivering unparalleled customer service, using premium parts, and maintaining the highest standards of workmanship.
              </p>
            </Card>

            <Card 
              id="vision-card"
              data-animate
              className={`p-8 bg-card border-2 hover:border-primary/50 transition-all duration-300 ${
                isVisible["vision-card"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-foreground leading-relaxed">
                To become the most trusted and respected commercial truck service center in the region, recognized for our innovation, reliability, and unwavering commitment to customer success. We envision a future where every commercial vehicle owner knows they can count on Delo Truck Center.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div 
            id="values-header"
            data-animate
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
              isVisible["values-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do at Delo Truck Center
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  id={`value-${index}`}
                  data-animate
                  className={`p-6 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border ${
                    isVisible[`value-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-foreground">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div 
            id="gallery-header"
            data-animate
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
              isVisible["gallery-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Our Facility in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Take a look at our modern facility and expert technicians at work
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div
                key={index}
                id={`gallery-${index}`}
                data-animate
                className={`aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer transition-all duration-500 hover:scale-105 ${
                  isVisible[`gallery-${index}`] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback image if the image doesn't exist
                    e.currentTarget.src = "/professional-truck-mechanics-working-in-modern-ser.jpg"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              id="why-choose-content"
              data-animate
              className={`space-y-6 transition-all duration-1000 ${
                isVisible["why-choose-content"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Experience the Delo Truck Center Difference
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">State-of-the-Art Equipment</h4>
                    <p className="text-muted-foreground">
                      Our facility is equipped with the latest diagnostic tools and repair equipment to handle any commercial vehicle service need.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Fleet Service Expertise</h4>
                    <p className="text-muted-foreground">
                      We understand the unique needs of fleet operators and offer customized maintenance programs to minimize downtime.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Competitive Pricing</h4>
                    <p className="text-muted-foreground">
                      Fair, transparent pricing with no hidden fees. We provide detailed estimates before starting any work.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Comprehensive Services</h4>
                    <p className="text-muted-foreground">
                      From routine maintenance to complex repairs, DOT inspections to emergency roadside assistance - we do it all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div 
              id="why-choose-image"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible["why-choose-image"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted shadow-2xl">
                <img
                  src="/professional-truck-mechanics-working-in-modern-ser.jpg"
                  alt="Delo Truck Center Facility"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div 
            id="faq-header"
            data-animate
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
              isVisible["faq-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Answers to common questions about our services and company
            </p>
          </div>

          <div 
            id="faq-content"
            data-animate
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              isVisible["faq-content"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${faq.id}`}
                    className="bg-card border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-semibold text-lg py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 whitespace-pre-wrap">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>FAQ'lar yuklanmoqda...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}