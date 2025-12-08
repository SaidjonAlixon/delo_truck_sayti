"use client"

import type React from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Contact() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(getTranslation(language, "thankYouMessage"))
    setFormData({ name: "", email: "", phone: "", service: "", message: "" })
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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  placeholder=""
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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  placeholder=""
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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                  placeholder=""
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

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Phone className="w-5 h-5 mr-2" />
                {getTranslation(language, "requestServiceButton")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
