# Bug Hunter Adversarial Audit Hisoboti (2-bosqich)

**Sana**: 2026-09-11  
**Loyiha**: OmborXona Boshqaruv Tizimi  
**Audit Turi**: Chuqur Adversarial Tekshiruv (Hunter &rarr; Skeptic &rarr; Referee)

---

## Audit Xulosasi

Bug Hunter metodologiyasi asosida loyihaning barcha qismlari (`backend/`, `frontend/`, `api/`, ma'lumotlar bazasi tranzaksiyalari, xavfsizlik va kontent moderatsiyasi) to'liq qayta tekshirildi.

| Jami Tekshirilgan Muammolar | Tasdiqlangan Xatolar | Asossiz (Skeptic rad etgan) | Critical | High | Medium | Low |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 8 | **8** | 0 | 0 | **2** | **5** | **1** |

---

## Tasdiqlangan Nuqsonlar Ro'yxati

### 1. [BH2-001] Chiqindiga tashlash (Dispose) formasi mavjud bo'lmagan `/stock-outs` endpointiga so'rov yuborishi
- **Darajasi**: **High**
- **Fayl**: `backend/src/views/pages/inventory.ejs:354`
- **Tavsif**: "Ombor qoldig'i" sahifasida muddati o'tgan yoki yaroqsiz tovarlarni hisobdan chiqarish ("Chiqindiga tashlash") tugmasi bosilganda, forma `await api.post('/stock-outs', ...)` manziliga so'rov yuboradi. Serverda esa yo'l `/api/stock-out` (birlikda). Natijada so'rov 404 xatoligi bilan tugaydi va tovarni chiqitga chiqarib bo'lmaydi.
- **Yechim**: `inventory.ejs` dagi manzilni `/stock-out` ga o'zgartirish hamda `server.js` da `/api/stock-outs` ni ham qo'llab-quvvatlash uchun alias qo'shish.

---

### 2. [BH2-002] Nomaqbul so'zlar filtrida o'zbekcha "chala" so'zi xato taqiqlanganligi
- **Darajasi**: **Medium**
- **Fayl**: `backend/src/middleware/contentModerator.js:37`
- **Tavsif**: Regex #37 da `chala` so'zi haqorat sifatida kiritilgan (`(chala|dalban)`). O'zbek tilida "chala" so'zi "to'liq emas", "yarim tayyor" ma'nosini bildiradi ("chala mahsulot", "chala yuk", "chala to'lov"). Ushbu so'z qatnashgan har qanday tovar yoki izoh 400 Bad Request bilan asossiz bloklanadi.
- **Yechim**: `contentModerator.js` dan `chala` so'zini olib tashlash.

---

### 3. [BH2-003] `updateStockIn` va `updateStockOut` da NaN va Baza Validatsiya Xatosi
- **Darajasi**: **High**
- **Fayl**: `backend/src/controllers/stockIn.controller.js:316-324`, `stockOut.controller.js:324-330`
- **Tavsif**: Kirim yoki chiqim yozuvini tahrirlashda yangi miqdor yoki narx uzatilmasa, `parseFloat(undefined)` `NaN` qiymatini beradi. Bu `quantityDiff = NaN` va `newStock = NaN` ga olib keladi. Prisma bazaga `NaN` saqlashga urinib, qulab tushadi (PrismaClientValidationError).
- **Yechim**: Miqdor va narx berilmagan holatda mavjud yozuvning amaldagi qiymatlaridan foydalanish (`(quantity !== undefined && quantity !== '') ? parseFloat(quantity) : oldQuantity`).

---

### 4. [BH2-004] Audit loglar sahifasida Kirim va Chiqim soni doimiy 0 ko'rsatishi
- **Darajasi**: **Medium**
- **Fayl**: `backend/src/views/pages/audit-logs.ejs:176-177, 225-230, 235-255`
- **Tavsif**:
  1. Frontend kirim va chiqim sonini hisoblashda `l.module === 'stock_in'` va `l.module === 'stock_out'` deb qidiradi. Backend esa kirim va chiqimlarni `module: 'stock'` bilan yozadi. Shu sababli ko'rsatkichlar doimo 0 bo'lib turadi.
  2. Modul nomlari lug'atida `'stock'` kiritilmagani uchun jadvalda o'zbekcha "Omborxona" o'rniga inglizcha "stock" chiqadi.
  3. Amallar nomlari lug'atida `'in'`, `'out'`, `'in-update'`, `'out-update'` kiritilmagan.
- **Yechim**: `audit-logs.ejs` dagi filtrlash va lug'at xaritasini to'liq sinxronlash.

---

### 5. [BH2-005] API so'rovlariga mavjud bo'lmagan yo'nalishlarda HTML 404 qaytishi
- **Darajasi**: **Medium**
- **Fayl**: `backend/src/server.js:270-275`
- **Tavsif**: Mavjud bo'lmagan har qanday URL ga 404 HTML sahifasi ko'rsatilmoqda. Agar mijoz `/api/*` endpointiga noto'g'ri so'rov yuborsa, JSON o'rniga to'liq HTML sahifasi qaytadi, bu esa API integratsiyalarini va frontend xato ko'rsatkichlarini buzadi.
- **Yechim**: `/api/*` so'rovlari uchun alohida JSON formatidagi 404 javob beruvchi middleware qo'shish.

---

### 6. [BH2-006] Paginatsiyada `page=0` yoki manfiy qiymat kelganda Prisma 500 Crash
- **Darajasi**: **Medium**
- **Fayl**: `backend/src/controllers/product.controller.js:15`, `category.controller.js`, `supplier.controller.js`, `stockIn.controller.js`, `stockOut.controller.js`, `user.controller.js`, `inventory.routes.js`
- **Tavsif**: `skip = (page - 1) * limit`. Agar `page=0` yoki manfiy bo'lsa, `skip` manfiy bo'ladi. Prisma query engine `AssertionError: Invalid value for skip argument: Value can only be positive, found: -10` xatosi bilan so'rovni 500 xatosi bilan to'xtatadi.
- **Yechim**: Barcha paginatsiyalarda `Math.max(1, parseInt(page) || 1)` va `Math.max(0, (cleanPage - 1) * cleanLimit)` qo'llash.

---

### 7. [BH2-007] Login vaqtida `accessToken` cookie saqlanmasligi
- **Darajasi**: **Low**
- **Fayl**: `backend/src/controllers/auth.controller.js:153`, `backend/src/middleware/auth.js:10`
- **Tavsif**: `auth.js` middleware'i cookie orqali avtorizatsiyani qo'llab-quvvatlaydi, biroq `auth.controller.js` login qilinganda cookie o'rnatmaydi, logoutda esa tozalamaydi.
- **Yechim**: Login va refreshToken endpointlarida `httpOnly: true, sameSite: 'lax'` cookie o'rnatish, logoutda esa tozalash.

---

### 8. [BH2-008] Inventarizatsiya sahifasida `status` filtri serverga ulanmaganligi
- **Darajasi**: **Medium**
- **Fayl**: `backend/src/views/pages/inventory.ejs:210, 219-221`
- **Tavsif**: `/inventory` sahifasida "Yaroqsiz" yoki "Yaxshi" filtri tanlanganda, server faqat 1-sahifadagi 20 ta tovarni qaytaradi, frontend esa faqat o'sha 20 ta tovar ichidan filtrlaydi. Natijada keyingi sahifalardagi yaroqsiz tovarlar ko'rinmay qoladi va umumiy hisob noto'g'ri ko'rsatiladi.
- **Yechim**: Backend `/api/products` ga `status` filtratsiyasini qo'shish yoki server darajasida qoldiq bo'yicha saralashni to'g'rilash.

---

## Tuzatish va Qayta Tekshirish (Remediation & Verification)

Barcha 8 ta tasdiqlangan nuqson to'liq tuzatildi va tekshirildi:

| ID | Darajasi | Muammo | Holat | O'zgartirilgan Fayllar |
| :--- | :---: | :--- | :---: | :--- |
| **BH2-001** | High | Chiqindiga chiqarish 404 xatoligi | **TUZATILDI** | `inventory.ejs`, `server.js` |
| **BH2-002** | Medium | "chala" so'zining asossiz taqiqlanishi | **TUZATILDI** | `contentModerator.js` |
| **BH2-003** | High | Qisman yangilashda NaN va Prisma validatsiya qulashi | **TUZATILDI** | `stockIn.controller.js`, `stockOut.controller.js` |
| **BH2-004** | Medium | Audit loglarda Kirim/Chiqim ko'rsatkichi 0 bo'lishi | **TUZATILDI** | `audit-logs.ejs` |
| **BH2-005** | Medium | API endpointlariga HTML 404 javob qaytishi | **TUZATILDI** | `server.js` |
| **BH2-006** | Medium | Manfiy/0 paginatsiyada Prisma assertion qulashi | **TUZATILDI** | Barcha kontrollerlar va routerlar |
| **BH2-007** | Low | Cookie orqali avtorizatsiyaning to'liq ishlamasligi | **TUZATILDI** | `auth.controller.js` |
| **BH2-008** | Medium | Inventarizatsiyada status bo'yicha qidiruv/sahifalash | **TUZATILDI** | `product.controller.js`, `inventory.ejs` |

