import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET all testimonials
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY id DESC')
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, text, rating } = body

    const result = await pool.query(
      `INSERT INTO testimonials (name, role, text, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, role, text, rating || 5]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

// PUT update testimonial
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, role, text, rating } = body

    const result = await pool.query(
      `UPDATE testimonials 
       SET name = $1, role = $2, text = $3, rating = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, role, text, rating, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM testimonials WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

