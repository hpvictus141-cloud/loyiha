# 🚀 Loyihani Ishga Tushirish - Node.js

## ✅ Tayyor!

Loyiha to'liq Node.js ga o'tkazildi. Endi bitta server backend API va frontend'ni birga serve qiladi.

## 📦 1. Dependencies o'rnatish

```powershell
# Backend papkasida
cd backend
npm install
```

## 🗄️ 2. Database sozlash

```powershell
# Backend papkasida
# Prisma generate
npm run generate

# Migration
npm run migrate

# Seed data (demo data)
npm run seed
```

## 🚀 3. Serverni ishga tushirish

```powershell
# Development mode (auto-restart)
cd backend
npm run dev
```

**Yoki root papkadan:**

```powershell
npm run dev
```

## 🌐 4. Brauzerda ochish

Server ishga tushgandan keyin:

- **Frontend (Landing):** http://localhost:3010
- **Login:** http://localhost:3010/login.html  
- **Dashboard:** http://localhost:3010/pages/dashboard.html
- **Backend API:** http://localhost:3010/api

## 👤 Login Ma'lumotlari

### Admin
- **Login:** admin
- **Parol:** admin123

### Operator  
- **Login:** operator
- **Parol:** operator123

## 📂 Loyiha Strukturasi

```
70-qadam Loyiha/
├── backend/                    # Node.js backend + frontend server
│   ├── src/
│   │   ├── server.js          # Asosiy server (API + Static files)
│   │   ├── controllers/       # API controllers
│   │   ├── routes/            # API routes
│   │   └── middleware/        # Auth, validation
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Demo data
│   └── package.json
│
├── frontend/                   # Static files (HTML, CSS, JS)
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── pages/
│   └── index.html
│
├── package.json               # Root package.json
└── README_NODE.md             # To'liq yo'riqnoma
```

## 🔧 Muhim Komandalar

```powershell
# Development server (auto-restart)
npm run dev

# Production server
npm start

# Database migration
npm run migrate

# Prisma Studio (Database GUI)
npm run studio

# Seed data
npm run seed

# Server loglarini ko'rish
# Terminal da ko'rinadi
```

## ✨ Yangi Imkoniyatlar

### 1. **Bitta Port** - Bitta server
- Backend API: `http://localhost:3010/api/*`
- Frontend: `http://localhost:3010/*`

### 2. **Auto-reload**
- Backend kod o'zgarganda avtomatik restart
- `node --watch` ishlatiladi

### 3. **Static File Serving**
- Express orqali frontend fayllar serve qilinadi
- Production ready

### 4. **API + Frontend birgalikda**
- CORS muammosi yo'q
- Deployment oson

## 🎯 Production Deployment

### Vercel / Railway / Render

1. GitHub'ga push qiling
2. Service'da yangi project yarating
3. Environment variables kiriting
4. Deploy qiling

### Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3010
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Port band bo'lsa

```powershell
# 3010 portdagi jarayonni toping
netstat -ano | findstr :3010

# To'xtating
taskkill /PID <process_id> /F
```

### Database connection xatosi

```powershell
# PostgreSQL ishlab turganini tekshiring
Get-Service -Name postgresql*

# Database mavjudligini tekshiring
psql -U postgres -l
```

### Prisma xatosi

```powershell
# Prisma clientni qayta generate
cd backend
npx prisma generate

# Migrationni reset
npx prisma migrate reset
```

## 📊 Server Output

Server ishga tushganda ko'rinadi:

```
🚀 Server ishga tushdi:
   - Backend API: http://localhost:3010/api
   - Frontend: http://localhost:3010
   - Environment: development
```

## 🎨 Frontend

Frontend fayllar `frontend/` papkasida:
- **HTML** - Pages
- **CSS** - Zamonaviy qora-ko'k dizayn
- **JavaScript** - Vanilla JS (no framework)

Backend Express server bu fayllarni static serve qiladi.

## 📝 Eslatma

- ✅ Backend va Frontend birgalikda ishlaydi
- ✅ Bitta port (3010)
- ✅ Auto-reload yoqilgan
- ✅ Production ready
- ✅ CORS yo'q
- ✅ Simple deployment

---

**Muammo bo'lsa `README_NODE.md` ni o'qing!**
