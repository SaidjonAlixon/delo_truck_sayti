"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit, LogOut, Settings } from "lucide-react"

interface Service {
  id: string
  titleKey: string
  descKey: string
  title?: string | null
  description?: string | null
  price: string | null
  priceType: "starting" | "call" | "fixed"
  serviceId: string
  image: string
  discountPercent?: number | null
  saleStartDate?: string | null
  saleEndDate?: string | null
}

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  rating: number
}

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("services")

  useEffect(() => {
    // Check authentication
    const auth = sessionStorage.getItem("adminAuthenticated")
    const loginTime = sessionStorage.getItem("adminLoginTime")
    
    if (!auth || !loginTime) {
      router.push("/admin/login")
      return
    }

    // Check if session expired (24 hours)
    const timeDiff = Date.now() - parseInt(loginTime)
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    if (hoursDiff > 24) {
      sessionStorage.removeItem("adminAuthenticated")
      sessionStorage.removeItem("adminLoginTime")
      router.push("/admin/login")
      return
    }

    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated")
    sessionStorage.removeItem("adminLoginTime")
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Sayt ma'lumotlarini boshqarish</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Xizmatlar</TabsTrigger>
            <TabsTrigger value="testimonials">Izohlar</TabsTrigger>
            <TabsTrigger value="content">Kontent</TabsTrigger>
            <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services')
      const result = await response.json()
      if (result.success) {
        // Transform database format to component format
        const transformed = result.data.map((s: any) => ({
          id: s.id.toString(),
          titleKey: s.title_key,
          descKey: s.desc_key,
          title: s.title,
          description: s.description,
          price: s.price,
          priceType: s.price_type,
          serviceId: s.service_id,
          image: s.image,
          discountPercent: s.discount_percent,
          saleStartDate: s.sale_start_date,
          saleEndDate: s.sale_end_date,
        }))
        setServices(transformed)
      } else {
        console.error('Failed to load services')
      }
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const saveServices = async (newServices: Service[]) => {
    try {
      // Save each service to database
      for (const service of newServices) {
        const exists = services.find(s => s.id === service.id)
        if (exists) {
          // Update existing
          await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: parseInt(service.id),
              service_id: service.serviceId,
              title_key: service.titleKey,
              desc_key: service.descKey,
              price: service.price,
              price_type: service.priceType,
              image: service.image,
            }),
          })
        } else {
          // Create new
          await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: service.serviceId,
              title_key: service.titleKey,
              desc_key: service.descKey,
              price: service.price,
              price_type: service.priceType,
              image: service.image,
            }),
          })
        }
      }
      setServices(newServices)
      window.dispatchEvent(new Event("servicesUpdated"))
    } catch (error) {
      console.error('Error saving services:', error)
      alert('Error saving services. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu xizmatni o'chirishni xohlaysizmi?")) {
      try {
        const response = await fetch(`/api/services?id=${id}`, {
          method: 'DELETE',
        })
        const result = await response.json()
        if (result.success) {
          await loadServices()
          window.dispatchEvent(new Event("servicesUpdated"))
        } else {
          alert('Error deleting service: ' + (result.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting service:', error)
        alert('Error deleting service')
      }
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Xizmatlar Boshqaruvi</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yangi Xizmat
        </Button>
      </div>

      {(isAdding || editingId) && (
        <ServiceForm
          initialData={editingId ? services.find(s => s.id === editingId) : null}
          onSave={async (service: Service) => {
            try {
              if (editingId) {
                // Update existing service
                const response = await fetch('/api/services', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: parseInt(editingId),
                    service_id: service.serviceId,
                    title_key: service.titleKey,
                    desc_key: service.descKey,
                    title: service.title || null,
                    description: service.description || null,
                    price: service.price,
                    price_type: service.priceType,
                    image: service.image,
                    discount_percent: service.discountPercent || null,
                    sale_start_date: service.saleStartDate ? new Date(service.saleStartDate).toISOString() : null,
                    sale_end_date: service.saleEndDate ? new Date(service.saleEndDate).toISOString() : null,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  await loadServices()
                  setEditingId(null)
                  // Dispatch event to update frontend
                  window.dispatchEvent(new Event("servicesUpdated"))
                  // Also trigger storage event for cross-tab updates
                  localStorage.setItem('servicesLastUpdated', Date.now().toString())
                  alert('Service saved successfully! Changes will appear on the website.')
                } else {
                  alert('Error saving service: ' + (result.message || 'Unknown error'))
                }
              } else {
                // Create new service
                const response = await fetch('/api/services', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    service_id: service.serviceId,
                    title_key: service.titleKey,
                    desc_key: service.descKey,
                    title: service.title || null,
                    description: service.description || null,
                    price: service.price,
                    price_type: service.priceType,
                    image: service.image,
                    discount_percent: service.discountPercent || null,
                    sale_start_date: service.saleStartDate ? new Date(service.saleStartDate).toISOString() : null,
                    sale_end_date: service.saleEndDate ? new Date(service.saleEndDate).toISOString() : null,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  await loadServices()
                  setIsAdding(false)
                  // Dispatch event to update frontend
                  window.dispatchEvent(new Event("servicesUpdated"))
                  // Also trigger storage event for cross-tab updates
                  localStorage.setItem('servicesLastUpdated', Date.now().toString())
                  alert('Service saved successfully! Changes will appear on the website.')
                } else {
                  alert('Error saving service: ' + (result.message || 'Unknown error'))
                }
              }
            } catch (error) {
              console.error('Error saving service:', error)
              alert('Error saving service')
            }
          }}
          onCancel={() => {
            setIsAdding(false)
            setEditingId(null)
          }}
        />
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">{service.titleKey}</h3>
              <p className="text-sm text-muted-foreground">{service.serviceId}</p>
              {service.price && <p className="text-sm text-muted-foreground">{service.price}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingId(service.id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ServiceForm({ onSave, onCancel, initialData }: any) {
  const [formData, setFormData] = useState({
    titleKey: initialData?.titleKey || "",
    descKey: initialData?.descKey || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    priceType: initialData?.priceType || "starting",
    serviceId: initialData?.serviceId || "",
    image: initialData?.image || "",
    discountPercent: initialData?.discountPercent || null,
    saleStartDate: initialData?.saleStartDate ? new Date(initialData.saleStartDate).toISOString().slice(0, 16) : "",
    saleEndDate: initialData?.saleEndDate ? new Date(initialData.saleEndDate).toISOString().slice(0, 16) : "",
  })

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{initialData ? "Xizmatni Tahrirlash" : "Yangi Xizmat"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Xizmat nomi (to'g'ridan-to'g'ri matn) *</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Computer Diagnostics"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Bu matn saytda ko'rinadi</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Xizmat izohi (to'g'ridan-to'g'ri matn) *</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground min-h-[100px]"
            placeholder="Professional computer diagnostics for your vehicle"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Bu matn saytda ko'rinadi</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Service ID</label>
          <input
            type="text"
            value={formData.serviceId}
            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="diagnostics"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Narx</label>
          <input
            type="text"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="$150 (bo'sh qoldirish mumkin)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Narx turi</label>
          <select
            value={formData.priceType}
            onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
          >
            <option value="starting">Starting At</option>
            <option value="call">Call For Price</option>
            <option value="fixed">Fixed Price</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Rasm manzili</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="https://example.com/image.jpg yoki /services/diagnostics.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            To'liq rasm URL'i (https://example.com/image.jpg, .png, .webp) yoki mahalliy fayl yo'li (/services/image.jpg)
          </p>
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Eslatma: Blog post URL'i emas, to'g'ridan-to'g'ri rasm faylining URL'i kerak! 
            Rasmga o'ng klik qilib "Copy image address" yoki "Copy image URL" tanlang.
          </p>
          {formData.image && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Rasm ko'rinishi:</p>
              <div className="w-full h-48 border rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget
                    img.style.display = 'none'
                    const parent = img.parentElement
                    if (parent && !parent.querySelector('.error-message')) {
                      const errorDiv = document.createElement('div')
                      errorDiv.className = 'error-message text-xs text-red-500 p-2 text-center'
                      errorDiv.innerHTML = '❌ Rasm yuklanmadi!<br/>URL\'ni tekshiring.<br/>Rasm URL\'i to\'g\'ri bo\'lishi kerak (.jpg, .png, .webp)'
                      parent.appendChild(errorDiv)
                    }
                  }}
                  onLoad={(e) => {
                    const errorMsg = e.currentTarget.parentElement?.querySelector('.error-message')
                    if (errorMsg) {
                      errorMsg.remove()
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Aksiya sozlamalari */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold mb-4">Aksiya sozlamalari (ixtiyoriy)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chegirma foizi (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent || ""}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Masalan: 20"
              />
              <p className="text-xs text-muted-foreground mt-1">Aksiya chegirma foizi (0-100%)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Aksiya boshlanish vaqti</label>
              <input
                type="datetime-local"
                value={formData.saleStartDate || ""}
                onChange={(e) => setFormData({ ...formData, saleStartDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Aksiya qachon boshlanishi</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Aksiya tugash vaqti</label>
              <input
                type="datetime-local"
                value={formData.saleEndDate || ""}
                onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Aksiya qachon tugashi (bu vaqtgacha countdown timer ishlaydi)</p>
            </div>
            {formData.discountPercent && formData.price && formData.priceType !== "call" && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Chegirma narx:</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {(() => {
                    const originalPrice = parseFloat(formData.price.replace(/[^0-9.]/g, ''))
                    const discount = originalPrice * (formData.discountPercent / 100)
                    const finalPrice = originalPrice - discount
                    return `$${finalPrice.toFixed(2)}` + (formData.price.includes('$') ? '' : '')
                  })()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Asl narx: {formData.price} - {formData.discountPercent}% = Chegirma narx
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave(formData)}>Saqlash</Button>
          <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        </div>
      </div>
    </Card>
  )
}

function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const result = await response.json()
      if (result.success) {
        setTestimonials(result.data)
      } else {
        console.error('Failed to load testimonials')
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    }
  }

  const saveTestimonials = async (newTestimonials: Testimonial[]) => {
    // This will be handled by individual save operations
    setTestimonials(newTestimonials)
    window.dispatchEvent(new Event("testimonialsUpdated"))
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bu izohni o'chirishni xohlaysizmi?")) {
      try {
        const response = await fetch(`/api/testimonials?id=${id}`, {
          method: 'DELETE',
        })
        const result = await response.json()
        if (result.success) {
          loadTestimonials()
        } else {
          alert('Error deleting testimonial')
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error)
        alert('Error deleting testimonial')
      }
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Izohlar Boshqaruvi</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yangi Izoh
        </Button>
      </div>

      {(isAdding || editingId) && (
        <TestimonialForm
          initialData={editingId ? testimonials.find(t => t.id === editingId) : null}
          onSave={async (testimonial: any) => {
            try {
              if (editingId) {
                // Update existing testimonial
                const response = await fetch('/api/testimonials', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: editingId,
                    name: testimonial.name,
                    role: testimonial.role,
                    text: testimonial.textEn || testimonial.text,
                    rating: testimonial.rating,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  loadTestimonials()
                  setEditingId(null)
                }
              } else {
                // Create new testimonial
                const response = await fetch('/api/testimonials', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: testimonial.name,
                    role: testimonial.role,
                    text: testimonial.textEn || testimonial.text,
                    rating: testimonial.rating,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  loadTestimonials()
                  setIsAdding(false)
                }
              }
            } catch (error) {
              console.error('Error saving testimonial:', error)
              alert('Error saving testimonial')
            }
          }}
          onCancel={() => {
            setIsAdding(false)
            setEditingId(null)
          }}
        />
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {testimonial.text || testimonial.textEn}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingId(testimonial.id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TestimonialForm({ onSave, onCancel, initialData }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    text: initialData?.text || initialData?.textEn || "",
    rating: initialData?.rating || 5,
  })

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{initialData ? "Izohni Tahrirlash" : "Yangi Izoh"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ism *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Ism kiriting"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Lavozim *</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Lavozim kiriting"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Izoh (Inglizcha) *</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            rows={4}
            placeholder="Enter testimonial text in English"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Reyting (1-5) *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
          >
            <option value={1}>1 yulduz</option>
            <option value={2}>2 yulduz</option>
            <option value={3}>3 yulduz</option>
            <option value={4}>4 yulduz</option>
            <option value={5}>5 yulduz</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(formData)}>Saqlash</Button>
          <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        </div>
      </div>
    </Card>
  )
}

function ContentManagement() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Kontent Boshqaruvi</h2>
      <p className="text-muted-foreground">Bu bo'limda sahifa kontentlarini boshqarish funksiyalari bo'ladi.</p>
    </Card>
  )
}

function SettingsManagement() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sozlamalar</h2>
      <p className="text-muted-foreground">Bu bo'limda umumiy sozlamalarni boshqarish funksiyalari bo'ladi.</p>
    </Card>
  )
}

