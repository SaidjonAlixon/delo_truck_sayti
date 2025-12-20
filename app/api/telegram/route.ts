import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, phoneNumber, serviceType, additionalNotes, email, name, service, message, phone } = body

    // Support both quote form and contact form formats
    const customerName = fullName || name || ''
    const phoneNum = phoneNumber || phone || ''
    const serviceTypeValue = serviceType || service || ''
    const notes = additionalNotes || message || ''
    const emailAddress = email || ''

    // Validation - check if we have required fields
    if (!customerName || customerName.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Full name is required' },
        { status: 400 }
      )
    }
    
    if (!phoneNum || phoneNum.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Telegram Bot API configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured')
      return NextResponse.json(
        { success: false, message: 'Telegram service not configured' },
        { status: 500 }
      )
    }

    // Format message
    const serviceTypeMap: { [key: string]: string } = {
      diagnostics: 'Diagnostics',
      tire: 'Tire Service',
      oil: 'Oil Change',
      suspension: 'Suspension Service',
      transmission: 'DEF & Transmission',
      dot: 'DOT Inspection',
    }

    const serviceName = serviceTypeValue ? serviceTypeMap[serviceTypeValue] || serviceTypeValue : 'Not specified'

    // Determine message type based on whether email is present (contact form) or not (quote form)
    const messageTitle = emailAddress 
      ? '🆕 *YANGI XIZMAT SO\'ROVI*' 
      : '💬 *YANGI TAKLIF SO\'ROVI*'
    
    // Service emoji map
    const serviceEmojiMap: { [key: string]: string } = {
      'Diagnostics': '🔍',
      'Tire Service': '🛞',
      'Oil Change': '🛢️',
      'Suspension Service': '⚙️',
      'DEF & Transmission': '🔧',
      'DOT Inspection': '✅',
    }
    
    const serviceEmoji = serviceEmojiMap[serviceName] || '🔧'
    
    let telegramMessageText = `${messageTitle}\n`
    telegramMessageText += `━━━━━━━━━━━━━━━━━━━━\n\n`
    telegramMessageText += `👤 *Ism:* ${customerName}\n`
    
    if (emailAddress) {
      telegramMessageText += `📧 *Email:* ${emailAddress}\n`
    }
    
    telegramMessageText += `📱 *Telefon:* ${phoneNum}\n`
    telegramMessageText += `${serviceEmoji} *Xizmat turi:* ${serviceName}\n\n`
    
    if (notes && notes.trim() !== '') {
      telegramMessageText += `📝 *Qo'shimcha ma'lumot:*\n${notes}\n\n`
    }
    
    telegramMessageText += `⏰ *Vaqt:* ${new Date().toLocaleString('uz-UZ', { 
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`

    const telegramMessage = telegramMessageText.trim()

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data)
      const errorMessage = data.description || 'Failed to send message to Telegram'
      
      // More user-friendly error messages
      if (errorMessage.includes('chat not found') || errorMessage.includes('Bad Request')) {
        return NextResponse.json(
          { success: false, message: 'Kanal topilmadi. Iltimos, bot kanalda admin ekanligini va kanal ID ni to\'g\'ri ekanligini tekshiring.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { success: false, message: `Telegram xatosi: ${errorMessage}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Taklif muvaffaqiyatli yuborildi!',
    })
  } catch (error) {
    console.error('Error sending to Telegram:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

