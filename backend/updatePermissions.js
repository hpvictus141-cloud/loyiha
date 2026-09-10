import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePermissions() {
  console.log('🔐 Ruxsatlar yangilanmoqda...\n');

  try {
    // Admin rolini topish
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' },
      include: { permissions: true }
    });

    if (!adminRole) {
      console.error('❌ Admin roli topilmadi!');
      process.exit(1);
    }

    // Barcha ruxsatlarni topish
    const allPermissions = await prisma.permission.findMany();

    // Admin roliga barcha ruxsatlarni bog'lash
    await prisma.role.update({
      where: { id: adminRole.id },
      data: {
        permissions: {
          set: allPermissions.map(p => ({ id: p.id }))
        }
      }
    });

    console.log('✅ Admin roliga barcha ruxsatlar bog\'landi');
    console.log(`   - Jami ${allPermissions.length} ta ruxsat\n`);

    console.log('📋 Ruxsatlar:');
    const grouped = {};
    for (const perm of allPermissions) {
      if (!grouped[perm.module]) grouped[perm.module] = [];
      grouped[perm.module].push(perm.action);
    }
    for (const [module, actions] of Object.entries(grouped)) {
      console.log(`   • ${module}: ${actions.join(', ')}`);
    }

    console.log('\n🎉 Ruxsatlar muvaffaqiyatli yangilandi!\n');

  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePermissions();
