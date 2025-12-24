import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET - Fetch all FAQs
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM faq ORDER BY display_order ASC, id ASC'
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

// POST - Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, display_order } = body

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO faq (question, answer, display_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [question, answer, display_order || 0]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, question, answer, display_order } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE faq 
       SET question = $1, answer = $2, display_order = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [question, answer, display_order || 0, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'FAQ ID is required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'DELETE FROM faq WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
