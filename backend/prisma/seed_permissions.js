import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  { module: '*', action: '*', description: 'Barcha huquqlar' },
  
  // Mahsulotlar
  { module: 'products', action: 'create', description: 'Mahsulot yaratish' },
  { module: 'products', action: 'read', description: 'Mahsulotlarni ko\'rish' },
  { module: 'products', action: 'update', description: 'Mahsulotni tahrirlash' },
  { module: 'products', action: 'delete', description: 'Mahsulotni o\'chirish' },

  // Kategoriyalar
  { module: 'categories', action: 'create', description: 'Kategoriya yaratish' },
  { module: 'categories', action: 'read', description: 'Kategoriyalarni ko\'rish' },
  { module: 'categories', action: 'update', description: 'Kategoriyani tahrirlash' },
  { module: 'categories', action: 'delete', description: 'Kategoriyani o\'chirish' },

  // O'lchov birliklari
  { module: 'units', action: 'create', description: 'Birlik yaratish' },
  { module: 'units', action: 'read', description: 'Birliklarni ko\'rish' },
  { module: 'units', action: 'update', description: 'Birlikni tahrirlash' },
  { module: 'units', action: 'delete', description: 'Birlikni o\'chirish' },

  // Yetkazib beruvchilar
  { module: 'suppliers', action: 'create', description: 'Yetkazib beruvchi qo\'shish' },
  { module: 'suppliers', action: 'read', description: 'Yetkazib beruvchilarni ko\'rish' },
  { module: 'suppliers', action: 'update', description: 'Yetkazib beruvchini tahrirlash' },
  { module: 'suppliers', action: 'delete', description: 'Yetkazib beruvchini o\'chirish' },

  // Ombor operatsiyalari (Kirim / Chiqim / Qoldiq)
  { module: 'stock', action: 'create', description: 'Kirim/chiqim qilish' },
  { module: 'stock', action: 'read', description: 'Kirim/chiqimlarni ko\'rish' },
  { module: 'stock', action: 'update', description: 'Kirim/chiqimni tahrirlash' },
  { module: 'stock', action: 'delete', description: 'Kirim/chiqimni o\'chirish' },
  { module: 'inventory', action: 'read', description: 'Ombor qoldig\'ini ko\'rish' },

  // Foydalanuvchilar
  { module: 'users', action: 'create', description: 'Foydalanuvchi yaratish' },
  { module: 'users', action: 'read', description: 'Foydalanuvchilarni ko\'rish' },
  { module: 'users', action: 'update', description: 'Foydalanuvchini tahrirlash' },
  { module: 'users', action: 'delete', description: 'Foydalanuvchini o\'chirish' },

  // Hisobotlar, Sozlamalar va Audit
  { module: 'reports', action: 'read', description: 'Hisobotlarni ko\'rish' },
  { module: 'settings', action: 'update', description: 'Sozlamalarni o\'zgartirish' },
  { module: 'settings', action: 'read', description: 'Sozlamalarni ko\'rish' },
  { module: 'audit', action: 'read', description: 'Audit loglarni ko\'rish' }
];

export async function seedPermissions() {
  console.log('🔑 [OmborXona] Ruxsatnomalar (Permissions) yuklanmoqda...');

  // 1. Rollarni olish yoki yaratish
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Tizim administratori' }
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: { name: 'Operator', description: 'Ombor operatori' }
  });

  const omborchiRole = await prisma.role.upsert({
    where: { name: 'Omborchi' },
    update: {},
    create: { name: 'Omborchi', description: 'Ombor mutaxassisi' }
  });

  // 2. Har bir ruxsatni upsert qilish
  const createdPermissions = [];
  for (const p of permissions) {
    const perm = await prisma.permission.upsert({
      where: {
        module_action: { module: p.module, action: p.action }
      },
      update: { description: p.description },
      create: p
    });
    createdPermissions.push(perm);
  }
  console.log(`✅ ${createdPermissions.length} ta tizim ruxsatnomalari yaratildi`);

  // 3. Admin roliga BARCHA ruxsatlarni ulash
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        set: createdPermissions.map(p => ({ id: p.id }))
      }
    }
  });
  console.log('✅ Admin roliga barcha huquqlar bog\'landi');

  // 4. Operator roliga operatsion ruxsatlarni ulash
  const operatorPerms = createdPermissions.filter(p => 
    p.module === 'products' || 
    p.module === 'categories' || 
    p.module === 'units' || 
    p.module === 'suppliers' || 
    p.module === 'stock' || 
    p.module === 'inventory' || 
    p.module === 'reports'
  );
  await prisma.role.update({
    where: { id: operatorRole.id },
    data: {
      permissions: {
        set: operatorPerms.map(p => ({ id: p.id }))
      }
    }
  });
  console.log('✅ Operator roliga operatsion huquqlar bog\'landi');

  // 5. Omborchi roliga ko'rish va ombor operatsiyalarini ulash
  const omborchiPerms = createdPermissions.filter(p => 
    (p.module === 'products' && p.action === 'read') ||
    (p.module === 'categories' && p.action === 'read') ||
    (p.module === 'units' && p.action === 'read') ||
    (p.module === 'stock') ||
    (p.module === 'inventory')
  );
  await prisma.role.update({
    where: { id: omborchiRole.id },
    data: {
      permissions: {
        set: omborchiPerms.map(p => ({ id: p.id }))
      }
    }
  });
  console.log('✅ Omborchi roliga ombor huquqlari bog\'landi');
}

// Fayl to'g'ridan-to'g'ri ishga tushirilganda
if (process.argv[1]?.endsWith('seed_permissions.js')) {
  seedPermissions()
    .then(() => {
      console.log('🎉 Ruxsatnomalar to\'liq muvaffaqiyatli saqlandi!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Xatolik:', err);
      process.exit(1);
    });
}
