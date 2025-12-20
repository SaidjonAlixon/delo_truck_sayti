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
  price: string | null
  priceType: "starting" | "call" | "fixed"
  serviceId: string
  image: string
}

interface Testimonial {
  id: number
  name: string
  role: string
  textEn: string
  textUz: string
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
    // Load services from localStorage or default
    const saved = localStorage.getItem("adminServices")
    if (saved) {
      setServices(JSON.parse(saved))
    } else {
      // Load default services
      const defaultServices: Service[] = [
        {
          id: "1",
          titleKey: "computerDiagnostics",
          descKey: "computerDiagnosticsDesc",
          price: "$150",
          priceType: "starting",
          serviceId: "diagnostics",
          image: "/services/diagnostics.jpg",
        },
        {
          id: "2",
          titleKey: "tireService",
          descKey: "tireServiceDesc",
          price: "$80",
          priceType: "starting",
          serviceId: "tire",
          image: "/services/tire-service.jpg",
        },
        {
          id: "3",
          titleKey: "oilChange",
          descKey: "oilChangeDesc",
          price: "$200",
          priceType: "starting",
          serviceId: "oil",
          image: "/services/oil-change.jpg",
        },
        {
          id: "4",
          titleKey: "suspensionSteering",
          descKey: "suspensionSteeringDesc",
          price: null,
          priceType: "call",
          serviceId: "suspension",
          image: "/services/suspension.jpg",
        },
        {
          id: "5",
          titleKey: "transmissionRepair",
          descKey: "transmissionRepairDesc",
          price: null,
          priceType: "call",
          serviceId: "transmission",
          image: "/services/transmission.jpg",
        },
        {
          id: "6",
          titleKey: "dotCarbInspections",
          descKey: "dotCarbInspectionsDesc",
          price: "$100",
          priceType: "fixed",
          serviceId: "dot",
          image: "/services/dot-inspection.jpg",
        },
      ]
      setServices(defaultServices)
      localStorage.setItem("adminServices", JSON.stringify(defaultServices))
    }
  }, [])

  const saveServices = (newServices: Service[]) => {
    setServices(newServices)
    localStorage.setItem("adminServices", JSON.stringify(newServices))
    // Update components/services.tsx to use this data
    window.dispatchEvent(new Event("servicesUpdated"))
  }

  const handleDelete = (id: string) => {
    if (confirm("Bu xizmatni o'chirishni xohlaysizmi?")) {
      const updated = services.filter((s) => s.id !== id)
      saveServices(updated)
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
          onSave={(service) => {
            if (editingId) {
              const updated = services.map(s => s.id === editingId ? { ...service, id: editingId } : s)
              saveServices(updated)
              setEditingId(null)
            } else {
              const newId = Date.now().toString()
              saveServices([...services, { ...service, id: newId }])
              setIsAdding(false)
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
    price: initialData?.price || "",
    priceType: initialData?.priceType || "starting",
    serviceId: initialData?.serviceId || "",
    image: initialData?.image || "",
  })

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{initialData ? "Xizmatni Tahrirlash" : "Yangi Xizmat"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title Key (tarjima kaliti)</label>
          <input
            type="text"
            value={formData.titleKey}
            onChange={(e) => setFormData({ ...formData, titleKey: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="computerDiagnostics"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description Key (tarjima kaliti)</label>
          <input
            type="text"
            value={formData.descKey}
            onChange={(e) => setFormData({ ...formData, descKey: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="computerDiagnosticsDesc"
          />
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
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="/services/diagnostics.jpg"
          />
        </div>
        <div className="flex gap-2">
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
    const saved = localStorage.getItem("adminTestimonials")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTestimonials(parsed)
      } catch (e) {
        console.error("Error loading testimonials:", e)
      }
    }
  }, [])

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials)
    localStorage.setItem("adminTestimonials", JSON.stringify(newTestimonials))
    window.dispatchEvent(new Event("testimonialsUpdated"))
  }

  const handleDelete = (id: number) => {
    if (confirm("Bu izohni o'chirishni xohlaysizmi?")) {
      const updated = testimonials.filter((t) => t.id !== id)
      saveTestimonials(updated)
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
          onSave={(testimonial: Testimonial) => {
            if (editingId) {
              const updated = testimonials.map(t => t.id === editingId ? { ...testimonial, id: editingId } : t)
              saveTestimonials(updated)
              setEditingId(null)
            } else {
              const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1
              saveTestimonials([...testimonials, { ...testimonial, id: newId }])
              setIsAdding(false)
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
                {testimonial.textUz || testimonial.textEn}
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
    textEn: initialData?.textEn || "",
    textUz: initialData?.textUz || "",
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
            value={formData.textEn}
            onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            rows={4}
            placeholder="Inglizcha izoh kiriting"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Izoh (O'zbekcha) *</label>
          <textarea
            value={formData.textUz}
            onChange={(e) => setFormData({ ...formData, textUz: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            rows={4}
            placeholder="O'zbekcha izoh kiriting"
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

