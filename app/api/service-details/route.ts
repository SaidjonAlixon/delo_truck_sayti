import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET all service details or by service_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('service_id')

    if (serviceId) {
      const result = await pool.query(
        'SELECT * FROM service_details WHERE service_id = $1',
        [serviceId]
      )
      return NextResponse.json({ success: true, data: result.rows[0] || null })
    }

    const result = await pool.query('SELECT * FROM service_details ORDER BY service_id ASC')
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching service details:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch service details' },
      { status: 500 }
    )
  }
}

// POST create new service detail
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service_id, features, benefits, process, estimated_time, warranty } = body

    const result = await pool.query(
      `INSERT INTO service_details (service_id, features, benefits, process, estimated_time, warranty)
       VALUES ($1, $2::text[], $3::text[], $4::text[], $5, $6)
       RETURNING *`,
      [
        service_id,
        Array.isArray(features) ? features : [],
        Array.isArray(benefits) ? benefits : [],
        Array.isArray(process) ? process : [],
        estimated_time || null,
        warranty || null
      ]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    console.error('Error creating service detail:', error)
    return NextResponse.json(
      { success: false, message: `Failed to create service detail: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// PUT update service detail
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, service_id, features, benefits, process, estimated_time, warranty } = body

    const result = await pool.query(
      `UPDATE service_details 
       SET service_id = $1, features = $2::text[], benefits = $3::text[], process = $4::text[], 
           estimated_time = $5, warranty = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        service_id,
        Array.isArray(features) ? features : [],
        Array.isArray(benefits) ? benefits : [],
        Array.isArray(process) ? process : [],
        estimated_time || null,
        warranty || null,
        id
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Service detail not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    console.error('Error updating service detail:', error)
    return NextResponse.json(
      { success: false, message: `Failed to update service detail: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// DELETE service detail
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service detail ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM service_details WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Service detail deleted successfully' })
  } catch (error) {
    console.error('Error deleting service detail:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete service detail' },
      { status: 500 }
    )
  }
}

