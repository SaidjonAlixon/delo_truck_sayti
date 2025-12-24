"use client"

import { Phone, Mail, MapPin, ChevronDown, Clock, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useContent } from "@/lib/use-content"
import { useState, useEffect } from "react"

// Helper function to get city/country name from timezone
function getTimezoneLocation(timezone: string): string {
  const timezoneMap: { [key: string]: string } = {
    'America/New_York': 'New York, USA',
    'America/Chicago': 'Chicago, USA',
    'America/Denver': 'Denver, USA',
    'America/Los_Angeles': 'Los Angeles, USA',
    'America/Phoenix': 'Phoenix, USA',
    'America/Anchorage': 'Anchorage, USA',
    'Pacific/Honolulu': 'Honolulu, USA',
    'Europe/London': 'London, UK',
    'Europe/Paris': 'Paris, France',
    'Europe/Berlin': 'Berlin, Germany',
    'Asia/Dubai': 'Dubai, UAE',
    'Asia/Tashkent': 'Tashkent, Uzbekistan',
    'Asia/Tokyo': 'Tokyo, Japan',
    'Asia/Shanghai': 'Shanghai, China',
    'Asia/Kolkata': 'Mumbai, India',
    'Australia/Sydney': 'Sydney, Australia',
    'America/Mexico_City': 'Mexico City, Mexico',
    'America/Sao_Paulo': 'São Paulo, Brazil',
    'America/Toronto': 'Toronto, Canada',
    'America/Vancouver': 'Vancouver, Canada',
  }
  
  return timezoneMap[timezone] || timezone.split('/').pop()?.replace('_', ' ') || timezone
}

export function SiteFooter() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  // Barcha bo'limlarni doimiy ochiq qilib qo'yamiz
  const [hoveredSection] = useState<string | null>("all")
  const [currentTime, setCurrentTime] = useState<{
    time: string
    date: string
    timezone: string
    location: string
  }>({
    time: "",
    date: "",
    timezone: "",
    location: "",
  })
  const [timezone, setTimezone] = useState<string>("America/New_York")

  const loadTimezone = async () => {
    try {
      const response = await fetch('/api/settings?key=timezone', {
        cache: 'no-store',
      })
      const result = await response.json()
      if (result.success && result.data) {
        setTimezone(result.data.setting_value)
      }
    } catch (error) {
      console.error("Error loading timezone:", error)
    }
  }

  useEffect(() => {
    loadTimezone()
    
    // Listen for updates from admin panel (same tab)
    const handleUpdate = (e: Event) => {
      console.log('Timezone updated event received in footer')
      const customEvent = e as CustomEvent
      if (customEvent.detail?.timezone) {
        setTimezone(customEvent.detail.timezone)
      } else {
        loadTimezone()
      }
    }
    window.addEventListener("timezoneUpdated", handleUpdate as EventListener)
    
    // Also listen to storage events for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'timezoneUpdated' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          console.log('Timezone updated via storage event in footer:', data.timezone)
          if (data.timezone) {
            setTimezone(data.timezone)
          }
        } catch (error) {
          console.error('Error parsing timezone update:', error)
          loadTimezone()
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)
    
    // Poll localStorage for same-tab updates (since storage event doesn't fire in same tab)
    let lastTimestamp: string | null = null
    const storageCheckInterval = setInterval(() => {
      const stored = localStorage.getItem('timezoneUpdated')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          if (data.timestamp?.toString() !== lastTimestamp) {
            lastTimestamp = data.timestamp?.toString() || null
            if (data.timezone) {
              console.log('Timezone updated via polling in footer:', data.timezone)
              setTimezone(data.timezone)
            }
          }
        } catch (error) {
          // Ignore parse errors
        }
      }
    }, 500)
    
    // Check for updates when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTimezone()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    
    return () => {
      window.removeEventListener("timezoneUpdated", handleUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(storageCheckInterval)
    }
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      const timeString = now.toLocaleString("en-US", {
        timeZone: timezone,
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })

      const dateString = now.toLocaleString("en-US", {
        timeZone: timezone,
        month: "long",
        day: "numeric",
        year: "numeric",
        weekday: "long",
      })

      const timeZoneName = now.toLocaleString("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
      })

      const timezoneLabel = timeZoneName.split(" ").pop() || timezone
      const locationName = getTimezoneLocation(timezone)

      setCurrentTime({
        time: timeString,
        date: dateString,
        timezone: timezoneLabel,
        location: locationName,
      })
    }

    if (timezone) {
      updateTime()
      const interval = setInterval(updateTime, 1000)
      return () => clearInterval(interval)
    }
  }, [timezone])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-muted/30 py-4 border-0">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-0 mb-3 border-0">
          {/* Left Section - Light Background */}
          <div className="flex-1 text-foreground py-6 px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Company Info */}
              <div className="flex-1 lg:max-w-[40%]">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-foreground leading-tight mb-1">Delo Truck Center</h3>
                    <p className="text-base text-muted-foreground mb-2">LLC</p>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-0">
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
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-foreground hover:text-primary transition-colors">
                {getTranslation(language, "services")}
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1 text-xs text-muted-foreground">
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
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-foreground hover:text-primary transition-colors">
                Quick Links
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1 text-xs text-muted-foreground">
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
              <button className="flex items-center gap-1 font-semibold mb-2 text-sm text-foreground hover:text-primary transition-colors">
                Contact
                <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
              </button>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
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
          </div>

          {/* Right Section - Time Widget */}
          <div className="lg:w-[400px] text-foreground py-6 px-6 flex items-center justify-center">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-foreground/80" />
                <h3 className="text-xl font-bold text-foreground">
                  Current Time
                </h3>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                {/* Clock Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {currentTime.timezone || "EST"}
                  </div>
                </div>

                {/* Time and Date */}
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-bold text-foreground mb-1 font-mono">
                    {currentTime.time || "Loading..."}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {currentTime.date || "Loading..."}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {currentTime.location || ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentTime.timezone ? `${currentTime.timezone} Time` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 text-center border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Delo Truck Center LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
