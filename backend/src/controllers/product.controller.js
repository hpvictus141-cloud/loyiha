import prisma from '../config/database.js';

export const getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      categoryId, 
      status,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      isActive 
    } = req.query;

    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (cleanPage - 1) * cleanLimit;
    const where = {};
    const conditions = [];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    if (categoryId) {
      conditions.push({ categoryId });
    }

    if (isActive !== undefined) {
      conditions.push({ isActive: isActive === 'true' });
    }

    if (status === 'expired') {
      conditions.push({
        OR: [
          { name: { contains: 'shikast', mode: 'insensitive' } },
          { name: { contains: 'buzil', mode: 'insensitive' } },
          { name: { contains: 'yaroqsiz', mode: 'insensitive' } },
          { currentStock: { lte: 0 } }
        ]
      });
    } else if (status === 'good') {
      conditions.push({
        AND: [
          { NOT: { name: { contains: 'shikast', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'buzil', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'yaroqsiz', mode: 'insensitive' } } },
          { currentStock: { gt: 0 } }
        ]
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const ALLOWED_SORT_FIELDS = ['name', 'code', 'purchasePrice', 'salePrice', 'currentStock', 'minStock', 'createdAt', 'updatedAt'];
    const cleanSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const cleanSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: cleanLimit,
        orderBy: { [cleanSortBy]: cleanSortOrder },
        include: {
          category: true,
          unit: true
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: cleanPage,
        limit: cleanLimit,
        total,
        pages: Math.ceil(total / cleanLimit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        unit: true,
        stockIns: {
          take: 10,
          orderBy: { date: 'desc' }
        },
        stockOuts: {
          take: 10,
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      code,
      name,
      categoryId,
      unitId,
      purchasePrice,
      salePrice,
      minStock,
      description,
      barcode
    } = req.body;

    const product = await prisma.product.create({
      data: {
        code,
        name,
        categoryId,
        unitId,
        purchasePrice: parseFloat(purchasePrice),
        salePrice: parseFloat(salePrice),
        minStock: parseFloat(minStock || 0),
        description,
        barcode
      },
      include: {
        category: true,
        unit: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Mahsulot qo\'shildi',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      categoryId,
      unitId,
      purchasePrice,
      salePrice,
      minStock,
      description,
      barcode,
      isActive
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        code,
        name,
        categoryId,
        unitId,
        purchasePrice: (purchasePrice !== undefined && purchasePrice !== '') ? parseFloat(purchasePrice) : undefined,
        salePrice: (salePrice !== undefined && salePrice !== '') ? parseFloat(salePrice) : undefined,
        minStock: (minStock !== undefined && minStock !== '') ? parseFloat(minStock) : undefined,
        description,
        barcode,
        isActive
      },
      include: {
        category: true,
        unit: true
      }
    });

    res.json({
      success: true,
      message: 'Mahsulot yangilandi',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const [stockInCount, stockOutCount, logCount] = await Promise.all([
      prisma.stockIn.count({ where: { productId: id } }),
      prisma.stockOut.count({ where: { productId: id } }),
      prisma.inventoryLog.count({ where: { productId: id } })
    ]);

    if (stockInCount > 0 || stockOutCount > 0 || logCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud',
        message: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Mahsulot o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        currentStock: {
          lte: prisma.product.fields.minStock
        }
      },
      include: {
        category: true,
        unit: true
      },
      orderBy: {
        currentStock: 'asc'
      }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
