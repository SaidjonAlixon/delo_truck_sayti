export type Language = "en"

export const translations = {
    // Header
    services: "Services",
    about: "About",
    contact: "Contact",
    callNow: "Call Now",

    // Hero
    professionalTruckServices: "Professional Truck Services",
    heroTitle: "Expert Truck Repair & Maintenance Services",
    heroDescription:
      "Delo Truck Center LLC provides comprehensive truck repair and maintenance services for commercial vehicles. From diagnostics to DOT inspections, we keep your fleet running smoothly.",
    scheduleService: "Schedule Service",
    yearsExperience: "Years Experience",
    trucksServiced: "Trucks Serviced",
    support: "Support",
    callUsAnytime: "Call us anytime",
    // Hero Carousel Slides
    heroSlide1Title: "Expert Truck Repair & Maintenance Services",
    heroSlide1Description:
      "Delo Truck Center LLC provides comprehensive truck repair and maintenance services for commercial vehicles. From diagnostics to DOT inspections, we keep your fleet running smoothly.",
    heroSlide2Title: "Professional Mechanics With Real Experience",
    heroSlide2Description:
      "Our team has serviced over 1000+ trucks with 5+ years of combined experience. We've successfully completed major repairs and maintenance projects for commercial fleets across New York.",
    heroSlide3Title: "24/7 Emergency Truck Service Available",
    heroSlide3Description:
      "When your truck breaks down, every minute counts. Our emergency service team is available around the clock to get you back on the road quickly and safely.",
    contactUsToday: "Contact Us Now",

    // Services
    ourServices: "Our Services",
    comprehensiveTruckServices: "Comprehensive Truck Services",
    servicesDescription:
      "From routine maintenance to complex repairs, we offer a full range of services to keep your commercial trucks on the road.",
    computerDiagnostics: "Diagnostics",
    computerDiagnosticsDesc:
      "Complete truck diagnostic services using advanced equipment to identify and resolve issues quickly",
    tireService: "Tire Service",
    tireServiceDesc: "Professional tire installation, balancing, rotation, and repair for all truck types",
    oilChange: "Oil Change",
    oilChangeDesc: "Full synthetic and conventional oil changes with filter replacement and fluid level checks",
    suspensionSteering: "Suspension Service",
    suspensionSteeringDesc: "Complete suspension system inspection, repair, and replacement for optimal ride quality",
    transmissionRepair: "DEF & Transmission",
    transmissionRepairDesc: "Diesel Exhaust Fluid system service and complete transmission repair and maintenance",
    dotCarbInspections: "DOT Inspection",
    dotCarbInspectionsDesc: "Comprehensive Department of Transportation safety inspections for commercial vehicles",
    roadsideService: "Roadside Service",
    roadsideServiceDesc: "24/7 emergency roadside assistance including towing, tire changes, fuel delivery, and lockout services",
    acService: "A/C Service",
    acServiceDesc: "Complete air conditioning system service, repair, and maintenance for commercial truck cabs",
    brakeService: "Brake Service",
    brakeServiceDesc: "Professional brake inspection, repair, and replacement services for all truck types",
    pmService: "PM Service",
    pmServiceDesc: "Preventive maintenance services to keep your truck running smoothly and avoid costly breakdowns",
    carbInspection: "CARB Inspection",
    carbInspectionDesc: "California Air Resources Board emissions inspections and compliance services",
    defService: "DEF Service",
    defServiceDesc: "Diesel Exhaust Fluid system service, maintenance, and repair for emissions compliance",
    dpfCleaning: "DPF Cleaning",
    dpfCleaningDesc: "Diesel Particulate Filter cleaning and regeneration services to maintain engine performance",
    jumpStarts: "Jump Starts",
    jumpStartsDesc: "Emergency jump start services to get your truck running when the battery dies",
    startingAt: "Starting at",
    callForPrice: "Call for price",
    getAQuote: "Get a Quote",

    requestAQuote: "Request a Quote",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    serviceType: "Service Type",
    selectService: "Select a service",
    additionalNotes: "Additional Notes",
    additionalNotesPlaceholder: "Tell us about your truck and the service you need...",
    submitRequest: "Submit Request",
    close: "Close",

    // Map Section
    location: "Our Location",
    findUs: "Find us at our main service center in Dayton",
    address: "Address",
    hours: "Hours of Operation",
    phone: "Phone Numbers",
    email: "Email",

    // Contact Section
    getInTouch: "Get In Touch",
    contactDescription: "Have questions or need service? Reach out to us and we'll get back to you as soon as possible.",
    phoneDesc: "Call us anytime for immediate assistance",
    emailDesc: "Send us an email and we'll respond promptly",
    locationDesc: "Visit our service center in New York",
    businessHours: "Business Hours",
    mondayFriday: "Monday - Friday: 8:30 AM - 5:00 PM",
    saturday: "Saturday: 9:00 AM - 3:00 PM",
    emergencyServices: "24/7 Emergency services available",
    requestService: "Request Service",
    emailAddress: "Email Address",
    serviceNeeded: "Service Needed",
    additionalInfo: "Additional Information",
    additionalInfoPlaceholder: "Tell us about your truck and the service you need...",
    requestServiceButton: "Request Service",
    thankYouMessage: "Thank you! We'll contact you soon.",

    // Footer
    footerDescription1: "Professional truck repair and maintenance services for commercial vehicles.",
    footerDescription2: "Keeping your fleet on the road.",

    // About Section
    aboutUs: "About Us",
    trustedTruckServicePartner: "Your Trusted Truck Service Partner",
    aboutDescription1: "Delo Truck Center LLC has been serving the commercial trucking industry for over 5 years. We specialize in comprehensive truck repair, maintenance, and inspection services for all types of commercial vehicles.",
    aboutDescription2: "Our state-of-the-art facility is equipped with the latest diagnostic tools and staffed by certified technicians who are committed to keeping your fleet running safely and efficiently.",
    yearsOfExcellence: "Years of Excellence",
    certifiedTechnicians: "Certified Technicians",
    certifiedTechniciansDesc: "Our team consists of ASE-certified mechanics with extensive training and experience in commercial vehicle repair.",
    qualityService: "Quality Service",
    qualityServiceDesc: "We use only premium parts and follow manufacturer specifications to ensure the highest quality repairs and maintenance.",
    customerFocused: "Customer Focused",
    customerFocusedDesc: "Your satisfaction is our priority. We work with your schedule and budget to provide the best service possible.",
    fastTurnaround: "Fast Turnaround",
    fastTurnaroundDesc: "We understand that downtime costs money. Our efficient processes minimize wait times without compromising quality.",

    // Testimonials Section
    ourCustomers: "Our Customers",
    whatOurCustomersSay: "What Our Customers Say About Us",
    testimonialsDescription: "Read what our satisfied customers have to say about their experience with Delo Truck Center.",
    readMore: "Read More",
    showLess: "Show Less",
}

export function getTranslation(_lang: Language, key: keyof typeof translations): string {
  return translations[key]
}
