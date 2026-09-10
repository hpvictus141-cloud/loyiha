import prisma from '../config/database.js';
import { isFutureDate } from '../utils/dateValidator.js';

export const getStockIns = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      productId, 
      supplierId,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {};

    const ALLOWED_SORT_FIELDS = ['date', 'quantity', 'price', 'totalAmount', 'createdAt', 'updatedAt'];
    const cleanSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'date';
    const cleanSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    if (productId) {
      where.productId = productId;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (startDate && isFutureDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

    if (endDate && isFutureDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'Boshlanish sanasi tugash sanasidan katta bo\'lishi mumkin emas'
      });
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        if (typeof endDate === 'string' && !endDate.includes('T')) {
          end.setHours(23, 59, 59, 999);
        }
        where.date.lte = end;
      }
    }

    const [stockIns, total] = await Promise.all([
      prisma.stockIn.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { [cleanSortBy]: cleanSortOrder },
        include: {
          product: {
            include: {
              unit: true,
              category: true
            }
          },
          supplier: true,
          user: {
            select: {
              id: true,
              fullName: true,
              username: true
            }
          }
        }
      }),
      prisma.stockIn.count({ where })
    ]);

    res.json({
      success: true,
      data: stockIns,
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

export const getStockIn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stockIn = await prisma.stockIn.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            unit: true,
            category: true
          }
        },
        supplier: true,
        user: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        }
      }
    });

    if (!stockIn) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: stockIn
    });
  } catch (error) {
    next(error);
  }
};

export const createStockIn = async (req, res, next) => {
  try {
    const {
      productId,
      supplierId,
      quantity,
      price,
      date,
      invoiceNumber,
      notes
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Mahsulot tanlanmagan'
      });
    }

    const quantityDecimal = parseFloat(quantity);
    if (isNaN(quantityDecimal) || quantityDecimal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Kirim miqdori 0 dan katta bo\'lishi kerak'
      });
    }

    const priceDecimal = parseFloat(price);
    if (isNaN(priceDecimal) || priceDecimal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Kirim narxi to\'g\'ri kiritilishi kerak'
      });
    }

    if (date && isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

    const totalAmount = quantityDecimal * priceDecimal;

    const result = await prisma.$transaction(async (tx) => {
      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, "currentStock", "minStock"
        FROM "Product"
        WHERE id = ${productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        throw new Error('Mahsulot topilmadi');
      }

      const stockIn = await tx.stockIn.create({
        data: {
          productId,
          supplierId: supplierId || null,
          quantity: quantityDecimal,
          price: priceDecimal,
          totalAmount,
          date: date ? new Date(date) : new Date(),
          invoiceNumber,
          notes,
          userId: req.user.id
        },
        include: {
          product: {
            include: {
              unit: true,
              category: true
            }
          },
          supplier: true,
          user: {
            select: {
              id: true,
              fullName: true,
              username: true
            }
          }
        }
      });

      const newStock = parseFloat(lockedProduct.currentStock) + quantityDecimal;

      await tx.product.update({
        where: { id: productId },
        data: { currentStock: newStock }
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          actionType: 'KIRIM',
          quantityBefore: parseFloat(lockedProduct.currentStock),
          quantityChange: quantityDecimal,
          quantityAfter: newStock,
          referenceId: stockIn.id,
          referenceType: 'STOCK_IN',
          notes: `Kirim: ${invoiceNumber || 'N/A'}`
        }
      });

      if (newStock <= parseFloat(lockedProduct.minStock)) {
        await tx.notification.create({
          data: {
            title: 'Ombor qoldig\'i kam',
            message: `${lockedProduct.name} mahsulotining qoldig\'i minimal darajaga yetdi (${newStock})`,
            type: 'WARNING',
            userId: null
          }
        });
      }

      return stockIn;
    });

    res.status(201).json({
      success: true,
      message: 'Kirim qo\'shildi',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateStockIn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      supplierId,
      quantity,
      price,
      date,
      invoiceNumber,
      notes
    } = req.body;

    if (date !== undefined && date && isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingStockIn = await tx.stockIn.findUnique({
        where: { id }
      });

      if (!existingStockIn) {
        throw new Error('Kirim topilmadi');
      }

      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, "currentStock", "minStock"
        FROM "Product"
        WHERE id = ${existingStockIn.productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        throw new Error('Mahsulot topilmadi');
      }

      const oldQuantity = parseFloat(existingStockIn.quantity);
      const newQuantity = parseFloat(quantity);
      const quantityDiff = newQuantity - oldQuantity;

      const newPrice = parseFloat(price);
      const totalAmount = newQuantity * newPrice;

      const oldStock = parseFloat(lockedProduct.currentStock);
      const newStock = oldStock + quantityDiff;

      if (newStock < 0) {
        throw new Error('Omborda yetarli mahsulot yo\'q. Kirimni bu miqdorga kamaytirib bo\'lmaydi');
      }

      const stockIn = await tx.stockIn.update({
        where: { id },
        data: {
          supplierId: supplierId || null,
          quantity: newQuantity,
          price: newPrice,
          totalAmount,
          date: date ? new Date(date) : undefined,
          invoiceNumber,
          notes
        },
        include: {
          product: {
            include: {
              unit: true,
              category: true
            }
          },
          supplier: true,
          user: {
            select: {
              id: true,
              fullName: true,
              username: true
            }
          }
        }
      });

      if (quantityDiff !== 0) {
        await tx.product.update({
          where: { id: lockedProduct.id },
          data: { currentStock: newStock }
        });

        await tx.inventoryLog.create({
          data: {
            productId: lockedProduct.id,
            actionType: 'KIRIM_TUZATISH',
            quantityBefore: oldStock,
            quantityChange: quantityDiff,
            quantityAfter: newStock,
            referenceId: stockIn.id,
            referenceType: 'STOCK_IN_UPDATE',
            notes: `Kirim tuzatildi: ${invoiceNumber || 'N/A'}`
          }
        });
      }

      return stockIn;
    });

    res.json({
      success: true,
      message: 'Kirim yangilandi',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStockIn = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const stockIn = await tx.stockIn.findUnique({
        where: { id }
      });

      if (!stockIn) {
        throw new Error('Kirim topilmadi');
      }

      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, "currentStock"
        FROM "Product"
        WHERE id = ${stockIn.productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        throw new Error('Mahsulot topilmadi');
      }

      const quantity = parseFloat(stockIn.quantity);
      const oldStock = parseFloat(lockedProduct.currentStock);
      const newStock = oldStock - quantity;

      if (newStock < 0) {
        throw new Error('Omborda yetarli mahsulot yo\'q');
      }

      await tx.product.update({
        where: { id: lockedProduct.id },
        data: { currentStock: newStock }
      });

      await tx.inventoryLog.create({
        data: {
          productId: lockedProduct.id,
          actionType: 'KIRIM_BEKOR',
          quantityBefore: oldStock,
          quantityChange: -quantity,
          quantityAfter: newStock,
          referenceId: stockIn.id,
          referenceType: 'STOCK_IN_DELETE',
          notes: `Kirim bekor qilindi: ${stockIn.invoiceNumber || 'N/A'}`
        }
      });

      await tx.stockIn.delete({
        where: { id }
      });
    });

    res.json({
      success: true,
      message: 'Kirim o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};
