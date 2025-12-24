"use client"

import { Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useState, useEffect, useCallback, useMemo } from "react"
import { QuoteModal } from "@/components/quote-modal"
import { useContent } from "@/lib/use-content"

interface HeroSlide {
  title: string
  description: string
  backgroundImage: string
}

export function Hero() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const slides: HeroSlide[] = useMemo(
    () => [
      {
        title: getContent("heroSlide1Title"),
        description: getContent("heroSlide1Description"),
        backgroundImage: "/professional-commercial-truck-in-modern-service-ce.jpg",
      },
      {
        title: getContent("heroSlide2Title"),
        description: getContent("heroSlide2Description"),
        backgroundImage: "/professional-truck-mechanics-working-in-modern-ser.jpg",
      },
      {
        title: getContent("heroSlide3Title"),
        description: getContent("heroSlide3Description"),
        backgroundImage: "/professional-commercial-truck-in-modern-service-ce.jpg",
      },
    ],
    [getContent]
  )

  const nextSlide = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setTimeout(() => setIsAnimating(false), 50)
    }, 400)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setTimeout(() => setIsAnimating(false), 50)
    }, 400)
  }, [slides.length])

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setTimeout(() => setIsAnimating(false), 50)
      }, 400)
    }
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
            {/* Slide Content with smooth animations */}
            <div 
              key={currentSlide}
              className={`space-y-6 transition-all duration-500 ease-in-out ${
                isAnimating 
                  ? "opacity-0 translate-y-10 scale-98" 
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              <h1 
                className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg transition-all duration-500 ease-out ${
                  isAnimating 
                    ? "opacity-0 translate-y-6 blur-sm" 
                    : "opacity-100 translate-y-0 blur-0"
                }`}
                style={{ 
                  transitionDelay: isAnimating ? "0ms" : "100ms" 
                }}
              >
                {slides[currentSlide].title}
              </h1>
              <p 
                className={`text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md transition-all duration-500 ease-out ${
                  isAnimating 
                    ? "opacity-0 translate-y-6 blur-sm" 
                    : "opacity-100 translate-y-0 blur-0"
                }`}
                style={{ 
                  transitionDelay: isAnimating ? "0ms" : "200ms" 
                }}
              >
                {slides[currentSlide].description}
              </p>
              <div 
                className={`pt-4 transition-all duration-500 ease-out ${
                  isAnimating 
                    ? "opacity-0 translate-y-6 scale-95" 
                    : "opacity-100 translate-y-0 scale-100"
                }`}
                style={{ 
                  transitionDelay: isAnimating ? "0ms" : "300ms" 
                }}
              >
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white text-lg h-14 px-8 uppercase font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  {getContent("contactUsToday")}
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

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </section>
  )
}
