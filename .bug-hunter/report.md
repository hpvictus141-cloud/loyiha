# 🛡️ Bug Hunter — Loyiha Audit va Xavfsizlik Hisoboti

> **Tekshiruv sanasi:** 2026-09-08  
> **Rejim:** Scan-Only (Tahlil va audit rejimi — kodga o'zgartirish kiritilmagan)  
> **Metodologiya:** Bug Hunter Adversarial Audit (Hunter ➔ Skeptic ➔ Referee)  
> **Holat:** 16 ta tasdiqlangan muammo (1 Critical, 4 High, 7 Medium, 4 Low)

---

## 📊 Umumiy Statistika

| Daraja | Soni | Tavsif |
|---|---|---|
| 🔴 **CRITICAL** | 1 ta | Tizim xavfsizligiga bevosita tahdid (Privilege Escalation) |
| 🟠 **HIGH** | 4 ta | Maxfiy ma'lumotlar oshkor bo'lishi, rol bloklanishi, poyga holati, manfiy qoldiq |
| 🟡 **MEDIUM** | 7 ta | Xatoliklar, validatsiya kamchiliklari, ma'lumotlar bazasi ziddiyatlari, UI sintaksis buzilishlari |
| 🟢 **LOW** | 4 ta | Kichik IDOR, amalga oshirilmagan UI funksiyalar, xotira sarfi, sana filtrlash |

---

## 🔴 1. O'TA XAVFLI (CRITICAL) MUAMMOLAR

### [BH-001] Ro'yxatdan o'tishda ruxsatsiz Admin huquqini qo'lga kiritish (Privilege Escalation)
* **Fayl:** [`backend/src/controllers/auth.controller.js:7-64`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/auth.controller.js#L7-L64) va [`backend/src/routes/auth.routes.js:17-22`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/routes/auth.routes.js#L17-L22)
* **Zaiflik turi:** CWE-269 (Mass Assignment / Improper Privilege Management)
* **Tafsilot:** Ochiq (unauthenticated) `POST /api/auth/register` API endpointi so'rov tanasidan to'g'ridan-to'g'ri `roleId` parametrini qabul qiladi:
  ```javascript
  const { username, password, fullName, phone, roleId } = req.body;
  ...
  let finalRoleId = roleId;
  ...
  roleId: finalRoleId
  ```
  Har qanday tashqi foydalanuvchi tizimga ro'yxatdan o'tish vaqtida Admin rolining ID-sini yuborish orqali to'liq huquqli Administrator hisobini yaratib olishi mumkin.
* **Xavf darajasi:** Butun tizim va ma'lumotlar bazasi ustidan nazoratni begona shaxs egallab olishi mumkin.
* **Tavsiya:** `register` endpointidan `roleId` qabul qilishni to'xtatish (sukut bo'yicha eng past huquqli rol berish) yoki umumiy ro'yxatdan o'tishni yopib, yangi foydalanuvchilarni faqat Admin paneldagi `/api/users` orqali yaratish.

---

## 🟠 2. YUQORI DARAJALI (HIGH) MUAMMOLAR

### [BH-002] Foydalanuvchilar parollari AuditLog bazasida ochiq (plaintext) saqlanib qolishi
* **Fayl:** [`backend/src/middleware/auditLog.js:15-21`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/middleware/auditLog.js#L15-L21) va [`backend/src/routes/user.routes.js:29-45`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/routes/user.routes.js#L29-L45)
* **Zaiflik turi:** CWE-532 (Insertion of Sensitive Information into Log File)
* **Tafsilot:** `auditLog` middleware'i so'rov ma'lumotlarini bazaga saqlashda butun `req.body` obyektini filtrsiz `JSON.stringify(...)` qiladi:
  ```javascript
  details: JSON.stringify({
    method: req.method,
    path: req.path,
    body: req.body, // <--- Parol ochiq holda JSON ichida saqlanadi!
    ...
  })
  ```
  Administrator yangi foydalanuvchi qo'shganda (`POST /api/users`) yoki parolni o'zgartirganda (`POST /:id/change-password`), foydalanuvchining ochiq paroli `AuditLog` jadvaliga yoziladi. Harakatlar tarixini ko'rish huquqiga ega bo'lgan har qanday shaxs barcha parollarni o'qiy oladi.
* **Tavsiya:** `auditLog` middleware'ida `password`, `newPassword`, `currentPassword`, `token` kalitlarini log qilishdan oldin maskalash (`[REDACTED]`).

### [BH-003] Operator roli uchun Omborxona menyularining sidebar'da ko'rinmasligi (UI Bloklanish)
* **Fayl:** [`frontend/assets/js/layout.js:52-103`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/frontend/assets/js/layout.js#L52-L103)
* **Zaiflik turi:** Funksional nuqson (Broken Access Flow / Role UI Lockout)
* **Tafsilot:** `layout.js` faylida butun "Omborxona" bo'limi (Kirim `/stock-in`, Chiqim `/stock-out`, Ombor qoldig'i `/inventory`) hamda "Yetkazib beruvchilar" (`/suppliers`) havolalari faqat `${isAdmin ? ... : ''}` sharti bilan o'rab qo'yilgan.
  Garchi backend'da Operator roliga `stock:create`, `stock:update`, `suppliers:create` huquqlari berilgan bo'lsa-da, Operator profilida kirganda chap menyuda ushbu sahifalar umuman chiqmaydi.
* **Xavf darajasi:** Operator omborni boshqarish uchun tizimga kirganda asosiy vazifalarini bajarish sahifalarini ko'ra olmaydi.
* **Tavsiya:** `layout.js` da `isAdmin` o'rniga foydalanuvchining tegishli ruxsatlarini (`Auth.hasPermission('stock:create')` yoki `isOperator`) tekshirish.

### [BH-004] Chiqim qilishda poyga holati (Race Condition / TOCTOU) tufayli mahsulot qoldig'ining buzilishi
* **Fayl:** [`backend/src/controllers/stockOut.controller.js:118-167`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/stockOut.controller.js#L118-L167)
* **Zaiflik turi:** CWE-362 (Concurrent Execution using Shared Resource with Improper Synchronization)
* **Tafsilot:** `createStockOut` tranzaksiyasida mahsulot qoldig'i avval `findUnique` bilan o'qiladi, so'ngra `if (currentStock < quantityDecimal)` orqali tekshiriladi va yangilanadi. PostgreSQL'ning sukut bo'yicha `Read Committed` tranzaksiya izolyatsiyasida `findUnique` qatorni qulflamaydi (`SELECT FOR UPDATE` yo'q). Bir vaqtda bir nechta chiqim so'rovi kelsa, ikkalasi ham bir xil qoldiqni o'qib, omborda boridan ko'proq mahsulotni chiqarib yuborishi mumkin.
* **Tavsiya:** Tranzaksiya ichida `SELECT ... FOR UPDATE` (qatorni blokirovka qilish) yoki atomar kamaytirish (`decrement`) va ma'lumotlar bazasida `CHECK (current_stock >= 0)` cheklovidan foydalanish.

### [BH-005] Kirimni tahrirlashda (Update StockIn) mahsulot qoldig'i manfiy (minus) bo'lib ketishi
* **Fayl:** [`backend/src/controllers/stockIn.controller.js:271-280`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/stockIn.controller.js#L271-L280)
* **Zaiflik turi:** CWE-840 (Business Logic Flaw)
* **Tafsilot:** `updateStockIn` funksiyasida `newStock = oldStock + quantityDiff` hisoblanadi. Agar avval kiritilgan kirim miqdori kamaytirilsa (masalan, 100 tadan 10 taga) va bu vaqt ichida tovardan chiqim qilingan bo'lsa, `newStock` manfiy qiymatga tushib ketadi (`-70`). `deleteStockIn` da `if (newStock < 0)` tekshiruvi bor, ammo `updateStockIn` da bu tekshiruv unutilgan.
* **Tavsiya:** `updateStockIn` ichida `if (newStock < 0) throw new Error("Omborda yetarli mahsulot yo'q...")` tekshiruvini qo'shish.

---

## 🟡 3. O'RTA DARAJALI (MEDIUM) MUAMMOLAR

### [BH-006] Noto'g'ri `sortBy` parametri orqali Prisma 500 xatosi va ma'lumotlar bazasi sxemasi sizib chiqishi
* **Fayl:** [`backend/src/controllers/product.controller.js:10-40`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/product.controller.js#L10-L40), `stockIn.controller.js`, `stockOut.controller.js`
* **Zaiflik turi:** CWE-209 (Generation of Error Message Containing Sensitive Information)
* **Tafsilot:** URL so'rovida `?sortBy=noto'g'ri_ustun` yuborilsa, Prisma `PrismaClientValidationError` tashlaydi. `errorHandler.js` buni validatsiya xatosi sifatida ushlamasdan, 500 status kodi bilan mijozga Prisma sxemasining barcha mavjud maydonlari va ichki tuzilishini qaytarib yuboradi.
* **Tavsiya:** Qidiruv va saralash parametrlarini (`sortBy`, `sortOrder`) oq ro'yxat (whitelist) orqali tekshirish.

### [BH-007] O'zbek tilidagi tutuq belgili (`'`) mahsulotlar o'chirish tugmasi bosilganda JS Syntax Error
* **Fayl:** [`backend/src/views/pages/products.ejs:250`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/views/pages/products.ejs#L250), `categories.ejs:124`, `users.ejs:246`
* **Zaiflik turi:** CWE-79 / Client-side Logic Fault
* **Tafsilot:** O'chirish tugmasi HTML da quyidagicha yozilgan:
  ```html
  onclick="deleteProduct('${p.id}', '${Utils.escapeHtml(p.name)}')"
  ```
  `Utils.escapeHtml` faqat `<`, `>`, `&` belgilarini escape qiladi, bittalik qo'shtirnoqni (`'`) esa o'zgartirmaydi. Mahsulot nomi "Bo'yoq", "O'lchagich" yoki "G'isht" bo'lsa, HTML `onclick="deleteProduct('...', 'Bo'yoq')"` ko'rinishida generatsiya bo'lib, `Uncaught SyntaxError: Unexpected identifier 'yoq'` xatosi bilan tugma ishlamay qoladi.
* **Tavsiya:** Ma'lumotlarni inline `onclick` orqali emas, balki `data-id` va `data-name` atributlari orqali uzatish yoki `JSON.stringify` dan foydalanish.

### [BH-008] API URL manzilining qat'iy `http://localhost:3010/api` deb yozilganligi
* **Fayl:** [`frontend/assets/js/api.js:1`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/frontend/assets/js/api.js#L1)
* **Zaiflik turi:** CWE-1188 (Insecure Default Initialization of Resource)
* **Tafsilot:** `const API_BASE = 'http://localhost:3010/api';` deb yozilgan. Tizim tarmoq orqali (masalan ombordagi planshet yoki shtrix-kod skanerdan `192.168.1.50:3010`) yoki serverga domen bilan joylanganda, brauzer so'rovlarni o'zining shaxsiy `localhost`iga yuboradi va sayt ishlamay qoladi.
* **Tavsiya:** `const API_BASE = window.location.origin + '/api';` yoki nisbiy `/api` qilib belgilash.

### [BH-009] Tranzaksiyasi bor mahsulot va yetkazib beruvchilarni o'chirishda P2003 Foreign Key 500 Crash
* **Fayl:** [`backend/src/controllers/product.controller.js:187-202`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/product.controller.js#L187-L202) va `supplier.controller.js:165-180`
* **Zaiflik turi:** CWE-20 (Improper Input Validation / Foreign Key Constraint Crash)
* **Tafsilot:** Mahsulot yoki yetkazib beruvchida kirim/chiqim amallari bo'lsa, ularni to'g'ridan-to'g'ri `prisma.product.delete` orqali o'chirishga urinish PostgreSQL P2003 xatosini keltirib chiqaradi va server 500 xato beradi. Shuningdek, bu ombor audit balansini buzadi.
* **Tavsiya:** Bog'langan tranzaksiyalari bor mahsulotlarni o'chirish o'rniga soft-delete (`isActive = false`) qilish yoki xatoni oldindan tekshirib xabar berish.

### [BH-010] Kam qolgan tovarlar haqidagi ogohlantirish (Low Stock Alert) faqat amalni bajargan Operatorga borishi
* **Fayl:** [`backend/src/controllers/stockIn.controller.js:190-198`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/stockIn.controller.js#L190-L198) va `stockOut.controller.js:182-190`
* **Zaiflik turi:** CWE-840 (Business Logic Notification Flaw)
* **Tafsilot:** Mahsulot minimal qoldiqdan tushib ketganda yaratiladigan bildirishnomaga `userId: req.user.id` beriladi. Natijada ogohlantirishni faqat o'sha paytda chiqim qilgan Operator ko'radi, ammo xarid qilishga mas'ul bo'lgan Administratorlar va ombor mudiri bu bildirishnomani ko'rmaydi.
* **Tavsiya:** Ogohlantirish bildirishnomalarini `userId: null` (tizimli broadcast) qilib yaratish yoki barcha Admin foydalanuvchilarga yuborish.

### [BH-011] Mahsulotni tahrirlashda narx maydonlari validatsiyadan o'tkazilmaganligi
* **Fayl:** [`backend/src/routes/product.routes.js:31-34`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/routes/product.routes.js#L31-L34)
* **Zaiflik turi:** CWE-20 (Improper Input Validation)
* **Tafsilot:** `PUT /api/products/:id` marshrutida faqat `name` tekshiriladi. Agar narxga manfiy son yoki noto'g'ri string berilsa, `parseFloat` `NaN` qaytaradi va Prisma `Decimal cannot be created from NaN` xatosi bilan qulaydi.
* **Tavsiya:** `product.routes.js` da `purchasePrice`, `salePrice`, `minStock` uchun validatsiya qo'shish.

### [BH-012] Parol administrator tomonidan o'zgartirilganda eski sessiyalarning bekor qilinmasligi
* **Fayl:** [`backend/src/controllers/user.controller.js:315-348`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/controllers/user.controller.js#L315-L348)
* **Zaiflik turi:** CWE-613 (Insufficient Session Expiration)
* **Tafsilot:** `auth.controller.js` da foydalanuvchi parolini o'zgartirsa barcha sessiyalar o'chiriladi. Lekin Administrator boshqa foydalanuvchining parolini o'zgartirganda (`user.controller.js`), `prisma.session.deleteMany` chaqirilmagan. Xavfsizligi buzilgan hisobning refresh tokenlari muddati tugaguncha faol qoladi.
* **Tavsiya:** Admin tomonidan parol yangilanganda `prisma.session.deleteMany({ where: { userId: id } })` ni qo'shish.

---

## 🟢 4. PAST DARAJALI (LOW) VA GIGIYENA MUAMMOLARI

### [BH-013] Bildirishnomalar IDOR zaifligi (Boshqa birovning bildirishnomasini o'qilgan qilish)
* **Fayl:** [`backend/src/routes/notification.routes.js:26-39`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/routes/notification.routes.js#L26-L39)
* **Tafsilot:** `PUT /api/notifications/:id/read` da `userId` tekshirilmaydi. Har qanday foydalanuvchi bilgan ID orqali boshqa birovning bildirishnomasini o'qilgan holatga o'tkazib qo'yishi mumkin.

### [BH-014] "Barchani o'qilgan deb belgilash" tugmasining soxta (dummy) ekanligi
* **Fayl:** [`frontend/assets/js/layout.js:299-302`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/frontend/assets/js/layout.js#L299-L302)
* **Tafsilot:** `Layout.markAllRead()` funksiyasi faqat `Toast.info` chiqaradi, ammo backendda bunday API yo'q. Qayta yuklanganda bildirishnomalar yana o'qilmagan holda turadi.

### [BH-015] Ishlatilmayotgan `express-session` xotira sizishi (Memory Leak)
* **Fayl:** [`backend/src/server.js:60-69`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/server.js#L60-L69)
* **Tafsilot:** Loyihada to'liq JWT autentifikatsiyasi ishlatiladi. `express-session` MemoryStore rejimida har bir so'rov uchun xotirada sessiya yaratadi, lekin kodda `req.session` biror marta ham ishlatilmagan.

### [BH-016] Hisobotlarda `endDate` kuni qilingan amallarning hisobdan tushib qolishi
* **Fayl:** [`backend/src/routes/report.routes.js:33-37`](file:///c:/Users/Pain/Desktop/70-qadam%20Loyiha/backend/src/routes/report.routes.js#L33-L37)
* **Tafsilot:** `new Date('2026-09-08')` so'rovi UTC 00:00:00 deb qabul qilingani sababli, tanlangan oxirgi kunning o'zida amalga oshirilgan operatsiyalar ro'yxatga kirmay qoladi.

---

## 🎯 Xulosa va Keyingi Qadamlar

Foydalanuvchi talabiga ko'ra **kodga hech qanday o'zgartirish kiritilmadi**. Barcha topilmalar mustaqil ravishda sinovdan o'tkazilib, `.bug-hunter/scan-report.json`, `.bug-hunter/hunter-findings.json`, `.bug-hunter/skeptic.json` va `.bug-hunter/referee.json` fayllariga saqlandi.

Siz tasdiqlaganingizdan so'ng ushbu xatolarni bosqichma-bosqich tuzatishga kirishishimiz mumkin.
