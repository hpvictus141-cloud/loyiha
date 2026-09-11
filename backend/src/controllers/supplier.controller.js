import prisma from '../config/database.js';

export const getSuppliers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      isActive 
    } = req.query;

    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (cleanPage - 1) * cleanLimit;
    const where = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: cleanLimit,
        orderBy: { companyName: 'asc' },
        include: {
          _count: {
            select: { stockIns: true }
          }
        }
      }),
      prisma.supplier.count({ where })
    ]);

    res.json({
      success: true,
      data: suppliers,
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

export const getSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        stockIns: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            product: true
          }
        },
        _count: {
          select: { stockIns: true }
        }
      }
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const {
      companyName,
      contactPerson,
      phone,
      email,
      address,
      taxId,
      description
    } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        companyName,
        contactPerson,
        phone,
        email,
        address,
        taxId,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: 'Yetkazib beruvchi qo\'shildi',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      contactPerson,
      phone,
      email,
      address,
      taxId,
      description,
      isActive
    } = req.body;

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        companyName,
        contactPerson,
        phone,
        email,
        address,
        taxId,
        description,
        isActive
      }
    });

    res.json({
      success: true,
      message: 'Yetkazib beruvchi yangilandi',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    const stockInCount = await prisma.stockIn.count({
      where: { supplierId: id }
    });

    if (stockInCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud',
        message: 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud'
      });
    }

    await prisma.supplier.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Yetkazib beruvchi o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};
