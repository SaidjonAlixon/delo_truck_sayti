"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  left: number
  animationDuration: number
  animationDelay: number
  size: number
  opacity: number
}

export function Snow() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    // 80 ta qor qoplamasi yaratamiz (yanada ko'p va chiroyli)
    const flakes: Snowflake[] = []
    for (let i = 0; i < 80; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100, // 0-100% orasida tasodifiy pozitsiya
        animationDuration: 8 + Math.random() * 15, // 8-23 soniya (tezroq harakat)
        animationDelay: Math.random() * 0.5, // 0-0.5 soniya kechikish (darhol boshlanish uchun)
        size: 6 + Math.random() * 8, // 6-14px o'lcham (kattaroq)
        opacity: 0.4 + Math.random() * 0.6, // 0.4-1.0 shaffoflik
      })
    }
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => {
        // Har bir qor qoplamasi uchun alohida drift (yon tomonga harakat)
        const drift = (Math.random() - 0.5) * 50 // -25px dan +25px gacha
        return (
          <div
            key={flake.id}
            className="absolute top-[-10px] text-white select-none"
            style={{
              left: `${flake.left}%`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `snowfall ${flake.animationDuration}s linear infinite`,
              animationDelay: `${flake.animationDelay}s`,
              '--snow-drift': `${drift}px`,
            } as React.CSSProperties & { '--snow-drift': string }}
          >
            ❄
          </div>
        )
      })}
    </div>
  )
}

