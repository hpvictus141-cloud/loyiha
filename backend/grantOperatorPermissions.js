import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function grantPermissions() {
  console.log('🔐 Operator roliga ruxsatlar berilmoqda...\n');

  try {
    // Operator rolini topish
    const operatorRole = await prisma.role.findUnique({
      where: { name: 'Operator' },
      include: { permissions: true }
    });

    if (!operatorRole) {
      console.error('❌ Operator roli topilmadi!');
      process.exit(1);
    }

    // Operator uchun kerakli ruxsatlar
    const operatorPermissions = [
      { module: 'products', action: 'create' },
      { module: 'products', action: 'update' },
      { module: 'products', action: 'delete' },
      { module: 'products', action: 'read' },
      { module: 'categories', action: 'create' },
      { module: 'categories', action: 'update' },
      { module: 'categories', action: 'delete' },
      { module: 'suppliers', action: 'create' },
      { module: 'suppliers', action: 'update' },
      { module: 'suppliers', action: 'delete' },
      { module: 'stock', action: 'create' },
      { module: 'stock', action: 'update' },
      { module: 'stock', action: 'delete' }
    ];

    // Ruxsatlarni topish
    const permissions = [];
    for (const perm of operatorPermissions) {
      const permission = await prisma.permission.findUnique({
        where: { module_action: { module: perm.module, action: perm.action } }
      });
      if (permission) {
        permissions.push(permission);
      }
    }

    // Operator roliga ruxsatlarni bog'lash
    await prisma.role.update({
      where: { id: operatorRole.id },
      data: {
        permissions: {
          connect: permissions.map(p => ({ id: p.id }))
        }
      }
    });

    console.log('✅ Operator roliga ruxsatlar berildi:');
    console.log(`   - Jami ${permissions.length} ta ruxsat\n`);
    
    console.log('📋 Berilgan ruxsatlar:');
    for (const perm of permissions) {
      console.log(`   • ${perm.module}:${perm.action}`);
    }

    console.log('\n🎉 Operator endi quyidagi amallarni bajara oladi:');
    console.log('   - Mahsulotlarni qo\'shish, tahrirlash, o\'chirish');
    console.log('   - Kategoriyalarni qo\'shish, tahrirlash, o\'chirish');
    console.log('   - Yetkazib beruvchilarni qo\'shish, tahrirlash, o\'chirish');
    console.log('   - Kirim/Chiqim operatsiyalarini amalga oshirish\n');

  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

grantPermissions();
