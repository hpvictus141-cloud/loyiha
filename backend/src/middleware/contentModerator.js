/**
 * Content Moderation Middleware - So'kinish va haqoratli so'zlar filtri
 * O'zbek va Rus tillaridagi nomaqbul so'zlarni aniqlaydi va bloklaydi.
 */

// O'zbek va Rus tillaridagi eng ko'p uchraydigan haqoratli/so'kinish so'zlari
// Unicode-aware word boundaries: (?<![\p{L}\p{N}]) va (?![\p{L}\p{N}])
const PROFANITY_PATTERNS = [
  // Ruscha asosiy so'kinishlar (Lotin va Kirill)
  /(?<![\p{L}\p{N}])(suka|cyka|сука|сучка|сучара)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(blya|blyad|blyat|blat|бля|блять|блядь|блядина)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(xuy|huy|xui|hui|хуй|хуя|хуе|хуи|хуем|хуйня|нахуй|похуй)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(pizda|pizdec|pizdet|пизда|пиздец|пиздит|пиздабол)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(ebat|yebat|yehat|yob|yobaniy|ебать|ебал|ебан|ёб|ёбаный|долбоёб|долбоеб)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(gandon|gandoni|гандон|гондон)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(mudak|mudila|мудак|мудила)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(chmo|чмо|чмошник)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(lox|лоx|лох|лошара)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(pidar|pidaras|пидор|пидорас|педик)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(shlyuxa|шлюха|шалава)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(zaebal|zaebis|заебал|заебись)(?![\p{L}\p{N}])/iu,

  // O'zbekcha asosiy so'kinish va haqoratlar (Lotin va Kirill)
  /(?<![\p{L}\p{N}])(dalbayob|dalbayop|dalbaiob|далбаёб|далбаеб|долбоёб)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(jalap|jalab|jala|жалаб|жалап|жалеп)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(sikay|sikey|sikish|siktir|siktirgin|сикай|сикей|сикиш|сиктир)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(kutingga|kotingga|kuting|koting|kutvachcha|кутинга|котинга|кутвачча)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(qotoq|qotog|qotoqmisan|коток|қотоқ)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(haromi|xaromi|haromzoda|xaromzoda|хароми|харомзода)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(itvachcha|it emgan|итвачча)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(onangni|onangdi|onang|онангни|онангди)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(padariga|padaringga|падарига|падарингga)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(shavol|sha'vol|шавол)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(amxona|amxo'r|амхона)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(sheshangni|pochangni|шешангни)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(ogzingga|ogzinga|огзингга|оғзингга)(?![\p{L}\p{N}])/iu,
  /(?<![\p{L}\p{N}])(chala|dalban)(?![\p{L}\p{N}])/iu
];

/**
 * Matn variantlarini tayyorlash (leetspeak, bo'shliqlar, takroriy harflar)
 */
function getNormalizedVariants(text) {
  if (!text || typeof text !== 'string') return [];

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Leetspeak almashtirish
  const leet = lower
    .replace(/@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's');

  // 2. Takroriy harflarni qisqartirish (masalan: suuuuuka -> suka)
  const collapsedLower = lower.replace(/([\p{L}])\1+/gu, '$1');
  const collapsedLeet = leet.replace(/([\p{L}])\1+/gu, '$1');

  // 3. Harflar orasidagi belgilarni (nuqta, tire, chiziqcha) olib tashlash (masalan: s.u.k.a -> suka)
  const noDelimsLower = lower.replace(/[\.\-_*~#|\\/]+/g, '');
  const noDelimsLeet = leet.replace(/[\.\-_*~#|\\/]+/g, '');
  const noDelimsCollapsed = collapsedLeet.replace(/[\.\-_*~#|\\/]+/g, '');

  return [raw, lower, leet, collapsedLower, collapsedLeet, noDelimsLower, noDelimsLeet, noDelimsCollapsed];
}

/**
 * Matnda nomaqbul so'z borligini tekshiradi
 * @param {string} text - Tekshiriladigan matn
 * @returns {boolean} - Agar nomaqbul so'z topilsa true
 */
export function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false;

  const variants = getNormalizedVariants(text);

  for (const variant of variants) {
    for (const pattern of PROFANITY_PATTERNS) {
      if (pattern.test(variant)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Obyektdagi (req.body) matnli maydonlarni tekshiruvchi yordamchi
 * @param {object} obj - Tekshiriladigan obyekt
 * @param {string[]} targetFields - Agar berilgan bo'lsa faqat shu maydonlar, bo'lmasa barcha string maydonlar
 * @returns {string|null} - Nomaqbul so'z aniqlangan maydon nomi yoki null
 */
export function findProfanityField(obj, targetFields = []) {
  if (!obj || typeof obj !== 'object') return null;

  const keysToCheck = targetFields.length > 0 
    ? targetFields 
    : Object.keys(obj);

  for (const key of keysToCheck) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim() !== '') {
      if (containsProfanity(value)) {
        return key;
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedField = findProfanityField(value);
      if (nestedField) return `${key}.${nestedField}`;
    }
  }

  return null;
}

/**
 * Express Middleware:
 * So'rov tana qismidagi (req.body) kiritilgan matnlarni tekshiradi.
 * Agar nomaqbul so'z aniqlansa, darhol 400 xatolik bilan to'xtatadi.
 * 
 * @param {string[]} [fields] - Ixtiyoriy: tekshirilishi kerak bo'lgan aniq maydonlar ro'yxati
 */
export const moderateContent = (fields = []) => {
  return (req, res, next) => {
    // Faqat POST, PUT, PATCH so'rovlari uchun tanani tekshiramiz
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const violatedField = findProfanityField(req.body, fields);

      if (violatedField) {
        return res.status(400).json({
          success: false,
          error: "Matnda nomaqbul so'zlar aniqlandi, iltimos tahrirlang",
          message: "Matnda nomaqbul so'zlar aniqlandi, iltimos tahrirlang",
          field: violatedField,
          details: {
            field: violatedField,
            message: "Bu maydonda nomaqbul so'z ishlatilgan."
          }
        });
      }
    }

    next();
  };
};

export default moderateContent;
