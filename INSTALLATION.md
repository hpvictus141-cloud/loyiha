# Professional Omborxona Boshqaruv Tizimi - O'rnatish Qo'llanmasi

## Texnik talablar

### Backend
- Node.js v18 yoki undan yuqori
- PostgreSQL v14 yoki undan yuqori
- npm v9 yoki undan yuqori

### Frontend
- Zamonaviy veb-brauzer (Chrome, Firefox, Safari, Edge)
- Live Server yoki boshqa statik server

## O'rnatish qadamlari

### 1. Loyihani yuklab olish
```bash
git clone <repository-url>
cd warehouse-management-system
```

### 2. PostgreSQL ma'lumotlar bazasini yaratish

PostgreSQL serveringizga kiring va yangi ma'lumotlar bazasi yarating:

```sql
CREATE DATABASE warehouse_db;
```

### 3. Backend sozlash

#### 3.1. Backend papkasiga o'ting
```bash
cd backend
```

#### 3.2. Node modullarini o'rnating
```bash
npm install
```

#### 3.3. Environment faylini sozlang
`.env.example` faylidan nusxa oling va `.env` nomini bering:

```bash
copy .env.example .env
```

`.env` faylini oching va quyidagi parametrlarni o'z ma'lumotlaringizga moslang:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/warehouse_db"
JWT_SECRET="your-secure-random-secret-key-here"
JWT_REFRESH_SECRET="your-secure-refresh-secret-key-here"
JWT_EXPIRE="24h"
JWT_REFRESH_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
```

**Muhim:** Production muhitda `JWT_SECRET` va `JWT_REFRESH_SECRET` qiymatlarini kuchli tasodifiy qatorlarga o'zgartiring!

#### 3.4. Ma'lumotlar bazasi migratsiyasini bajaring
```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 3.5. Backend serverni ishga tushiring
```bash
npm run dev
```

Backend server `http://localhost:5000` da ishga tushadi.

### 4. Frontend sozlash

Yangi terminal oynasini oching:

#### 4.1. Frontend papkasiga o'ting
```bash
cd frontend
```

#### 4.2. Live Server yordamida ochish

**VS Code ishlatuvchilari uchun:**
1. VS Code'da `index.html` faylini oching
2. Sichqoncha o'ng tugmasini bosing
3. "Open with Live Server" ni tanlang

**Boshqa usul:**
Agar Live Server o'rnatilmagan bo'lsa, Python orqali server ishga tushiring:

```bash
# Python 3 bo'lsa
python -m http.server 8080

# Yoki
python3 -m http.server 8080
```

Brauzerda `http://localhost:8080` ga o'ting.

### 5. Birinchi foydalanuvchini yaratish

1. Brauzerda `http://localhost:8080/login.html` ga o'ting
2. "Boshlash" tugmasini bosing
3. Ro'yxatdan o'tish formasi ochiladi (backend avtomatik redirect qiladi)
4. Quyidagi ma'lumotlarni kiriting:
   - Foydalanuvchi nomi: `admin`
   - Email: `admin@warehouse.uz`
   - Parol: `admin123` (keyin o'zgartiring!)
   - To'liq ism: `Administrator`
   - Telefon: `+998901234567`

**Muhim:** Birinchi ro'yxatdan o'tgan foydalanuvchi avtomatik Admin huquqiga ega bo'ladi!

## API Endpoint'lari

Backend server quyidagi asosiy endpoint'larni taqdim etadi:

### Autentifikatsiya
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Tizimga kirish
- `POST /api/auth/refresh-token` - Token yangilash
- `POST /api/auth/logout` - Chiqish
- `GET /api/auth/profile` - Profil ma'lumotlari

### Mahsulotlar
- `GET /api/products` - Mahsulotlar ro'yxati
- `POST /api/products` - Yangi mahsulot
- `PUT /api/products/:id` - Mahsulotni yangilash
- `DELETE /api/products/:id` - Mahsulotni o'chirish

### Kirim/Chiqim
- `GET /api/stock-in` - Kirim operatsiyalari
- `POST /api/stock-in` - Yangi kirim
- `GET /api/stock-out` - Chiqim operatsiyalari
- `POST /api/stock-out` - Yangi chiqim

### Hisobotlar
- `GET /api/reports/stock-summary` - Ombor holati
- `GET /api/reports/stock-movements` - Harakatlar tarixi
- `GET /api/dashboard/stats` - Dashboard statistika

To'liq API documentation uchun backend serverda `/api/docs` ga tashrif buyuring (agar Swagger o'rnatilgan bo'lsa).

## Xavfsizlik

### Production uchun tavsiyalar

1. **Environment o'zgaruvchilari**
   - Kuchli JWT secretlar ishlatng
   - Ma'lumotlar bazasi parolini himoyalang
   - `.env` faylini hech qachon git'ga qo'shmang

2. **HTTPS**
   - Production'da faqat HTTPS ishlatng
   - SSL sertifikatini sozlang

3. **CORS**
   - Faqat ishonchli domenlarni ruxsat bering
   - Wildcard (`*`) ishlatmang

4. **Rate Limiting**
   - Backend'da allaqachon sozlangan
   - Kerak bo'lsa, sozlamalarni `.env` da o'zgartiring

5. **Ma'lumotlar bazasi**
   - Muntazam backup oling
   - Kuchli parollar ishlatng
   - Firewall orqali kirshni cheklang

## Muammolarni hal qilish

### Backend ishga tushmayapti
1. Node.js versiyasini tekshiring: `node --version`
2. PostgreSQL ishlab turganini tekshiring
3. `.env` faylini to'g'ri sozlanganini tekshiring
4. Port 5000 band emasligini tekshiring

### Ma'lumotlar bazasi xatosi
1. PostgreSQL serveri ishlab turganini tekshiring
2. DATABASE_URL to'g'ri sozlanganini tasdiqlang
3. Ma'lumotlar bazasi yaratilganini tekshiring
4. Migratsiyani qayta bajaring: `npx prisma migrate reset`

### Frontend backend'ga ulanmayapti
1. Backend serveri ishlab turganini tekshiring
2. `frontend/assets/js/api.js` faylida API_BASE URL ni tekshiring
3. CORS sozlamalari to'g'ri ekanligini tasdiqlang
4. Brauzer konsolida xatolarni ko'ring (F12)

### Login qila olmayman
1. Foydalanuvchi yaratilganini tekshiring
2. Parol to'g'ri kiritilganini tasdiqlang
3. Backend loglarini ko'ring
4. JWT secret sozlanganini tekshiring

## Qo'shimcha

### Standart foydalanuvchi rollari

1. **Admin** - Barcha huquqlar
2. **Operator** - Kirim/chiqim, hisobotlar
3. **Omborchi** - Faqat ombor operatsiyalari

### O'lchov birliklari qo'shish

Ma'lumotlar bazasiga standart o'lchov birliklarini qo'shish:

```sql
INSERT INTO "Unit" (id, name, symbol) VALUES
(gen_random_uuid(), 'Dona', 'dona'),
(gen_random_uuid(), 'Kilogramm', 'kg'),
(gen_random_uuid(), 'Litr', 'l'),
(gen_random_uuid(), 'Metr', 'm'),
(gen_random_uuid(), 'Quti', 'quti');
```

### Yordam va qo'llab-quvvatlash

Muammolar yuzaga kelsa:
1. GitHub Issues bo'limiga murojaat qiling
2. Texnik hujjatlarni o'qing
3. Backend loglarini tekshiring

## Litsenziya

Ushbu loyiha Proprietary litsenziya ostida tarqatiladi.
