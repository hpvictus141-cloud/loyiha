import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Demo ma\'lumotlar bilan to\'ldirish boshlandi...\n');

  // 1. Kategoriyalar
  console.log('📁 Kategoriyalar yaratilmoqda...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Elektronika' },
      update: {},
      create: { name: 'Elektronika', description: 'Elektronika mahsulotlari', isActive: true }
    }),
    prisma.category.upsert({
      where: { name: 'Oziq-ovqat' },
      update: {},
      create: { name: 'Oziq-ovqat', description: 'Oziq-ovqat mahsulotlari', isActive: true }
    }),
    prisma.category.upsert({
      where: { name: 'Kiyim' },
      update: {},
      create: { name: 'Kiyim', description: 'Kiyim-kechak', isActive: true }
    }),
    prisma.category.upsert({
      where: { name: 'Mebel' },
      update: {},
      create: { name: 'Mebel', description: 'Uy-joy mebellari', isActive: true }
    }),
    prisma.category.upsert({
      where: { name: 'Kitoblar' },
      update: {},
      create: { name: 'Kitoblar', description: 'Kitoblar va darsliklar', isActive: true }
    })
  ]);
  console.log('✅ 5 ta kategoriya yaratildi\n');

  // 2. O'lchov birliklari
  console.log('📏 O\'lchov birliklari yaratilmoqda...');
  const units = await Promise.all([
    prisma.unit.upsert({
      where: { name: 'Dona' },
      update: {},
      create: { name: 'Dona', symbol: 'dona' }
    }),
    prisma.unit.upsert({
      where: { name: 'Kilogramm' },
      update: {},
      create: { name: 'Kilogramm', symbol: 'kg' }
    }),
    prisma.unit.upsert({
      where: { name: 'Litr' },
      update: {},
      create: { name: 'Litr', symbol: 'l' }
    }),
    prisma.unit.upsert({
      where: { name: 'Metr' },
      update: {},
      create: { name: 'Metr', symbol: 'm' }
    }),
    prisma.unit.upsert({
      where: { name: 'Quti' },
      update: {},
      create: { name: 'Quti', symbol: 'quti' }
    })
  ]);
  console.log('✅ 5 ta o\'lchov birligi yaratildi\n');

  // 3. Yetkazib beruvchilar
  console.log('🏢 Yetkazib beruvchilar yaratilmoqda...');
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        companyName: 'Artel Electronics',
        contactPerson: 'Bobur Karimov',
        phone: '+998 71 123 45 67',
        email: 'info@artel.uz',
        address: 'Toshkent sh., Yakkasaroy t.',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        companyName: 'Coca-Cola Uzbekistan',
        contactPerson: 'Aziza Rahimova',
        phone: '+998 71 234 56 78',
        email: 'orders@coca-cola.uz',
        address: 'Toshkent sh., Olmazor t.',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        companyName: 'Avalon Textile',
        contactPerson: 'Jasur Tursunov',
        phone: '+998 71 345 67 89',
        email: 'sales@avalon.uz',
        address: 'Toshkent sh., Sergeli t.',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        companyName: 'Grand Furniture',
        contactPerson: 'Dilshod Alimov',
        phone: '+998 71 456 78 90',
        email: 'info@grand-furniture.uz',
        address: 'Toshkent sh., Mirzo Ulug\'bek t.',
        isActive: true
      }
    }),
    prisma.supplier.create({
      data: {
        companyName: 'Academic Books',
        contactPerson: 'Malika Hasanova',
        phone: '+998 71 567 89 01',
        email: 'orders@academic-books.uz',
        address: 'Toshkent sh., Yunusobod t.',
        isActive: true
      }
    })
  ]);
  console.log('✅ 5 ta yetkazib beruvchi yaratildi\n');

  // 4. Mahsulotlar
  console.log('📦 Mahsulotlar yaratilmoqda...');
  const products = [];
  
  // Elektronika
  products.push(
    await prisma.product.create({
      data: {
        code: 'EL-001',
        name: 'Samsung Galaxy A54',
        categoryId: categories[0].id,
        unitId: units[0].id,
        purchasePrice: 3500000,
        salePrice: 4200000,
        minStock: 5,
        currentStock: 15,
        barcode: '8801643881061',
        description: '128GB, 6GB RAM, Blue',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'EL-002',
        name: 'Artel TV 43 Smart',
        categoryId: categories[0].id,
        unitId: units[0].id,
        purchasePrice: 2800000,
        salePrice: 3500000,
        minStock: 3,
        currentStock: 8,
        barcode: '4606534000018',
        description: 'Full HD, Android TV',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'EL-003',
        name: 'Noutbuk Lenovo IdeaPad',
        categoryId: categories[0].id,
        unitId: units[0].id,
        purchasePrice: 5500000,
        salePrice: 6800000,
        minStock: 2,
        currentStock: 4,
        barcode: '195348206624',
        description: 'i5, 8GB RAM, 512GB SSD',
        isActive: true
      }
    })
  );

  // Oziq-ovqat
  products.push(
    await prisma.product.create({
      data: {
        code: 'FD-001',
        name: 'Coca-Cola 1.5L',
        categoryId: categories[1].id,
        unitId: units[2].id,
        purchasePrice: 8000,
        salePrice: 12000,
        minStock: 50,
        currentStock: 120,
        barcode: '5449000000996',
        description: 'Gazlangan ichimlik',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'FD-002',
        name: 'Non',
        categoryId: categories[1].id,
        unitId: units[0].id,
        purchasePrice: 2000,
        salePrice: 3000,
        minStock: 100,
        currentStock: 80,
        barcode: '4870177070506',
        description: 'Oq non 400g',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'FD-003',
        name: 'Guruch',
        categoryId: categories[1].id,
        unitId: units[1].id,
        purchasePrice: 15000,
        salePrice: 18000,
        minStock: 200,
        currentStock: 350,
        barcode: '8690512002445',
        description: 'Toza guruch 1kg',
        isActive: true
      }
    })
  );

  // Kiyim
  products.push(
    await prisma.product.create({
      data: {
        code: 'CL-001',
        name: 'Ko\'ylak erkaklar uchun',
        categoryId: categories[2].id,
        unitId: units[0].id,
        purchasePrice: 80000,
        salePrice: 120000,
        minStock: 10,
        currentStock: 25,
        barcode: '7898416780033',
        description: 'L o\'lcham, oq',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'CL-002',
        name: 'Shimlar ayollar uchun',
        categoryId: categories[2].id,
        unitId: units[0].id,
        purchasePrice: 100000,
        salePrice: 150000,
        minStock: 8,
        currentStock: 18,
        barcode: '7894567890124',
        description: 'M o\'lcham, qora',
        isActive: true
      }
    })
  );

  // Mebel
  products.push(
    await prisma.product.create({
      data: {
        code: 'FR-001',
        name: 'Yozuv stoli',
        categoryId: categories[3].id,
        unitId: units[0].id,
        purchasePrice: 800000,
        salePrice: 1200000,
        minStock: 2,
        currentStock: 5,
        barcode: '4670028640345',
        description: '120x60 sm, yog\'och',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'FR-002',
        name: 'Ofis stul',
        categoryId: categories[3].id,
        unitId: units[0].id,
        purchasePrice: 400000,
        salePrice: 600000,
        minStock: 5,
        currentStock: 3,
        barcode: '8808992985822',
        description: 'Aylanuvchi, qora',
        isActive: true
      }
    })
  );

  // Kitoblar
  products.push(
    await prisma.product.create({
      data: {
        code: 'BK-001',
        name: 'O\'zbek tili darsligi',
        categoryId: categories[4].id,
        unitId: units[0].id,
        purchasePrice: 25000,
        salePrice: 35000,
        minStock: 20,
        currentStock: 45,
        barcode: '9789943563100',
        description: '5-sinf',
        isActive: true
      }
    }),
    await prisma.product.create({
      data: {
        code: 'BK-002',
        name: 'Matematika darsligi',
        categoryId: categories[4].id,
        unitId: units[0].id,
        purchasePrice: 30000,
        salePrice: 40000,
        minStock: 20,
        currentStock: 38,
        barcode: '9789943563117',
        description: '6-sinf',
        isActive: true
      }
    })
  );

  // Yaroqsiz mahsulotlar (demo)
  products.push(
    await prisma.product.create({
      data: {
        code: 'EX-001',
        name: 'Shikastlangan laptop',
        categoryId: categories[0].id,
        unitId: units[0].id,
        purchasePrice: 4000000,
        salePrice: 4200000,
        minStock: 0,
        currentStock: 1,
        barcode: '8594012345678',
        description: 'Ekrani singan, ishlatib bo\'lmaydi',
        isActive: false
      }
    }),
    await prisma.product.create({
      data: {
        code: 'EX-002',
        name: 'Buzilgan sut mahsuloti',
        categoryId: categories[1].id,
        unitId: units[2].id,
        purchasePrice: 8000,
        salePrice: 12000,
        minStock: 0,
        currentStock: 5,
        barcode: '4607012345000',
        description: 'Yaroqlilik muddati o\'tgan',
        isActive: false
      }
    }),
    await prisma.product.create({
      data: {
        code: 'EX-003',
        name: 'Nuqsonli shim',
        categoryId: categories[2].id,
        unitId: units[0].id,
        purchasePrice: 70000,
        salePrice: 100000,
        minStock: 0,
        currentStock: 3,
        barcode: '7894560000111',
        description: 'Yirtilgan, sotib bo\'lmaydi',
        isActive: false
      }
    })
  );

  console.log('✅ 15 ta mahsulot yaratildi (12 faol + 3 yaroqsiz)\n');

  // Admin foydalanuvchini olish
  const adminUser = await prisma.user.findFirst({
    where: { username: 'admin' }
  });

  if (!adminUser) {
    throw new Error('Admin foydalanuvchi topilmadi!');
  }

  // 5. Kirim operatsiyalari
  console.log('📥 Kirim operatsiyalari yaratilmoqda...');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  await prisma.stockIn.createMany({
    data: [
      {
        productId: products[0].id,
        supplierId: suppliers[0].id,
        userId: adminUser.id,
        quantity: 10,
        price: 3500000,
        totalAmount: 10 * 3500000,
        date: today,
        invoiceNumber: 'INV-001',
        notes: 'Yangi partiya'
      },
      {
        productId: products[1].id,
        supplierId: suppliers[0].id,
        userId: adminUser.id,
        quantity: 5,
        price: 2800000,
        totalAmount: 5 * 2800000,
        date: yesterday,
        invoiceNumber: 'INV-002',
        notes: 'To\'lov qilingan'
      },
      {
        productId: products[3].id,
        supplierId: suppliers[1].id,
        userId: adminUser.id,
        quantity: 100,
        price: 8000,
        totalAmount: 100 * 8000,
        date: today,
        invoiceNumber: 'INV-003'
      },
      {
        productId: products[5].id,
        supplierId: suppliers[1].id,
        userId: adminUser.id,
        quantity: 200,
        price: 15000,
        totalAmount: 200 * 15000,
        date: lastWeek,
        invoiceNumber: 'INV-004'
      },
      {
        productId: products[6].id,
        supplierId: suppliers[2].id,
        userId: adminUser.id,
        quantity: 15,
        price: 80000,
        totalAmount: 15 * 80000,
        date: yesterday,
        invoiceNumber: 'INV-005'
      }
    ]
  });
  console.log('✅ 5 ta kirim operatsiyasi yaratildi\n');

  // 6. Chiqim operatsiyalari
  console.log('📤 Chiqim operatsiyalari yaratilmoqda...');
  await prisma.stockOut.createMany({
    data: [
      {
        productId: products[0].id,
        userId: adminUser.id,
        quantity: 2,
        recipientName: 'Ali Valiyev',
        recipientPhone: '+998 91 234 56 78',
        date: today,
        notes: 'Mijozga sotildi - Laptop'
      },
      {
        productId: products[3].id,
        userId: adminUser.id,
        quantity: 20,
        recipientName: 'Do\'kon "Oziq-ovqat"',
        recipientPhone: '+998 90 123 45 67',
        date: yesterday,
        notes: 'Do\'konga yetkazildi - Coca-Cola'
      },
      {
        productId: products[4].id,
        userId: adminUser.id,
        quantity: 10,
        recipientName: 'Anvar Toshmatov',
        recipientPhone: '+998 93 777 88 99',
        date: today,
        notes: 'Non sotildi'
      },
      {
        productId: products[6].id,
        userId: adminUser.id,
        quantity: 3,
        recipientName: 'Fashion Store',
        recipientPhone: '+998 95 888 77 66',
        date: lastWeek,
        notes: 'Ko\'ylak sotildi'
      }
    ]
  });
  console.log('✅ 4 ta chiqim operatsiyasi yaratildi\n');

  // 7. Audit Logs
  console.log('📋 Audit loglar yaratilmoqda...');
  const auditLogs = [];
  
  // Login logs
  auditLogs.push({
    userId: adminUser.id,
    action: 'login',
    module: 'auth',
    details: 'Administrator tizimga kirdi',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 hafta oldin
  });

  // Product logs
  products.forEach((product, index) => {
    auditLogs.push({
      userId: adminUser.id,
      action: 'create',
      module: 'products',
      details: `"${product.name}" mahsuloti qo'shildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - (6 - Math.floor(index / 2)) * 24 * 60 * 60 * 1000)
    });
  });

  // Category logs
  categories.forEach((category, index) => {
    auditLogs.push({
      userId: adminUser.id,
      action: 'create',
      module: 'categories',
      details: `"${category.name}" kategoriyasi qo'shildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000)
    });
  });

  // Supplier logs
  suppliers.forEach((supplier, index) => {
    auditLogs.push({
      userId: adminUser.id,
      action: 'create',
      module: 'suppliers',
      details: `"${supplier.name}" yetkazib beruvchi qo'shildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
    });
  });

  // Stock In logs
  auditLogs.push(
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: `Ноутбук (2 dona) kirim qilindi - 8,400,000 so'm`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: today
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: `Coca-Cola (50 dona) kirim qilindi - 600,000 so'm`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: yesterday
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: `Non (100 dona) kirim qilindi - 200,000 so'm`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: yesterday
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: `Ko'ylak erkaklar uchun (15 dona) kirim qilindi - 1,200,000 so'm`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: lastWeek
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: `Yozuv stoli (3 dona) kirim qilindi - 2,400,000 so'm`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: yesterday
    }
  );

  // Stock Out logs
  auditLogs.push(
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_out',
      details: `Ноутбук (2 dona) Ali Valiyev ga sotildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: today
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_out',
      details: `Coca-Cola (20 dona) Do'kon "Oziq-ovqat" ga yetkazildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: yesterday
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_out',
      details: `Non (10 dona) Anvar Toshmatov ga sotildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: today
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_out',
      details: `Ko'ylak erkaklar uchun (3 dona) Fashion Store ga sotildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: lastWeek
    }
  );

  // Some update and delete logs
  auditLogs.push(
    {
      userId: adminUser.id,
      action: 'update',
      module: 'products',
      details: `"Ноутбук" mahsuloti tahrirlandi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      userId: adminUser.id,
      action: 'update',
      module: 'categories',
      details: `"Elektronika" kategoriyasi tahrirlandi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      userId: adminUser.id,
      action: 'read',
      module: 'audit',
      details: `Harakatlar tarixi ko'rildi`,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 soat oldin
    }
  );

  // Create all audit logs
  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }
  
  console.log(`✅ ${auditLogs.length} ta audit log yaratildi\n`);

  console.log('🎉 Demo ma\'lumotlar muvaffaqiyatli yuklandi!\n');
  console.log('📊 Yaratilgan ma\'lumotlar:');
  console.log('   - 5 ta kategoriya');
  console.log('   - 5 ta o\'lchov birligi');
  console.log('   - 5 ta yetkazib beruvchi');
  console.log('   - 15 ta mahsulot (12 faol + 3 yaroqsiz)');
  console.log('   - 5 ta kirim');
  console.log('   - 4 ta chiqim');
  console.log(`   - ${auditLogs.length} ta audit log\n`);
}

main()
  .catch((e) => {
    console.error('❌ Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
