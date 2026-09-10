# 🚀 OmborXona - To'liq Node.js Full-Stack Tizimi

Zamonaviy Omborxona Boshqaruv Tizimi - Node.js, Express, Prisma, PostgreSQL

## 📋 Texnologiyalar

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend  
- **Vanilla JavaScript** - No framework overhead
- **Modern CSS** - CSS3 + CSS Variables
- **HTML5** - Semantic markup
- **Chart.js** - Data visualization

### DevOps
- **Node --watch** - Auto-restart on changes
- **Prisma Studio** - Database GUI
- **Morgan** - HTTP request logger

## 🎯 Xususiyatlar

✅ **Bitta Node.js Server** - Backend API + Frontend serving
✅ **Real-time Updates** - Avtomatik yangilanish
✅ **Dark/Light Theme** - Mavzu o'zgartirish
✅ **Role-based Access** - Admin va Operator rollari
✅ **Responsive Design** - Mobile-friendly
✅ **Modern UI/UX** - Zamonaviy qora-ko'k dizayn
✅ **Fast Performance** - Optimallashtirilgan

## 📦 O'rnatish

### 1. Talablar

```bash
# Node.js versiyasini tekshirish
node --version  # 18.0.0 yoki yuqori bo'lishi kerak

# PostgreSQL o'rnatilgan bo'lishi kerak
psql --version
```

### 2. Loyihani yuklab olish

```bash
cd "c:\Users\User\OneDrive\Desktop\70-qadam Loyiha"
```

### 3. Dependencies o'rnatish

```bash
# Root dan o'rnatish
npm run setup

# Yoki backend papkasida
cd backend
npm install
```

### 4. Database sozlash

```bash
# Database yaratish (agar yo'q bo'lsa)
# PostgreSQL ga ulanish
psql -U postgres

# Database yaratish
CREATE DATABASE warehouse_db;
\q

# .env faylini sozlash
cd backend
# .env faylini tahrirlang (DATABASE_URL)
```

### 5. Prisma migratsiya

```bash
# Backend papkasida
npm run migrate

# Seed data qo'shish (ixtiyoriy)
npm run seed
```

## 🚀 Ishga Tushirish

### Development Mode

```bash
# Root papkadan
npm run dev

# Yoki backend papkadan
cd backend
npm run dev
```

Server ishga tushadi:
- **Frontend:** http://localhost:3010
- **Backend API:** http://localhost:3010/api
- **Login:** http://localhost:3010/login.html

### Production Mode

```bash
npm start
```

## 📁 Loyiha Strukturasi

```
70-qadam Loyiha/
├── backend/
│   ├── src/
│   │   ├── server.js              # Asosiy server (API + Frontend)
│   │   ├── config/                # Database config
│   │   ├── controllers/           # API controllers
│   │   ├── middleware/            # Auth, error handling
│   │   ├── routes/                # API routes
│   │   └── utils/                 # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── migrations/            # Database migrations
│   │   └── seed.js                # Seed data
│   ├── .env                       # Environment variables
│   └── package.json               # Backend dependencies
│
├── frontend/
│   ├── assets/
│   │   ├── css/                   # Styles
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   └── dashboard.css
│   │   └── js/                    # JavaScript
│   │       ├── api.js             # API client
│   │       ├── auth.js            # Authentication
│   │       ├── utils.js           # Utilities
│   │       ├── layout.js          # Layout management
│   │       └── realtime.js        # Real-time features
│   ├── pages/                     # HTML pages
│   ├── index.html                 # Landing page
│   └── login.html                 # Login page
│
├── package.json                   # Root package.json
└── README_NODE.md                 # This file
```

## 🔧 Konfiguratsiya

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/warehouse_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRE="24h"
JWT_REFRESH_EXPIRE="7d"

# Server
PORT=3010
NODE_ENV="development"

# File Upload
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh token

### Products
- `GET /api/products` - Mahsulotlar ro'yxati
- `POST /api/products` - Mahsulot qo'shish
- `PUT /api/products/:id` - Mahsulot tahrirlash
- `DELETE /api/products/:id` - Mahsulot o'chirish

### Stock Operations
- `POST /api/stock-in` - Kirim
- `POST /api/stock-out` - Chiqim
- `GET /api/inventory` - Ombor qoldig'i

### Reports
- `GET /api/reports/stock-movement` - Harakat hisoboti
- `GET /api/reports/export/pdf` - PDF export
- `GET /api/reports/export/excel` - Excel export

## 👥 Default Foydalanuvchilar

### Admin
- **Login:** admin
- **Parol:** admin123
- **Rol:** Admin (to'liq huquqlar)

### Operator
- **Login:** operator
- **Parol:** operator123
- **Rol:** Operator (cheklangan huquqlar)

## 🛠️ Development Commands

```bash
# Server ishga tushirish (auto-restart)
npm run dev

# Database migratsiya
npm run migrate

# Prisma Studio (Database GUI)
npm run studio

# Seed data qo'shish
npm run seed

# Production build
npm run build

# Production start
npm start
```

## 📱 Frontend Routing

Node.js server frontend fayllarini avtomatik serve qiladi:

- `/` → `index.html` (Landing page)
- `/login.html` → Login sahifasi
- `/pages/dashboard.html` → Dashboard
- `/pages/products.html` → Mahsulotlar
- Va boshqalar...

## 🔐 Xavfsizlik

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Helmet.js security headers
- ✅ CORS sozlamalari
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection (Prisma)

## 🚀 Performance

- ⚡ Compression middleware
- ⚡ Static file caching
- ⚡ Database connection pooling
- ⚡ Optimized queries
- ⚡ Minimal CSS/JS

## 📝 To'liq Funksiyalar

1. **Dashboard** - Statistika va grafiklar
2. **Mahsulotlar** - CRUD operatsiyalari
3. **Kategoriyalar** - Mahsulot turlari
4. **Kirim/Chiqim** - Stock operatsiyalari
5. **Ombor qoldig'i** - Real-time inventory
6. **Yetkazib beruvchilar** - Supplier management
7. **Hisobotlar** - PDF va Excel export
8. **Foydalanuvchilar** - User management (Admin)
9. **Harakatlar tarixi** - Audit logs
10. **Sozlamalar** - System settings

## 🐛 Troubleshooting

### Database connection error
```bash
# PostgreSQL ishlab turganini tekshiring
# Windows:
Get-Service -Name postgresql*

# Database mavjudligini tekshiring
psql -U postgres -l
```

### Port already in use
```bash
# 3010 portni band qilgan jarayonni toping
netstat -ano | findstr :3010

# Jarayonni to'xtating
taskkill /PID <process_id> /F
```

### Prisma errors
```bash
# Prisma clientni qayta generate qiling
cd backend
npx prisma generate

# Migrationlarni reset qiling
npx prisma migrate reset
```

## 📚 Qo'shimcha Ma'lumot

- **Node.js:** https://nodejs.org
- **Express:** https://expressjs.com
- **Prisma:** https://prisma.io
- **PostgreSQL:** https://postgresql.org

## 📞 Support

Savol yoki muammo bo'lsa, loyiha papkasidagi `STATUS.md` faylini ko'ring.

---

**Made with ❤️ using Node.js**
