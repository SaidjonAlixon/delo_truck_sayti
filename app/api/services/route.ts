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
    const { service_id, title_key, desc_key, title, description, price, price_type, image } = body

    const result = await pool.query(
      `INSERT INTO services (service_id, title_key, desc_key, title, description, price, price_type, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [service_id, title_key, desc_key, title || null, description || null, price, price_type, image]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create service' },
      { status: 500 }
    )
  }
}

// PUT update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, service_id, title_key, desc_key, title, description, price, price_type, image } = body

    const result = await pool.query(
      `UPDATE services 
       SET service_id = $1, title_key = $2, desc_key = $3, title = $4, description = $5, price = $6, price_type = $7, image = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [service_id, title_key, desc_key, title || null, description || null, price, price_type, image, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update service' },
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

