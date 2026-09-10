import { containsProfanity } from './src/middleware/contentModerator.js';

const BASE_URL = 'http://localhost:3010/api';

async function runTests() {
  console.log('🧪 [TEST] Boshlandi: Content Moderation va Global Error Handling\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Unit test: containsProfanity
  console.log('--- 1. containsProfanity Unit Testlari ---');
  const profanityWords = [
    'suka', 'SUKA', 'cyka', 'suuuuka', 's.u.k.a',
    'blyad', 'blyat', 'блять', 'бля',
    'xuy', 'хуй', 'pizda', 'пизда', 'gandon',
    'dalbayob', 'далбаёб', 'jalap', 'жалаб',
    'sikay', 'siktir', 'kutingga', 'qotoq', 'haromi', 'itvachcha'
  ];

  for (const word of profanityWords) {
    assert(containsProfanity(word) === true, `Nomaqbul so'z ushlandi: "${word}"`);
    assert(containsProfanity(`Bu tovar juda ${word} mahsulot`) === true, `Gap ichida ushlandi: "... ${word} ..."`);
  }

  const cleanWords = [
    'Elektronika', 'Sement', 'Kabel', 'Eshik', 'Oziq-ovqat', 
    'Toshkent sh.', 'Samarqand choyi', 'Pol yuvish vositasi', 'Muzlatgich'
  ];

  for (const word of cleanWords) {
    assert(containsProfanity(word) === false, `Toza so'z o'tdi (false positive yo'q): "${word}"`);
  }

  // 2. Login as admin to test protected endpoints
  console.log('\n--- 2. Tizimga kirish (Admin Auth) ---');
  let token = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    token = loginData.data?.accessToken;
    assert(!!token, 'Admin muvaffaqiyatli tizimga kirdi va token oldi');
  } catch (err) {
    console.error('Login xatosi:', err);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Test API Content Moderation (POST /api/categories)
  console.log('\n--- 3. API Content Moderation Testi (POST /api/categories) ---');
  try {
    const badCatRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'Yangi suka toifasi', description: 'Izoh' })
    });
    const badCatData = await badCatRes.json();
    assert(badCatRes.status === 400, `Nomaqbul so'zli kategoriya rad etildi (Status 400)`);
    assert(badCatData.error === "Matnda nomaqbul so'zlar aniqlandi, iltimos tahrirlang", `To'g'ri xatolik xabari: "${badCatData.error}"`);
    assert(badCatData.field === 'name', `Xato maydoni to'g'ri ko'rsatildi: field="${badCatData.field}"`);
  } catch (e) {
    assert(false, `Kategoriya moderatsiya xatosi: ${e.message}`);
  }

  // 4. Test API Content Moderation (POST /api/suppliers)
  console.log('\n--- 4. API Content Moderation Testi (POST /api/suppliers) ---');
  try {
    const badSupRes = await fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        companyName: 'Akfa Test MCHJ',
        contactPerson: 'Vali dalbayob',
        phone: '+998 90 999 88 77'
      })
    });
    const badSupData = await badSupRes.json();
    assert(badSupRes.status === 400, `Nomaqbul so'zli yetkazib beruvchi rad etildi (Status 400)`);
    assert(badSupData.field === 'contactPerson', `Xato maydoni ko'rsatildi: field="${badSupData.field}"`);
  } catch (e) {
    assert(false, `Yetkazib beruvchi moderatsiya xatosi: ${e.message}`);
  }

  // 5. Test Delete with Dependent Data (409 Conflict)
  console.log('\n--- 5. Bog\'liq ma\'lumotlar mavjud bo\'lganda DELETE testi (Status 409) ---');
  try {
    // Bog'liq mahsulotlari bor kategoriyani topamiz
    const catsRes = await fetch(`${BASE_URL}/categories?limit=10`, { headers });
    const catsData = await catsRes.json();
    const catWithProducts = catsData.data?.find(c => c._count?.products > 0);

    if (catWithProducts) {
      const delCatRes = await fetch(`${BASE_URL}/categories/${catWithProducts.id}`, {
        method: 'DELETE',
        headers
      });
      const delCatData = await delCatRes.json();
      assert(delCatRes.status === 409, `Bog'liq mahsulotlari bor kategoriyani o'chirish rad etildi (Status 409)`);
      assert(delCatData.error === "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud", 
        `To'g'ri xatolik matni: "${delCatData.error}"`);
    } else {
      console.log('  ⚠️ Bog\'liq mahsulotli kategoriya topilmadi');
    }

    // Bog'liq kirimlari bor yetkazib beruvchini o'chirishga urinamiz
    const supsRes = await fetch(`${BASE_URL}/suppliers?limit=10`, { headers });
    const supsData = await supsRes.json();
    const supWithStock = supsData.data?.find(s => s._count?.stockIns > 0);

    if (supWithStock) {
      const delSupRes = await fetch(`${BASE_URL}/suppliers/${supWithStock.id}`, {
        method: 'DELETE',
        headers
      });
      const delSupData = await delSupRes.json();
      assert(delSupRes.status === 409, `Bog'liq kirimlari bor yetkazib beruvchini o'chirish rad etildi (Status 409)`);
      assert(delSupData.error === "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud", 
        `To'g'ri xatolik matni: "${delSupData.error}"`);
    }

    // Bog'liq operatsiyalari bor mahsulotni o'chirishga urinamiz
    const prodsRes = await fetch(`${BASE_URL}/products?limit=10`, { headers });
    const prodsData = await prodsRes.json();
    if (prodsData.data?.length > 0) {
      const prod = prodsData.data[0];
      const delProdRes = await fetch(`${BASE_URL}/products/${prod.id}`, {
        method: 'DELETE',
        headers
      });
      const delProdData = await delProdRes.json();
      assert(delProdRes.status === 409, `Bog'liq operatsiyalari bor mahsulotni o'chirish rad etildi (Status 409)`);
      assert(delProdData.error === "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud", 
        `To'g'ri xatolik matni: "${delProdData.error}"`);
    }
  } catch (e) {
    assert(false, `Bog'liq ma'lumotlar xatosi: ${e.message}`);
  }

  // 6. Test Not Found (404) on non-existent ID
  console.log('\n--- 6. Mavjud bo\'lmagan ID bo\'yicha 404 testi ---');
  const fakeId = '00000000-0000-0000-0000-000000000999';
  try {
    const notFoundDelRes = await fetch(`${BASE_URL}/categories/${fakeId}`, {
      method: 'DELETE',
      headers
    });
    const notFoundDelData = await notFoundDelRes.json();
    assert(notFoundDelRes.status === 404, `Mavjud bo'lmagan kategoriya o'chirishda 404 qaytdi`);
    assert(notFoundDelData.error === 'Element topilmadi', `Xato matni: "${notFoundDelData.error}"`);

    const notFoundPutRes = await fetch(`${BASE_URL}/products/${fakeId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name: 'Yangi nom' })
    });
    const notFoundPutData = await notFoundPutRes.json();
    assert(notFoundPutRes.status === 404, `Mavjud bo'lmagan mahsulot tahrirlashda 404 qaytdi`);
    assert(notFoundPutData.error === 'Element topilmadi', `Xato matni: "${notFoundPutData.error}"`);
  } catch (e) {
    assert(false, `404 testi xatosi: ${e.message}`);
  }

  // Natijalar
  console.log(`\n========================================`);
  console.log(`📊 Test natijalari: ${passed} ta o'tdi, ${failed} ta xato`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
