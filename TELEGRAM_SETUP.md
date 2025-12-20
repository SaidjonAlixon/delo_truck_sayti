# Telegram Bot Sozlash

Quote formasi ma'lumotlarini Telegram kanalga yuborish uchun quyidagi qadamlar:

## 1. Telegram Bot Yaratish

1. Telegram'da `@BotFather` ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot uchun ism kiriting
4. Bot username kiriting (oxirida `bot` bo'lishi kerak, masalan: `delo_truck_bot`)
5. BotFather sizga **Bot Token** beradi (shakli: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Chat ID Topish

### Kanal uchun:
1. Kanalingizga botni admin qiling
2. Kanal postiga `/me` yozing
3. Yoki `@userinfobot` ga yozib, chat ID ni oling
4. Yoki `@getidsbot` dan foydalaning

### Shaxsiy chat uchun:
1. `@userinfobot` ga yozing
2. U sizga chat ID ni beradi (shakli: `-1001234567890` yoki `123456789`)

## 3. Environment Variables Sozlash

`.env.local` faylini yarating va quyidagilarni qo'shing:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

**Muhim:** `.env.local` fayl `.gitignore` da bo'lishi kerak!

## 4. Test Qilish

Formani to'ldirib, "Submit Request" tugmasini bosing. Ma'lumotlar Telegram kanalga yuborilishi kerak.

## Xatoliklar

Agar ishlamasa:
- Bot token va Chat ID to'g'ri ekanligini tekshiring
- Bot kanalga admin qilinganligini tekshiring (kanal uchun)
- `.env.local` fayl loyiha ildizida ekanligini tekshiring
- Server ni qayta ishga tushiring

