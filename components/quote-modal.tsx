"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService?: string
}

export function QuoteModal({ isOpen, onClose, selectedService }: QuoteModalProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    serviceType: selectedService || "",
    additionalNotes: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form and close modal
    setFormData({ fullName: "", phoneNumber: "", serviceType: "", additionalNotes: "" })
    onClose()
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
            {getTranslation(language, "requestAQuote")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getTranslation(language, "fullName")} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getTranslation(language, "phoneNumber")} *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="(123) 456-7890"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getTranslation(language, "serviceType")}
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{getTranslation(language, "selectService")}</option>
                <option value="diagnostics">{getTranslation(language, "computerDiagnostics")}</option>
                <option value="tire">{getTranslation(language, "tireService")}</option>
                <option value="oil">{getTranslation(language, "oilChange")}</option>
                <option value="suspension">{getTranslation(language, "suspensionSteering")}</option>
                <option value="transmission">{getTranslation(language, "transmissionRepair")}</option>
                <option value="dot">{getTranslation(language, "dotCarbInspections")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {getTranslation(language, "additionalNotes")}
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder={getTranslation(language, "additionalNotesPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="destructive"
              size="lg"
              className="w-full bg-destructive hover:bg-destructive/90 text-lg py-6"
            >
              {getTranslation(language, "submitRequest")}
              <Send className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <button
            onClick={onClose}
            className="mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium w-full text-center"
          >
            {getTranslation(language, "close")}
          </button>
        </div>
      </div>
    </div>
  )
}
