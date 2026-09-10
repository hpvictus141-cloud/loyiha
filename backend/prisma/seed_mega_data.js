import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper for dates relative to now
const now = new Date();
function daysAgo(days, hoursOffset = 0) {
  const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

function todayWithHours(hours, minutes = 0) {
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function main() {
  console.log('🌟 [OmborXona] Mega demo ma\'lumotlar yuklanmoqda...\n');

  // 1. Rollar
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Tizim administratori - barcha huquqlarga ega' }
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: { name: 'Operator', description: 'Ombor operatori - kirim, chiqim va hisobotlar' }
  });

  const omborchiRole = await prisma.role.upsert({
    where: { name: 'Omborchi' },
    update: {},
    create: { name: 'Omborchi', description: 'Ombor mutaxassisi - qoldiqlar va operatsiyalar' }
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

  console.log('✅ Foydalanuvchilar (admin, operator, omborchi, demo) tayyor');

  // 3. O'lchov birliklari
  const unitsData = [
    { name: 'Dona', symbol: 'dona', description: 'Donali mahsulotlar' },
    { name: 'Kilogramm', symbol: 'kg', description: 'Og\'irlik o\'lchovi' },
    { name: 'Litr', symbol: 'l', description: 'Suyuqlik va hajm o\'lchovi' },
    { name: 'Metr', symbol: 'm', description: 'Uzunlik o\'lchovi' },
    { name: 'Kvadrat metr', symbol: 'm²', description: 'Yuzasi o\'lchovi' },
    { name: 'Quti', symbol: 'quti', description: 'Qutilangan mahsulotlar' },
    { name: 'Paket', symbol: 'paket', description: 'Paketlangan mahsulotlar' },
    { name: 'O\'ram', symbol: 'o\'ram', description: 'O\'ralgan mahsulotlar' },
    { name: 'Komplekt', symbol: 'kompl', description: 'To\'plam yoki jihoz' }
  ];

  const units = {};
  for (const u of unitsData) {
    units[u.symbol] = await prisma.unit.upsert({
      where: { name: u.name },
      update: { symbol: u.symbol },
      create: u
    });
  }
  console.log('✅ O\'lchov birliklari tayyor');

  // 4. Kategoriyalar
  const categoriesData = [
    { name: 'Elektronika va maishiy texnika', description: 'Televizorlar, muzlatgichlar, konditsioner va maishiy texnikalar' },
    { name: 'Qurilish mollari', description: 'Sement, gipsokarton, bo\'yoqlar, kafel va pardozlash materiallari' },
    { name: 'Oziq-ovqat mahsulotlari', description: 'Choy, shakar, o\'simlik yog\'i, qandolat va konserva tovarlari' },
    { name: 'Kantselyariya va ofis buyumlari', description: 'A4 qog\'oz, ruchkalar, fayllar, daftarlar va ofis materiallari' },
    { name: 'Mebel va ofis jihozlari', description: 'Ofis stullari, stollar, metall shkaflar va javonlar' },
    { name: 'Maxsus kiyim va himoya vositalari', description: 'Kombinezonlar, xavfsizlik botinkalari, kaskalar va qo\'lqoplar' },
    { name: 'Avtomobil ehtiyot qismlari', description: 'Motor moylari, tormoz disklari, filtrlar va akkumulyatorlar' },
    { name: 'Tozalash va maishiy kimyo', description: 'Dezinfeksiya vositalari, tozalash jellari va yuvish vositalari' },
    { name: 'Santexnika va suv ta\'minoti', description: 'Kranlar, quvurlar, fitinglar va suv hisoblagichlar' },
    { name: 'Elektrika va yoritish', description: 'LED lampalar, kabellar, avtomat uzgichlar va rozetkalar' },
    { name: 'Qadoqlash materiallari', description: 'Skotch, streych plyonka, gofrakarton qutilar va qoplar' },
    { name: 'Asbob-uskunalar', description: 'Drel, perforator, bolg\'a, kalit to\'plamlari va o\'lchov lentalari' },
    { name: 'Tibbiyot va birinchi yordam', description: 'Aptechkalar, antiseptiklar, bintlar va tibbiy niqoblar' },
    { name: 'Ichimliklar va sharbatlar', description: 'Mineral suvlar, salqin ichimliklar va tabiiy sharbatlar' }
  ];

  const categories = {};
  for (const c of categoriesData) {
    categories[c.name] = await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: c
    });
  }
  console.log('✅ 14 ta kategoriya tayyor');

  // 5. Yetkazib beruvchilar
  const suppliersData = [
    {
      companyName: 'Artel Electronics MCHJ',
      contactPerson: 'Farhod Qodirov',
      phone: '+998 71 202 22 22',
      email: 'info@artel.uz',
      address: 'Toshkent sh., Yashnobod tumani, Parkent ko\'chasi 182',
      taxId: '302194821',
      description: 'O\'zbekistondagi yetakchi maishiy texnika ishlab chiqaruvchisi'
    },
    {
      companyName: 'Akfa Building Materials XK',
      contactPerson: 'Bobur Mirzayev',
      phone: '+998 71 203 00 00',
      email: 'sales@akfa-build.uz',
      address: 'Toshkent sh., Olmazor tumani, Kichik halqa yo\'li 1',
      taxId: '305829104',
      description: 'Qurilish profillari va pardozlash mollari yetkazib beruvchi'
    },
    {
      companyName: 'Samarqand Choy QK',
      contactPerson: 'Shavkat Rahimov',
      phone: '+998 66 233 44 55',
      email: 'tea@samtea.uz',
      address: 'Samarqand sh., Gagarin ko\'chasi 45',
      taxId: '201849203',
      description: 'Choy va qandolat mahsulotlari ulgurji yetkazib beruvchisi'
    },
    {
      companyName: 'Toshkent Qog\'oz Sanoati MCHJ',
      contactPerson: 'Otabek Salimov',
      phone: '+998 71 278 99 88',
      email: 'paper@tqs.uz',
      address: 'Toshkent vil., Zangiota tumani, Sanoat hududi 12',
      taxId: '301948291',
      description: 'A4 formatli qog\'oz, karton va poligrafiya mahsulotlari'
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
      description: 'Maxsus ishchi kiyimlari, kombinezon va paxtali qo\'lqoplar'
    },
    {
      companyName: 'AvtoDetall Impex XK',
      contactPerson: 'Jamshid Fayziyev',
      phone: '+998 74 228 33 44',
      email: 'import@avtodetall.uz',
      address: 'Andijon sh., Amir Temur shox ko\'chasi 88',
      taxId: '306192847',
      description: 'Avtomobil moylari va texnik suyuqliklar to\'g\'ridan-to\'g\'ri importi'
    },
    {
      companyName: 'Chirchiq Mega Plast MCHJ',
      contactPerson: 'Anvar Toshmatov',
      phone: '+998 70 715 12 34',
      email: 'info@chirchiqplast.uz',
      address: 'Toshkent vil., Chirchiq sh., Zakovat ko\'chasi 4',
      taxId: '308221940',
      description: 'Santexnika quvurlari, fitinglar va plastik mahsulotlar'
    },
    {
      companyName: 'Bekobod Metall Sanoat AJ',
      contactPerson: 'Sherzod Qodirov',
      phone: '+998 90 999 11 22',
      email: 'sales@bekmetall.uz',
      address: 'Bekobod sh., Zavodskaya 1',
      taxId: '202334819',
      description: 'Armatura, po\'lat quvurlar va metall buyumlar'
    },
    {
      companyName: 'Oasis Beverages Distribution',
      contactPerson: 'Kamron Xoliqov',
      phone: '+998 71 280 40 50',
      email: 'order@oasisbev.uz',
      address: 'Toshkent sh., Sergeli tumani, Yangi Sergeli 25',
      taxId: '309112233',
      description: 'Mineral suvlar, muzdek choylar va sharbatlar distribyutori'
    },
    {
      companyName: 'Asbob-Uskuna Profi XK',
      contactPerson: 'Alisher Vohidov',
      phone: '+998 71 250 60 70',
      email: 'profi@asbob.uz',
      address: 'Toshkent sh., Mirzo Ulug\'bek tumani, Buyuk Ipak Yo\'li 120',
      taxId: '307445566',
      description: 'Professional elektr va qo\'l asboblari yetkazib beruvchisi'
    },
    {
      companyName: 'MedFarm Ta\'minot MCHJ',
      contactPerson: 'Gulnora Karimova',
      phone: '+998 71 245 88 99',
      email: 'medfarm@ta-minot.uz',
      address: 'Toshkent sh., Shayxontohur tumani, Navoiy 44',
      taxId: '301556677',
      description: 'Tibbiy buyumlar, dezinfektantlar va birinchi yordam to\'plamlari'
    },
    {
      companyName: 'Zamonaviy Ofis Mebel XK',
      contactPerson: 'Rustam Yusupov',
      phone: '+998 90 312 34 56',
      email: 'mebel@ofispro.uz',
      address: 'Toshkent sh., Uchtepa tumani, Lutfiy ko\'chasi 33',
      taxId: '303778899',
      description: 'Ergonomik ofis mebellari, stul va saqlash tizimlari'
    },
    {
      companyName: 'ElektroKomplekt Servis MCHJ',
      contactPerson: 'Davron Ahmedov',
      phone: '+998 71 268 77 00',
      email: 'elektro@komplekt.uz',
      address: 'Toshkent sh., Yakkasaroy tumani, Shota Rustaveli 90',
      taxId: '304990011',
      description: 'Kabel, elektr himoya va sanoat yoritish tizimlari'
    },
    {
      companyName: 'Universal Qadoq Sanoat MCHJ',
      contactPerson: 'Bahodir Qosimov',
      phone: '+998 71 290 33 44',
      email: 'pack@universalqadoq.uz',
      address: 'Toshkent vil., Qibray tumani, Salar 15',
      taxId: '306334455',
      description: 'Karton qutilar, skotch, streych va qadoqlash plyonkalari'
    }
  ];

  const suppliers = {};
  for (const s of suppliersData) {
    suppliers[s.companyName] = await prisma.supplier.upsert({
      where: { taxId: s.taxId },
      update: {
        companyName: s.companyName,
        contactPerson: s.contactPerson,
        phone: s.phone,
        address: s.address,
        description: s.description
      },
      create: s
    });
  }
  console.log('✅ 15 ta yetkazib beruvchi tayyor');

  // 6. Mahsulotlar katalogi (80+ xilma-xil mahsulotlar)
  const productsData = [
    // 1. Elektronika
    {
      code: 'EL-001',
      name: 'Televizor Artel Smart 43" Full HD',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 2400000,
      salePrice: 2950000,
      minStock: 5,
      currentStock: 24,
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
      currentStock: 15,
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
      currentStock: 32,
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
      currentStock: 3, // KAM QOLGAN
      barcode: '478001234504',
      description: '35 kv.m xonalar uchun qish-yoz rejimli inverter konditsioner'
    },
    {
      code: 'EL-005',
      name: 'Mikroto\'lqinli pech Artel 20L Solo',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 720000,
      salePrice: 940000,
      minStock: 8,
      currentStock: 19,
      barcode: '478001234505',
      description: '20 litr hajm, 6 xil avtomatik dastur'
    },
    {
      code: 'EL-006',
      name: 'Kir yuvish mashinasi Artel 7kg Inverter',
      category: 'Elektronika va maishiy texnika',
      unit: 'dona',
      purchasePrice: 3100000,
      salePrice: 3850000,
      minStock: 5,
      currentStock: 2, // KAM QOLGAN
      barcode: '478001234506',
      description: '7 kg yuklama, 1200 aylanish/minut tezlik'
    },

    // 2. Qurilish mollari
    {
      code: 'QM-001',
      name: 'Sement Ohangaron M-500 (50 kg qop)',
      category: 'Qurilish mollari',
      unit: 'quti',
      purchasePrice: 62000,
      salePrice: 75000,
      minStock: 50,
      currentStock: 480,
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
      minStock: 40,
      currentStock: 190,
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
      minStock: 20,
      currentStock: 55,
      barcode: '478001234513',
      description: 'Ichki devorlar uchun matoviy oq rangli sifatli emulsiya'
    },
    {
      code: 'QM-004',
      name: 'Shpaklyovka Alchibay Finiw (25 kg)',
      category: 'Qurilish mollari',
      unit: 'quti',
      purchasePrice: 38000,
      salePrice: 49000,
      minStock: 30,
      currentStock: 12, // KAM QOLGAN
      barcode: '478001234514',
      description: 'Gips asosidagi yakuniy silliqlash shpaklyovkasi'
    },
    {
      code: 'QM-005',
      name: 'Kafel yelimi Ceresit CM-11 (25 kg)',
      category: 'Qurilish mollari',
      unit: 'quti',
      purchasePrice: 45000,
      salePrice: 58000,
      minStock: 35,
      currentStock: 110,
      barcode: '478001234515',
      description: 'Keramik kafel va plitkalar uchun mustahkam kley'
    },
    {
      code: 'QM-006',
      name: 'Gidroizolyatsiya bikrost (10m rulon)',
      category: 'Qurilish mollari',
      unit: 'o\'ram',
      purchasePrice: 140000,
      salePrice: 185000,
      minStock: 15,
      currentStock: 4, // KAM QOLGAN
      barcode: '478001234516',
      description: 'Tom va poydevor uchun rulonli ruberoid izolatsiyasi'
    },

    // 3. Oziq-ovqat mahsulotlari
    {
      code: 'OF-001',
      name: 'Qora choy "Samarqand Premium" 250g',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'paket',
      purchasePrice: 18000,
      salePrice: 24000,
      minStock: 100,
      currentStock: 650,
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
      currentStock: 420,
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
      minStock: 25,
      currentStock: 110,
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
      currentStock: 220,
      barcode: '478001234524',
      description: 'Hidsizlantirilgan tozalangan kungaboqar o\'simlik moyi'
    },
    {
      code: 'OF-005',
      name: 'Guruch "Alanga" Toshkent (25 kg qop)',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'quti',
      purchasePrice: 375000,
      salePrice: 440000,
      minStock: 20,
      currentStock: 6, // KAM QOLGAN
      barcode: '478001234525',
      description: 'Palov uchun tanlangan yuqori navli Alanga guruchi'
    },
    {
      code: 'OF-006',
      name: 'Makaron "Makfa" Spagetti 450g',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'paket',
      purchasePrice: 9500,
      salePrice: 13000,
      minStock: 150,
      currentStock: 780,
      barcode: '478001234526',
      description: 'Qattiq bug\'doy navidan tayyorlangan oliy sifatli spagetti'
    },
    {
      code: 'OF-007',
      name: 'Un "Qozog\'iston Birinchi Nav" (50 kg)',
      category: 'Oziq-ovqat mahsulotlari',
      unit: 'quti',
      purchasePrice: 280000,
      salePrice: 330000,
      minStock: 30,
      currentStock: 85,
      barcode: '478001234527',
      description: 'Oliy sifatli non va xamir ovqatlar uchun un'
    },

    // 4. Kantselyariya
    {
      code: 'KS-001',
      name: 'A4 formatdagi qog\'oz SvetoCopy Classic',
      category: 'Kantselyariya va ofis buyumlari',
      unit: 'quti',
      purchasePrice: 37000,
      salePrice: 47000,
      minStock: 60,
      currentStock: 340,
      barcode: '478001234531',
      description: '80g/m2 zichlikdagi standart printer va kseroks qog\'ozi (500 varaq)'
    },
    {
      code: 'KS-002',
      name: 'Ruchka sharikli ErichKrause 0.7mm Ko\'k',
      category: 'Kantselyariya va ofis buyumlari',
      unit: 'dona',
      purchasePrice: 2200,
      salePrice: 3500,
      minStock: 250,
      currentStock: 1600,
      barcode: '478001234532',
      description: 'Yumshoq yozuvchi ko\'k rangli sharikli ruchka'
    },
    {
      code: 'KS-003',
      name: 'Fayl papka-registrator Delux 75mm',
      category: 'Kantselyariya va ofis buyumlari',
      unit: 'dona',
      purchasePrice: 16000,
      salePrice: 22000,
      minStock: 30,
      currentStock: 140,
      barcode: '478001234533',
      description: 'Hujjatlar arxivi uchun mustahkam temir qisqichli papka'
    },
    {
      code: 'KS-004',
      name: 'Oddiy qalam to\'plami Koh-i-Noor (12 dona)',
      category: 'Kantselyariya va ofis buyumlari',
      unit: 'quti',
      purchasePrice: 24000,
      salePrice: 34000,
      minStock: 20,
      currentStock: 5, // KAM QOLGAN
      barcode: '478001234534',
      description: 'HB grafitli professional qalamlar to\'plami'
    },
    {
      code: 'KS-005',
      name: 'Stepler Kangaro No.10 metall',
      category: 'Kantselyariya va ofis buyumlari',
      unit: 'dona',
      purchasePrice: 19000,
      salePrice: 27000,
      minStock: 15,
      currentStock: 48,
      barcode: '478001234535',
      description: '20 varaqgacha qog\'oz qisuvchi mustahkam ofis stepleri'
    },

    // 5. Mebel va ofis jihozlari
    {
      code: 'MB-001',
      name: 'Ofis kreslosi "Ergonomic Mesh Black"',
      category: 'Mebel va ofis jihozlari',
      unit: 'dona',
      purchasePrice: 750000,
      salePrice: 980000,
      minStock: 5,
      currentStock: 18,
      barcode: '478001234541',
      description: 'Bel tayanchi va nafas oluvchi to\'rli boshqaruvchi kreslosi'
    },
    {
      code: 'MB-002',
      name: 'Metall saqlash javoni 4 qavatli (180x90x40)',
      category: 'Mebel va ofis jihozlari',
      unit: 'dona',
      purchasePrice: 480000,
      salePrice: 650000,
      minStock: 6,
      currentStock: 22,
      barcode: '478001234542',
      description: 'Ombor va arxiv uchun galvanizatsiyalangan mustahkam javon'
    },
    {
      code: 'MB-003',
      name: 'Yozuv stoli "Modern Office" 120x60',
      category: 'Mebel va ofis jihozlari',
      unit: 'dona',
      purchasePrice: 520000,
      salePrice: 710000,
      minStock: 4,
      currentStock: 2, // KAM QOLGAN
      barcode: '478001234543',
      description: 'Metall karkasli, laminat qoplamali qulay ofis stoli'
    },
    {
      code: 'MB-004',
      name: 'Hujjatlar uchun metall seyf AIKO T-17',
      category: 'Mebel va ofis jihozlari',
      unit: 'dona',
      purchasePrice: 620000,
      salePrice: 840000,
      minStock: 3,
      currentStock: 7,
      barcode: '478001234544',
      description: 'Elektron qulflangan ixcham arxiv seyfi'
    },

    // 6. Maxsus kiyim va himoya vositalari
    {
      code: 'KK-001',
      name: 'Kombinezon maxsus ishchi kiyimi (To\'plam)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'kompl',
      purchasePrice: 175000,
      salePrice: 235000,
      minStock: 20,
      currentStock: 68,
      barcode: '478001234551',
      description: 'Ombor va ishlab chiqarish xodimlari uchun pishiq paxtali kiyim'
    },
    {
      code: 'KK-002',
      name: 'Paxtali himoya qo\'lqoplari (PVC nuqtali)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'dona',
      purchasePrice: 2800,
      salePrice: 4500,
      minStock: 300,
      currentStock: 1400,
      barcode: '478001234552',
      description: 'Yuk ortish va tushirish uchun sirpanmaydigan qo\'lqop'
    },
    {
      code: 'KK-003',
      name: 'Himoya kaskasi oq (Qurilish uchun)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'dona',
      purchasePrice: 32000,
      salePrice: 46000,
      minStock: 25,
      currentStock: 8, // KAM QOLGAN
      barcode: '478001234553',
      description: 'Zarbaga chidamli sozlanuvchi xavfsizlik kaskasi'
    },
    {
      code: 'KK-004',
      name: 'Maxsus xavfsizlik botinkalari (Temir burunli)',
      category: 'Maxsus kiyim va himoya vositalari',
      unit: 'dona',
      purchasePrice: 185000,
      salePrice: 250000,
      minStock: 15,
      currentStock: 34,
      barcode: '478001234554',
      description: 'Og\'ir yuk tushishidan himoyalovchi charm poyabzal'
    },

    // 7. Avto ehtiyot qismlari
    {
      code: 'AV-001',
      name: 'Motor moyi Castrol Magnatec 5W-40 (4L)',
      category: 'Avtomobil ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 320000,
      salePrice: 410000,
      minStock: 15,
      currentStock: 46,
      barcode: '478001234561',
      description: 'Sintetik yuqori himoyali benzin va dizel dvigatel moyi'
    },
    {
      code: 'AV-002',
      name: 'Tormoz suyuqligi DOT-4 Rosdot (0.5L)',
      category: 'Avtomobil ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 32000,
      salePrice: 46000,
      minStock: 20,
      currentStock: 4, // KAM QOLGAN
      barcode: '478001234562',
      description: 'Barcha turdagi yengil avtomobillar uchun tormoz suyuqligi'
    },
    {
      code: 'AV-003',
      name: 'Antifriz Felix Pro Long Life -40C (5L)',
      category: 'Avtomobil ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 95000,
      salePrice: 130000,
      minStock: 15,
      currentStock: 38,
      barcode: '478001234563',
      description: 'Sovutish tizimi uchun qizil rangli yuqori sifatli antifriz'
    },
    {
      code: 'AV-004',
      name: 'Akkumulyator Delkor 60Ah 12V',
      category: 'Avtomobil ehtiyot qismlari',
      unit: 'dona',
      purchasePrice: 650000,
      salePrice: 820000,
      minStock: 5,
      currentStock: 14,
      barcode: '478001234564',
      description: 'Koreya ishlab chiqarishi, uzoq xizmat muddati'
    },

    // 8. Tozalash va maishiy kimyo
    {
      code: 'KM-001',
      name: 'Tozalash geli Domestos Ultra White 1L',
      category: 'Tozalash va maishiy kimyo',
      unit: 'dona',
      purchasePrice: 21000,
      salePrice: 28500,
      minStock: 40,
      currentStock: 180,
      barcode: '478001234571',
      description: 'Universall xlorli dezinfeksiya va tozalash geli'
    },
    {
      code: 'KM-002',
      name: 'Suyuq sovun "Fresh Touch" 5L (Konteyner)',
      category: 'Tozalash va maishiy kimyo',
      unit: 'dona',
      purchasePrice: 42000,
      salePrice: 56000,
      minStock: 20,
      currentStock: 74,
      barcode: '478001234572',
      description: 'Qo\'llar uchun yumshoq ko\'pikli xushbo\'y suyuq sovun'
    },
    {
      code: 'KM-003',
      name: 'Idish yuvish vositasi Fairy Limon 1L',
      category: 'Tozalash va maishiy kimyo',
      unit: 'dona',
      purchasePrice: 23000,
      salePrice: 31000,
      minStock: 35,
      currentStock: 130,
      barcode: '478001234573',
      description: 'Yog\'larni tez ketkazuvchi konsentrlangan suyuqlik'
    },
    {
      code: 'KM-004',
      name: 'Pol yuvish vositasi Mr.Proper 5L',
      category: 'Tozalash va maishiy kimyo',
      unit: 'dona',
      purchasePrice: 68000,
      salePrice: 89000,
      minStock: 15,
      currentStock: 3, // KAM QOLGAN
      barcode: '478001234574',
      description: 'Kafel, laminat va linoleum uchun yuvish vositasi'
    },

    // 9. Santexnika
    {
      code: 'ST-001',
      name: 'Plastik quvur PPR 25mm (4 metr)',
      category: 'Santexnika va suv ta\'minoti',
      unit: 'm',
      purchasePrice: 12000,
      salePrice: 17000,
      minStock: 100,
      currentStock: 520,
      barcode: '478001234581',
      description: 'Issiq va sovuq suv uchun bosimli polipropilen quvur'
    },
    {
      code: 'ST-002',
      name: 'Suv kran-aralashtirgich (Smesitel oshxona)',
      category: 'Santexnika va suv ta\'minoti',
      unit: 'dona',
      purchasePrice: 145000,
      salePrice: 198000,
      minStock: 10,
      currentStock: 28,
      barcode: '478001234582',
      description: 'Xromlangan, keramik kartrijli buriluvchi kran'
    },
    {
      code: 'ST-003',
      name: 'Suv hisoblagich (Schetchik) Betar 1/2"',
      category: 'Santexnika va suv ta\'minoti',
      unit: 'dona',
      purchasePrice: 115000,
      salePrice: 155000,
      minStock: 15,
      currentStock: 5, // KAM QOLGAN
      barcode: '478001234583',
      description: 'Davlat standarti bo\'yicha sertifikatlangan suv hisoblagich'
    },

    // 10. Elektrika va yoritish
    {
      code: 'ELK-001',
      name: 'LED lampochka 15W E27 Akfa Oq',
      category: 'Elektrika va yoritish',
      unit: 'dona',
      purchasePrice: 9500,
      salePrice: 14000,
      minStock: 100,
      currentStock: 640,
      barcode: '478001234591',
      description: 'Energiya tejovchi, 6500K sovuq oq nurli lampochka'
    },
    {
      code: 'ELK-002',
      name: 'Elektr kabeli VVG-P 3x2.5mm (100m buxta)',
      category: 'Elektrika va yoritish',
      unit: 'o\'ram',
      purchasePrice: 580000,
      salePrice: 720000,
      minStock: 10,
      currentStock: 35,
      barcode: '478001234592',
      description: 'Mis simli ikki qavatli izolatsiyali kuchlanish kabeli'
    },
    {
      code: 'ELK-003',
      name: 'Avtomat uzgich Schneider 16A bir qutbli',
      category: 'Elektrika va yoritish',
      unit: 'dona',
      purchasePrice: 22000,
      salePrice: 32000,
      minStock: 30,
      currentStock: 110,
      barcode: '478001234593',
      description: 'Elektr tarmog\'ini qisqa tutashuvdan himoyalovchi avtomat'
    },
    {
      code: 'ELK-004',
      name: 'Projektor LED 50W IP65 Tashqi yoritish',
      category: 'Elektrika va yoritish',
      unit: 'dona',
      purchasePrice: 75000,
      salePrice: 110000,
      minStock: 12,
      currentStock: 2, // KAM QOLGAN
      barcode: '478001234594',
      description: 'Ombor hududi va tashqi maydonlar uchun suv o\'tkazmas projektor'
    },

    // 11. Qadoqlash materiallari
    {
      code: 'QD-001',
      name: 'Skotch qadoqlash 48mm x 100m Shaffof',
      category: 'Qadoqlash materiallari',
      unit: 'dona',
      purchasePrice: 7500,
      salePrice: 11500,
      minStock: 150,
      currentStock: 920,
      barcode: '478001234601',
      description: 'Kuchli yopishuvchi mustahkam qadoqlash lentasi'
    },
    {
      code: 'QD-002',
      name: 'Streych plyonka 50cm (2.2 kg rulon)',
      category: 'Qadoqlash materiallari',
      unit: 'o\'ram',
      purchasePrice: 52000,
      salePrice: 71000,
      minStock: 30,
      currentStock: 160,
      barcode: '478001234602',
      description: 'Poddon va qutilarni o\'rash uchun elastik streych'
    },
    {
      code: 'QD-003',
      name: 'Gofrakarton quti T-24 (60x40x40 cm)',
      category: 'Qadoqlash materiallari',
      unit: 'dona',
      purchasePrice: 8500,
      salePrice: 12500,
      minStock: 100,
      currentStock: 480,
      barcode: '478001234603',
      description: '3 qavatli mustahkam yuk tashish karton qutisi'
    },

    // 12. Asbob-uskunalar
    {
      code: 'AS-001',
      name: 'Perforator Bosch GBH 2-26 DRE Professional',
      category: 'Asbob-uskunalar',
      unit: 'dona',
      purchasePrice: 1250000,
      salePrice: 1620000,
      minStock: 4,
      currentStock: 12,
      barcode: '478001234611',
      description: '800W quvvatli zarbali professional teshish apparati'
    },
    {
      code: 'AS-002',
      name: 'Bolg\'a to\'plami va kalitlar to\'plami (82 buyum)',
      category: 'Asbob-uskunalar',
      unit: 'kompl',
      purchasePrice: 420000,
      salePrice: 580000,
      minStock: 6,
      currentStock: 25,
      barcode: '478001234612',
      description: 'Xrom-vanadiy po\'latdan yasalgan chidamli chilangar to\'plami'
    },
    {
      code: 'AS-003',
      name: 'Lazerli masofa o\'lchagich Bosch 40m',
      category: 'Asbob-uskunalar',
      unit: 'dona',
      purchasePrice: 380000,
      salePrice: 510000,
      minStock: 5,
      currentStock: 1, // KAM QOLGAN
      barcode: '478001234613',
      description: 'Aniq masofa, yuza va hajm o\'lchovchi lazer ruletka'
    },

    // 13. Tibbiyot va birinchi yordam
    {
      code: 'TB-001',
      name: 'Omborxona uchun birinchi yordam aptechkasi',
      category: 'Tibbiyot va birinchi yordam',
      unit: 'kompl',
      purchasePrice: 145000,
      salePrice: 195000,
      minStock: 10,
      currentStock: 32,
      barcode: '478001234621',
      description: 'Barcha zaruriy dori-darmon va bog\'lov materiallari bilan'
    },
    {
      code: 'TB-002',
      name: 'Antiseptik gel "SeptoPlus" 5L dispenserli',
      category: 'Tibbiyot va birinchi yordam',
      unit: 'dona',
      purchasePrice: 55000,
      salePrice: 75000,
      minStock: 15,
      currentStock: 44,
      barcode: '478001234622',
      description: '70% spirtli terini zararsizlantiruvchi vosita'
    },

    // 14. Ichimliklar
    {
      code: 'IC-001',
      name: 'Mineral gazsiz suv "Chortoq" 1.5L',
      category: 'Ichimliklar va sharbatlar',
      unit: 'dona',
      purchasePrice: 3800,
      salePrice: 5500,
      minStock: 120,
      currentStock: 680,
      barcode: '478001234631',
      description: 'Tabiiy tog\' suvi, minerallar bilan boyitilgan'
    },
    {
      code: 'IC-002',
      name: 'Tabiiy olma sharbati "Dena" 1L',
      category: 'Ichimliklar va sharbatlar',
      unit: 'dona',
      purchasePrice: 8500,
      salePrice: 12000,
      minStock: 80,
      currentStock: 320,
      barcode: '478001234632',
      description: 'Qo\'shimcha shakarsiz 100% tabiiy olma sharbati'
    }
  ];

  const products = {};
  for (const p of productsData) {
    const cat = categories[p.category];
    const unt = units[p.unit];
    if (!cat || !unt) {
      console.warn(`Ogohlantirish: Kategoriya (${p.category}) yoki birlik (${p.unit}) topilmadi`);
      continue;
    }

    // Ensure barcode is unique to avoid collision with previous seeds
    let finalBarcode = p.barcode;
    if (finalBarcode) {
      const existingBarcodeOwner = await prisma.product.findUnique({ where: { barcode: finalBarcode } });
      if (existingBarcodeOwner && existingBarcodeOwner.code !== p.code) {
        finalBarcode = '478' + Math.floor(100000000 + Math.random() * 900000000);
      }
    }

    products[p.code] = await prisma.product.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        categoryId: cat.id,
        unitId: unt.id,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        minStock: p.minStock,
        currentStock: p.currentStock,
        barcode: finalBarcode,
        description: p.description,
        isActive: true
      },
      create: {
        code: p.code,
        name: p.name,
        categoryId: cat.id,
        unitId: unt.id,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        minStock: p.minStock,
        currentStock: p.currentStock,
        barcode: finalBarcode,
        description: p.description,
        isActive: true
      }
    });
  }
  console.log(`✅ ${Object.keys(products).length} ta boy mahsulot katalogi tayyor`);

  // 7. Kirim operatsiyalari (StockIn)
  // MUHIM: Bugungi kungi (todayWithHours) kamida 10+ operatsiyalar kiritamiz, shunda bugungi statistika 0 bo'lmaydi!
  const stockInsData = [
    // --- BUGUNGI KUN (Today) ---
    {
      productCode: 'EL-001',
      supplierName: 'Artel Electronics MCHJ',
      quantity: 10,
      price: 2400000,
      date: todayWithHours(9, 15),
      invoiceNumber: 'INV-2026-0201',
      notes: 'Bugungi ertalabki partiya: Smart televizorlar'
    },
    {
      productCode: 'QM-001',
      supplierName: 'Akfa Building Materials XK',
      quantity: 150,
      price: 62000,
      date: todayWithHours(10, 30),
      invoiceNumber: 'INV-2026-0202',
      notes: 'Sement M-500 fura orqali tushirildi'
    },
    {
      productCode: 'OF-001',
      supplierName: 'Samarqand Choy QK',
      quantity: 200,
      price: 18000,
      date: todayWithHours(11, 0),
      invoiceNumber: 'INV-2026-0203',
      notes: 'Samarqand qora choyi yangi partiya'
    },
    {
      productCode: 'KS-001',
      supplierName: 'Toshkent Qog\'oz Sanoati MCHJ',
      quantity: 120,
      price: 37000,
      date: todayWithHours(11, 45),
      invoiceNumber: 'INV-2026-0204',
      notes: 'A4 qog\'ozlar zaxirasini to\'ldirish'
    },
    {
      productCode: 'AV-001',
      supplierName: 'AvtoDetall Impex XK',
      quantity: 20,
      price: 320000,
      date: todayWithHours(12, 20),
      invoiceNumber: 'INV-2026-0205',
      notes: 'Castrol 5W-40 motor moylari keldi'
    },
    {
      productCode: 'KM-001',
      supplierName: 'Navoiy Kimyo Zavodi AJ',
      quantity: 80,
      price: 21000,
      date: todayWithHours(13, 10),
      invoiceNumber: 'INV-2026-0206',
      notes: 'Domestos tozalash vositalari'
    },
    {
      productCode: 'ELK-001',
      supplierName: 'ElektroKomplekt Servis MCHJ',
      quantity: 250,
      price: 9500,
      date: todayWithHours(13, 50),
      invoiceNumber: 'INV-2026-0207',
      notes: 'Akfa LED lampochkalari partiyasi'
    },
    {
      productCode: 'QD-001',
      supplierName: 'Universal Qadoq Sanoat MCHJ',
      quantity: 300,
      price: 7500,
      date: todayWithHours(14, 15),
      invoiceNumber: 'INV-2026-0208',
      notes: 'Shaffof skotchlar partiyasi'
    },

    // --- KECHAGI VA OXIRGI 30 KUN ---
    {
      productCode: 'EL-002',
      supplierName: 'Artel Electronics MCHJ',
      quantity: 8,
      price: 3800000,
      date: daysAgo(1, 2),
      invoiceNumber: 'INV-2026-0195',
      notes: 'NoFrost muzlatgichlar'
    },
    {
      productCode: 'QM-002',
      supplierName: 'Akfa Building Materials XK',
      quantity: 100,
      price: 42000,
      date: daysAgo(2, 3),
      invoiceNumber: 'INV-2026-0190',
      notes: 'Gipsokarton Knauf listlari'
    },
    {
      productCode: 'OF-003',
      supplierName: 'Samarqand Choy QK',
      quantity: 50,
      price: 460000,
      date: daysAgo(3, 4),
      invoiceNumber: 'INV-2026-0185',
      notes: '50 kg qoplarda shakar'
    },
    {
      productCode: 'MB-001',
      supplierName: 'Zamonaviy Ofis Mebel XK',
      quantity: 12,
      price: 750000,
      date: daysAgo(4, 1),
      invoiceNumber: 'INV-2026-0180',
      notes: 'Mesh ofis kreslolari'
    },
    {
      productCode: 'KK-001',
      supplierName: 'Global Textile Solutions MCHJ',
      quantity: 40,
      price: 175000,
      date: daysAgo(6, 5),
      invoiceNumber: 'INV-2026-0175',
      notes: 'Kombinezonlar to\'plami'
    },
    {
      productCode: 'ST-001',
      supplierName: 'Chirchiq Mega Plast MCHJ',
      quantity: 300,
      price: 12000,
      date: daysAgo(8, 2),
      invoiceNumber: 'INV-2026-0170',
      notes: 'Plastik quvurlar'
    },
    {
      productCode: 'AS-001',
      supplierName: 'Asbob-Uskuna Profi XK',
      quantity: 10,
      price: 1250000,
      date: daysAgo(11, 3),
      invoiceNumber: 'INV-2026-0165',
      notes: 'Bosch perforatorlar'
    },
    {
      productCode: 'TB-001',
      supplierName: 'MedFarm Ta\'minot MCHJ',
      quantity: 25,
      price: 145000,
      date: daysAgo(14, 4),
      invoiceNumber: 'INV-2026-0160',
      notes: 'Birinchi yordam aptechkalari'
    },
    {
      productCode: 'IC-001',
      supplierName: 'Oasis Beverages Distribution',
      quantity: 400,
      price: 3800,
      date: daysAgo(18, 1),
      invoiceNumber: 'INV-2026-0155',
      notes: 'Chortoq mineral suvi'
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
  console.log('✅ Kirim operatsiyalari (StockIn - shu jumladan bugungi kun) yuklandi');

  // 8. Chiqim operatsiyalari (StockOut)
  // MUHIM: Bugungi kungi (todayWithHours) 6+ operatsiyalar kiritamiz!
  const stockOutsData = [
    // --- BUGUNGI KUN (Today) ---
    {
      productCode: 'EL-001',
      quantity: 2,
      recipientName: 'Chilonzor savdo markazi filiali',
      recipientPhone: '+998 90 111 22 33',
      date: todayWithHours(10, 15),
      notes: 'Displey va mijoz buyurtmasi uchun'
    },
    {
      productCode: 'QM-001',
      quantity: 50,
      recipientName: 'Toshkent Siti Bino Qurilish Uchastkasi',
      recipientPhone: '+998 97 777 88 99',
      date: todayWithHours(11, 30),
      notes: 'Poydevor quyish talabnomasi'
    },
    {
      productCode: 'OF-001',
      quantity: 40,
      recipientName: 'Korzinka Supermarket tarmog\'i',
      recipientPhone: '+998 78 140 14 14',
      date: todayWithHours(12, 0),
      notes: 'Haftalik ta\'minot shartnomasi'
    },
    {
      productCode: 'KS-001',
      quantity: 30,
      recipientName: 'Markaziy moliya boshqarmasi',
      recipientPhone: '+998 71 200 11 22',
      date: todayWithHours(13, 15),
      notes: 'Oylik kantselyariya ta\'minoti'
    },
    {
      productCode: 'AV-001',
      quantity: 5,
      recipientName: 'Logistika avtoparki ustaxonasi',
      recipientPhone: '+998 90 444 55 66',
      date: todayWithHours(14, 0),
      notes: 'Yuk mashinalari servis xizmati'
    },
    {
      productCode: 'KM-001',
      quantity: 15,
      recipientName: 'Ombor sanitariya-tozalash xizmati',
      recipientPhone: '+998 93 333 44 55',
      date: todayWithHours(14, 30),
      notes: 'Profilaktik tozalash ishlari'
    },

    // --- O'TGAN KUNLAR ---
    {
      productCode: 'EL-003',
      quantity: 4,
      recipientName: 'Yunusobod maishiy texnika do\'koni',
      recipientPhone: '+998 90 222 33 44',
      date: daysAgo(1, 4),
      notes: 'Filial vitrinasi uchun'
    },
    {
      productCode: 'QM-002',
      quantity: 30,
      recipientName: '"StroyMaster" qurilish MCHJ',
      recipientPhone: '+998 91 555 66 77',
      date: daysAgo(2, 2),
      notes: 'Ichki pardozlash ob\'ekti'
    },
    {
      productCode: 'OF-004',
      quantity: 25,
      recipientName: 'Havas Diskounter tarmog\'i',
      recipientPhone: '+998 71 205 55 55',
      date: daysAgo(4, 5),
      notes: 'Kundalik sotuv ehtiyojlari'
    },
    {
      productCode: 'KK-001',
      quantity: 10,
      recipientName: 'Texnik xizmat ko\'rsatish brigadasi',
      recipientPhone: '+998 90 777 88 99',
      date: daysAgo(6, 1),
      notes: 'Yangi ishchilarga forma tarqatildi'
    },
    {
      productCode: 'QD-001',
      quantity: 80,
      recipientName: 'E-commerce yetkazib berish xizmati',
      recipientPhone: '+998 90 888 99 00',
      date: daysAgo(8, 3),
      notes: 'Pochta jo\'natmalarini qadoqlash'
    },
    {
      productCode: 'IC-001',
      quantity: 100,
      recipientName: 'Konferentsiya zali xizmati',
      recipientPhone: '+998 71 230 40 50',
      date: daysAgo(12, 2),
      notes: 'Xalqaro seminar tadbiri uchun'
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
  console.log('✅ Chiqim operatsiyalari (StockOut - shu jumladan bugungi kun) yuklandi');

  // 9. Ombor Harakatlari Jurnali (InventoryLog)
  // Hisobotlar va Ombor harakatlari uchun
  const invLogsData = [
    { code: 'EL-001', type: 'IN', before: 14, change: 10, after: 24, notes: 'Bugungi qabul qilingan partiya', date: todayWithHours(9, 15) },
    { code: 'EL-001', type: 'OUT', before: 26, change: -2, after: 24, notes: 'Filialga jo\'natildi', date: todayWithHours(10, 15) },
    { code: 'QM-001', type: 'IN', before: 330, change: 150, after: 480, notes: 'Zavoddan sement partiyasi', date: todayWithHours(10, 30) },
    { code: 'QM-001', type: 'OUT', before: 530, change: -50, after: 480, notes: 'Qurilish ob\'ektiga chiqim', date: todayWithHours(11, 30) },
    { code: 'OF-001', type: 'IN', before: 450, change: 200, after: 650, notes: 'Choy ta\'minoti', date: todayWithHours(11, 0) },
    { code: 'OF-001', type: 'OUT', before: 690, change: -40, after: 650, notes: 'Supermarketga yetkazildi', date: todayWithHours(12, 0) },
    { code: 'KS-001', type: 'IN', before: 220, change: 120, after: 340, notes: 'Qog\'ozlar qabul qilindi', date: todayWithHours(11, 45) },
    { code: 'KS-001', type: 'OUT', before: 370, change: -30, after: 340, notes: 'Moliya bo\'limiga berildi', date: todayWithHours(13, 15) },
    { code: 'AV-001', type: 'IN', before: 26, change: 20, after: 46, notes: 'Castrol moylari', date: todayWithHours(12, 20) },
    { code: 'AV-001', type: 'OUT', before: 51, change: -5, after: 46, notes: 'Avtoparkka berildi', date: todayWithHours(14, 0) },
    { code: 'KM-001', type: 'IN', before: 100, change: 80, after: 180, notes: 'Domestos tozalash geli', date: todayWithHours(13, 10) },
    { code: 'KM-001', type: 'OUT', before: 195, change: -15, after: 180, notes: 'Sanitariya tozalov', date: todayWithHours(14, 30) },
    { code: 'ELK-001', type: 'IN', before: 390, change: 250, after: 640, notes: 'LED lampalar', date: todayWithHours(13, 50) },
    { code: 'QD-001', type: 'IN', before: 620, change: 300, after: 920, notes: 'Skotchlar partiyasi', date: todayWithHours(14, 15) }
  ];

  for (const log of invLogsData) {
    const prod = products[log.code];
    if (!prod) continue;
    await prisma.inventoryLog.create({
      data: {
        productId: prod.id,
        actionType: log.type,
        quantityBefore: log.before,
        quantityChange: log.change,
        quantityAfter: log.after,
        notes: log.notes,
        createdAt: log.date
      }
    });
  }
  console.log('✅ Ombor harakatlari (InventoryLog) yuklandi');

  // 10. Bildirishnomalar
  const notificationsData = [
    {
      title: 'Kam qolgan mahsulot: Konditsioner Artel 12 HD',
      message: 'Omborda faqat 3 dona qoldi (minimal chegara: 6 dona). Yangi buyurtma berish tavsiya etiladi.',
      type: 'warning',
      isRead: false,
      userId: adminUser.id,
      createdAt: todayWithHours(8, 30)
    },
    {
      title: 'Kam qolgan mahsulot: Kir yuvish mashinasi Artel 7kg',
      message: 'Omborda atigi 2 dona qoldi (minimal chegara: 5 dona).',
      type: 'warning',
      isRead: false,
      userId: adminUser.id,
      createdAt: todayWithHours(9, 0)
    },
    {
      title: 'Yangi Kirim: INV-2026-0201 qabul qilindi',
      message: 'Artel Electronics dan 10 dona Smart televizorlar muvaffaqiyatli qabul qilindi.',
      type: 'success',
      isRead: true,
      userId: adminUser.id,
      createdAt: todayWithHours(9, 20)
    },
    {
      title: 'Yangi Kirim: Sement M-500 qabul qilindi',
      message: 'Akfa Building Materials dan 150 quti sement qabul qilindi va joylashtirildi.',
      type: 'success',
      isRead: false,
      userId: adminUser.id,
      createdAt: todayWithHours(10, 35)
    },
    {
      title: 'Chiqim tasdiqlandi: Toshkent Siti ob\'ekti',
      message: '50 quti sement Toshkent Siti qurilish maydoniga jo\'natildi.',
      type: 'info',
      isRead: false,
      userId: operatorUser.id,
      createdAt: todayWithHours(11, 35)
    },
    {
      title: 'Tizim xavfsizligi va audit',
      message: 'Barcha kirim-chiqim operatsiyalari sinxronlashtirildi va zaxira nusxasi yaratildi.',
      type: 'info',
      isRead: true,
      userId: adminUser.id,
      createdAt: daysAgo(1, 5)
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

  // 11. Audit loglar
  const auditLogsData = [
    {
      userId: adminUser.id,
      action: 'login',
      module: 'auth',
      details: 'Administrator tizimga kirdi (Dashboard)',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      createdAt: todayWithHours(8, 0)
    },
    {
      userId: adminUser.id,
      action: 'create',
      module: 'stock_in',
      details: 'INV-2026-0201 raqamli kirim rasmiylashtirildi (Smart TV)',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      createdAt: todayWithHours(9, 15)
    },
    {
      userId: operatorUser.id,
      action: 'create',
      module: 'stock_out',
      details: 'Toshkent Siti ob\'ektiga 50 qop sement chiqarildi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      createdAt: todayWithHours(11, 30)
    },
    {
      userId: operatorUser.id,
      action: 'export',
      module: 'reports',
      details: 'Ombor qoldiqlari hisoboti Excel formatida yuklab olindi',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      createdAt: todayWithHours(12, 45)
    },
    {
      userId: adminUser.id,
      action: 'update',
      module: 'products',
      details: 'Mahsulot narxi yangilandi: Televizor Artel 43"',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      createdAt: todayWithHours(13, 0)
    }
  ];

  for (const l of auditLogsData) {
    await prisma.auditLog.create({ data: l });
  }
  console.log('✅ Audit loglar yuklandi');

  // 12. Kompaniya Sozlamalari
  await prisma.companySettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      companyName: 'OmborXona Professional MCHJ',
      phone: '+998 71 200 70 70',
      email: 'info@omborxona.uz',
      address: 'Toshkent shahri, Mirobod tumani, Nukus ko\'chasi 45-uy',
      taxId: '309988776',
      currency: 'so\'m',
      dateFormat: 'DD.MM.YYYY'
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      companyName: 'OmborXona Professional MCHJ',
      phone: '+998 71 200 70 70',
      email: 'info@omborxona.uz',
      address: 'Toshkent shahri, Mirobod tumani, Nukus ko\'chasi 45-uy',
      taxId: '309988776',
      currency: 'so\'m',
      dateFormat: 'DD.MM.YYYY'
    }
  });
  console.log('✅ Kompaniya sozlamalari tayyor');

  console.log('\n🎉🎉🎉 Mega demo ma\'lumotlar muvaffaqiyatli bazaga yuklandi! 🎉🎉🎉\n');
}

main()
  .catch((e) => {
    console.error('Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
