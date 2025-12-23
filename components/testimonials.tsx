"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useContent } from "@/lib/use-content"

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  rating: number
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mahmoud Hussein",
    role: "Truck Owner",
    text: "Great experience at Delo Truck Center LLC! I had an excellent experience here. The staff were professional, friendly, and really know what they're doing. They diagnosed the problem quickly and fixed it efficiently. The prices were fair, and the service was honest and transparent — no hidden fees or unnecessary upselling. I truly appreciate how they respect truckers' time and get the job done right. Highly recommend Delo Truck Center to anyone looking for reliable and trustworthy service!",
    rating: 5,
  },
  {
    id: 2,
    name: "William Shaye",
    role: "Truck Driver",
    text: "Went there to do my breaks, change diff fluid but found out that there was a leak from seal hub but the shop had parts & stuff, got it done under 2 hours! Very affordable if you negotiate with owner and fast!",
    rating: 5,
  },
  {
    id: 3,
    name: "Gabin Kamgang",
    role: "Fleet Manager",
    text: "I had some issues with my truck, the TA mechanic was not able to fix due to the complexity, but this shop was able to fix it. They had great prices and worked past business hours until my truck was fully fixed. My driver was back on the road the same day. I highly recommend this shop if you want someone very reliable, caring and someone that will get you back to the road asap.",
    rating: 5,
  },
  {
    id: 4,
    name: "Ruben",
    role: "Truck Owner",
    text: "I brought my truck into Delo Truck Center in Dayton after getting quoted a crazy price somewhere else to replace the entire clutch. These guys took a real look at it and told me straight—it didn't need a full replacement. They repaired what was actually wrong, saved me a ton of money and time, and got me back on the road fast. You don't see that kind of honesty much anymore. The mechanics here know their stuff—competent, professional, and trustworthy. The owner himself was hands-on, doing the work and making sure everything was done right. Real great guy. You can tell he takes pride in what he does and looks out for his customers. I've been to plenty of shops that try to take advantage of folks—this place is the opposite. If you want solid work without getting ripped off, this is where you go. Much respect to the crew. Appreciate the good work.",
    rating: 5,
  },
  {
    id: 5,
    name: "Rachel Brown",
    role: "Local Expert",
    text: "Delo addressed all our concerns and went above and beyond to ensure we left feeling confident with the service provided. Their attention to detail, honesty, and willingness to go the extra mile made the experience seamless and stress-free. If you're looking for a diesel mechanic that truly cares about its customers, Delo is your best bet! They've earned our trust and future business!",
    rating: 5,
  },
  {
    id: 6,
    name: "Sasanka Rajapaksa",
    role: "Local Expert",
    text: "Came to fix my box truck with def issue. Professional mechanics go through all the issue and fixed it with reasonable price. Nice people.",
    rating: 5,
  },
  {
    id: 7,
    name: "Akmammet Allakgayev",
    role: "Local Expert",
    text: "My trucks get professional care at this location. Ahmet is knowledgeable mechanic. Thanks",
    rating: 5,
  },
  {
    id: 8,
    name: "Yosef",
    role: "Truck Driver",
    text: "Awesome service, got inspection brakes, tires, and fender fixed, they were fast and efficient, ahmet and Murat thanks.",
    rating: 5,
  },
  {
    id: 9,
    name: "A. K.",
    role: "Local Expert",
    text: "Very professional techs, affordable prices, quick service",
    rating: 5,
  },
  {
    id: 10,
    name: "kenan arslan",
    role: "Local Expert",
    text: "Wonderful service reasonable price. I really thank you Mr Ahmet Its was really fast",
    rating: 5,
  },
  {
    id: 11,
    name: "Hi Nobody",
    role: "Local Expert",
    text: "This is a really clean and well organized shop the owner is knowledgeable and very easy to deal with so much respect for this place and its owner I would recommend it to anyone",
    rating: 5,
  },
  {
    id: 12,
    name: "trey jackson",
    role: "Truck Driver",
    text: "They best business in Dayton great people to work with it's all love thank you to you guys",
    rating: 5,
  },
  {
    id: 13,
    name: "Goku Cougar",
    role: "Truck Driver",
    text: "Nice, honest people. Perfect, quick and quality service. Thank you Gentlemen.",
    rating: 5,
  },
  {
    id: 14,
    name: "Lance",
    role: "Local Expert",
    text: "Good people's, good prices, very helpful and reliable. Will be back soon to finish up others repairs on my international.",
    rating: 5,
  },
  {
    id: 15,
    name: "Oleksandr Kuzemko",
    role: "Local Expert",
    text: "Thank you, guys from the CIS did everything quickly and the price is very good! Thank you",
    rating: 5,
  },
  {
    id: 16,
    name: "Azamat Yuldashev",
    role: "Local Expert",
    text: "I had an outstanding experience at this truck shop. From the moment I arrived, the team was professional, efficient, and truly focused on getting me back on the road as quickly as possible. A special thank you to Ahmed — his knowledge, honesty, and dedication made all the difference. He took the time to explain everything clearly, treated my truck with great care, and ensured the job was done right. It's rare to find service this reliable and consistent. I highly recommend this shop to anyone looking for quality work and exceptional customer service. I'll definitely be coming back whenever I need anything in the future.",
    rating: 5,
  },
  {
    id: 17,
    name: "Ozodbek Abdurahimov",
    role: "Truck Driver",
    text: "Excellent Service and Professional Work! I had a brake issue with my truck and brought it to this shop. They did an amazing job — quick, professional, and very thorough. The mechanics really know what they're doing, and they explained everything clearly before getting started. My truck feels great now, and I'm very proud and thankful for their quality work and honesty. It's rare to find a shop that cares this much about doing things right. Highly recommend this team to any driver who wants reliable service and real expertise! Great shop ever",
    rating: 5,
  },
  {
    id: 18,
    name: "Ahmet Faruk",
    role: "Commercial Driver",
    text: "They quickly diagnosed and fixed an electronic issue on my semi truck. The team was very knowledgeable, helpful, and professional. They explained everything clearly and took great care of my truck from start to finish. I truly appreciate their honest and high-quality service. I highly recommend this shop excellent people and excellent workmanship.",
    rating: 5,
  },
]

export function Testimonials() {
  const { language } = useLanguage()
  const { getTranslation: getContent } = useContent()
  const [currentStartIndex, setCurrentStartIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)

  useEffect(() => {
    loadTestimonials()
    
    // Listen for updates from admin panel
    const handleUpdate = () => {
      loadTestimonials()
    }

    window.addEventListener("testimonialsUpdated", handleUpdate)
    return () => window.removeEventListener("testimonialsUpdated", handleUpdate)
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials', {
        cache: 'no-store',
      })
      const result = await response.json()
      if (result.success && result.data && result.data.length > 0) {
        setTestimonials(result.data)
        console.log('Testimonials loaded from database:', result.data.length)
      } else {
        // Fallback to default testimonials if database is empty
        console.log('Database is empty, using default testimonials')
        setTestimonials(defaultTestimonials)
      }
    } catch (error) {
      console.error("Error loading testimonials:", error)
      // Fallback to default testimonials on error
      setTestimonials(defaultTestimonials)
    }
  }

  // Har safar 3 ta kartochka ko'rsatish uchun ketma-ket
  const getVisibleTestimonials = () => {
    const visible: Testimonial[] = []
    const startIdx = currentStartIndex
    
    // Har safar keyingi 3 ta izohni ketma-ket ko'rsatamiz
    for (let i = 0; i < 3; i++) {
      const index = startIdx + i
      if (index < testimonials.length) {
        visible.push(testimonials[index])
      }
    }
    
    return visible
  }

  const visibleTestimonials = getVisibleTestimonials()

  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        // Keyingi 3 ta izohga o'tish
        setCurrentStartIndex((prev) => {
          const nextIndex = prev + 3
          // Agar barcha izohlar ko'rsatilgan bo'lsa, boshidan boshlaymiz
          if (nextIndex >= testimonials.length) {
            return 0
          }
          return nextIndex
        })
        setExpandedCards(new Set()) // Yangi kartochkalarga o'tganda expanded holatni tozalaymiz
        setIsAnimating(false)
      }, 300)
    }, 10000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const toggleExpand = (testimonialId: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId)
      } else {
        newSet.add(testimonialId)
      }
      return newSet
    })
  }

  // Qisqa matn funksiyasi (bir xil uzunlikda)
  const getShortText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">
              {getContent("ourCustomers")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
            {getContent("whatOurCustomersSay")}
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            {getContent("testimonialsDescription")}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentStartIndex((prev) => {
                  const prevIndex = prev - 3
                  if (prevIndex < 0) {
                    const lastStartIndex = Math.floor((testimonials.length - 1) / 3) * 3
                    return lastStartIndex < 0 ? 0 : lastStartIndex
                  }
                  return prevIndex
                })
                setExpandedCards(new Set())
                setIsAnimating(false)
              }, 300)
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center hover:scale-110"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentStartIndex((prev) => {
                  const nextIndex = prev + 3
                  if (nextIndex >= testimonials.length) {
                    return 0
                  }
                  return nextIndex
                })
                setExpandedCards(new Set())
                setIsAnimating(false)
              }, 300)
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center hover:scale-110"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {visibleTestimonials.map((testimonial, cardIndex) => {
            const isExpanded = expandedCards.has(testimonial.id)
            const fullText = testimonial.text
            const shortText = getShortText(fullText, 150)
            const displayText = isExpanded ? fullText : shortText
            const needsExpandButton = fullText.length > 150

            return (
              <Card
                key={`${testimonial.id}-${currentStartIndex}-${cardIndex}`}
                className={`relative p-5 md:p-6 bg-foreground text-background border-0 shadow-xl rounded-xl transition-all duration-500 ${
                  isAnimating ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
                }`}
                style={{
                  animationDelay: `${cardIndex * 0.1}s`,
                }}
              >
                {/* Rating Stars - Top Left */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-12 h-12 md:w-14 md:h-14 text-primary fill-primary/20" />
                </div>

                {/* Testimonial Text */}
                <div className="mb-4">
                  <p className={`text-sm md:text-base leading-relaxed text-background/90 ${
                    !isExpanded ? "min-h-[120px] md:min-h-[140px]" : ""
                  }`}>
                    {displayText}
                  </p>
                  {needsExpandButton && (
                    <button
                      onClick={() => toggleExpand(testimonial.id)}
                      className="mt-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>

                {/* Reviewer Info */}
                <div className="pt-3 border-t border-background/20">
                  <h4 className="text-base md:text-lg font-bold text-background mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-background/70 text-xs md:text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            )
          })}
          </div>
        </div>

      </div>
    </section>
  )
}

