import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET all content or by page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    let result
    if (page) {
      result = await pool.query(
        'SELECT * FROM content WHERE page = $1 ORDER BY content_key ASC',
        [page]
      )
    } else {
      result = await pool.query('SELECT * FROM content ORDER BY page ASC, content_key ASC')
    }

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST create or update content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, content_key, content_value } = body

    if (!page || !content_key || content_value === undefined) {
      return NextResponse.json(
        { success: false, message: 'page, content_key, and content_value are required' },
        { status: 400 }
      )
    }

    // Use UPSERT (INSERT ... ON CONFLICT UPDATE)
    const result = await pool.query(
      `INSERT INTO content (page, content_key, content_value, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (page, content_key) 
       DO UPDATE SET content_value = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [page, content_key, content_value]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save content' },
      { status: 500 }
    )
  }
}

// PUT update content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, content_value } = body

    if (!id || content_value === undefined) {
      return NextResponse.json(
        { success: false, message: 'id and content_value are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE content 
       SET content_value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [content_value, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Content ID is required' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM content WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete content' },
      { status: 500 }
    )
  }
}

