import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET - Fetch setting by key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      const result = await pool.query(
        'SELECT * FROM settings WHERE setting_key = $1',
        [key]
      )
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Setting not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: result.rows[0] })
    } else {
      // Return all settings
      const result = await pool.query('SELECT * FROM settings ORDER BY setting_key')
      return NextResponse.json({ success: true, data: result.rows })
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Setting key and value are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE settings 
       SET setting_value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE setting_key = $2
       RETURNING *`,
      [value, key]
    )

    if (result.rows.length === 0) {
      // Insert if doesn't exist
      const insertResult = await pool.query(
        `INSERT INTO settings (setting_key, setting_value)
         VALUES ($1, $2)
         RETURNING *`,
        [key, value]
      )
      return NextResponse.json({ success: true, data: insertResult.rows[0] })
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}

