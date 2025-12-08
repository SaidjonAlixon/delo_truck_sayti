"use client"

import { Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useState, useEffect, useCallback, useMemo } from "react"

interface HeroSlide {
  title: string
  description: string
  backgroundImage: string
}

export function Hero() {
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides: HeroSlide[] = useMemo(
    () => [
      {
        title: getTranslation(language, "heroSlide1Title"),
        description: getTranslation(language, "heroSlide1Description"),
        backgroundImage: "/professional-commercial-truck-in-modern-service-ce.jpg",
      },
      {
        title: getTranslation(language, "heroSlide2Title"),
        description: getTranslation(language, "heroSlide2Description"),
        backgroundImage: "/professional-truck-mechanics-working-in-modern-ser.jpg",
      },
      {
        title: getTranslation(language, "heroSlide3Title"),
        description: getTranslation(language, "heroSlide3Description"),
        backgroundImage: "/professional-commercial-truck-in-modern-service-ce.jpg",
      },
    ],
    [language]
  )

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden pt-20">
      {/* Background Images with Blur */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
                filter: "blur(4px)",
                transform: "scale(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Slide Content */}
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                {slides[currentSlide].description}
              </p>
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 uppercase font-semibold"
                >
                  {getTranslation(language, "contactUsToday")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-md transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-md transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-3 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
