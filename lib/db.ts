import { Pool } from 'pg'
import { translations } from './translations'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:RDuRZocopeKzjPgUGBtWPwGTPHAXvCup@trolley.proxy.rlwy.net:33893/railway',
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool

// Initialize database tables
export async function initDatabase() {
  try {
    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        service_id VARCHAR(255) UNIQUE NOT NULL,
        title_key VARCHAR(255) NOT NULL,
        desc_key VARCHAR(255) NOT NULL,
        title VARCHAR(500),
        description TEXT,
        price VARCHAR(255),
        price_type VARCHAR(50) NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Add title and description columns if they don't exist (migration)
    await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS title VARCHAR(500),
      ADD COLUMN IF NOT EXISTS description TEXT
    `)
    
    // Add sale/discount columns if they don't exist (migration)
    await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS sale_start_date TIMESTAMP DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMP DEFAULT NULL
    `)

    // Create content table for managing page content
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        content_key VARCHAR(255) NOT NULL,
        content_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page, content_key)
      )
    `)

    // Create testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create admin credentials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default admin if not exists
    await pool.query(`
      INSERT INTO admin_credentials (username, password)
      VALUES ('adminDelo', '2026DeloTruck2025')
      ON CONFLICT (username) DO NOTHING
    `)

    // Check if testimonials table is empty, then insert default testimonials
    const testimonialsCount = await pool.query('SELECT COUNT(*) FROM testimonials')
    if (parseInt(testimonialsCount.rows[0].count) === 0) {
      const defaultTestimonials = [
        { name: 'Mahmoud Hussein', role: 'Truck Owner', text: 'Great experience at Delo Truck Center LLC! I had an excellent experience here. The staff were professional, friendly, and really know what they\'re doing. They diagnosed the problem quickly and fixed it efficiently. The prices were fair, and the service was honest and transparent — no hidden fees or unnecessary upselling. I truly appreciate how they respect truckers\' time and get the job done right. Highly recommend Delo Truck Center to anyone looking for reliable and trustworthy service!', rating: 5 },
        { name: 'William Shaye', role: 'Truck Driver', text: 'Went there to do my breaks, change diff fluid but found out that there was a leak from seal hub but the shop had parts & stuff, got it done under 2 hours! Very affordable if you negotiate with owner and fast!', rating: 5 },
        { name: 'Gabin Kamgang', role: 'Fleet Manager', text: 'I had some issues with my truck, the TA mechanic was not able to fix due to the complexity, but this shop was able to fix it. They had great prices and worked past business hours until my truck was fully fixed. My driver was back on the road the same day. I highly recommend this shop if you want someone very reliable, caring and someone that will get you back to the road asap.', rating: 5 },
        { name: 'Ruben', role: 'Truck Owner', text: 'I brought my truck into Delo Truck Center in Dayton after getting quoted a crazy price somewhere else to replace the entire clutch. These guys took a real look at it and told me straight—it didn\'t need a full replacement. They repaired what was actually wrong, saved me a ton of money and time, and got me back on the road fast. You don\'t see that kind of honesty much anymore. The mechanics here know their stuff—competent, professional, and trustworthy. The owner himself was hands-on, doing the work and making sure everything was done right. Real great guy. You can tell he takes pride in what he does and looks out for his customers. I\'ve been to plenty of shops that try to take advantage of folks—this place is the opposite. If you want solid work without getting ripped off, this is where you go. Much respect to the crew. Appreciate the good work.', rating: 5 },
        { name: 'Rachel Brown', role: 'Local Expert', text: 'Delo addressed all our concerns and went above and beyond to ensure we left feeling confident with the service provided. Their attention to detail, honesty, and willingness to go the extra mile made the experience seamless and stress-free. If you\'re looking for a diesel mechanic that truly cares about its customers, Delo is your best bet! They\'ve earned our trust and future business!', rating: 5 },
        { name: 'Sasanka Rajapaksa', role: 'Local Expert', text: 'Came to fix my box truck with def issue. Professional mechanics go through all the issue and fixed it with reasonable price. Nice people.', rating: 5 },
        { name: 'Akmammet Allakgayev', role: 'Local Expert', text: 'My trucks get professional care at this location. Ahmet is knowledgeable mechanic. Thanks', rating: 5 },
        { name: 'Yosef', role: 'Truck Driver', text: 'Awesome service, got inspection brakes, tires, and fender fixed, they were fast and efficient, ahmet and Murat thanks.', rating: 5 },
        { name: 'A. K.', role: 'Local Expert', text: 'Very professional techs, affordable prices, quick service', rating: 5 },
        { name: 'kenan arslan', role: 'Local Expert', text: 'Wonderful service reasonable price. I really thank you Mr Ahmet Its was really fast', rating: 5 },
        { name: 'Hi Nobody', role: 'Local Expert', text: 'This is a really clean and well organized shop the owner is knowledgeable and very easy to deal with so much respect for this place and its owner I would recommend it to anyone', rating: 5 },
        { name: 'trey jackson', role: 'Truck Driver', text: 'They best business in Dayton great people to work with it\'s all love thank you to you guys', rating: 5 },
        { name: 'Goku Cougar', role: 'Truck Driver', text: 'Nice, honest people. Perfect, quick and quality service. Thank you Gentlemen.', rating: 5 },
        { name: 'Lance', role: 'Local Expert', text: 'Good people\'s, good prices, very helpful and reliable. Will be back soon to finish up others repairs on my international.', rating: 5 },
        { name: 'Oleksandr Kuzemko', role: 'Local Expert', text: 'Thank you, guys from the CIS did everything quickly and the price is very good! Thank you', rating: 5 },
        { name: 'Azamat Yuldashev', role: 'Local Expert', text: 'I had an outstanding experience at this truck shop. From the moment I arrived, the team was professional, efficient, and truly focused on getting me back on the road as quickly as possible. A special thank you to Ahmed — his knowledge, honesty, and dedication made all the difference. He took the time to explain everything clearly, treated my truck with great care, and ensured the job was done right. It\'s rare to find service this reliable and consistent. I highly recommend this shop to anyone looking for quality work and exceptional customer service. I\'ll definitely be coming back whenever I need anything in the future.', rating: 5 },
        { name: 'Ozodbek Abdurahimov', role: 'Truck Driver', text: 'Excellent Service and Professional Work! I had a brake issue with my truck and brought it to this shop. They did an amazing job — quick, professional, and very thorough. The mechanics really know what they\'re doing, and they explained everything clearly before getting started. My truck feels great now, and I\'m very proud and thankful for their quality work and honesty. It\'s rare to find a shop that cares this much about doing things right. Highly recommend this team to any driver who wants reliable service and real expertise! Great shop ever', rating: 5 },
        { name: 'Ahmet Faruk', role: 'Commercial Driver', text: 'They quickly diagnosed and fixed an electronic issue on my semi truck. The team was very knowledgeable, helpful, and professional. They explained everything clearly and took great care of my truck from start to finish. I truly appreciate their honest and high-quality service. I highly recommend this shop excellent people and excellent workmanship.', rating: 5 },
      ]
      
      for (const testimonial of defaultTestimonials) {
        await pool.query(
          `INSERT INTO testimonials (name, role, text, rating)
           VALUES ($1, $2, $3, $4)`,
          [testimonial.name, testimonial.role, testimonial.text, testimonial.rating]
        )
      }
    }

    // Check if services table is empty, then insert default services
    const servicesCount = await pool.query('SELECT COUNT(*) FROM services')
    if (parseInt(servicesCount.rows[0].count) === 0) {
      const defaultServices = [
        { service_id: 'diagnostics', title_key: 'computerDiagnostics', desc_key: 'computerDiagnosticsDesc', price: null, price_type: 'call', image: '/services/diagnostics.jpg' },
        { service_id: 'tire', title_key: 'tireService', desc_key: 'tireServiceDesc', price: null, price_type: 'call', image: '/services/tire-service.jpg' },
        { service_id: 'oil', title_key: 'oilChange', desc_key: 'oilChangeDesc', price: null, price_type: 'call', image: '/services/oil-change.jpg' },
        { service_id: 'suspension', title_key: 'suspensionSteering', desc_key: 'suspensionSteeringDesc', price: null, price_type: 'call', image: '/services/suspension.jpg' },
        { service_id: 'transmission', title_key: 'transmissionRepair', desc_key: 'transmissionRepairDesc', price: null, price_type: 'call', image: '/services/transmission.jpg' },
        { service_id: 'dot', title_key: 'dotCarbInspections', desc_key: 'dotCarbInspectionsDesc', price: null, price_type: 'call', image: '/services/dot-inspection.jpg' },
        { service_id: 'roadside', title_key: 'roadsideService', desc_key: 'roadsideServiceDesc', price: null, price_type: 'call', image: '/services/tire-service.jpg' },
        { service_id: 'ac', title_key: 'acService', desc_key: 'acServiceDesc', price: null, price_type: 'call', image: '/services/diagnostics.jpg' },
        { service_id: 'brake', title_key: 'brakeService', desc_key: 'brakeServiceDesc', price: null, price_type: 'call', image: '/services/dot-inspection.jpg' },
        { service_id: 'pm', title_key: 'pmService', desc_key: 'pmServiceDesc', price: null, price_type: 'call', image: '/services/oil-change.jpg' },
        { service_id: 'carb', title_key: 'carbInspection', desc_key: 'carbInspectionDesc', price: null, price_type: 'call', image: '/services/dot-inspection.jpg' },
        { service_id: 'def', title_key: 'defService', desc_key: 'defServiceDesc', price: null, price_type: 'call', image: '/services/oil-change.jpg' },
        { service_id: 'dpf', title_key: 'dpfCleaning', desc_key: 'dpfCleaningDesc', price: null, price_type: 'call', image: '/services/diagnostics.jpg' },
        { service_id: 'jumpstart', title_key: 'jumpStarts', desc_key: 'jumpStartsDesc', price: null, price_type: 'call', image: '/services/tire-service.jpg' },
      ]
      
      for (const service of defaultServices) {
        await pool.query(
          `INSERT INTO services (service_id, title_key, desc_key, price, price_type, image)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (service_id) DO NOTHING`,
          [service.service_id, service.title_key, service.desc_key, service.price, service.price_type, service.image]
        )
      }
    }

    // Initialize content table with default translations
    const contentCount = await pool.query('SELECT COUNT(*) FROM content')
    if (parseInt(contentCount.rows[0].count) === 0) {
      
      const defaultContent: Array<{page: string, content_key: string, content_value: string}> = []
      for (const [key, value] of Object.entries(translations)) {
        // Determine page based on key
        let page = 'general'
        const keyLower = key.toLowerCase()
        if (keyLower.includes('hero') || keyLower.includes('slide')) {
          page = 'hero'
        } else if (keyLower.includes('service') && !keyLower.includes('request')) {
          page = 'services'
        } else if (keyLower.includes('about') || keyLower.includes('certified') || keyLower.includes('quality') || keyLower.includes('customerfocused') || keyLower.includes('fast') || keyLower.includes('trusted')) {
          page = 'about'
        } else if (keyLower.includes('contact') || keyLower.includes('request') || (keyLower.includes('phone') && !keyLower.includes('desc')) || keyLower.includes('email') || keyLower.includes('getintouch')) {
          page = 'contact'
        } else if (keyLower.includes('testimonial') || (keyLower.includes('customer') && keyLower.includes('say'))) {
          page = 'testimonials'
        } else if (keyLower.includes('footer')) {
          page = 'footer'
        } else if (keyLower.includes('map') || keyLower.includes('location') || keyLower.includes('findus') || keyLower.includes('hours')) {
          page = 'map'
        }
        
        defaultContent.push({
          page,
          content_key: key,
          content_value: String(value)
        })
      }
      
      for (const content of defaultContent) {
        await pool.query(
          `INSERT INTO content (page, content_key, content_value)
           VALUES ($1, $2, $3)
           ON CONFLICT (page, content_key) DO NOTHING`,
          [content.page, content.content_key, content.content_value]
        )
      }
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

