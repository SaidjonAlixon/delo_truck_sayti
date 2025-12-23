import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET all services
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC')
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service_id, title_key, desc_key, title, description, price, price_type, image, discount_percent, sale_start_date, sale_end_date } = body

    // Convert dates to proper format
    let saleStartDate = null
    let saleEndDate = null
    
    if (sale_start_date) {
      try {
        saleStartDate = new Date(sale_start_date).toISOString()
      } catch (e) {
        console.error('Invalid sale_start_date:', sale_start_date)
      }
    }
    
    if (sale_end_date) {
      try {
        saleEndDate = new Date(sale_end_date).toISOString()
      } catch (e) {
        console.error('Invalid sale_end_date:', sale_end_date)
      }
    }

    // Convert discount_percent to integer if provided
    const discountPercent = discount_percent !== null && discount_percent !== undefined && discount_percent !== '' 
      ? parseInt(discount_percent) 
      : null

    const result = await pool.query(
      `INSERT INTO services (service_id, title_key, desc_key, title, description, price, price_type, image, discount_percent, sale_start_date, sale_end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [service_id, title_key, desc_key, title || null, description || null, price, price_type, image, discountPercent, saleStartDate, saleEndDate]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, message: `Failed to create service: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// PUT update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, service_id, title_key, desc_key, title, description, price, price_type, image, discount_percent, sale_start_date, sale_end_date } = body

    // Convert dates to proper format
    let saleStartDate = null
    let saleEndDate = null
    
    if (sale_start_date) {
      try {
        saleStartDate = new Date(sale_start_date).toISOString()
      } catch (e) {
        console.error('Invalid sale_start_date:', sale_start_date)
      }
    }
    
    if (sale_end_date) {
      try {
        saleEndDate = new Date(sale_end_date).toISOString()
      } catch (e) {
        console.error('Invalid sale_end_date:', sale_end_date)
      }
    }

    // Convert discount_percent to integer if provided
    const discountPercent = discount_percent !== null && discount_percent !== undefined && discount_percent !== '' 
      ? parseInt(discount_percent) 
      : null

    const result = await pool.query(
      `UPDATE services 
       SET service_id = $1, title_key = $2, desc_key = $3, title = $4, description = $5, price = $6, price_type = $7, image = $8, discount_percent = $9, sale_start_date = $10, sale_end_date = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [service_id, title_key, desc_key, title || null, description || null, price, price_type, image, discountPercent, saleStartDate, saleEndDate, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, message: `Failed to update service: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// DELETE service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM services WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete service' },
      { status: 500 }
    )
  }
}

