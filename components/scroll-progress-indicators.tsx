"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Mouse } from "lucide-react"

export function ScrollProgressIndicators() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      // Calculate scroll progress (0 to 100)
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
      
      // Hide indicators when scrolled past 85%
      setIsVisible(progress < 85)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  // Calculate vertical position based on scroll progress
  const verticalOffset = scrollProgress * 0.4 // Adjust multiplier for movement speed

  return (
    <>
      {/* Left Side Indicator */}
      <div 
        className="fixed left-6 top-1/2 z-50 transition-all duration-300 ease-out pointer-events-none"
        style={{
          transform: `translateY(calc(-50% + ${verticalOffset}px))`,
          opacity: isVisible ? Math.max(0.3, 1 - scrollProgress / 100) : 0
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Scroll Track */}
          <div className="w-1 h-32 bg-primary/20 rounded-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-100"
              style={{
                height: `${scrollProgress}%`
              }}
            />
            {/* Scroll Ball */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full transition-all duration-100 shadow-lg"
              style={{
                top: `${scrollProgress}%`,
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          </div>
          
          {/* Mouse Icon with Animation */}
          <div className="flex flex-col items-center gap-1">
            <Mouse className="w-5 h-5 text-primary/70 animate-pulse" />
            <ChevronDown className="w-4 h-4 text-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>

      {/* Right Side Indicator */}
      <div 
        className="fixed right-6 top-1/2 z-50 transition-all duration-300 ease-out pointer-events-none"
        style={{
          transform: `translateY(calc(-50% + ${verticalOffset}px))`,
          opacity: isVisible ? Math.max(0.3, 1 - scrollProgress / 100) : 0
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Scroll Track */}
          <div className="w-1 h-32 bg-primary/20 rounded-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-100"
              style={{
                height: `${scrollProgress}%`
              }}
            />
            {/* Scroll Ball */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full transition-all duration-100 shadow-lg"
              style={{
                top: `${scrollProgress}%`,
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          </div>
          
          {/* Mouse Icon with Animation */}
          <div className="flex flex-col items-center gap-1">
            <Mouse className="w-5 h-5 text-primary/70 animate-pulse" />
            <ChevronDown className="w-4 h-4 text-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </>
  )
}

