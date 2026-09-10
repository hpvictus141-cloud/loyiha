import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDemoData() {
  console.log('🗑️  Demo ma\'lumotlarni tozalash boshlandi...\n');

  try {
    // Delete in correct order (respecting foreign keys)
    console.log('📤 Chiqim operatsiyalarini o\'chirish...');
    await prisma.stockOut.deleteMany({});
    console.log('✅ Chiqim operatsiyalari o\'chirildi');

    console.log('📥 Kirim operatsiyalarini o\'chirish...');
    await prisma.stockIn.deleteMany({});
    console.log('✅ Kirim operatsiyalari o\'chirildi');

    console.log('📦 Mahsulotlarni o\'chirish...');
    await prisma.product.deleteMany({});
    console.log('✅ Mahsulotlar o\'chirildi');

    console.log('🏢 Yetkazib beruvchilarni o\'chirish...');
    await prisma.supplier.deleteMany({});
    console.log('✅ Yetkazib beruvchilar o\'chirildi');

    console.log('🏷️  Kategoriyalarni o\'chirish...');
    await prisma.category.deleteMany({});
    console.log('✅ Kategoriyalar o\'chirildi');

    console.log('📏 O\'lchov birliklarini o\'chirish...');
    await prisma.unit.deleteMany({});
    console.log('✅ O\'lchov birliklari o\'chirildi');

    console.log('📋 Audit loglarni o\'chirish...');
    await prisma.auditLog.deleteMany({});
    console.log('✅ Audit loglar o\'chirildi');

    console.log('\n🎉 Demo ma\'lumotlar muvaffaqiyatli tozalandi!\n');
    console.log('💡 Endi seedFull.js ni ishga tushiring: node prisma/seedFull.js\n');

  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDemoData();
