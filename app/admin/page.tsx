"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit, LogOut } from "lucide-react"

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
          <p className="text-muted-foreground">Loading...</p>
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
            <p className="text-muted-foreground">Manage website content</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="services2">Services 2</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="timezone">Time</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="services2">
            <ServicesDetailsManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="faq">
            <FAQManagement />
          </TabsContent>

          <TabsContent value="timezone">
            <TimezoneManagement />
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
    if (confirm("Are you sure you want to delete this service?")) {
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
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Service
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
      <h3 className="text-xl font-bold mb-4">{initialData ? "Edit Service" : "New Service"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Service Name (direct text) *</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Computer Diagnostics"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">This text will appear on the website</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Service Description (direct text) *</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground min-h-[100px]"
            placeholder="Professional computer diagnostics for your vehicle"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">This text will appear on the website</p>
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
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="text"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="$150 (can be left empty)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price Type</label>
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
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="https://example.com/image.jpg or /services/diagnostics.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Full image URL (https://example.com/image.jpg, .png, .webp) or local file path (/services/image.jpg)
          </p>
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Note: Not a blog post URL, a direct image file URL is needed! 
            Right-click on the image and select "Copy image address" or "Copy image URL".
          </p>
          {formData.image && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Image Preview:</p>
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
                      errorDiv.innerHTML = '❌ Image failed to load!<br/>Please check the URL.<br/>Image URL must be valid (.jpg, .png, .webp)'
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
        
        {/* Promotion settings */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold mb-4">Promotion Settings (optional)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Discount Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent || ""}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                placeholder="e.g., 20"
              />
              <p className="text-xs text-muted-foreground mt-1">Promotion discount percentage (0-100%)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Promotion Start Time</label>
              <input
                type="datetime-local"
                value={formData.saleStartDate || ""}
                onChange={(e) => setFormData({ ...formData, saleStartDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">When the promotion starts</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Promotion End Time</label>
              <input
                type="datetime-local"
                value={formData.saleEndDate || ""}
                onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">When the promotion ends (countdown timer will run until this time)</p>
            </div>
            {formData.discountPercent && formData.price && formData.priceType !== "call" && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Discounted Price:</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {(() => {
                    const originalPrice = parseFloat(formData.price.replace(/[^0-9.]/g, ''))
                    const discount = originalPrice * (formData.discountPercent / 100)
                    const finalPrice = originalPrice - discount
                    return `$${finalPrice.toFixed(2)}` + (formData.price.includes('$') ? '' : '')
                  })()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Original Price: {formData.price} - {formData.discountPercent}% = Discounted Price
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave(formData)}>Save</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
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
      const response = await fetch('/api/testimonials', {
        cache: 'no-store',
      })
      const result = await response.json()
      if (result.success) {
        setTestimonials(result.data || [])
        console.log('Loaded testimonials:', result.data?.length || 0)
      } else {
        console.error('Failed to load testimonials:', result.message)
        alert('Error loading testimonials: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
      alert('Error loading testimonials. Please refresh the page.')
    }
  }

  const saveTestimonials = async (newTestimonials: Testimonial[]) => {
    // This will be handled by individual save operations
    setTestimonials(newTestimonials)
    window.dispatchEvent(new Event("testimonialsUpdated"))
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        const response = await fetch(`/api/testimonials?id=${id}`, {
          method: 'DELETE',
        })
        const result = await response.json()
        if (result.success) {
          loadTestimonials()
          // Dispatch event to update frontend
          window.dispatchEvent(new Event("testimonialsUpdated"))
          alert('Testimonial deleted successfully! Please refresh the page (F5)')
        } else {
          alert('Error: ' + (result.message || 'Unknown error'))
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
        <div>
          <h2 className="text-2xl font-bold">Testimonials Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total testimonials: {testimonials.length}
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Testimonial
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
                    text: testimonial.text,
                    rating: testimonial.rating,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  loadTestimonials()
                  setEditingId(null)
                  // Dispatch event to update frontend
                  window.dispatchEvent(new Event("testimonialsUpdated"))
                  alert('Testimonial updated successfully! Please refresh the page (F5)')
                } else {
                  alert('Error: ' + (result.message || 'Unknown error'))
                }
              } else {
                // Create new testimonial
                const response = await fetch('/api/testimonials', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: testimonial.name,
                    role: testimonial.role,
                    text: testimonial.text,
                    rating: testimonial.rating,
                  }),
                })
                const result = await response.json()
                if (result.success) {
                  loadTestimonials()
                  setIsAdding(false)
                  // Dispatch event to update frontend
                  window.dispatchEvent(new Event("testimonialsUpdated"))
                  alert('New testimonial added successfully! Please refresh the page (F5)')
                } else {
                  alert('Error: ' + (result.message || 'Unknown error'))
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

      {testimonials.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No testimonials yet</p>
          <p className="text-sm">Click the "New Testimonial" button to add one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-5 border-2 hover:border-primary/50 transition-colors">
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < (testimonial.rating || 5)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                      {testimonial.text || "No testimonial text"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(testimonial.id)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
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
      <h3 className="text-xl font-bold mb-4">{initialData ? "Edit Testimonial" : "New Testimonial"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Role/Position *</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
            placeholder="Enter role/position"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Testimonial Text (English) *</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground min-h-[100px]"
            rows={5}
            placeholder="Enter testimonial text in English"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Rating (1-5) *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
          >
            <option value={1}>1 star</option>
            <option value={2}>2 stars</option>
            <option value={3}>3 stars</option>
            <option value={4}>4 stars</option>
            <option value={5}>5 stars</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onSave(formData)} className="bg-primary hover:bg-primary/90">
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}

interface ContentItem {
  id: number
  page: string
  content_key: string
  content_value: string
}

function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedPage, setSelectedPage] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const pages = ['all', 'hero', 'services', 'about', 'contact', 'testimonials', 'footer', 'map', 'general']

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      setLoading(true)
      const url = selectedPage === 'all' ? '/api/content' : `/api/content?page=${selectedPage}`
      const response = await fetch(url)
      const result = await response.json()
      if (result.success) {
        setContents(result.data)
      } else {
        console.error('Failed to load contents')
      }
    } catch (error) {
      console.error('Error loading contents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContents()
  }, [selectedPage])

  const handleSave = async (id: number, newValue: string) => {
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          content_value: newValue,
        }),
      })
      const result = await response.json()
      if (result.success) {
        await loadContents()
        setEditingId(null)
        // Dispatch event to update frontend
        window.dispatchEvent(new Event('contentUpdated'))
        alert('Content updated successfully! Please refresh the page (F5)')
      } else {
        alert('Error: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content')
    }
  }

  const handleDelete = async (id: number, contentKey: string) => {
    if (!confirm(`Are you sure you want to delete the "${contentKey}" content?`)) {
      return
    }
    try {
      const response = await fetch(`/api/content?id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        await loadContents()
        // Dispatch event to update frontend
        window.dispatchEvent(new Event('contentUpdated'))
        alert('Content deleted successfully! Please refresh the page (F5)')
      } else {
        alert('Error: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Error deleting content')
    }
  }

  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.page]) {
      acc[content.page] = []
    }
    acc[content.page].push(content)
    return acc
  }, {} as Record<string, ContentItem[]>)

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Content Management</h2>
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <div className="flex gap-2">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background text-foreground"
          >
            {pages.map(page => (
              <option key={page} value={page}>
                {page === 'all' ? 'All Pages' : page.charAt(0).toUpperCase() + page.slice(1)}
              </option>
            ))}
          </select>
          <Button onClick={loadContents} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedContents).map(([page, pageContents]) => (
          <div key={page} className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {page === 'all' ? 'All' : page.charAt(0).toUpperCase() + page.slice(1)} Page ({pageContents.length} items)
            </h3>
            <div className="space-y-3">
              {pageContents.map((content) => (
                <div key={content.id} className="flex gap-3 items-start p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">
                      {content.content_key}
                    </label>
                    {editingId === content.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={content.content_value}
                          onChange={(e) => {
                            setContents(prev =>
                              prev.map(c => c.id === content.id ? { ...c, content_value: e.target.value } : c)
                            )
                          }}
                          className="w-full px-3 py-2 border rounded-lg bg-background text-foreground min-h-[80px]"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(content.id, content.content_value)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null)
                              loadContents() // Reset to original
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                          {content.content_value || '(empty)'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(content.id)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(content.id, content.content_key)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {contents.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No content found. Call /api/init-db endpoint to initialize the database.
          </p>
        )}
      </div>
    </Card>
  )
}

function ServicesDetailsManagement() {
  const [services, setServices] = useState<any[]>([])
  const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({})
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
    loadServiceDetails()
    
    const handleUpdate = () => {
      loadServiceDetails()
    }
    window.addEventListener("serviceDetailsUpdated", handleUpdate)
    
    return () => {
      window.removeEventListener("serviceDetailsUpdated", handleUpdate)
    }
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services')
      const result = await response.json()
      if (result.success) {
        setServices(result.data || [])
      }
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const loadServiceDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/service-details')
      const result = await response.json()
      if (result.success) {
        const detailsMap: Record<string, any> = {}
        result.data.forEach((detail: any) => {
          detailsMap[detail.service_id] = {
            id: detail.id,
            service_id: detail.service_id,
            features: Array.isArray(detail.features) ? detail.features : [],
            benefits: Array.isArray(detail.benefits) ? detail.benefits : [],
            process: Array.isArray(detail.process) ? detail.process : [],
            estimated_time: detail.estimated_time || '',
            warranty: detail.warranty || '',
          }
        })
        setServiceDetails(detailsMap)
      }
    } catch (error) {
      console.error('Error loading service details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (serviceId: string, detailData: any) => {
    try {
      const existingDetail = serviceDetails[serviceId]
      const method = existingDetail?.id ? 'PUT' : 'POST'
      const url = '/api/service-details'
      
      const requestBody = existingDetail?.id
        ? { id: existingDetail.id, ...detailData }
        : detailData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      if (result.success) {
        await loadServiceDetails()
        setEditingServiceId(null)
        window.dispatchEvent(new Event("serviceDetailsUpdated"))
        localStorage.setItem('serviceDetailsLastUpdated', Date.now().toString())
        alert('Service details saved successfully! Changes will appear on the website.')
      } else {
        alert('Error: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving service details:', error)
      alert('Error saving service details')
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Service Details Management</h2>
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Service Details Management</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage detailed information (Features, Benefits, Process, Estimated Time, Warranty) for each service
        </p>
      </div>

      <div className="space-y-6">
        {services.map((service) => {
          const detail = serviceDetails[service.service_id] || {
            service_id: service.service_id,
            features: [],
            benefits: [],
            process: [],
            estimated_time: '',
            warranty: '',
          }
          const isEditing = editingServiceId === service.service_id

          return (
            <Card key={service.id} className="p-6 border-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{service.title || service.title_key}</h3>
                  <p className="text-sm text-muted-foreground">Service ID: {service.service_id}</p>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setEditingServiceId(isEditing ? null : service.service_id)}
                >
                  {isEditing ? "Cancel" : <><Edit className="w-4 h-4 mr-2" />Edit Details</>}
                </Button>
              </div>

              {isEditing ? (
                <ServiceDetailsForm
                  serviceId={service.service_id}
                  initialData={detail}
                  onSave={(data) => handleSave(service.service_id, data)}
                  onCancel={() => setEditingServiceId(null)}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {detail.features.length > 0 ? (
                        detail.features.map((feature: string, idx: number) => (
                          <li key={idx}>{feature}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground/50">No features added</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {detail.benefits.length > 0 ? (
                        detail.benefits.map((benefit: string, idx: number) => (
                          <li key={idx}>{benefit}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground/50">No benefits added</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Our Process:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      {detail.process.length > 0 ? (
                        detail.process.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground/50">No process steps added</li>
                      )}
                    </ol>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1 text-foreground">Estimated Time:</h4>
                      <p className="text-muted-foreground">{detail.estimated_time || 'Not set'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-foreground">Warranty:</h4>
                      <p className="text-muted-foreground">{detail.warranty || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </Card>
  )
}

function ServiceDetailsForm({ 
  serviceId, 
  initialData, 
  onSave, 
  onCancel 
}: { 
  serviceId: string
  initialData: any
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    service_id: serviceId,
    features: initialData.features || [],
    benefits: initialData.benefits || [],
    process: initialData.process || [],
    estimated_time: initialData.estimated_time || '',
    warranty: initialData.warranty || '',
  })

  useEffect(() => {
    setFormData({
      service_id: serviceId,
      features: initialData.features || [],
      benefits: initialData.benefits || [],
      process: initialData.process || [],
      estimated_time: initialData.estimated_time || '',
      warranty: initialData.warranty || '',
    })
  }, [initialData, serviceId])

  const addItem = (field: 'features' | 'benefits' | 'process') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const updateItem = (field: 'features' | 'benefits' | 'process', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray
    })
  }

  const removeItem = (field: 'features' | 'benefits' | 'process', index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index)
    setFormData({
      ...formData,
      [field]: newArray
    })
  }

  return (
    <div className="space-y-6">
      {/* Features */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-foreground">Key Features</label>
          <Button size="sm" variant="outline" onClick={() => addItem('features')}>
            <Plus className="w-4 h-4 mr-1" />Add Feature
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateItem('features', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Enter feature"
              />
              <Button size="sm" variant="destructive" onClick={() => removeItem('features', index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {formData.features.length === 0 && (
            <p className="text-sm text-muted-foreground">No features added. Click "Add Feature" to add one.</p>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-foreground">Benefits</label>
          <Button size="sm" variant="outline" onClick={() => addItem('benefits')}>
            <Plus className="w-4 h-4 mr-1" />Add Benefit
          </Button>
        </div>
        <div className="space-y-2">
          {formData.benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateItem('benefits', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Enter benefit"
              />
              <Button size="sm" variant="destructive" onClick={() => removeItem('benefits', index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {formData.benefits.length === 0 && (
            <p className="text-sm text-muted-foreground">No benefits added. Click "Add Benefit" to add one.</p>
          )}
        </div>
      </div>

      {/* Process */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-foreground">Our Process (Steps)</label>
          <Button size="sm" variant="outline" onClick={() => addItem('process')}>
            <Plus className="w-4 h-4 mr-1" />Add Step
          </Button>
        </div>
        <div className="space-y-2">
          {formData.process.map((step: string, index: number) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {index + 1}
              </div>
              <input
                type="text"
                value={step}
                onChange={(e) => updateItem('process', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Enter process step"
              />
              <Button size="sm" variant="destructive" onClick={() => removeItem('process', index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {formData.process.length === 0 && (
            <p className="text-sm text-muted-foreground">No process steps added. Click "Add Step" to add one.</p>
          )}
        </div>
      </div>

      {/* Estimated Time & Warranty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Estimated Time</label>
          <input
            type="text"
            value={formData.estimated_time}
            onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            placeholder="e.g., 30-60 minutes"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Warranty</label>
          <input
            type="text"
            value={formData.warranty}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            placeholder="e.g., 90 days on diagnostic services"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

function SettingsManagement() {
  const [snowEnabled, setSnowEnabled] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings?key=snow_enabled')
      const result = await response.json()
      if (result.success && result.data) {
        setSnowEnabled(result.data.setting_value === 'true')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'snow_enabled',
          value: snowEnabled.toString(),
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Dispatch event to update frontend
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: { snowEnabled } }))
        // Also set localStorage for cross-tab updates
        localStorage.setItem('settingsUpdated', JSON.stringify({ snowEnabled, timestamp: Date.now() }))
        alert('Settings saved successfully! The website will update automatically.')
      } else {
        alert('Error: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage website settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Snow Effect Setting */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-foreground">Snow Effect</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable the snow animation on the website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={snowEnabled}
                onChange={(e) => setSnowEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {snowEnabled ? '✅ Snow effect enabled' : '❌ Snow effect disabled'}
          </div>
        </div>
      </div>
    </Card>
  )
}

function FAQManagement() {
  const [faqs, setFAQs] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    try {
      const response = await fetch('/api/faq')
      const result = await response.json()
      if (result.success) {
        setFAQs(result.data.sort((a: any, b: any) => a.display_order - b.display_order))
      }
    } catch (error) {
      console.error('Error loading FAQs:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/faq?id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        loadFAQs()
        window.dispatchEvent(new Event('faqUpdated'))
        alert('FAQ deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      alert('Error deleting FAQ')
    }
  }

  const handleSave = async (faqData: { question: string; answer: string; display_order: number }) => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = '/api/faq'
      
      const requestBody = editingId 
        ? { ...faqData, id: editingId }
        : faqData
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      if (result.success) {
        loadFAQs()
        setIsAdding(false)
        setEditingId(null)
        window.dispatchEvent(new Event('faqUpdated'))
        alert(`FAQ ${editingId ? 'updated' : 'added'} successfully!`)
      } else {
        alert('Error: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
      alert('Error saving FAQ')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New FAQ
          </Button>
        )}
      </div>

      {isAdding && !editingId && (
        <FAQForm
          faq={null}
          onSave={(data) => {
            handleSave(data)
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border rounded-lg p-4">
            {editingId === faq.id ? (
              <FAQForm
                faq={faq}
                onSave={(data) => {
                  handleSave(data)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    <p className="text-xs text-muted-foreground mt-2">Order: {faq.display_order}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(faq.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

function FAQForm({ faq, onSave, onCancel }: { faq: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    display_order: faq?.display_order || 0,
  })

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        display_order: faq.display_order || 0,
      })
    }
  }, [faq])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Question</label>
        <input
          type="text"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
          placeholder="Enter FAQ question"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Answer</label>
        <textarea
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg bg-background text-foreground min-h-[100px]"
          placeholder="Enter FAQ answer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Display Order</label>
        <input
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
          placeholder="0"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onSave(formData)}
          disabled={!formData.question.trim() || !formData.answer.trim()}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function TimezoneManagement() {
  const [timezone, setTimezone] = useState<string>('America/New_York')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York, USA' },
    { value: 'America/Chicago', label: 'Central Time (CT) - Chicago, USA' },
    { value: 'America/Denver', label: 'Mountain Time (MT) - Denver, USA' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles, USA' },
    { value: 'America/Phoenix', label: 'Mountain Standard Time (MST) - Phoenix, USA' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT) - Anchorage, USA' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST) - Honolulu, USA' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT) - London, UK' },
    { value: 'Europe/Paris', label: 'Central European Time (CET) - Paris, France' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET) - Berlin, Germany' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - Dubai, UAE' },
    { value: 'Asia/Tashkent', label: 'Uzbekistan Time (UZT) - Tashkent, Uzbekistan' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Tokyo, Japan' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST) - Shanghai, China' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - Mumbai, India' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET) - Sydney, Australia' },
    { value: 'America/Mexico_City', label: 'Central Time (CT) - Mexico City, Mexico' },
    { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT) - São Paulo, Brazil' },
    { value: 'America/Toronto', label: 'Eastern Time (ET) - Toronto, Canada' },
    { value: 'America/Vancouver', label: 'Pacific Time (PT) - Vancouver, Canada' },
  ]

  useEffect(() => {
    loadTimezone()
  }, [])

  const loadTimezone = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings?key=timezone')
      const result = await response.json()
      if (result.success && result.data) {
        setTimezone(result.data.setting_value)
      }
    } catch (error) {
      console.error('Error loading timezone:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'timezone',
          value: timezone,
        }),
      })

      const result = await response.json()
      if (result.success) {
        window.dispatchEvent(new CustomEvent('timezoneUpdated', { detail: { timezone } }))
        localStorage.setItem('timezoneUpdated', JSON.stringify({ timezone, timestamp: Date.now() }))
        alert('Timezone setting saved successfully! The website will update automatically.')
      } else {
        alert('Error: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving timezone:', error)
      alert('Error saving timezone setting')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Timezone Settings</h2>
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Timezone Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select the timezone to display on the website
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground min-h-[44px]"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            The selected timezone will be displayed in the clock widget on the footer and services page.
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">Current Time (will be displayed):</h3>
          <TimezonePreview timezone={timezone} />
        </div>
      </div>
    </Card>
  )
}

function TimezonePreview({ timezone }: { timezone: string }) {
  const [currentTime, setCurrentTime] = useState<{
    time: string
    date: string
    timezoneLabel: string
  }>({
    time: '',
    date: '',
    timezoneLabel: '',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      const timeString = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      })

      const dateString = now.toLocaleString('en-US', {
        timeZone: timezone,
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        weekday: 'long',
      })

      const timeZoneName = now.toLocaleString('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      })

      const timezoneLabel = timeZoneName.split(' ').pop() || timezone

      setCurrentTime({
        time: timeString,
        date: dateString,
        timezoneLabel: timezoneLabel,
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [timezone])

  return (
    <div className="space-y-1">
      <p className="text-2xl font-bold text-foreground font-mono">{currentTime.time}</p>
      <p className="text-sm text-muted-foreground">{currentTime.date}</p>
      <p className="text-xs text-muted-foreground">({currentTime.timezoneLabel})</p>
    </div>
  )
}

