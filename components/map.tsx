"use client"

import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Map() {
  const { language } = useLanguage()

  return (
    <section className="py-16 px-4 bg-background dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">{getTranslation(language, "location" as any)}</h2>
          <p className="text-lg text-muted-foreground">{getTranslation(language, "findUs" as any)}</p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps?q=Delo+Truck+Center+LLC&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Delo Truck Center LLC Location"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-foreground">{getTranslation(language, "address" as any)}</h3>
            <p className="text-muted-foreground">
              123 Truck Service Road
              <br />
              New York, NY 10001
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-foreground">{getTranslation(language, "hours" as any)}</h3>
            <p className="text-muted-foreground">
              Mon - Fri: 8:00 AM - 6:00 PM
              <br />
              Sat - Sun: 9:00 AM - 4:00 PM
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-foreground">{getTranslation(language, "phone" as any)}</h3>
            <p className="text-muted-foreground">
              +1 (555) 123-4567
              <br />
              +1 (555) 987-6543
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
