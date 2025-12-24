import { NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

export async function GET() {
  try {
    await initDatabase()
    return NextResponse.json({ success: true, message: 'Database initialized successfully' })
  } catch (error: any) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize database',
        error: error?.message || 'Unknown error',
        details: error?.stack
      },
      { status: 500 }
    )
  }
}

