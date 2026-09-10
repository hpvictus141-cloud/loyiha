/**
 * Sana validatsiyasi yordamchi funksiyalari (Date validation utilities)
 */

export const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Berilgan sana bugungi kundan katta (kelajak sana) ekanligini tekshiradi.
 * @param {string|Date} input 
 * @returns {boolean}
 */
export const isFutureDate = (input) => {
  if (!input) return false;
  const todayStr = getTodayString();

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed > todayStr;
    }
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const datePart = trimmed.substring(0, 10);
      if (datePart > todayStr) return true;
    }
  }

  const d = new Date(input);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return d.getTime() > endOfToday.getTime();
};

/**
 * express-validator uchun maxsus validator: sana kelajak sana bo'lmasligi kerak
 */
export const validateDateNotFuture = (value) => {
  if (!value) return true;
  if (isFutureDate(value)) {
    throw new Error('Sana bugungi kundan katta bo\'lishi mumkin emas');
  }
  return true;
};
