# Professional Omborxona Boshqaruv Tizimi - Funksiyalar

## Asosiy Funksiyalar

### 1. Dashboard
- **Real vaqt statistikasi**
  - Jami mahsulotlar soni
  - Bugungi kirim va chiqim
  - Kam qolgan mahsulotlar
  - Ombor umumiy qiymati
- **Grafiklar va vizualizatsiya**
  - Kirim-chiqim dinamikasi (Chart.js)
  - Davriy hisobotlar
  - Donut diagrammalar
- **So'nggi harakatlar**
  - Oxirgi kirimlar ro'yxati
  - Oxirgi chiqimlar ro'yxati
  - Kam qolgan mahsulotlar ogohlantirishi

### 2. Mahsulotlar Boshqaruvi
- **CRUD operatsiyalari**
  - Mahsulot qo'shish, tahrirlash, o'chirish
  - Mahsulot kodi (unique)
  - Shtrix-kod (barcode) qo'llab-quvvatlash
- **Ma'lumot maydonlari**
  - Nomi, kodi, kategoriya
  - O'lchov birligi
  - Sotib olish va sotish narxi
  - Minimal qoldiq darajasi
  - Joriy qoldiq (avtomatik hisoblangan)
  - Izoh va tavsif
- **Filtrlash va qidiruv**
  - Mahsulot nomi, kodi, shtrix-kod bo'yicha qidiruv
  - Kategoriya bo'yicha filtrlash
  - Holat bo'yicha filtrlash (faol/faol emas)
  - Saralash (asc/desc)
- **Pagination**
  - Sahifalash (15 ta yozuv)
  - Jami natijalar soni
  - Sahifa navigatsiyasi

### 3. Kategoriyalar
- Kategoriya yaratish, tahrirlash, o'chirish
- Kategoriya nomi va tavsifi
- Har bir kategoriyada mahsulotlar soni
- Qidiruv va filtrlash

### 4. Kirim Operatsiyalari
- **Kirim qo'shish**
  - Mahsulot tanlash
  - Miqdor va narx
  - Yetkazib beruvchi (ixtiyoriy)
  - Hisob raqam / faktura
  - Sana va izoh
  - Avtomatik jami summa hisoblash
- **Qoldiqni avtomatik yangilash**
  - Kirim kiritilganda qoldiq avtomatik ortadi
  - Inventory log yozuvi yaratiladi
- **Ogohlantirishlar**
  - Agar qoldiq minimal darajadan oshsa, ogohlantirish
- **Tarix va kuzatuv**
  - Kimdir qo'shgan (user tracking)
  - Qachon qo'shilgan (timestamp)
  - IP manzil va brauzer (audit log)

### 5. Chiqim Operatsiyalari
- **Chiqim qo'shish**
  - Mahsulot tanlash
  - Joriy qoldiqni ko'rsatish
  - Miqdor kiritish (qoldiqdan oshmasligi kerak)
  - Kimga berildi (ism, telefon)
  - Sana va izoh
- **Qoldiqni avtomatik kamaytirish**
  - Chiqim kiritilganda qoldiq avtomatik kamayadi
  - Agar qoldiq yetarli bo'lmasa, xato
- **Ogohlantirishlar**
  - Qoldiq tugasa, ogohlantirish
  - Minimal darajadan pastga tushsa, xabar

### 6. Ombor Qoldig'i
- **Real vaqt holati**
  - Barcha mahsulotlarning joriy qoldig'i
  - Jami ombor qiymati
  - Kam qolgan mahsulotlar
  - Tugagan mahsulotlar
- **Filtrlash**
  - Kategoriya bo'yicha
  - Holat bo'yicha (kam qolgan, yetarli, tugagan)
  - Qidiruv
- **Vizual indikatorlar**
  - Qizil rang: tugagan
  - Sariq rang: kam qolgan
  - Yashil rang: yetarli

### 7. Yetkazib Beruvchilar
- **Yetkazib beruvchi ma'lumotlari**
  - Korxona nomi
  - Mas'ul shaxs
  - Telefon, email, manzil
  - STIR (soliq identifikatsion raqami)
  - Izoh
- **Statistika**
  - Har bir yetkazib beruvchidan nechta kirim bo'lgan
  - So'nggi kirimlar tarixi
- **CRUD operatsiyalari**
  - Qo'shish, tahrirlash, o'chirish
  - Qidiruv va filtrlash

### 8. Hisobotlar
- **Ombor holati hisoboti**
  - Barcha mahsulotlarning joriy holati
  - Jami qiymat
  - PDF va Excel eksport
- **Harakatlar tarixi**
  - Barcha kirim-chiqim operatsiyalari
  - Sana oraliqi bo'yicha
  - Mahsulot bo'yicha filtrlash
- **Davriy hisobotlar**
  - Kunlik, haftalik, oylik, yillik
  - Kirim-chiqim statistikasi
  - Grafiklar va vizualizatsiya
- **Chop etish**
  - Hisobotlarni chop etish imkoniyati

### 9. Foydalanuvchilar Boshqaruvi
- **Rol-based access control (RBAC)**
  - Admin: barcha huquqlar
  - Operator: kirim-chiqim, hisobotlar
  - Omborchi: faqat ombor operatsiyalari
- **Foydalanuvchi yaratish**
  - To'liq ism, username, email, parol
  - Rol tanlash
  - Telefon raqami
- **Holat boshqaruvi**
  - Faol/Faol emas
  - Oxirgi kirish vaqti
- **Profil**
  - Shaxsiy ma'lumotlarni o'zgartirish
  - Parolni o'zgartirish
  - Profil rasmi

### 10. Sozlamalar
- **Korxona ma'lumotlari**
  - Korxona nomi, logo
  - Telefon, email, manzil
  - STIR
- **Tizim sozlamalari**
  - Valyuta (UZS, USD, EUR, RUB)
  - Sana formati (DD.MM.YYYY, YYYY-MM-DD, MM/DD/YYYY)
  - Interfeys mavzusi (Light/Dark mode)
- **Ma'lumotlar bazasi**
  - Zaxira nusxa yaratish (backup)
  - Tiklash (restore)

### 11. Harakatlar Tarixi (Audit Logs)
- **Barcha amallarni kuzatish**
  - Kim bajargan (user)
  - Qaysi modul (products, stock, users, etc.)
  - Qaysi amal (create, update, delete)
  - Qachon bajarilgan (timestamp)
  - IP manzil va brauzer
- **Filtrlash**
  - Modul bo'yicha
  - Sana oralig'i bo'yicha
  - Foydalanuvchi bo'yicha
- **Pagination**
  - 50 ta yozuv bir sahifada

### 12. Bildirishnomalar
- **Avtomatik ogohlantirishlar**
  - Mahsulot qoldig'i minimal darajaga yetganda
  - Mahsulot tugaganda
- **Bildirishnomalar paneli**
  - O'qilgan/o'qilmagan
  - Vaqt tamg'asi
  - Barchani o'qilgan deb belgilash

## Texnik Xususiyatlar

### Backend (Node.js + Express + PostgreSQL)
- **RESTful API**
  - Clean architecture
  - Controller → Service → Repository pattern
  - Error handling middleware
- **Autentifikatsiya va Avtorizatsiya**
  - JWT (Access + Refresh tokens)
  - bcrypt (password hashing)
  - Role-based permissions
- **Xavfsizlik**
  - Helmet (HTTP headers security)
  - CORS
  - Rate limiting
  - SQL injection himoyasi (Prisma ORM)
  - XSS himoyasi
- **Validation**
  - express-validator
  - Input sanitization
- **Logging**
  - Morgan (HTTP request logging)
  - Audit logging
- **Database**
  - Prisma ORM
  - Foreign keys
  - Indexes
  - Transactions
  - Migrations

### Frontend (Vanilla JavaScript)
- **UI/UX**
  - Responsive dizayn
  - Mobile-friendly
  - Dark/Light mode
  - Professional admin panel
  - Minimalist va zamonaviy
- **Komponentlar**
  - Reusable components
  - Modal oynalar
  - Toast notifications
  - Confirm dialogs
  - Loading skeletons
  - Pagination
  - Search va filters
  - Dropdown menus
- **Animatsiyalar**
  - Smooth transitions
  - Hover effects
  - Fade in/out
- **Grafiklar**
  - Chart.js integration
  - Line charts
  - Bar charts
  - Doughnut charts
- **State Management**
  - LocalStorage (tokens, user, theme)
  - Session management

### Ma'lumotlar Bazasi (PostgreSQL + Prisma)
- **14 ta jadval**
  - User, Role, Permission
  - Product, Category, Unit
  - Supplier
  - StockIn, StockOut
  - InventoryLog
  - AuditLog
  - Session
  - CompanySettings
  - Notification
- **Munosabatlar**
  - One-to-many
  - Many-to-many
  - Foreign keys
  - Cascade operations
- **Indexes**
  - Unique constraints
  - Search optimization
  - Performance indexes

## Loyiha Tuzilmasi

```
warehouse-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── supplier.controller.js
│   │   │   ├── stockIn.controller.js
│   │   │   ├── stockOut.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── auditLog.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   └── ... (boshqa route'lar)
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   ├── landing.css
│   │   │   └── dashboard.css
│   │   ├── js/
│   │   │   ├── api.js
│   │   │   ├── utils.js
│   │   │   ├── auth.js
│   │   │   └── layout.js
│   │   └── img/
│   │       └── favicon.svg
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── products.html
│   │   ├── categories.html
│   │   ├── stock-in.html
│   │   ├── stock-out.html
│   │   ├── inventory.html
│   │   ├── suppliers.html
│   │   ├── reports.html
│   │   ├── audit-logs.html
│   │   ├── users.html
│   │   ├── settings.html
│   │   └── profile.html
│   ├── index.html
│   └── login.html
├── .gitignore
├── README.md
├── INSTALLATION.md
└── FEATURES.md
```

## Kelajakda Qo'shilishi Mumkin Bo'lgan Funksiyalar

1. **PDF va Excel Eksport**
   - PDFKit bilan PDF generatsiya
   - ExcelJS bilan Excel eksport
   
2. **Shtrix-kod Skaneri**
   - QuaggaJS yoki ZXing integration
   - Mobil qurilmalar uchun kamera

3. **Email Bildirishnomalar**
   - Nodemailer integration
   - Kam qoldiqda email yuborish

4. **Multi-language**
   - i18n qo'llab-quvvatlash
   - O'zbek, Rus, Ingliz tillari

5. **Advanced Hisobotlar**
   - Foyda-zarar tahlili
   - ABC tahlil
   - Prognozlash

6. **Inventarizatsiya**
   - Fizik inventarizatsiya
   - Farqlarni aniqlash

7. **Multi-warehouse**
   - Bir nechta ombor boshqaruvi
   - Ombor o'rtasida transfer

8. **Mobile App**
   - React Native yoki Flutter
   - Offline rejim qo'llab-quvvatlash
