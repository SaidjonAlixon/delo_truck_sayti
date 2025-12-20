# Telegram Kanal ID ni topish

## Kanal ID ni topish usullari:

### 1-usul: @userinfobot orqali (Oson usul)
1. Telegram da `@userinfobot` ni toping va start qiling
2. Kanalga o'ting
3. Kanal ichida biror postni forward qiling `@userinfobot` ga
4. Bot sizga kanal ID ni beradi (masalan: `-1001234567890`)

### 2-usul: Kanal username dan foydalanish
Agar kanalingizda public username bo'lsa (masalan: `@mychannel`):
- Vercel da `TELEGRAM_CHAT_ID` ni `@mychannel` ga o'rnating

### 3-usul: @RawDataBot orqali
1. Kanalga `@RawDataBot` ni admin qiling
2. Bot sizga kanal ma'lumotlarini beradi
3. `chat.id` ni toping (masalan: `-1001234567890`)

## Vercel da sozlash:

1. Vercel Dashboard → Settings → Environment Variables
2. `TELEGRAM_CHAT_ID` ni toping
3. Value ni kanal ID ga o'zgartiring:
   - Kanal ID: `-1001234567890` (minus belgi bilan boshlanadi)
   - Yoki kanal username: `@your_channel_name`
4. Save qiling
5. Redeploy qiling

## Muhim eslatmalar:

1. **Bot kanalda admin bo'lishi kerak!**
   - Kanal sozlamalariga kiring
   - Administrators → Add Administrator
   - Botni tanlang va "Post Messages" huquqini bering

2. **Kanal ID format:**
   - Private kanal: `-1001234567890` (minus belgi bilan)
   - Public kanal: `@channel_username` yoki `-1001234567890`

3. **Tekshirish:**
   - Bot kanalga xabar yubora oladimi?
   - Kanal sozlamalarida bot admin ekanligini tekshiring

