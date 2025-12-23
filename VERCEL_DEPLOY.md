# Vercelga Deploy Qilish Qo'llanmasi

## 1. Database sozlash

### Variant A: Railway PostgreSQL (Tavsiya etiladi)
1. [Railway.app](https://railway.app) ga kiring
2. "New Project" → "Provision PostgreSQL" ni tanlang
3. Database yaratilgandan keyin, "Connect" → "Postgres Connection URL" ni ko'ring
4. Bu URL ni saqlab qo'ying (keyinroq ishlatamiz)

### Variant B: Vercel PostgreSQL
1. Vercel dashboard → Project → "Storage" tab
2. "Create Database" → "Postgres" ni tanlang
3. Database yaratilgandan keyin, connection string ni oling

### Variant C: Supabase (Bepul)
1. [Supabase.com](https://supabase.com) ga kiring
2. New project yarating
3. Project Settings → Database → Connection string ni oling

---

## 2. Vercel Project sozlash

### 2.1. GitHub Repository'ni Vercel'ga ulash
1. [Vercel.com](https://vercel.com) ga kiring va login qiling
2. "Add New" → "Project" ni tanlang
3. GitHub repository'ingizni tanlang (`delo_truck_sayti`)
4. "Import" tugmasini bosing

### 2.2. Environment Variables sozlash
Vercel project sozlamalarida "Environment Variables" bo'limiga kiring va quyidagilarni qo'shing:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
ADMIN_USERNAME=adminDelo
ADMIN_PASSWORD=2026DeloTruck2025
```

**Muhim:**
- `DATABASE_URL` - Sizning PostgreSQL database connection string'ingiz
- Agar Railway ishlatayotgan bo'lsangiz, URL allaqachon tayyor bo'ladi
- Agar Supabase ishlatayotgan bo'lsangiz, "Connection Pooling" URL'ini ishlating

### 2.3. Build Settings
Vercel avtomatik Next.js ni taniydi, lekin quyidagilarni tekshiring:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (agar root'da bo'lsa)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

---

## 3. Database'ni ishga tushirish

### 3.1. Database Initialization
Vercel deploy qilingandan keyin, quyidagi endpoint'ni chaqiring:

```
https://your-vercel-app.vercel.app/api/init-db
```

Yoki browser'da oching va "success" javobini kutayapsiz.

**Eslatma:** Bu endpoint database jadvallarini yaratadi va default ma'lumotlarni qo'shadi.

---

## 4. Deploy qilish

### 4.1. Avtomatik Deploy (Git Push orqali)
Har safar git'ga push qilsangiz, Vercel avtomatik deploy qiladi:

```bash
git push origin main
```

### 4.2. Manual Deploy
1. Vercel Dashboard → Project
2. "Deployments" tab
3. "Redeploy" tugmasini bosing

---

## 5. Production sozlamalari

### 5.1. Custom Domain (ixtiyoriy)
1. Vercel Dashboard → Project → Settings → Domains
2. Domain'ingizni qo'shing
3. DNS sozlamalarini amalga oshiring

### 5.2. Environment Variables Production'da
Har doim Production, Preview, va Development uchun environment variables'ni sozlashni unutmang.

---

## 6. Muammolarni hal qilish

### Database Connection Xatosi
- `DATABASE_URL` to'g'ri ekanligini tekshiring
- Database public access'ga ochiqligini tekshiring
- SSL sozlamalarini tekshiring (`sslmode=require`)

### Build Xatolari
- `package.json` da barcha dependencies mavjudligini tekshiring
- Vercel build logs'ni ko'rib chiqing

### API Routes ishlamayapti
- `/api/init-db` endpoint'ni bir marta chaqiring
- Database connection'ni tekshiring

---

## 7. Admin Panel kirish

Deploy qilingandan keyin:
- URL: `https://your-app.vercel.app/admin/login`
- Username: `adminDelo`
- Password: `2026DeloTruck2025`

---

## Qo'shimcha ma'lumot

- Railway: [https://railway.app](https://railway.app)
- Vercel: [https://vercel.com](https://vercel.com)
- Supabase: [https://supabase.com](https://supabase.com)
- Neon (Boshqa variant): [https://neon.tech](https://neon.tech)

