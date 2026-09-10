import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Ma\'lumotlar bazasini to\'ldirish boshlandi...');

  // Admin rolini yaratish
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Tizim administratori - barcha huquqlarga ega'
    }
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: {
      name: 'Operator',
      description: 'Operator - kirim-chiqim va hisobotlar bilan ishlaydi'
    }
  });

  const warehouseRole = await prisma.role.upsert({
    where: { name: 'Omborchi' },
    update: {},
    create: {
      name: 'Omborchi',
      description: 'Omborchi - faqat ombor operatsiyalari'
    }
  });

  console.log('Rollar yaratildi ✓');

  // Permissions yaratish
  const permissions = [
    { module: '*', action: '*', description: 'Barcha huquqlar' },
    { module: 'products', action: 'create', description: 'Mahsulot qo\'shish' },
    { module: 'products', action: 'update', description: 'Mahsulotni tahrirlash' },
    { module: 'products', action: 'delete', description: 'Mahsulotni o\'chirish' },
    { module: 'products', action: 'read', description: 'Mahsulotlarni ko\'rish' },
    { module: 'categories', action: 'create', description: 'Kategoriya qo\'shish' },
    { module: 'categories', action: 'update', description: 'Kategoriyani tahrirlash' },
    { module: 'categories', action: 'delete', description: 'Kategoriyani o\'chirish' },
    { module: 'suppliers', action: 'create', description: 'Yetkazib beruvchi qo\'shish' },
    { module: 'suppliers', action: 'update', description: 'Yetkazib beruvchini tahrirlash' },
    { module: 'suppliers', action: 'delete', description: 'Yetkazib beruvchini o\'chirish' },
    { module: 'stock', action: 'create', description: 'Kirim/Chiqim qo\'shish' },
    { module: 'stock', action: 'update', description: 'Kirim/Chiqimni tahrirlash' },
    { module: 'stock', action: 'delete', description: 'Kirim/Chiqimni o\'chirish' },
    { module: 'users', action: 'read', description: 'Foydalanuvchilarni ko\'rish' },
    { module: 'users', action: 'create', description: 'Foydalanuvchi qo\'shish' },
    { module: 'users', action: 'update', description: 'Foydalanuvchini tahrirlash' },
    { module: 'users', action: 'delete', description: 'Foydalanuvchini o\'chirish' },
    { module: 'settings', action: 'update', description: 'Sozlamalarni o\'zgartirish' },
    { module: 'audit', action: 'read', description: 'Audit loglarni ko\'rish' }
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { module_action: { module: perm.module, action: perm.action } },
      update: {},
      create: perm
    });
  }

  console.log('Ruxsatlar yaratildi ✓');

  // Admin roliga barcha ruxsatlarni bog'lash
  const allPermissions = await prisma.permission.findMany();
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id }))
      }
    }
  });

  console.log('Rollarga ruxsatlar bog\'landi ✓');

  // O'lchov birliklarini yaratish
  const units = [
    { name: 'Dona', symbol: 'dona', description: 'Donali mahsulotlar uchun' },
    { name: 'Kilogramm', symbol: 'kg', description: 'Og\'irlik o\'lchovi' },
    { name: 'Litr', symbol: 'l', description: 'Hajm o\'lchovi' },
    { name: 'Metr', symbol: 'm', description: 'Uzunlik o\'lchovi' },
    { name: 'Quti', symbol: 'quti', description: 'Qutilangan mahsulotlar' },
    { name: 'Paket', symbol: 'paket', description: 'Paketlangan mahsulotlar' },
    { name: 'O\'ram', symbol: 'o\'ram', description: 'O\'ralgan mahsulotlar' }
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: {},
      create: unit
    });
  }

  console.log('O\'lchov birliklari yaratildi ✓');

  // Kompaniya sozlamalarini yaratish
  await prisma.companySettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: { currency: 'so\'m' },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      companyName: 'Kompaniya nomi',
      currency: 'so\'m',
      dateFormat: 'DD.MM.YYYY'
    }
  });

  console.log('Kompaniya sozlamalari yaratildi ✓');

  // Demo foydalanuvchi va audit loglar yaratish
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@warehouse.local',
      password: hashedPassword,
      fullName: 'Demo Foydalanuvchi',
      phone: '+998 91 234 56 78',
      roleId: adminRole.id,
      isActive: true
    }
  });

  console.log('Demo foydalanuvchi yaratildi ✓');

  // Demo audit loglar
  const auditLogs = [
    {
      userId: demoUser.id,
      action: 'login',
      module: 'auth',
      details: 'Tizimga kirish',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'create',
      module: 'products',
      details: 'Yangi mahsulot qo\'shildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'update',
      module: 'products',
      details: 'Mahsulot tahrirlandi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'create',
      module: 'categories',
      details: 'Yangi kategoriya qo\'shildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'create',
      module: 'suppliers',
      details: 'Yangi yetkazib beruvchi qo\'shildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'create',
      module: 'stock',
      details: 'Kirim operatsiyasi amalga oshirildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'create',
      module: 'stock',
      details: 'Chiqim operatsiyasi amalga oshirildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'update',
      module: 'settings',
      details: 'Tizim sozlamalari yangilandi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'delete',
      module: 'products',
      details: 'Mahsulot o\'chirildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    },
    {
      userId: demoUser.id,
      action: 'read',
      module: 'audit',
      details: 'Harakatlar tarixi ko\'rildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
    }
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log('Demo audit loglar yaratildi ✓');

  console.log('\nMa\'lumotlar bazasi muvaffaqiyatli to\'ldirildi!');
  console.log('\nKeyingi qadamlar:');
  console.log('1. Backend serverni ishga tushiring: npm run dev');
  console.log('2. Frontend sahifasiga o\'ting: http://localhost:8080');
  console.log('3. Demo foydalanuvchi: login=demo, parol=demo123');
  console.log('4. Yoki yangi foydalanuvchi yaratishingiz mumkin');
}

main()
  .catch((e) => {
    console.error('Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
