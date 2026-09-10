import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  console.log('🔐 Admin va Operator yaratilmoqda...\n');

  try {
    // Admin rolini topish
    const adminRole = await prisma.role.findUnique({
      where: { name: 'Admin' }
    });

    const operatorRole = await prisma.role.findUnique({
      where: { name: 'Operator' }
    });

    if (!adminRole || !operatorRole) {
      console.error('❌ Rollar topilmadi! Avval seed.js ni ishga tushiring.');
      process.exit(1);
    }

    // Admin yaratish
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@omborxona.uz',
        password: adminPassword,
        fullName: 'Administrator',
        phone: '+998 90 123 45 67',
        roleId: adminRole.id,
        isActive: true
      }
    });

    console.log('✅ Admin yaratildi:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: Admin\n');

    // Operator yaratish
    const operatorPassword = await bcrypt.hash('operator123', 10);
    const operator = await prisma.user.upsert({
      where: { username: 'operator' },
      update: {},
      create: {
        username: 'operator',
        email: 'operator@omborxona.uz',
        password: operatorPassword,
        fullName: 'Operator User',
        phone: '+998 90 765 43 21',
        roleId: operatorRole.id,
        isActive: true
      }
    });

    console.log('✅ Operator yaratildi:');
    console.log('   Username: operator');
    console.log('   Password: operator123');
    console.log('   Role: Operator\n');

    console.log('🎉 Barcha foydalanuvchilar muvaffaqiyatli yaratildi!');
    console.log('\n📝 Login ma\'lumotlari:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Login: admin');
    console.log('   Parol: admin123');
    console.log('');
    console.log('👤 Operator:');
    console.log('   Login: operator');
    console.log('   Parol: operator123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Login: http://localhost:3010/login\n');

  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
