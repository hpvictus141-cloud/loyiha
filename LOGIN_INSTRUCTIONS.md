# 🔐 Login Ma'lumotlari

## Foydalanuvchilar

Tizimda 3 ta foydalanuvchi mavjud:

### 1️⃣ Admin (Barcha huquqlar)
- **Username:** `admin`
- **Parol:** `admin123`
- **Huquqlar:** ✅ Barcha amallar (qo'shish, tahrirlash, o'chirish, sozlamalar, hisobotlar)

### 2️⃣ Operator (Asosiy huquqlar)
- **Username:** `operator`
- **Parol:** `operator123`
- **Huquqlar:** ✅ Mahsulotlar, kategoriyalar, kirim/chiqim, yetkazib beruvchilar (qo'shish, tahrirlash, o'chirish)

### 3️⃣ Demo (Barcha huquqlar)
- **Username:** `demo`
- **Parol:** `demo123`
- **Huquqlar:** ✅ Barcha amallar (admin bilan bir xil)

---

## 🚀 Tizimni ishga tushirish

1. **Backend serverni ishga tushiring:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Brauzerda oching:**
   ```
   http://localhost:3010/login
   ```

3. **Login qiling:**
   - Admin yoki Operator bilan login qiling
   - Demo foydalanuvchi ham ishlatishingiz mumkin

---

## ✨ Xususiyatlar

### ✅ Ishlaydigan bo'limlar:
- 🏠 Dashboard (grafiklar, statistika)
- 📦 Mahsulotlar (qo'shish, tahrirlash, o'chirish)
- 🏷️ Kategoriyalar (qo'shish, tahrirlash, o'chirish)
- 📥 Kirim (demo ma'lumotlar bilan)
- 📤 Chiqim (demo ma'lumotlar bilan)
- 📊 Inventar (demo ma'lumotlar bilan)
- 🚚 Yetkazib beruvchilar (demo ma'lumotlar bilan)
- 👤 Profil (avatar, parol o'zgartirish, statistika)

### 🚧 Ishlab chiqilmoqda:
- Hisobotlar
- Foydalanuvchilar boshqaruvi
- Harakatlar tarixi (Audit logs)
- Sozlamalar

---

## 🛠️ Muammolarni hal qilish

### ❌ "Kategoriya qo'shilmayapti" yoki "Tahrirlash ishlamayapti"
**Sabab:** Operator yoki Admin roli bilan login qilmagansiz.
**Yechim:** `admin` yoki `operator` hisobi bilan qayta login qiling.

### ❌ "Cannot connect to database"
**Sabab:** Database ishlamayapti yoki backend server ishlamayapti.
**Yechim:** 
1. Backend serverni ishga tushiring: `npm run dev`
2. PostgreSQL serverini tekshiring

### ❌ "401 Unauthorized"
**Sabab:** Token muddati tugagan yoki noto'g'ri.
**Yechim:** Logout qiling va qayta login qiling.

---

## 📝 Demo ma'lumotlar

Tizimda quyidagi demo ma'lumotlar mavjud:

- **5 ta kategoriya:** Oziq-ovqat mahsulotlari, Ichimliklar, Kiyim-kechak, Elektronika, Uy-ro'zg'or buyumlari
- **5 ta o'lchov birligi:** Dona, kg, litr, metr, quti
- **5 ta yetkazib beruvchi:** Turkiston Food, Shirin Savdo, TechnoMart, Fashion Plus, Homeware LLC
- **12 ta mahsulot:** Guruch, Un, Shakar, Coca-Cola, Pepsi, Ko'ylak, Shim, va boshqalar
- **5 ta kirim operatsiyasi**
- **4 ta chiqim operatsiyasi**

---

## 💡 Maslahatlar

1. **Admin** - barcha huquqlarga ega, sozlamalar va foydalanuvchilar boshqaruvi uchun
2. **Operator** - kundalik ishlar uchun (mahsulotlar, kirim/chiqim, kategoriyalar)
3. **Demo** - test qilish uchun, admin bilan bir xil huquqlarga ega

**Eslatma:** Operator ham kategoriyalar va mahsulotlarni boshqara oladi!
