import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 OmborXona uchun to\'liq ma\'lumotlar yuklanmoqda...\n');

  // 1. Rollar
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

  console.log('✅ Rollar tayyor');

  // 2. Foydalanuvchilar
  const passwordHash = await bcrypt.hash('admin123', 10);
  const operatorPassHash = await bcrypt.hash('operator123', 10);
  const omborchiPassHash = await bcrypt.hash('omborchi123', 10);
  const demoPassHash = await bcrypt.hash('demo123', 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { roleId: adminRole.id, isActive: true },
    create: {
      username: 'admin',
      email: 'admin@warehouse.uz',
      password: passwordHash,
      fullName: 'Rustam Karimov',
      phone: '+998 90 123 45 67',
      roleId: adminRole.id,
      isActive: true
    }
  });

  const operatorUser = await prisma.user.upsert({
    where: { username: 'operator' },
    update: { roleId: operatorRole.id, isActive: true },
    create: {
      username: 'operator',
      email: 'operator@warehouse.uz',
      password: operatorPassHash,
      fullName: 'Jasur Aliyev',
      phone: '+998 91 345 67 89',
      roleId: operatorRole.id,
      isActive: true
    }
  });

  const omborchiUser = await prisma.user.upsert({
    where: { username: 'omborchi' },
    update: { roleId: omborchiRole.id, isActive: true },
    create: {
      username: 'omborchi',
      email: 'omborchi@warehouse.uz',
      password: omborchiPassHash,
      fullName: 'Dilshod Rahimov',
      phone: '+998 93 456 78 90',
      roleId: omborchiRole.id,
      isActive: true
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: { roleId: adminRole.id, isActive: true },
    create: {
      username: 'demo',
      email: 'demo@warehouse.local',
      password: demoPassHash,
      fullName: 'Demo Foydalanuvchi',
      phone: '+998 97 789 01 23',
      roleId: adminRole.id,
      isActive: true
    }
  });

  console.log('✅ Foydalanuvchilar (admin, operator, omborchi, demo) yaratildi');

  // 3. O'lchov birliklari
  const unitsData = [
    { name: 'Dona', symbol: 'dona', description: 'Donali mahsulotlar' },
    { name: 'Kilogramm', symbol: 'kg', description: 'Og\'irlik o\'lchovi' },
    { name: 'Litr', symbol: 'l', description: 'Hajm o\'lchovi' },
    { name: 'Metr', symbol: 'm', description: 'Uzunlik o\'lchovi' },
    { name: 'Quti', symbol: 'quti', description: 'Qutilangan tovarlar' },
    { name: 'Paket', symbol: 'paket', description: 'Paketlangan tovarlar' },
    { name: 'O\'ram', symbol: 'o\'ram', description: 'O\'ralgan tovarlar' }
  ];

  const units = {};
  for (const u of unitsData) {
    units[u.symbol] = await prisma.unit.upsert({
      where: { name: u.name },
      update: {},
      create: u
    });
  }
  console.log('✅ O\'lchov birliklari tayyor');

  // 4. Kategoriyalar
  const categoriesData = [
    { name: 'Elektronika va maishiy texnika', description: 'Televizorlar, muzlatgichlar va maishiy texnikalar' },
    { name: 'Qurilish mollari', description: 'Sement, gipsokarton, bo\'yoqlar va qurilish materiallari' },
    { name: 'Oziq-ovqat mahsulotlari', description: 'Choy, shakar, o\'simlik yog\'i va quyultirilgan mahsulotlar' },
    { name: 'Kantselyariya buyumlari', description: 'A4 qog\'oz, ruchkalar, fayllar va ofis materiallari' },
    { name: 'Maxsus kiyim va himoya vositalari', description: 'Kombinezonlar, ishchi etiklar va qo\'lqoplar' },
    { name: 'Avto ehtiyot qismlari', description: 'Motor moylari, tormoz suyuqliklari va filtrlar' },
    { name: 'Tozalash va kimyo vositalari', description: 'Dezinfeksiya, yuvish va tozalash vositalari' }
  ];

  const categories = {};
  for (const c of categoriesData) {
    categories[c.name] = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c
    });
  }
  console.log('✅ Kategoriyalar tayyor');

  // 5. Yetkazib beruvchilar
  const suppliersData = [
    {
      companyName: 'Artel Electronics MCHJ',
      contactPerson: 'Farhod Qodirov',
      phone: '+998 71 202 22 22',
      email: 'info@artel.uz',
      address: 'Toshkent sh., Yashnobod tumani, Parkent ko\'chasi 182',
      taxId: '302194821',
      description: 'Maishiy texnika va elektronika ishlab chiqaruvchi'
    },
    {
      companyName: 'Akfa Building Materials XK',
      contactPerson: 'Bobur Mirzayev',
      phone: '+998 71 203 00 00',
      email: 'sales@akfa-build.uz',
      address: 'Toshkent sh., Olmazor tumani, Kichik halqa yo\'li 1',
      taxId: '305829104',
      description: 'Sifatli qurilish va pardozlash mollari yetkazib beruvchi'
    },
    {
      companyName: 'Samarqand Choy QK',
      contactPerson: 'Shavkat Rahimov',
      phone: '+998 66 233 44 55',
      email: 'tea@samtea.uz',
      address: 'Samarqand sh., Gagarin ko\'chasi 45',
      taxId: '201849203',
      description: 'Choy va oziq-ovqat mahsulotlari ulgurji yetkazib beruvchisi'
    },
    {
      companyName: 'Toshkent Qog\'oz Sanoati MCHJ',
      contactPerson: 'Otabek Salimov',
      phone: '+998 71 278 99 88',
      email: 'paper@tqs.uz',
      address: 'Toshkent vil., Zangiota tumani, Sanoat hududi 12',
      taxId: '301948291',
      description: 'A4 formatli qog\'oz va karton mahsulotlari'
    },
    {
      companyName: 'Navoiy Kimyo Zavodi AJ',
      contactPerson: 'Mansur Zokirov',
      phone: '+998 79 223 11 00',
      email: 'trade@navoiy-kimyo.uz',
      address: 'Navoiy sh., Kimyogarlar ko\'chasi 5',
      taxId: '204928174',
      description: 'Sanoat va maishiy kimyoviy tozalash vositalari'
    },
    {
      companyName: 'Global Textile Solutions MCHJ',
      contactPerson: 'Nodir Ergashev',
      phone: '+998 73 244 55 66',
      email: 'contact@gtextile.uz',
      address: 'Farg\'ona sh., To\'qimachilar ko\'chasi 20',
      taxId: '304829185',
      description: 'Maxsus kiyimlar, kombinezon va paxtali qo\'lqoplar'
    },
    {
      companyName: 'AvtoDetall Impex XK',
      contactPerson: 'Jamshid Fayziyev',
      phone: '+998 74 228 33 44',
      email: 'import@avtodetall.uz',
      address: 'Andijon sh., Amir Temur shox ko\'chasi 88',
      taxId: '306192847',
      description: 'Avtomobil moylari va texnik suyuqliklar importi'
    }
  ];

  const suppliers = {};
  for (const s of suppliersData) {
    suppliers[s.companyName] = await prisma.supplier.upsert({
      where: { taxId: s.taxId },
      update: {},
      create: s
    });
  }
  console.log('✅ Yetkazib beruvchilar tayyor');

  // 6. Mahsulotlar katalogi
  const productsData = [
    {
      code: 'EL-001',
      name: 'Televizor Artel Smart 43" Full HD',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 2400000,
      salePrice: 2950000,
      minStock: 5,
      currentStock: 18,
      barcode: '478001234501',
      description: 'Smart TV, Wi-Fi, YouTube va Netflix qo\'llab-quvvatlaydi'
    },
    {
      code: 'EL-002',
      name: 'Muzlatgich Artel Grand 300L NoFrost',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 3800000,
      salePrice: 4600000,
      minStock: 4,
      currentStock: 12,
      barcode: '478001234502',
      description: 'Ikki kamerali, energiya tejovchi A+ sinf muzlatgich'
    },
    {
      code: 'EL-003',
      name: 'Changyutgich Artel VCC-0220 Eco',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 650000,
      salePrice: 850000,
      minStock: 10,
      currentStock: 25,
      barcode: '478001234503',
      description: '2200W quvvatli, konteynerli zamonaviy changyutgich'
    },
    {
      code: 'EL-004',
      name: 'Konditsioner Artel Inverter 12 HD',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 4200000,
      salePrice: 5100000,
      minStock: 6,
      currentStock: 3, // Minimal qoldiqdan kam!
      barcode: '478001234504',
      description: '35 kv.m xonalar uchun qish-yoz rejimli inverter konditsioner'
    },
    {
      code: 'QM-001',
      name: 'Sement Ohangaron M-500 (50 kg qop)',
      category: 'Qurilish mollari',
      unit: 'quti',
      purchasePrice: 62000,
      salePrice: 75000,
      minStock: 50,
      currentStock: 320,
      barcode: '478001234511',
      description: 'Yuqori sifatli pishiq qurilish sementi'
    },
    {
      code: 'QM-002',
      name: 'Gipsokarton Knauf 9.5mm (1.2x2.5m)',
      category: 'Qurilish mollari',
      unit: 'dona',
      purchasePrice: 42000,
      salePrice: 53000,
      minStock: 30,
      currentStock: 140,
      barcode: '478001234512',
      description: 'Shift va devorlar uchun namga chidamli gipsokarton listi'
    },
    {
      code: 'QM-003',
      name: 'Suv emulsiya Akfa White Silk (20 kg)',
      category: 'Qurilish mollari',
      unit: 'quti',
      purchasePrice: 175000,
      salePrice: 225000,
      minStock: 15,
      currentStock: 45,
      barcode: '478001234513',
      description: 'Ichki devorlar uchun matoviy oq rangli sifatli emulsiya'
    },
    {
      code: 'OF-001',
      name: 'Qora choy "Samarqand Premium" 250g',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'paket',
      purchasePrice: 18000,
      salePrice: 24000,
      minStock: 100,
      currentStock: 480,
      barcode: '478001234521',
      description: 'Yuqori navli yirik bargli qora choy'
    },
    {
      code: 'OF-002',
      name: 'Yashil choy "Kok choy No95" 200g',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'paket',
      purchasePrice: 14000,
      salePrice: 19000,
      minStock: 80,
      currentStock: 310,
      barcode: '478001234522',
      description: 'Klassik o\'zbek ko\'k choyi'
    },
    {
      code: 'OF-003',
      name: 'Shakar "Xorazm Shakar" (50 kg qop)',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'quti',
      purchasePrice: 460000,
      salePrice: 530000,
      minStock: 20,
      currentStock: 75,
      barcode: '478001234523',
      description: 'Tozalangan oq shakar qopi'
    },
    {
      code: 'OF-004',
      name: 'Kungaboqar moyi "Oila Tanlovi" 5L',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'dona',
      purchasePrice: 72000,
      salePrice: 89000,
      minStock: 40,
      currentStock: 160,
      barcode: '478001234524',
      description: 'Hidsizlantirilgan tozalangan kungaboqar o\'simlik moyi'
    },
    {
      code: 'KS-001',
      name: 'A4 formatdagi qog\'oz SvetoCopy Classic',
      category: 'Kantselyariya buyumlari',
      unit: 'quti',
      purchasePrice: 37000,
      salePrice: 47000,
      minStock: 50,
      currentStock: 260,
      barcode: '478001234531',
      description: '80g/m2 zichlikdagi standart printer va kseroks qog\'ozi (500 varaq)'
    },
    {
      code: 'KS-002',
      name: 'Ruchka sharikli ErichKrause 0.7mm Ko\'k',
      category: 'Kantselyariya buyumlari',
      unit: 'dona',
      purchasePrice: 2200,
      salePrice: 3500,
      minStock: 200,
      currentStock: 1200,
      barcode: '478001234532',
      description: 'Yumshoq yozuvchi ko\'k rangli sharikli ruchka'
    },
    {
      code: 'KS-003',
      name: 'Fayl papka-registrator Delux 75mm',
      category: 'Kantselyariya buyumlari',
      unit: 'dona',
      purchasePrice: 16000,
      salePrice: 22000,
      minStock: 25,
      currentStock: 90,
      barcode: '478001234533',
      description: 'Hujjatlar arxivi uchun mustahkam temir qisqichli papka'
    },
    {
      code: 'KK-001',
      name: 'Kombinezon maxsus ishchi kiyimi (To\'plam)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'dona',
      purchasePrice: 175000,
      salePrice: 235000,
      minStock: 15,
      currentStock: 42,
      barcode: '478001234541',
      description: 'Ombor va ishlab chiqarish xodimlari uchun pishiq paxtali kiyim'
    },
    {
      code: 'KK-002',
      name: 'Paxtali himoya qo\'lqoplari (PVC nuqtali)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'dona',
      purchasePrice: 2800,
      salePrice: 4500,
      minStock: 200,
      currentStock: 850,
      barcode: '478001234542',
      description: 'Yuk ortish va tushirish uchun sirpanmaydigan qo\'lqop'
    },
    {
      code: 'AV-001',
      name: 'Motor moyi Castrol Magnatec 5W-40 (4L)',
      category: 'Avto ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 320000,
      salePrice: 410000,
      minStock: 10,
      currentStock: 28,
      barcode: '478001234551',
      description: 'Sintetik yuqori himoyali benzin va dizel dvigatel moyi'
    },
    {
      code: 'AV-002',
      name: 'Tormoz suyuqligi DOT-4 Rosdot (0.5L)',
      category: 'Avto ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 32000,
      salePrice: 46000,
      minStock: 15,
      currentStock: 2, // Minimal qoldiqdan kam!
      barcode: '478001234552',
      description: 'Barcha turdagi yengil avtomobillar uchun tormoz suyuqligi'
    },
    {
      code: 'KM-001',
      name: 'Tozalash geli Domestos Ultra White 1L',
      category: 'Tozalash va kimyo vositalari',
      unit: 'dona',
      purchasePrice: 21000,
      salePrice: 28500,
      minStock: 30,
      currentStock: 110,
      barcode: '478001234561',
      description: 'Universall xlorli dezinfeksiya va tozalash geli'
    },
    {
      code: 'KM-002',
      name: 'Suyuq sovun "Fresh Touch" 5L (Konteyner)',
      category: 'Tozalash va kimyo vositalari',
      unit: 'dona',
      purchasePrice: 42000,
      salePrice: 56000,
      minStock: 15,
      currentStock: 65,
      barcode: '478001234562',
      description: 'Antibakterial yumshoq qo\'l yuvish suyuq sovuni'
    }
  ];

  const products = {};
  for (const p of productsData) {
    products[p.code] = await prisma.product.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        categoryId: categories[p.category].id,
        unitId: units[p.unit].id,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        minStock: p.minStock,
        currentStock: p.currentStock,
        barcode: p.barcode,
        description: p.description,
        isActive: true
      },
      create: {
        code: p.code,
        name: p.name,
        categoryId: categories[p.category].id,
        unitId: units[p.unit].id,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        minStock: p.minStock,
        currentStock: p.currentStock,
        barcode: p.barcode,
        description: p.description,
        isActive: true
      }
    });
  }
  console.log('✅ 20 ta mahsulot katalogi tayyor');

  // 7. Kirim operatsiyalari (StockIn)
  const now = new Date();
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const stockInsData = [
    {
      productCode: 'EL-001',
      supplierName: 'Artel Electronics MCHJ',
      quantity: 20,
      price: 2400000,
      date: daysAgo(25),
      invoiceNumber: 'INV-2026-0101',
      notes: 'Zavoddan to\'g\'ridan-to\'g\'ri partiya'
    },
    {
      productCode: 'EL-002',
      supplierName: 'Artel Electronics MCHJ',
      quantity: 15,
      price: 3800000,
      date: daysAgo(22),
      invoiceNumber: 'INV-2026-0104',
      notes: 'Yangi muzlatgichlar partiyasi'
    },
    {
      productCode: 'EL-003',
      supplierName: 'Artel Electronics MCHJ',
      quantity: 30,
      price: 650000,
      date: daysAgo(18),
      invoiceNumber: 'INV-2026-0112',
      notes: 'Konteynerli changyutgichlar'
    },
    {
      productCode: 'QM-001',
      supplierName: 'Akfa Building Materials XK',
      quantity: 400,
      price: 62000,
      date: daysAgo(15),
      invoiceNumber: 'INV-2026-0120',
      notes: 'Fura orqali sement partiyasi keldi'
    },
    {
      productCode: 'QM-002',
      supplierName: 'Akfa Building Materials XK',
      quantity: 180,
      price: 42000,
      date: daysAgo(14),
      invoiceNumber: 'INV-2026-0125',
      notes: 'Knauf gipsokarton listlari'
    },
    {
      productCode: 'QM-003',
      supplierName: 'Akfa Building Materials XK',
      quantity: 60,
      price: 175000,
      date: daysAgo(12),
      invoiceNumber: 'INV-2026-0133',
      notes: 'Oq rangli suv emulsiyalari'
    },
    {
      productCode: 'OF-001',
      supplierName: 'Samarqand Choy QK',
      quantity: 600,
      price: 18000,
      date: daysAgo(10),
      invoiceNumber: 'INV-2026-0140',
      notes: 'Qora choy 250g qutilarda'
    },
    {
      productCode: 'OF-002',
      supplierName: 'Samarqand Choy QK',
      quantity: 400,
      price: 14000,
      date: daysAgo(9),
      invoiceNumber: 'INV-2026-0145',
      notes: 'Yashil choy 95 partiyasi'
    },
    {
      productCode: 'OF-003',
      supplierName: 'Samarqand Choy QK',
      quantity: 100,
      price: 460000,
      date: daysAgo(7),
      invoiceNumber: 'INV-2026-0152',
      notes: '50 kg qoplarda Xorazm shakari'
    },
    {
      productCode: 'KS-001',
      supplierName: 'Toshkent Qog\'oz Sanoati MCHJ',
      quantity: 350,
      price: 37000,
      date: daysAgo(5),
      invoiceNumber: 'INV-2026-0160',
      notes: 'Svetocopy A4 qog\'oz partiyasi'
    },
    {
      productCode: 'KK-001',
      supplierName: 'Global Textile Solutions MCHJ',
      quantity: 50,
      price: 175000,
      date: daysAgo(4),
      invoiceNumber: 'INV-2026-0166',
      notes: 'Omborchilar uchun maxsus formalar'
    },
    {
      productCode: 'AV-001',
      supplierName: 'AvtoDetall Impex XK',
      quantity: 35,
      price: 320000,
      date: daysAgo(2),
      invoiceNumber: 'INV-2026-0175',
      notes: 'Castrol Magnatec motor moylari'
    },
    {
      productCode: 'KM-001',
      supplierName: 'Navoiy Kimyo Zavodi AJ',
      quantity: 150,
      price: 21000,
      date: daysAgo(1),
      invoiceNumber: 'INV-2026-0182',
      notes: 'Domestos tozalash vositalari'
    }
  ];

  for (const item of stockInsData) {
    const prod = products[item.productCode];
    const sup = suppliers[item.supplierName];
    if (!prod || !sup) continue;

    const existing = await prisma.stockIn.findFirst({
      where: { invoiceNumber: item.invoiceNumber }
    });

    if (!existing) {
      await prisma.stockIn.create({
        data: {
          productId: prod.id,
          supplierId: sup.id,
          quantity: item.quantity,
          price: item.price,
          totalAmount: item.quantity * item.price,
          date: item.date,
          invoiceNumber: item.invoiceNumber,
          notes: item.notes,
          userId: adminUser.id
        }
      });
    }
  }
  console.log('✅ Kirim operatsiyalari yuklandi');

  // 8. Chiqim operatsiyalari (StockOut)
  const stockOutsData = [
    {
      productCode: 'EL-001',
      quantity: 2,
      recipientName: 'Chilonzor savdo filiali',
      recipientPhone: '+998 90 111 22 33',
      date: daysAgo(20),
      notes: 'Ko\'rgazma va sotuv uchun yetkazildi'
    },
    {
      productCode: 'EL-002',
      quantity: 3,
      recipientName: 'Yunusobod savdo filiali',
      recipientPhone: '+998 90 222 33 44',
      date: daysAgo(18),
      notes: 'Buyurtmachi talabiga asosan'
    },
    {
      productCode: 'EL-003',
      quantity: 5,
      recipientName: 'Samarqand hududiy do\'koni',
      recipientPhone: '+998 93 333 44 55',
      date: daysAgo(15),
      notes: 'Filial ta\'minoti uchun'
    },
    {
      productCode: 'QM-001',
      quantity: 80,
      recipientName: 'Toshkent Siti Qurilish uchastkasi',
      recipientPhone: '+998 97 444 55 66',
      date: daysAgo(12),
      notes: 'Poydevor quyish ishlari uchun'
    },
    {
      productCode: 'QM-002',
      quantity: 40,
      recipientName: 'Pudratchi "StroyMaster" MCHJ',
      recipientPhone: '+998 91 555 66 77',
      date: daysAgo(10),
      notes: 'Bino ichki bezash ishlari'
    },
    {
      productCode: 'OF-001',
      quantity: 120,
      recipientName: 'Korzinka Supermarketlar tarmog\'i',
      recipientPhone: '+998 78 140 14 14',
      date: daysAgo(8),
      notes: 'Haftalik ta\'minot shartnomasi bo\'yicha'
    },
    {
      productCode: 'OF-002',
      quantity: 90,
      recipientName: 'Havas Diskounter do\'koni',
      recipientPhone: '+998 71 205 55 55',
      date: daysAgo(7),
      notes: 'Tarmoq do\'konlariga tarqatish'
    },
    {
      productCode: 'OF-003',
      quantity: 25,
      recipientName: 'Qandolat fabrikasi "Shirin Dunyo"',
      recipientPhone: '+998 99 666 77 88',
      date: daysAgo(5),
      notes: 'Shirinliklar tayyorlash tsexi uchun'
    },
    {
      productCode: 'KS-001',
      quantity: 90,
      recipientName: 'Bosh ofis ma\'muriyati',
      recipientPhone: '+998 71 200 00 11',
      date: daysAgo(3),
      notes: 'Barcha bo\'limlar oylik ehtiyoji'
    },
    {
      productCode: 'KK-001',
      quantity: 8,
      recipientName: 'Texnik xizmat ko\'rsatish bo\'limi',
      recipientPhone: '+998 90 777 88 99',
      date: daysAgo(2),
      notes: 'Yangi ishga olingan ustalarga tarqatildi'
    },
    {
      productCode: 'AV-001',
      quantity: 7,
      recipientName: 'Avtopark logistika bo\'limi',
      recipientPhone: '+998 90 888 99 00',
      date: daysAgo(1),
      notes: 'Isuzu yuk mashinalari moy almashtiruvi'
    },
    {
      productCode: 'KM-001',
      quantity: 40,
      recipientName: 'Sanitariya va tozalik xizmati',
      recipientPhone: '+998 93 999 00 11',
      date: daysAgo(0),
      notes: 'Ombor sanitariya tozalov tadbiri'
    }
  ];

  for (const item of stockOutsData) {
    const prod = products[item.productCode];
    if (!prod) continue;

    const existing = await prisma.stockOut.findFirst({
      where: {
        productId: prod.id,
        recipientName: item.recipientName,
        date: item.date
      }
    });

    if (!existing) {
      await prisma.stockOut.create({
        data: {
          productId: prod.id,
          quantity: item.quantity,
          recipientName: item.recipientName,
          recipientPhone: item.recipientPhone,
          date: item.date,
          notes: item.notes,
          userId: operatorUser.id
        }
      });
    }
  }
  console.log('✅ Chiqim operatsiyalari yuklandi');

  // 9. Bildirishnomalar (Notifications)
  const notificationsData = [
    {
      title: 'Ombor qoldig\'i kam',
      message: 'Konditsioner Artel Inverter 12 HD mahsulotidan atigi 3 dona qoldi (minimal chegara: 6 dona). Qayta buyurtma berish tavsiya etiladi.',
      type: 'warning',
      isRead: false
    },
    {
      title: 'Ombor qoldig\'i kam',
      message: 'Tormoz suyuqligi DOT-4 mahsulotidan atigi 2 dona qoldi (minimal chegara: 15 dona).',
      type: 'warning',
      isRead: false
    },
    {
      title: 'Yangi kirim operatsiyasi',
      message: 'Akfa Building Materials kompaniyasidan 400 qop sement muvaffaqiyatli qabul qilindi.',
      type: 'info',
      isRead: false
    },
    {
      title: 'Yirik chiqim amalga oshirildi',
      message: 'Toshkent Siti qurilish ob\'ektiga 80 qop sement chiqarib berildi.',
      type: 'success',
      isRead: true
    },
    {
      title: 'Tizim xavfsizligi yangilandi',
      message: 'OmborXona tizimida xavfsizlik va ma\'lumotlar integratsiyasi yangilandi.',
      type: 'info',
      isRead: true
    }
  ];

  for (const n of notificationsData) {
    const existing = await prisma.notification.findFirst({
      where: { title: n.title, message: n.message }
    });
    if (!existing) {
      await prisma.notification.create({ data: n });
    }
  }
  console.log('✅ Bildirishnomalar yuklandi');

  // 10. Audit loglar
  const auditLogsData = [
    {
      userId: adminUser.id,
      action: 'login',
      module: 'auth',
      details: 'Administrator tizimga muvaffaqiyatli kirdi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0'
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'products',
      details: 'Yangi mahsulot yaratildi: Televizor Artel Smart 43"',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0'
    },
    {
      userId: operatorUser.id,
      action: 'create',
      module: 'stock_in',
      details: 'INV-2026-0120 raqamli sement kirim hujjati tasdiqlandi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0'
    },
    {
      userId: operatorUser.id,
      action: 'create',
      module: 'stock_out',
      details: 'Toshkent Siti ob\'ektiga chiqim rasmiylashtirildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0'
    },
    {
      userId: adminUser.id,
      action: 'update',
      module: 'settings',
      details: 'Kompaniya rekvizitlari yangilandi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0'
    }
  ];

  for (const l of auditLogsData) {
    await prisma.auditLog.create({ data: l });
  }
  console.log('✅ Audit harakatlar tarixi yuklandi');

  console.log('\n🎉 Barcha ma\'lumotlar muvaffaqiyatli to\'ldirildi!');
}

main()
  .catch((e) => {
    console.error('Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
