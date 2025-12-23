"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { sendQuoteToTelegram } from "@/lib/telegram-api"
import { useContent } from "@/lib/use-content"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService?: string
}

export function QuoteModal({ isOpen, onClose, selectedService }: QuoteModalProps) {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    serviceType: selectedService || "",
    additionalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await sendQuoteToTelegram({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        serviceType: formData.serviceType,
        additionalNotes: formData.additionalNotes,
      })
      
      setSubmitStatus({
        type: 'success',
        message: getContent("thankYouMessage")
      })
      
      // Reset form
      setFormData({ fullName: "", phoneNumber: "", serviceType: "", additionalNotes: "" })
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSubmitStatus(null)
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            {getContent("requestAQuote")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getContent("fullName")} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getContent("phoneNumber")} *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="(123) 456-7890"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getContent("serviceType")}
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{getContent("selectService")}</option>
                <option value="roadside">Roadside Service</option>
                <option value="in-shop">In Shop Service</option>
                <option value="parking">Parking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getContent("additionalNotes")}
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder={getContent("additionalNotesPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <Button
              type="submit"
              variant="destructive"
              size="lg"
              className="w-full bg-destructive hover:bg-destructive/90 text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : getContent("submitRequest")}
              <Send className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <button
            onClick={onClose}
            className="mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium w-full text-center"
          >
            {getContent("close")}
          </button>
        </div>
      </div>
    </div>
  )
}
