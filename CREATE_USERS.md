# 👥 Foydalanuvchilarni Yaratish

## Avtomatik (Seed)

```powershell
cd backend
npm run seed
```

Bu quyidagi foydalanuvchilarni yaratadi:

### Admin
- Login: `admin`
- Parol: `admin123`
- Rol: Admin
- To'liq ism: Administrator

### Operator
- Login: `operator`
- Parol: `operator123`
- Rol: Operator
- To'liq ism: Operator User

---

## Qo'lda Yaratish (SQL)

Agar seed ishlamasa, PostgreSQL da qo'lda yaratish:

```sql
-- Database ga ulanish
psql -U postgres -d warehouse_db

-- Admin yaratish
INSERT INTO "User" (username, password, "fullName", email, "roleId", "isActive", "createdAt", "updatedAt")
VALUES (
  'admin',
  '$2a$10$YourHashedPasswordHere', -- 'admin123' hashed
  'Administrator',
  'admin@omborxona.uz',
  1, -- Admin role ID
  true,
  NOW(),
  NOW()
);

-- Operator yaratish
INSERT INTO "User" (username, password, "fullName", email, "roleId", "isActive", "createdAt", "updatedAt")
VALUES (
  'operator',
  '$2a$10$YourHashedPasswordHere', -- 'operator123' hashed
  'Operator User',
  'operator@omborxona.uz',
  2, -- Operator role ID
  true,
  NOW(),
  NOW()
);
```

---

## Parolni Hashing (Node.js)

```javascript
import bcrypt from 'bcryptjs';

// admin123
const adminHash = await bcrypt.hash('admin123', 10);
console.log('Admin hash:', adminHash);

// operator123
const operatorHash = await bcrypt.hash('operator123', 10);
console.log('Operator hash:', operatorHash);
```

---

## Tekshirish

```sql
-- Barcha foydalanuvchilarni ko'rish
SELECT id, username, "fullName", email, "roleId", "isActive" 
FROM "User";

-- Rollarni ko'rish
SELECT * FROM "Role";
```

---

## PowerShell Script (Admin Yaratish)

```powershell
# create_admin_user.ps1
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'Administrator',
      email: 'admin@omborxona.uz',
      roleId: 1,
      isActive: true
    }
  });
  
  console.log('✅ Admin yaratildi:', admin);
  await prisma.\$disconnect();
}

createAdmin();
"
```

---

## Demo Parollar

Testing uchun demo parollar:

| User | Login | Parol |
|------|-------|-------|
| Admin | admin | admin123 |
| Operator | operator | operator123 |
| Test User 1 | test1 | test123 |
| Test User 2 | test2 | test123 |

⚠️ **Production da o'zgartiring!**

---

## Parolni Tiklash

Agar parolni unutsangiz:

```javascript
// backend/resetPassword.js
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetPassword(username, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { username },
    data: { password: hashed }
  });
  
  console.log(`✅ ${username} paroli yangilandi!`);
}

resetPassword('admin', 'yangi_parol_123');
```

```powershell
node backend/resetPassword.js
```
