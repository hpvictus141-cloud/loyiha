import prisma from '../config/database.js';

export const getProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      categoryId, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      isActive 
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const ALLOWED_SORT_FIELDS = ['name', 'code', 'purchasePrice', 'salePrice', 'currentStock', 'minStock', 'createdAt', 'updatedAt'];
    const cleanSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const cleanSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
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
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        minStock: minStock ? parseFloat(minStock) : undefined,
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
