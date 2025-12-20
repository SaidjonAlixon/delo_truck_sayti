"use client"

import type React from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { sendContactToTelegram } from "@/lib/telegram-api"

export function Contact() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await sendContactToTelegram({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      })
      
      setSubmitStatus({
        type: 'success',
        message: getTranslation(language, "thankYouMessage")
      })
      setFormData({ name: "", email: "", phone: "", service: "", message: "" })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">{getTranslation(language, "getInTouch")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
            {getTranslation(language, "contactUsToday")}
          </h2>
          <p className="text-lg text-foreground leading-relaxed">{getTranslation(language, "contactDescription")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="rounded-2xl overflow-hidden bg-muted h-full">
            <img
              src="/services/book.jpg"
              alt="Contact Delo Truck Center"
              className="w-full h-full object-cover"
            />
          </div>

          <Card className="p-8 bg-card border-border flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground">
              {getTranslation(language, "requestService")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-card-foreground">
                  {getTranslation(language, "fullName")} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground placeholder:text-muted-foreground/60"
                  placeholder={language === "uz" ? "Ismingizni kiriting" : "Enter your full name"}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-card-foreground">
                  {getTranslation(language, "emailAddress")} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground placeholder:text-muted-foreground/60"
                  placeholder={language === "uz" ? "example@email.com" : "example@email.com"}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-card-foreground">
                  {getTranslation(language, "phoneNumber")} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground placeholder:text-muted-foreground/60"
                  placeholder={language === "uz" ? "+998 90 123 45 67" : "(123) 456-7890"}
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2 text-card-foreground">
                  {getTranslation(language, "serviceNeeded")} *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                >
                  <option value="">{getTranslation(language, "selectService")}</option>
                  <option value="diagnostics">{getTranslation(language, "computerDiagnostics")}</option>
                  <option value="tire">{getTranslation(language, "tireService")}</option>
                  <option value="oil">{getTranslation(language, "oilChange")}</option>
                  <option value="suspension">{getTranslation(language, "suspensionSteering")}</option>
                  <option value="transmission">{getTranslation(language, "transmissionRepair")}</option>
                  <option value="inspection">{getTranslation(language, "dotCarbInspections")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-card-foreground">
                  {getTranslation(language, "additionalInfo")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-background text-foreground"
                  placeholder={getTranslation(language, "additionalInfoPlaceholder")}
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
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isSubmitting}
              >
                <Phone className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Yuborilmoqda...' : getTranslation(language, "requestServiceButton")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
