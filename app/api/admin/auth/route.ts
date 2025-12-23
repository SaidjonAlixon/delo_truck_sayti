import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// POST login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'SELECT * FROM admin_credentials WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const admin = result.rows[0]

    // Simple password comparison (in production, use bcrypt)
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: { username: admin.username }
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

