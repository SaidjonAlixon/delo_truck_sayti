# Vercel Deployment - Telegram Integration Setup

## Environment Variables o'rnatish

Vercel da Telegram bot ishlashi uchun quyidagi environment variables ni o'rnatishingiz kerak:

### 1. Vercel Dashboard ga kiring
   - https://vercel.com/dashboard
   - Loyihangizni tanlang (delo-truck-sayti)

### 2. Settings → Environment Variables ga o'ting

### 3. Quyidagi o'zgaruvchilarni qo'shing:

**TELEGRAM_BOT_TOKEN**
```
8360181709:AAFVF09dp-qzjSM5HiY4lWzeVOKdsRyWEhQ
```

**TELEGRAM_CHAT_ID**
```
7517807386
```

### 4. Har bir o'zgaruvchini uchta muhit uchun tanlang:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### 5. Save tugmasini bosing

### 6. Redeploy qiling
   - Deployments bo'limiga o'ting
   - Eng so'nggi deployment ni tanlang
   - "..." menyusidan "Redeploy" ni tanlang
   - Yoki yangi commit push qiling

## Tekshirish

Deploy qilgandan keyin:
1. Saytga kiring
2. "Request Service" formani to'ldiring
3. Formani yuboring
4. Xatolik bo'lmasa, ma'lumotlar Telegram kanalga yuborilishi kerak

## Muammo bo'lsa

Agar hali ham "Telegram service not configured" xatosi chiqsa:
1. Environment Variables to'g'ri qo'shilganligini tekshiring
2. Token va Chat ID to'g'riligini tekshiring
3. Redeploy qiling
4. Browser cache ni tozalang (Ctrl+Shift+R)

