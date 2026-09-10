# Loyiha holati

**Sana:** 2026-07-12
**Holat:** Backend va Frontend tayyor, PostgreSQL kerak

---

## ✅ Tayyor qismlar

### Backend (100% tayyor)
- ✅ Express.js server sozlandi
- ✅ Prisma ORM konfiguratsiya qilindi
- ✅ 14 ta ma'lumotlar bazasi jadvali yaratildi
- ✅ 8 ta controller yozildi
- ✅ 15 ta REST API route sozlandi
- ✅ JWT Authentication (access + refresh token)
- ✅ Role-based access control (Admin, Operator, Omborchi)
- ✅ Middleware: auth, errorHandler, auditLog, validate
- ✅ Security: helmet, CORS, rate limiting, bcryptjs
- ✅ npm paketlar o'rnatildi (bcryptjs bilan)
- ✅ Prisma Client generatsiya qilindi
- ✅ Seed fayl tayyor (rollar, ruxsatlar, birliklar)
- ✅ Port 3010 da sozlandi
- ✅ .env fayl mavjud

**Fayllar:**
```
backend/
├── src/
│   ├── server.js ✓
│   ├── config/database.js ✓
│   ├── controllers/ (8 fayl) ✓
│   ├── middleware/ (4 fayl) ✓
│   ├── routes/ (15 fayl) ✓
│   └── utils/jwt.js ✓
├── prisma/
│   ├── schema.prisma ✓
│   └── seed.js ✓
├── package.json ✓
├── .env ✓
└── node_modules/ ✓
```

### Frontend (100% tayyor)
- ✅ Professional landing page
- ✅ Login sahifasi (JWT authentication)
- ✅ 12 ta admin panel sahifasi
- ✅ Responsive dizayn
- ✅ Dark/Light mode
- ✅ Toast notifications
- ✅ Modal oynalar
- ✅ Loading skeletons
- ✅ Search, filter, pagination
- ✅ Chart.js grafiklari
- ✅ To'liq o'zbek tilida
- ✅ Professional minimalist dizayn
- ✅ API client (localhost:3010 ga ulangan)

**Sahifalar:**
```
frontend/
├── index.html ✓ (Landing)
├── login.html ✓
├── pages/
│   ├── dashboard.html ✓
│   ├── products.html ✓
│   ├── categories.html ✓
│   ├── stock-in.html ✓
│   ├── stock-out.html ✓
│   ├── inventory.html ✓
│   ├── suppliers.html ✓
│   ├── reports.html ✓
│   ├── audit-logs.html ✓
│   ├── users.html ✓
│   ├── settings.html ✓
│   └── profile.html ✓
├── assets/
│   ├── css/ (4 fayl) ✓
│   └── js/ (4 fayl) ✓
└── css/style.css ✓
```

### Hujjatlar (100% tayyor)
- ✅ README.md
- ✅ INSTALLATION.md
- ✅ FEATURES.md
- ✅ POSTGRESQL_SETUP.md
- ✅ QUICK_START.md
- ✅ STATUS.md (bu fayl)
- ✅ .gitignore
- ✅ .env.example

---

## ⏳ Kerakli qadamlar

### 1. PostgreSQL o'rnatish ⚠️

**Tizimda PostgreSQL topilmadi!**

Quyidagi variantlardan birini tanlang:

#### Variant A: Rasmiy o'rnatish (Tavsiya)
1. https://www.postgresql.org/download/windows/ dan yuklab oling
2. PostgreSQL 16 ni o'rnating
3. Parol o'rnating (masalan: `postgres123`)
4. pgAdmin 4 ni ishga tushiring
5. `warehouse_db` bazasini yarating

#### Variant B: Docker
```powershell
docker run --name warehouse-postgres `
  -e POSTGRES_PASSWORD=postgres123 `
  -e POSTGRES_DB=warehouse_db `
  -p 5432:5432 -d postgres:16
```

📖 **Batafsil yo'riqnoma:** [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)

### 2. Ma'lumotlar bazasiga jadvallar yaratish

```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"

# Migratsiya - jadvallar yaratish
npx prisma migrate dev --name init

# Seed - boshlang'ich ma'lumotlar
npm run seed
```

### 3. Backend serverni ishga tushirish

```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"
npm run dev
```

✅ Backend ishga tushsa: http://localhost:3010

### 4. Frontend ochish

```powershell
# Variant A: VS Code Live Server
# frontend/index.html > Open with Live Server

# Variant B: Python
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\frontend"
python -m http.server 8080

# Variant C: Brauzerda to'g'ridan-to'g'ri ochish
# frontend/index.html
```

### 5. Birinchi foydalanuvchi yaratish

1. Login sahifasiga o'ting
2. Ro'yxatdan o'ting:
   - Login: `admin`
   - Email: `admin@warehouse.uz`
   - Parol: `admin123`
   - To'liq ism: `Administrator`

⚠️ **Birinchi foydalanuvchi avtomatik Admin bo'ladi!**

---

## 📊 Xususiyatlar

### Backend API Endpoints

**Authentication:**
- POST `/api/auth/register` - Ro'yxatdan o'tish
- POST `/api/auth/login` - Kirish
- POST `/api/auth/logout` - Chiqish
- POST `/api/auth/refresh-token` - Token yangilash
- GET `/api/auth/profile` - Profil

**Products:**
- GET `/api/products` - Ro'yxat
- POST `/api/products` - Yaratish
- GET `/api/products/:id` - Bittasini olish
- PUT `/api/products/:id` - Yangilash
- DELETE `/api/products/:id` - O'chirish

**Categories:**
- GET `/api/categories`
- POST `/api/categories`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`

**Suppliers:**
- GET `/api/suppliers`
- POST `/api/suppliers`
- PUT `/api/suppliers/:id`
- DELETE `/api/suppliers/:id`

**Stock In:**
- GET `/api/stock-in`
- POST `/api/stock-in`
- GET `/api/stock-in/:id`

**Stock Out:**
- GET `/api/stock-out`
- POST `/api/stock-out`
- GET `/api/stock-out/:id`

**Inventory:**
- GET `/api/inventory` - Ombor qoldig'i
- GET `/api/inventory/:id` - Mahsulot tarixi

**Reports:**
- GET `/api/reports/stock-summary` - Umumiy hisobot
- GET `/api/reports/stock-movements` - Harakatlar
- GET `/api/reports/period` - Davr hisoboti

**Dashboard:**
- GET `/api/dashboard/stats` - Statistika
- GET `/api/dashboard/charts` - Grafiklar

**Users:**
- GET `/api/users`
- POST `/api/users`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

**Settings:**
- GET `/api/settings`
- PUT `/api/settings`

**Audit Logs:**
- GET `/api/audit-logs`

**Notifications:**
- GET `/api/notifications`
- PUT `/api/notifications/:id/read`

### Ma'lumotlar bazasi jadvallari

1. **User** - Foydalanuvchilar
2. **Role** - Rollar (Admin, Operator, Omborchi)
3. **Permission** - Ruxsatlar
4. **Session** - Foydalanuvchi sesiiyalari
5. **Product** - Mahsulotlar
6. **Category** - Kategoriyalar
7. **Unit** - O'lchov birliklari
8. **Supplier** - Yetkazib beruvchilar
9. **StockIn** - Kirim operatsiyalari
10. **StockOut** - Chiqim operatsiyalari
11. **InventoryLog** - Ombor tarixi
12. **AuditLog** - Harakatlar tarixi
13. **CompanySettings** - Kompaniya sozlamalari
14. **Notification** - Xabarnomalar

### Xavfsizlik xususiyatlari

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Password hashing (bcryptjs)
- ✅ Role-based access control
- ✅ Audit logging (IP, User Agent tracking)
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL Injection protection (Prisma ORM)

---

## 🎯 Tizim funksiyalari

### Dashboard
- Jami mahsulotlar soni
- Jami yetkazib beruvchilar
- Kam qolgan mahsulotlar
- Bugungi kirim/chiqim
- Grafik: Oylik kirim/chiqim
- Grafik: Kategoriyalar bo'yicha taqsimot
- So'nggi kirim operatsiyalari
- So'nggi chiqim operatsiyalari

### Mahsulotlar
- CRUD operatsiyalar
- Mahsulot kodi (unique)
- Kategoriya va o'lchov birligi
- Sotib olish va sotish narxi
- Minimal qoldiq chegarasi
- Joriy qoldiq (avtomatik hisob)
- Qidiruv, filtrlash, saralash
- Pagination

### Kirim/Chiqim
- Mahsulot tanlash
- Miqdor va narx kiritish
- Yetkazib beruvchi (kirim uchun)
- Oluvchi (chiqim uchun)
- Avtomatik qoldiqni yangilash
- Avtomatik inventory log
- Izoh qo'shish

### Ombor qoldig'i
- Real vaqt qoldiqlari
- Kam qolgan mahsulotlar ogohlantirishi
- Mahsulot tarixi
- Kirim/chiqim tarixi

### Hisobotlar
- Ombor holati
- Kirim/chiqim harakatlari
- Davr bo'yicha hisobotlar
- Excel eksport (kutilmoqda)
- PDF eksport (kutilmoqda)

### Foydalanuvchilar
- Admin, Operator, Omborchi rollari
- Ruxsatlar boshqaruvi
- Foydalanuvchi holati (active/inactive)
- Oxirgi kirish vaqti

### Harakatlar tarixi
- Barcha operatsiyalar yoziladi
- Kim, qachon, qaysi amal
- IP manzil va brauzer ma'lumoti
- Filtrlash va qidiruv

### Sozlamalar
- Kompaniya nomi
- Logo
- Kontakt ma'lumotlari
- Valyuta
- Sana formati

---

## 📁 Loyiha tuzilmasi

```
70-qadam Loyiha/
│
├── backend/
│   ├── node_modules/          ✅
│   ├── prisma/
│   │   ├── schema.prisma      ✅
│   │   └── seed.js            ✅
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    ✅
│   │   ├── controllers/       ✅ (8 fayllar)
│   │   ├── middleware/        ✅ (4 fayllar)
│   │   ├── routes/            ✅ (15 fayllar)
│   │   ├── utils/
│   │   │   └── jwt.js         ✅
│   │   └── server.js          ✅
│   ├── .env                   ✅
│   ├── .env.example           ✅
│   ├── package.json           ✅
│   └── package-lock.json      ✅
│
├── frontend/
│   ├── assets/
│   │   ├── css/               ✅ (4 fayllar)
│   │   ├── js/                ✅ (4 fayllar)
│   │   └── img/               ✅
│   ├── pages/                 ✅ (12 sahifalar)
│   ├── css/
│   │   └── style.css          ✅
│   ├── index.html             ✅
│   └── login.html             ✅
│
├── README.md                  ✅
├── INSTALLATION.md            ✅
├── POSTGRESQL_SETUP.md        ✅
├── QUICK_START.md             ✅
├── FEATURES.md                ✅
├── STATUS.md                  ✅ (bu fayl)
├── .gitignore                 ✅
└── .env.example               ✅
```

---

## 🔧 Texnik ma'lumotlar

### Backend Stack
- Runtime: Node.js v18+
- Framework: Express.js v4.18
- ORM: Prisma v5.8
- Database: PostgreSQL v14+
- Auth: JWT (jsonwebtoken v9.0)
- Password: bcryptjs v2.4
- Security: helmet, cors, express-rate-limit
- Validation: express-validator

### Frontend Stack
- HTML5
- CSS3 (Variables, Flexbox, Grid)
- JavaScript ES6+
- Chart.js (grafiklar)
- Fetch API
- LocalStorage (token va user)

### Port va URL'lar
- Backend API: http://localhost:3010
- Frontend: http://localhost:8080 (yoki boshqa port)
- PostgreSQL: localhost:5432

### Environment o'zgaruvchilar
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/warehouse_db"
JWT_SECRET="warehouse-jwt-secret-key-change-this-in-production-2024"
JWT_REFRESH_SECRET="warehouse-refresh-secret-key-change-this-in-production-2024"
JWT_EXPIRE="24h"
JWT_REFRESH_EXPIRE="7d"
PORT=3010
NODE_ENV="development"
```

---

## 🚨 Muhim eslatmalar

1. **PostgreSQL majburiy!** Tizim ishlashi uchun PostgreSQL o'rnatilgan va ishlab turgan bo'lishi kerak.

2. **Birinchi foydalanuvchi Admin** - Ro'yxatdan o'tgan birinchi foydalanuvchi avtomatik Admin huquqiga ega bo'ladi.

3. **Demo ma'lumotlar yo'q** - Barcha jadvallar bo'sh holatda yaratiladi. Foydalanuvchi o'zi ma'lumot kiritadi.

4. **Parollarni o'zgartiring** - Production muhitda .env faylidagi JWT_SECRET larni o'zgartiring!

5. **HTTPS kerak** - Production'da HTTPS ishlatng.

---

## 📞 Keyingi qadamlar

**HOZIR QILISH KERAK:**
1. PostgreSQL o'rnatish → [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)
2. Ma'lumotlar bazasiga jadvallar yaratish
3. Backend serverni ishga tushirish
4. Frontend ochish
5. Birinchi admin foydalanuvchi yaratish

**Qisqa yo'l:**
```powershell
# 1. PostgreSQL o'rnating va warehouse_db yarating

# 2. Keyin:
cd backend
npx prisma migrate dev --name init
npm run seed
npm run dev

# 3. Yangi terminal:
cd frontend
python -m http.server 8080

# 4. Brauzerda login qiling!
```

---

**Omad! Savollar bo'lsa, hujjatlarga qarang.** 🚀
