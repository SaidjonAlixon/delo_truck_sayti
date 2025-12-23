"use client"

import { useState, useEffect } from 'react'
import { translations } from './translations'

// Cache for content from database
let contentCache: Record<string, string> | null = null
let contentCacheTime = 0
const CACHE_DURATION = 60000 // 1 minute

export function useContent() {
  const [content, setContent] = useState<Record<string, string>>(translations)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      // Check cache
      const now = Date.now()
      if (contentCache && (now - contentCacheTime) < CACHE_DURATION) {
        setContent(contentCache)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/content', {
          cache: 'no-store',
        })
        const result = await response.json()
        
        if (result.success && result.data.length > 0) {
          // Transform database data to object
          const contentMap: Record<string, string> = { ...translations }
          result.data.forEach((item: any) => {
            contentMap[item.content_key] = item.content_value
          })
          
          contentCache = contentMap
          contentCacheTime = now
          setContent(contentMap)
        } else {
          // Fallback to translations if database is empty
          setContent(translations)
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // Fallback to translations on error
        setContent(translations)
      } finally {
        setLoading(false)
      }
    }

    loadContent()

    // Listen for content updates
    const handleContentUpdate = () => {
      contentCache = null // Clear cache
      loadContent()
    }

    window.addEventListener('contentUpdated', handleContentUpdate)
    
    // Refresh on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        if (!contentCache || (now - contentCacheTime) >= CACHE_DURATION) {
          loadContent()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const getTranslation = (key: keyof typeof translations): string => {
    return content[key] || translations[key] || key
  }

  return { content, getTranslation, loading }
}

