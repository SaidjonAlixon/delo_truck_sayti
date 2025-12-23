"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { translations } from './translations'

type TranslationKey = keyof typeof translations

interface TranslationsContextType {
  translations: typeof translations
  getTranslation: (key: TranslationKey) => string
  loading: boolean
}

const TranslationsContext = createContext<TranslationsContextType>({
  translations,
  getTranslation: (key) => translations[key] || key,
  loading: false,
})

export function TranslationsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>(translations)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content', {
          cache: 'no-store',
        })
        const result = await response.json()
        
        if (result.success && result.data.length > 0) {
          const contentMap: Record<string, string> = { ...translations }
          result.data.forEach((item: any) => {
            contentMap[item.content_key] = item.content_value
          })
          setContent(contentMap)
        }
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()

    // Listen for updates
    const handleUpdate = () => {
      loadContent()
    }
    window.addEventListener('contentUpdated', handleUpdate)
    
    // Refresh on visibility
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadContent()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('contentUpdated', handleUpdate)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const getTranslation = (key: TranslationKey): string => {
    return content[key] || translations[key] || key
  }

  return (
    <TranslationsContext.Provider value={{ translations: content as typeof translations, getTranslation, loading }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslations() {
  return useContext(TranslationsContext)
}

