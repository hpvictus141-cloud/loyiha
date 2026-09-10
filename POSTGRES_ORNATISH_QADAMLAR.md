# PostgreSQL O'rnatish - Qadam-baqadam yo'riqnoma

## QADAM 1: PostgreSQL yuklab olish ✅ (Siz hozir shu yerdasiz)

Siz hozir PostgreSQL rasmiy saytida turganingiz ko'rinmoqda.

### 1.1. Installer yuklab olish

Sahifani pastga scroll qiling va **"Windows installers"** bo'limini toping.

Yoki to'g'ridan-to'g'ri bu havolaga o'ting:
👉 **https://www.enterprisedb.com/downloads/postgres-postgresql-downloads**

### 1.2. Versiyani tanlash

| Versiya | Windows | Tavsiya |
|---------|---------|---------|
| PostgreSQL 16.x | Windows x86-64 | ✅ **Tavsiya** (Eng yangi barqaror) |
| PostgreSQL 15.x | Windows x86-64 | ✅ Yaxshi (Barqaror) |
| PostgreSQL 14.x | Windows x86-64 | ⚠️ Eski |

**Tavsiya:** PostgreSQL 16.x ni tanlang

### 1.3. "Download" tugmasini bosing

Fayl nomi: `postgresql-16.x-windows-x64.exe` (hajmi: ~250-350 MB)

Fayl yuklab olinadi: `C:\Users\mardo\Downloads\` papkasiga

---

## QADAM 2: Installer ni ishga tushirish

### 2.1. Downloads papkasiga o'ting
```
C:\Users\mardo\Downloads\
```

### 2.2. Yuklab olingan faylni toping
Fayl nomi: `postgresql-16.x-windows-x64.exe`

### 2.3. Faylni **o'ng tugma** bilan bosing
- "Run as administrator" (Administrator sifatida ishga tushirish) ni tanlang
- UAC (User Account Control) oynasi ochilsa, "Yes" ni bosing

---

## QADAM 3: O'rnatish jarayoni

### 3.1. Welcome Screen
```
Setup - PostgreSQL
┌─────────────────────────────────────┐
│ Welcome to the PostgreSQL Setup     │
│ Wizard                              │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**"Next"** tugmasini bosing

---

### 3.2. Installation Directory (O'rnatish joyi)
```
┌─────────────────────────────────────┐
│ Installation Directory              │
│                                     │
│ C:\Program Files\PostgreSQL\16      │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**Default joyni o'zgartirmasdan "Next"** tugmasini bosing

---

### 3.3. Select Components (Komponentlarni tanlash)
```
┌─────────────────────────────────────┐
│ Select Components                   │
│                                     │
│ ☑ PostgreSQL Server                │
│ ☑ pgAdmin 4                        │
│ ☑ Stack Builder                    │
│ ☑ Command Line Tools               │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**Barcha komponentlar belgilangan bo'lsin (default holatda)**
- PostgreSQL Server - Asosiy server
- pgAdmin 4 - Grafik interfeys (juda qulay!)
- Stack Builder - Qo'shimcha paketlar
- Command Line Tools - Komanda qatori

**"Next"** tugmasini bosing

---

### 3.4. Data Directory (Ma'lumotlar joyi)
```
┌─────────────────────────────────────┐
│ Data Directory                      │
│                                     │
│ C:\Program Files\PostgreSQL\16\data │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**Default joyni o'zgartirmasdan "Next"** tugmasini bosing

---

### 3.5. Password ⚠️ MUHIM!
```
┌─────────────────────────────────────┐
│ Password                            │
│                                     │
│ Password: [____________]            │
│ Retype:   [____________]            │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**BU JUDA MUHIM QADAM!**

Parolni kiriting va eslab qoling!

**Tavsiya:** Oddiy parol ishlating (test uchun)
- `postgres123` ✅ (yoki)
- `admin123` ✅ (yoki)
- `12345678` ✅

**MUHIM:** Bu parolni eslab qoling! Keyinchalik kerak bo'ladi!

Parolni ikki marta kiriting va **"Next"**

---

### 3.6. Port Number (Port raqami)
```
┌─────────────────────────────────────┐
│ Port                                │
│                                     │
│ Port: [5432]                        │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**Default port `5432` ni o'zgartirmasdan qoldiring**

**"Next"** tugmasini bosing

---

### 3.7. Advanced Options (Locale)
```
┌─────────────────────────────────────┐
│ Advanced Options                    │
│                                     │
│ Locale: [Default locale]            │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
**Default ni tanlangan holda qoldiring**

**"Next"** tugmasini bosing

---

### 3.8. Pre Installation Summary (Xulosa)
```
┌─────────────────────────────────────┐
│ Ready to Install                    │
│                                     │
│ Installation Directory:             │
│   C:\Program Files\PostgreSQL\16    │
│ Data Directory:                     │
│   C:\Program Files\PostgreSQL\16\data│
│ Port: 5432                          │
│                                     │
│ [Next >]                            │
└─────────────────────────────────────┘
```
Barcha sozlamalarni ko'rib chiqing va **"Next"** ni bosing

---

### 3.9. O'rnatish jarayoni
```
┌─────────────────────────────────────┐
│ Installing PostgreSQL               │
│                                     │
│ [████████████████░░░░░] 75%        │
│                                     │
│ Please wait...                      │
└─────────────────────────────────────┘
```
**Kutib turing...** (3-5 daqiqa)

---

### 3.10. Completing Setup
```
┌─────────────────────────────────────┐
│ Completing PostgreSQL Setup         │
│                                     │
│ ☑ Stack Builder will launch after   │
│   setup                             │
│                                     │
│ [Finish]                            │
└─────────────────────────────────────┘
```
**Stack Builder** belgisini **OLIB TASHLANG** (hozir kerak emas)

**"Finish"** tugmasini bosing

---

## QADAM 4: PostgreSQL ishga tushganini tekshirish

### 4.1. Windows Services orqali tekshirish

**Variant A: Services oynasini ochish**
1. `Win + R` tugmalarini bosing
2. `services.msc` yozing
3. `Enter` bosing

**Variant B: PowerShell orqali**
```powershell
Get-Service -Name "*postgres*"
```

**Natija ko'rinishi kerak:**
```
Status   Name               DisplayName
------   ----               -----------
Running  postgresql-x64-16  PostgreSQL Database Server 16
```

Agar `Running` ko'rinsa - hammasi to'g'ri! ✅

---

## QADAM 5: warehouse_db bazasini yaratish

### 5.1. pgAdmin 4 ni ochish

**Start Menu orqali:**
1. Windows tugmasini bosing
2. "pgAdmin" deb qidiring
3. "pgAdmin 4" ni bosing

**Yoki:**
`C:\Program Files\PostgreSQL\16\pgAdmin 4\bin\pgAdmin4.exe`

### 5.2. pgAdmin 4 da ishlash

1. **pgAdmin 4 ochiladi** (brauzerda ochilishi mumkin)
2. Chap tomonda **"Servers"** ni ko'rasiz
3. **"PostgreSQL 16"** ni bosing
4. **Parol so'raladi** - o'rnatishda belgilagan parolingizni kiriting (masalan: `postgres123`)

### 5.3. Ma'lumotlar bazasini yaratish

1. **Databases** ni toping (chap panelda)
2. **O'ng tugma** bosing
3. **Create > Database** ni tanlang
4. Oyna ochiladi:
   ```
   Database: warehouse_db
   Owner: postgres
   ```
5. **"Save"** tugmasini bosing

✅ **Tayyor!** `warehouse_db` bazasi yaratildi!

---

## QADAM 6: Backend .env faylini yangilash

### 6.1. .env faylini oching
`C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend\.env`

### 6.2. DATABASE_URL qatorini toping
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/warehouse_db"
```

### 6.3. Parolni o'zgartiring
`password` ni o'zingiz belgilagan parolga almashtiring:

**Agar parolingiz `postgres123` bo'lsa:**
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/warehouse_db"
```

**Agar parolingiz `admin123` bo'lsa:**
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/warehouse_db"
```

### 6.4. Faylni saqlang (Ctrl + S)

---

## QADAM 7: Ma'lumotlar bazasiga jadvallar yaratish

### 7.1. PowerShell ni oching
1. `Win + X` tugmalarini bosing
2. "Windows PowerShell" ni tanlang

### 7.2. Backend papkasiga o'ting
```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"
```

### 7.3. Prisma migratsiyasini bajaring
```powershell
npx prisma migrate dev --name init
```

**Kutilayotgan natija:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "warehouse_db"

Applying migration `20260714_init`

✔ Generated Prisma Client

The following migration(s) have been created and applied:
  migrations/
    └─ 20260714_init/
       └─ migration.sql

✔ Database migration completed successfully
```

### 7.4. Boshlang'ich ma'lumotlarni kiritish
```powershell
npm run seed
```

**Natija:**
```
Ma'lumotlar bazasini to'ldirish boshlandi...
Rollar yaratildi ✓
Ruxsatlar yaratildi ✓
Rollarga ruxsatlar bog'landi ✓
O'lchov birliklari yaratildi ✓
Kompaniya sozlamalari yaratildi ✓

Ma'lumotlar bazasi muvaffaqiyatli to'ldirildi!
```

---

## QADAM 8: Backend serverni ishga tushirish

```powershell
npm run dev
```

**Natija:**
```
> warehouse-backend@1.0.0 dev
> node --watch src/server.js

Server 3010 portda ishlamoqda
```

✅ **Backend tayyor!** http://localhost:3010

---

## QADAM 9: Frontend ochish

### Yangi PowerShell oynasini oching

**Variant A: Python HTTP Server**
```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\frontend"
python -m http.server 8080
```

**Variant B: VS Code Live Server**
- VS Code da `frontend/index.html` ni oching
- O'ng tugma > "Open with Live Server"

**Variant C: Brauzerda to'g'ridan-to'g'ri**
- `frontend/index.html` faylini ikki marta bosing

---

## QADAM 10: Login qilish

1. Brauzerda `http://localhost:8080` (yoki frontend URL) ga o'ting
2. **"Login"** tugmasini bosing
3. **Ro'yxatdan o'ting:**
   - Login: `admin`
   - Email: `admin@warehouse.uz`
   - Parol: `admin123`
   - To'liq ism: `Administrator`
   - Telefon: `+998901234567`

4. **Kirish** tugmasini bosing

✅ **Dashboard ochiladi!**

---

## ✅ Tayyor!

Omborxona boshqaruv tizimi ishga tushdi!

### Agar muammo bo'lsa:

**PostgreSQL ishlamayapti:**
```powershell
Start-Service postgresql-x64-16
```

**Port band:**
```powershell
netstat -ano | findstr :3010
```

**Ma'lumotlar bazasi topilmayapti:**
pgAdmin 4 da `warehouse_db` mavjudligini tekshiring

---

## 📞 Yordam

Qaysi qadamda muammo bor?
- Screenshot yuboring
- Xatolik xabarini ko'rsating
- Men yordam beraman!
