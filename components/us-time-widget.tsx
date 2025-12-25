"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

// Helper function to get city/country name from timezone
function getTimezoneLocation(timezone: string): string {
  const timezoneMap: { [key: string]: string } = {
    'America/New_York': 'Dayton, OH',
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

export function USTimeWidget() {
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
      console.log('Timezone updated event received')
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
          console.log('Timezone updated via storage event:', data.timezone)
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
              console.log('Timezone updated via polling:', data.timezone)
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

      // Get timezone abbreviation
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

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Clock Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                <Clock className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {currentTime.timezone}
              </div>
            </div>

            {/* Time and Date */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Current Time
                </h3>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-5xl md:text-6xl font-bold text-foreground mb-2 font-mono">
                    {currentTime.time || "Loading..."}
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    {currentTime.date || "Loading..."}
                  </p>
                </div>
                <p className="text-base md:text-lg font-semibold text-foreground">
                  {currentTime.location || ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTime.timezone ? `${currentTime.timezone} Time` : ""}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

