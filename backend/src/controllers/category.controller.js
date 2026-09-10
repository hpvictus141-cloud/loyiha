import prisma from '../config/database.js';

export const getCategories = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      search, 
      isActive 
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.category.count({ where })
    ]);

    res.json({
      success: true,
      data: categories,
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

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: 'Kategoriya qo\'shildi',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        isActive
      }
    });

    res.json({
      success: true,
      message: 'Kategoriya yangilandi',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud',
        message: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Kategoriya o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};
