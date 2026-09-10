# PostgreSQL O'rnatish Qo'llanmasi (Windows)

## Usul 1: PostgreSQL rasmiy o'rnatish (Tavsiya etiladi)

### 1.1. PostgreSQL yuklab olish
1. PostgreSQL rasmiy saytiga o'ting: https://www.postgresql.org/download/windows/
2. "Download the installer" ni bosing
3. EnterpriseDB installer yuklab oling (masalan: postgresql-16.x-windows-x64.exe)

### 1.2. O'rnatish
1. Yuklab olingan faylni ishga tushiring
2. O'rnatish yo'lini tanlang (default: `C:\Program Files\PostgreSQL\16`)
3. Komponentlarni tanlang (hammasi belgilangan bo'lsin):
   - PostgreSQL Server
   - pgAdmin 4
   - Stack Builder
   - Command Line Tools
4. Ma'lumotlar saqlash joyini tanlang (default: `C:\Program Files\PostgreSQL\16\data`)
5. **Superuser (postgres) paroli o'rnating** - Bu parolni eslab qoling! (masalan: `postgres123`)
6. Port raqamini kiriting (default: `5432` - o'zgartirmasdan qoldiring)
7. Locale tanlang (default: `[Default locale]`)
8. O'rnatishni boshlang

### 1.3. PostgreSQL serverini ishga tushirish
O'rnatishdan keyin PostgreSQL avtomatik ishga tushadi. Agar ishlamayotgan bo'lsa:

```powershell
# Windows Services orqali
# 1. Win + R tugmalarini bosing
# 2. "services.msc" yozing va Enter bosing
# 3. "postgresql-x64-16" xizmatini toping
# 4. O'ng tugma > Start
```

Yoki PowerShell orqali:
```powershell
Start-Service postgresql-x64-16
```

### 1.4. Ma'lumotlar bazasini yaratish

**Usul A: pgAdmin 4 orqali (Oson)**
1. pgAdmin 4 ni oching (Start Menu > PostgreSQL 16 > pgAdmin 4)
2. Servers > PostgreSQL 16 ni bosing
3. Parolni kiriting (o'rnatishda belgilaganing)
4. Databases > o'ng tugma > Create > Database
5. Database nomi: `warehouse_db`
6. Save tugmasini bosing

**Usul B: psql (Command Line) orqali**
```powershell
# PostgreSQL ga ulaning
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql -U postgres

# Parolni kiriting, keyin:
CREATE DATABASE warehouse_db;
\q
```

### 1.5. Backend .env faylini yangilang
`backend\.env` faylini oching va quyidagini o'zgartiring:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/warehouse_db"
```

`postgres123` ni o'zingiz o'rnatgan parol bilan almashtiring.

---

## Usul 2: Docker orqali (Tez va oson)

Agar Docker o'rnatilgan bo'lsa, quyidagi buyruqni bajaring:

```powershell
docker run --name warehouse-postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=warehouse_db -p 5432:5432 -d postgres:16
```

Backend `.env` fayli:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/warehouse_db"
```

---

## PostgreSQL ishga tushganini tekshirish

### Usul 1: PowerShell orqali
```powershell
Get-Service -Name "*postgres*"
```

Natija: Status = `Running` bo'lishi kerak

### Usul 2: Ulanishni sinab ko'ring
```powershell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql -U postgres -d warehouse_db
```

Agar parol so'rasa va kiritgandan keyin database prompti (`warehouse_db=#`) ko'rinsa, hammasi to'g'ri!

---

## Keyingi qadamlar

PostgreSQL o'rnatilgandan va warehouse_db bazasi yaratilgandan so'ng:

```powershell
cd "C:\Users\mardo\OneDrive\Desktop\70-qadam Loyiha\backend"

# 1. Prisma Client generatsiya qilish (allaqachon bajarilgan ✓)
npx prisma generate

# 2. Ma'lumotlar bazasiga jadvallarni yaratish
npx prisma migrate dev --name init

# 3. Boshlang'ich ma'lumotlarni kiritish
npm run seed

# 4. Backend serverni ishga tushirish
npm run dev
```

Backend `http://localhost:3010` da ishga tushadi!

---

## Muammolarni hal qilish

### PostgreSQL topilmayapti
```powershell
# PATH ga qo'shish
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```

### Port 5432 band
```powershell
# Qaysi dastur ishlatayotganini tekshiring
netstat -ano | findstr :5432
```

### Parol xatosi
1. pgAdmin 4 da serverga ulanib ko'ring
2. Agar ulanmasa, parolni qayta o'rnating:
   - Services > postgresql-x64-16 ni to'xtating
   - PostgreSQL konfig faylini tahrirlang

### Ma'lumotlar bazasi yaratilmagan
```sql
-- psql ichida:
\l                          -- barcha bazalarni ko'rish
CREATE DATABASE warehouse_db;  -- agar yo'q bo'lsa
```

---

## Qo'shimcha ma'lumot

### PostgreSQL parolini unutdim
1. `C:\Program Files\PostgreSQL\16\data\pg_hba.conf` faylini oching
2. Barcha `md5` ni `trust` ga o'zgartiring
3. PostgreSQL xizmatini qayta ishga tushiring
4. Parolsiz kirib, yangi parol o'rnating:
```sql
ALTER USER postgres PASSWORD 'yangi_parol';
```
5. `pg_hba.conf` ni asl holatiga qaytaring (`trust` → `md5`)
6. Qayta ishga tushiring

### PostgreSQL to'liq o'chirish
1. Control Panel > Programs > Uninstall
2. PostgreSQL 16 ni tanlang va o'chiring
3. Quyidagi papkalarni o'chiring:
   - `C:\Program Files\PostgreSQL`
   - `C:\Users\mardo\AppData\Roaming\postgresql`
   - `C:\Users\mardo\AppData\Local\Temp\postgresql`

---

**Yordam kerakmi?** 
- Qaysi qadamda qolib ketdingiz?
- Xatolik xabarini ko'rsating
- PostgreSQL versiyangizni kiriting: `psql --version`
