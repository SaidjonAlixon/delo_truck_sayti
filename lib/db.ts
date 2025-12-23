import { Pool } from 'pg'

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

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

