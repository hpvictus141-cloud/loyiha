export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validatsiya xatosi',
      message: 'Validatsiya xatosi',
      errors: err.errors
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Bunday ma\'lumot allaqachon mavjud',
        message: 'Bunday ma\'lumot allaqachon mavjud'
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }
    if (err.code === 'P2003') {
      return res.status(409).json({
        success: false,
        error: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud',
        message: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud'
      });
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Yuborilgan so\'rov parametrlari noto\'g\'ri',
      message: 'Yuborilgan so\'rov parametrlari noto\'g\'ri'
    });
  }

  const isNotFound = err.status === 404 || 
    err.message === 'Element topilmadi' ||
    err.message === 'Mahsulot topilmadi' || 
    err.message === 'Kirim topilmadi' || 
    err.message === 'Chiqim topilmadi' || 
    err.message === 'Yetkazib beruvchi topilmadi' || 
    err.message === 'Foydalanuvchi topilmadi' ||
    err.message === 'Kategoriya topilmadi';

  if (isNotFound) {
    return res.status(404).json({
      success: false,
      error: 'Element topilmadi',
      message: 'Element topilmadi'
    });
  }

  if (err.status === 409 || err.message?.includes("bog'liq") || err.message?.includes("bog'langan")) {
    return res.status(409).json({
      success: false,
      error: "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud",
      message: "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud"
    });
  }

  const statusCode = err.status || (err.message && err.message.includes('yetarli mahsulot yo\'q') ? 400 : 500);
  const errorMessage = statusCode === 500 ? 'Serverda xatolik yuz berdi' : (err.message || 'Serverda xatolik yuz berdi');

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    message: errorMessage
  });
};
