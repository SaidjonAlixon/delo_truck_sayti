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
              636 N Irwin St
              <br />
              Dayton, OH 45403
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-foreground">{getTranslation(language, "hours" as any)}</h3>
            <p className="text-muted-foreground">
              Mon - Fri: 8:00am - 6:00pm
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-foreground">{getTranslation(language, "phone" as any)}</h3>
            <p className="text-muted-foreground">
              +1 929-522-9913
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
