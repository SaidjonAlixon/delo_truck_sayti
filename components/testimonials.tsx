"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface Testimonial {
  id: number
  name: string
  role: string
  textEn: string
  textUz: string
  rating: number
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mahmoud Hussein",
    role: "Truck Owner",
    textEn: "Great experience at Delo Truck Center LLC! I had an excellent experience here. The staff were professional, friendly, and really know what they're doing. They diagnosed the problem quickly and fixed it efficiently. The prices were fair, and the service was honest and transparent — no hidden fees or unnecessary upselling. I truly appreciate how they respect truckers' time and get the job done right. Highly recommend Delo Truck Center to anyone looking for reliable and trustworthy service!",
    textUz: "Delo Truck Center LLC da ajoyib tajriba! Men bu yerda ajoyib tajriba oshirdim. Xodimlar professional, do'stona va haqiqatan ham nima qilayotganlarini bilishadi. Ular muammoni tezda tashxislashdi va samarali tuzatdilar. Narxlar adolatli edi va xizmat halol va shaffof edi — yashirin to'lovlar yoki keraksiz qo'shimcha xizmatlar yo'q. Men ularning yuk mashina haydovchilarining vaqtini hurmat qilishlari va ishni to'g'ri bajarishlarini chin yurakdan qadrlayman. Ishonchli va ishonchli xizmat izlayotgan har kimga Delo Truck Centerni yuqori darajada tavsiya qilaman!",
    rating: 5,
  },
  {
    id: 2,
    name: "William Shaye",
    role: "Truck Driver",
    textEn: "Went there to do my breaks, change diff fluid but found out that there was a leak from seal hub but the shop had parts & stuff, got it done under 2 hours! Very affordable if you negotiate with owner and fast!",
    textUz: "Tormozlarni tuzatish va differensial suyuqligini almashtirish uchun keldim, lekin muhr gubkadan oqib chiqayotgani aniqlandi, lekin servisda qismlar bor edi, 2 soat ichida bajarildi! Agar xo'jayin bilan muzokara qilsangiz juda arzon va tez!",
    rating: 5,
  },
  {
    id: 3,
    name: "Gabin Kamgang",
    role: "Fleet Manager",
    textEn: "I had some issues with my truck, the TA mechanic was not able to fix due to the complexity, but this shop was able to fix it. They had great prices and worked past business hours until my truck was fully fixed. My driver was back on the road the same day. I highly recommend this shop if you want someone very reliable, caring and someone that will get you back to the road asap.",
    textUz: "Mening yuk mashinamda ba'zi muammolar bor edi, TA mexaniki murakkabligi sababli tuzata olmadi, lekin bu servis tuzata oldi. Ular ajoyib narxlarni taklif qildilar va yuk mashinam to'liq tuzatilguncha ish vaqtidan keyin ham ishladilar. Mening haydovchim xuddi shu kuni yo'lda edi. Agar siz juda ishonchli, g'amxo'r va sizni iloji boricha tezroq yo'lda qaytaradigan odamni xohlasangiz, bu servisni yuqori darajada tavsiya qilaman.",
    rating: 5,
  },
  {
    id: 4,
    name: "Ruben",
    role: "Truck Owner",
    textEn: "I brought my truck into Delo Truck Center in Dayton after getting quoted a crazy price somewhere else to replace the entire clutch. These guys took a real look at it and told me straight—it didn't need a full replacement. They repaired what was actually wrong, saved me a ton of money and time, and got me back on the road fast. You don't see that kind of honesty much anymore. The mechanics here know their stuff—competent, professional, and trustworthy. The owner himself was hands-on, doing the work and making sure everything was done right. Real great guy. You can tell he takes pride in what he does and looks out for his customers. I've been to plenty of shops that try to take advantage of folks—this place is the opposite. If you want solid work without getting ripped off, this is where you go. Much respect to the crew. Appreciate the good work.",
    textUz: "Men o'z yuk mashinamni Delo Truck Centerga olib keldim, chunki boshqa joyda butun debriyajni almashtirish uchun aqldan ozgan narx taklif qilingan edi. Bu odamlar uni haqiqatan ko'rib chiqdilar va menga to'g'ridan-to'g'ri aytishdi - to'liq almashtirish kerak emas edi. Ular haqiqatan ham buzilgan narsani tuzatdilar, menga juda ko'p pul va vaqt tejadilar va meni tez yo'lda qaytardilar. Bunday halollikni endi kamdan-kam ko'rasiz. Bu yerdagi mexaniklar o'z ishlarini biladilar — kompetent, professional va ishonchli. Xo'jayinning o'zi qo'l bilan ish qildi va hamma narsa to'g'ri bajarilishini ta'minladi. Haqiqatan ham ajoyib odam. U o'z qilayotgan ishiga faxrlanadi va mijozlariga g'amxo'rlik qilishini ko'rish mumkin. Men ko'p servislarda bo'lganman, ular odamlarni foydalanishga harakat qilishadi — bu joy teskari. Agar siz o'g'rilik qilmasdan qattiq ishni xohlasangiz, mana shu yerga boring. Jamoa uchun katta hurmat. Yaxshi ish uchun minnatdorman.",
    rating: 5,
  },
  {
    id: 5,
    name: "Rachel Brown",
    role: "Local Expert",
    textEn: "Delo addressed all our concerns and went above and beyond to ensure we left feeling confident with the service provided. Their attention to detail, honesty, and willingness to go the extra mile made the experience seamless and stress-free. If you're looking for a diesel mechanic that truly cares about its customers, Delo is your best bet! They've earned our trust and future business!",
    textUz: "Delo bizning barcha tashvishlarimizga javob berdi va biz taqdim etilgan xizmatdan ishonchli bo'lib ketishimizni ta'minlash uchun ancha yuqoriga ko'tarildi. Ularning tafsilotlarga e'tibori, halolligi va qo'shimcha harakat qilishga tayyorligi tajribani silliq va stresssiz qildi. Agar siz mijozlariga haqiqatan ham g'amxo'rlik qiladigan dizel mexanigini qidirayotgan bo'lsangiz, Delo sizning eng yaxshi tanlovingiz! Ular bizning ishonchimizni va kelajakdagi biznesimizni qozonishdi!",
    rating: 5,
  },
  {
    id: 6,
    name: "Sasanka Rajapaksa",
    role: "Local Expert",
    textEn: "Came to fix my box truck with def issue. Professional mechanics go through all the issue and fixed it with reasonable price. Nice people.",
    textUz: "DEF muammosi bilan yashirin yuk mashinamni tuzatish uchun keldim. Professional mexaniklar barcha muammolarni ko'rib chiqishdi va maqul narxda tuzatdilar. Yaxshi odamlar.",
    rating: 5,
  },
  {
    id: 7,
    name: "Akmammet Allakgayev",
    role: "Local Expert",
    textEn: "My trucks get professional care at this location. Ahmet is knowledgeable mechanic. Thanks",
    textUz: "Mening yuk mashinalarim bu joyda professional parvarish olishadi. Ahmet bilimdon mexanik. Rahmat",
    rating: 5,
  },
  {
    id: 8,
    name: "Yosef",
    role: "Truck Driver",
    textEn: "Awesome service, got inspection brakes, tires, and fender fixed, they were fast and efficient, ahmet and Murat thanks.",
    textUz: "Ajoyib xizmat, tekshiruv tormozlari, shinalar va qanot tuzatildi, ular tez va samarali edilar, Ahmet va Muratga rahmat.",
    rating: 5,
  },
  {
    id: 9,
    name: "A. K.",
    role: "Local Expert",
    textEn: "Very professional techs, affordable prices, quick service",
    textUz: "Juda professional texniklar, arzon narxlar, tez xizmat",
    rating: 5,
  },
  {
    id: 10,
    name: "kenan arslan",
    role: "Local Expert",
    textEn: "Wonderful service reasonable price. I really thank you Mr Ahmet Its was really fast",
    textUz: "Ajoyib xizmat, maqul narx. Men haqiqatan ham rahmat aytaman, janob Ahmet, bu juda tez edi",
    rating: 5,
  },
  {
    id: 11,
    name: "Hi Nobody",
    role: "Local Expert",
    textEn: "This is a really clean and well organized shop the owner is knowledgeable and very easy to deal with so much respect for this place and its owner I would recommend it to anyone",
    textUz: "Bu haqiqatan ham toza va yaxshi tashkil etilgan servis, xo'jayin bilimdon va u bilan shug'ullanish juda oson, bu joy va uning xo'jayiniga katta hurmat. Men buni hamma kishiga tavsiya qilaman",
    rating: 5,
  },
  {
    id: 12,
    name: "trey jackson",
    role: "Truck Driver",
    textEn: "They best business in Dayton great people to work with it's all love thank you to you guys",
    textUz: "Ular Dayton'dagi eng yaxshi biznes, ular bilan ishlash ajoyib odamlar, bu barcha sevgi, sizlarga rahmat, do'stlar",
    rating: 5,
  },
  {
    id: 13,
    name: "Goku Cougar",
    role: "Truck Driver",
    textEn: "Nice, honest people. Perfect, quick and quality service. Thank you Gentlemen.",
    textUz: "Yaxshi, halol odamlar. Mukammal, tez va sifatli xizmat. Rahmat, janoblar.",
    rating: 5,
  },
  {
    id: 14,
    name: "Lance",
    role: "Local Expert",
    textEn: "Good people's, good prices, very helpful and reliable. Will be back soon to finish up others repairs on my international.",
    textUz: "Yaxshi odamlar, yaxshi narxlar, juda yordamchi va ishonchli. Tez orada xalqaro yuk mashinamda boshqa ta'mirlashlarni yakunlash uchun qaytaman.",
    rating: 5,
  },
  {
    id: 15,
    name: "Oleksandr Kuzemko",
    role: "Local Expert",
    textEn: "Thank you, guys from the CIS did everything quickly and the price is very good! Thank you",
    textUz: "Rahmat, MDHdan kelgan yigitlar hamma narsani tezda qildilar va narx juda yaxshi! Rahmat",
    rating: 5,
  },
  {
    id: 16,
    name: "Azamat Yuldashev",
    role: "Local Expert",
    textEn: "I had an outstanding experience at this truck shop. From the moment I arrived, the team was professional, efficient, and truly focused on getting me back on the road as quickly as possible. A special thank you to Ahmed — his knowledge, honesty, and dedication made all the difference. He took the time to explain everything clearly, treated my truck with great care, and ensured the job was done right. It's rare to find service this reliable and consistent. I highly recommend this shop to anyone looking for quality work and exceptional customer service. I'll definitely be coming back whenever I need anything in the future.",
    textUz: "Men bu yuk mashinasi servisida ajoyib tajriba oshirdim. Men kelgan paytdan boshlab, jamoa professional, samarali va meni iloji boricha tezroq yo'lda qaytarishga e'tibor qaratdi. Ahmedga alohida minnatdorchilik - uning bilimi, halolligi va sadoqati hamma narsani o'zgartirdi. U hamma narsani aniq tushuntirish uchun vaqt ajratdi, yuk mashinamga katta ehtiyotkorlik bilan munosabatda bo'ldi va ish to'g'ri bajarilishini ta'minladi. Bunday ishonchli va barqaror xizmatni topish kamdan-kam uchraydi. Men sifatli ish va ajoyib mijozlarga xizmat ko'rsatishni qidirayotgan har kimga bu servisni yuqori darajada tavsiya qilaman. Men kelajakda biror narsa kerak bo'lganda albatta qaytaman.",
    rating: 5,
  },
  {
    id: 17,
    name: "Ozodbek Abdurahimov",
    role: "Truck Driver",
    textEn: "Excellent Service and Professional Work! I had a brake issue with my truck and brought it to this shop. They did an amazing job — quick, professional, and very thorough. The mechanics really know what they're doing, and they explained everything clearly before getting started. My truck feels great now, and I'm very proud and thankful for their quality work and honesty. It's rare to find a shop that cares this much about doing things right. Highly recommend this team to any driver who wants reliable service and real expertise! Great shop ever",
    textUz: "Ajoyib Xizmat va Professional Ish! Mening yuk mashinamda tormoz muammosi bor edi va men uni bu servisga olib keldim. Ular ajoyib ish qildilar — tez, professional va juda puxta. Mexaniklar haqiqatan ham nima qilayotganlarini bilishadi va ular boshlamasdan oldin hamma narsani aniq tushuntirishdi. Endi mening yuk mashinam ajoyib his qilmoqda va men ularning sifatli ishi va halolligi uchun juda faxrlanaman va minnatdorman. Ishlarni to'g'ri bajarishga shunchalik g'amxo'rlik qiladigan servis topish kamdan-kam uchraydi. Ishonchli xizmat va haqiqiy mutaxassislikni xohlaydigan har qanday haydovchiga bu jamoani yuqori darajada tavsiya qilaman! Eng zo'r servis",
    rating: 5,
  },
  {
    id: 18,
    name: "Ahmet Faruk",
    role: "Commercial Driver",
    textEn: "They quickly diagnosed and fixed an electronic issue on my semi truck. The team was very knowledgeable, helpful, and professional. They explained everything clearly and took great care of my truck from start to finish. I truly appreciate their honest and high-quality service. I highly recommend this shop excellent people and excellent workmanship.",
    textUz: "Ular mening yarim yuk mashinamdagi elektron muammoni tezda tashxislashdi va tuzatdilar. Jamoa juda bilimdon, yordamchi va professional edi. Ular hamma narsani aniq tushuntirishdi va boshlang'ichdan oxirigacha yuk mashinamga katta ehtiyotkorlik bilan munosabatda bo'lishdi. Men ularning halol va yuqori sifatli xizmatlarini chin yurakdan qadrlayman. Men bu servisni ajoyib odamlar va ajoyib ish mahorati bilan yuqori darajada tavsiya qilaman.",
    rating: 5,
  },
]

export function Testimonials() {
  const { language } = useLanguage()
  const [currentStartIndex, setCurrentStartIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)

  useEffect(() => {
    // Load testimonials from localStorage
    const saved = localStorage.getItem("adminTestimonials")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) {
          setTestimonials(parsed)
        }
      } catch (e) {
        console.error("Error loading testimonials:", e)
      }
    }

    // Listen for updates
    const handleUpdate = () => {
      const saved = localStorage.getItem("adminTestimonials")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.length > 0) {
            setTestimonials(parsed)
          }
        } catch (e) {
          console.error("Error loading testimonials:", e)
        }
      }
    }

    window.addEventListener("testimonialsUpdated", handleUpdate)
    return () => window.removeEventListener("testimonialsUpdated", handleUpdate)
  }, [])

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
              {getTranslation(language, "ourCustomers")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
            {getTranslation(language, "whatOurCustomersSay")}
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            {getTranslation(language, "testimonialsDescription")}
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
            const fullText = language === "uz" ? testimonial.textUz : testimonial.textEn
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
                      {isExpanded 
                        ? (language === "uz" ? "Qisqartirish" : "Show Less")
                        : (language === "uz" ? "To'liq o'qish" : "Read More")
                      }
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

