# Tezkor Boshlash

## 🚀 Hozirgi holat

✅ **Tayyor:**
- Backend kod (Node.js + Express + Prisma)
- Frontend sahifalar (HTML + CSS + JS)
- npm paketlar o'rnatilgan
- Prisma Client yaratilgan
- Port 3010 sozlangan

⏳ **Kerak bo'lgan:**
- PostgreSQL o'rnatish va ishga tushirish
- Ma'lumotlar bazasiga jadvallar yaratish
- Backend server ishga tushirish

---

## 📋 3 ta oddiy qadam

### 1️⃣ PostgreSQL o'rnatish (5 daqiqa)

#### Variant A: Rasmiy o'rnatish (Tavsiya etiladi)
```
1. https://www.postgresql.org/download/windows/ saytiga o'ting
2. PostgreSQL 16 ni yuklab oling
3. O'rnating, parol o'rnating (masalan: postgres123)
4. pgAdmin 4 ni oching
5. warehouse_db bazasini yarating
```

#### Variant B: Docker (Agar Docker o'rnatilgan bo'lsa)
```powershell
docker run --name warehouse-postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=warehouse_db -p 5432:5432 -d postgres:16
```

📖 **Batafsil:** [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)

---

### 2️⃣ Backend sozlash (1 daqiqa)

```powershell
# Backend papkasiga o'ting
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"

# .env faylini tekshiring va kerak bo'lsa parolni o'zgartiring
# DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/warehouse_db"

# Ma'lumotlar bazasiga jadvallar yaratish
npx prisma migrate dev --name init

# Boshlang'ich ma'lumotlarni kiritish (rollar, birliklar)
npm run seed

# Backend serverni ishga tushirish
npm run dev
```

✅ **Natija:** Backend http://localhost:3010 da ishga tushadi

---

### 3️⃣ Frontend ochish (30 soniya)

#### Variant A: VS Code Live Server
```
1. VS Code da frontend/index.html ni oching
2. O'ng tugma > Open with Live Server
```

#### Variant B: Python HTTP Server
```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\frontend"
python -m http.server 8080
```

#### Variant C: Brauzerda to'g'ridan-to'g'ri
```
frontend/index.html faylini brauzerda oching
```

✅ **Natija:** Frontend ochiladi

---

## 🎯 Tizimdan foydalanish

### Birinchi foydalanuvchi yaratish

1. Frontend sahifasini oching
2. "Login" sahifasiga o'ting
3. Ro'yxatdan o'ting:
   - Login: `admin`
   - Email: `admin@warehouse.uz`
   - Parol: `admin123`
   - To'liq ism: `Administrator`
   - Telefon: `+998901234567`

**⚠️ Muhim:** Birinchi foydalanuvchi avtomatik **Admin** huquqiga ega bo'ladi!

### Admin panel

Login qilgandan so'ng dashboard ochiladi va quyidagi modullar mavjud:

- 📊 **Dashboard** - Statistika va grafiklar
- 📦 **Mahsulotlar** - Mahsulotlar boshqaruvi
- 📁 **Kategoriyalar** - Kategoriyalar
- ⬇️ **Kirim** - Mahsulot kirim operatsiyalari
- ⬆️ **Chiqim** - Mahsulot chiqim operatsiyalari
- 📦 **Ombor** - Real vaqt qoldig'i
- 🏢 **Yetkazib beruvchilar** - Kontragentlar
- 📈 **Hisobotlar** - Turli hisobotlar
- 👥 **Foydalanuvchilar** - Hodimlar boshqaruvi
- ⚙️ **Sozlamalar** - Tizim sozlamalari
- 📋 **Harakatlar tarixi** - Audit log

---

## ❓ Muammolar

### Backend ishga tushmayapti

```powershell
# Node.js versiyasini tekshiring (18+ kerak)
node --version

# PostgreSQL ishlab turganini tekshiring
Get-Service -Name "*postgres*"

# Port 3010 band emasligini tekshiring
netstat -ano | findstr :3010
```

### PostgreSQL ulanmayapti

```powershell
# PostgreSQL ishga tushiring
Start-Service postgresql-x64-16

# yoki pgAdmin 4 da serverni ishga tushiring
```

### Ma'lumotlar bazasi topilmayapti

```sql
-- psql yoki pgAdmin 4 da:
CREATE DATABASE warehouse_db;
```

### Frontend backend'ga ulanmayapti

1. Backend ishlab turganini tekshiring: http://localhost:3010/api/auth/login
2. Brauzer konsolini oching (F12) va xatolarni ko'ring
3. frontend/assets/js/api.js faylida API_BASE_URL ni tekshiring

---

## 📚 Qo'shimcha hujjatlar

- 📖 [README.md](README.md) - Loyiha haqida umumiy
- 📖 [INSTALLATION.md](INSTALLATION.md) - Batafsil o'rnatish qo'llanmasi
- 📖 [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) - PostgreSQL o'rnatish
- 📖 [FEATURES.md](FEATURES.md) - To'liq funksiyalar ro'yxati

---

## ⚡ Tezkor yo'riqnoma (1 qator)

PostgreSQL o'rnatilgan va ishlab turgan bo'lsa:

```powershell
cd backend && npx prisma migrate dev --name init && npm run seed && npm run dev
```

Keyin frontend/index.html ni oching!

---

## ✅ Tayyor!

Savollar bo'lsa yoki yordam kerak bo'lsa:
- Backend loglarni tekshiring
- Browser konsolini ko'ring (F12)
- Xatolik xabarini diqqat bilan o'qing
- Hujjatlarga qarang

**Omad!** 🎉
