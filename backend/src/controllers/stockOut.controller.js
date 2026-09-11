import prisma from '../config/database.js';
import { isFutureDate } from '../utils/dateValidator.js';

export const getStockOuts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      productId,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (cleanPage - 1) * cleanLimit;
    const where = {};

    const ALLOWED_SORT_FIELDS = ['date', 'quantity', 'createdAt', 'updatedAt'];
    const cleanSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'date';
    const cleanSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    if (productId) {
      where.productId = productId;
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

    const [stockOuts, total] = await Promise.all([
      prisma.stockOut.findMany({
        where,
        skip,
        take: cleanLimit,
        orderBy: { [cleanSortBy]: cleanSortOrder },
        include: {
          product: {
            include: {
              unit: true,
              category: true
            }
          },
          user: {
            select: {
              id: true,
              fullName: true,
              username: true
            }
          }
        }
      }),
      prisma.stockOut.count({ where })
    ]);

    res.json({
      success: true,
      data: stockOuts,
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

export const getStockOut = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stockOut = await prisma.stockOut.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            unit: true,
            category: true
          }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        }
      }
    });

    if (!stockOut) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: stockOut
    });
  } catch (error) {
    next(error);
  }
};

export const createStockOut = async (req, res, next) => {
  try {
    const {
      productId,
      quantity,
      recipientName,
      recipientPhone,
      date,
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
        message: 'Chiqim miqdori 0 dan katta bo\'lishi kerak'
      });
    }

    if (!recipientName || !String(recipientName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Qabul qiluvchi ismini kiriting'
      });
    }

    if (date && isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

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

      const currentStock = parseFloat(lockedProduct.currentStock);

      if (currentStock < quantityDecimal) {
        throw new Error('Omborda yetarli mahsulot yo\'q');
      }

      const stockOut = await tx.stockOut.create({
        data: {
          productId,
          quantity: quantityDecimal,
          recipientName,
          recipientPhone,
          date: date ? new Date(date) : new Date(),
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
          user: {
            select: {
              id: true,
              fullName: true,
              username: true
            }
          }
        }
      });

      const newStock = currentStock - quantityDecimal;

      await tx.product.update({
        where: { id: productId },
        data: { currentStock: newStock }
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          actionType: 'CHIQIM',
          quantityBefore: currentStock,
          quantityChange: -quantityDecimal,
          quantityAfter: newStock,
          referenceId: stockOut.id,
          referenceType: 'STOCK_OUT',
          notes: `Chiqim: ${recipientName}`
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

      return stockOut;
    });

    res.status(201).json({
      success: true,
      message: 'Chiqim qo\'shildi',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateStockOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      quantity,
      recipientName,
      recipientPhone,
      date,
      notes
    } = req.body;

    if (quantity !== undefined) {
      const q = parseFloat(quantity);
      if (isNaN(q) || q <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Chiqim miqdori 0 dan katta bo\'lishi kerak'
        });
      }
    }

    if (recipientName !== undefined && !String(recipientName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Qabul qiluvchi ismini kiriting'
      });
    }

    if (date !== undefined && date && isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'Sana bugungi kundan katta bo\'lishi mumkin emas'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingStockOut = await tx.stockOut.findUnique({
        where: { id }
      });

      if (!existingStockOut) {
        throw new Error('Chiqim topilmadi');
      }

      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, "currentStock", "minStock"
        FROM "Product"
        WHERE id = ${existingStockOut.productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        throw new Error('Mahsulot topilmadi');
      }

      const oldQuantity = parseFloat(existingStockOut.quantity);
      const newQuantity = (quantity !== undefined && quantity !== null && quantity !== '') ? parseFloat(quantity) : oldQuantity;
      const quantityDiff = newQuantity - oldQuantity;

      const oldStock = parseFloat(lockedProduct.currentStock);
      const newStock = oldStock - quantityDiff;

      if (newStock < 0) {
        throw new Error('Omborda yetarli mahsulot yo\'q');
      }

      const stockOut = await tx.stockOut.update({
        where: { id },
        data: {
          quantity: newQuantity,
          recipientName,
          recipientPhone,
          date: date ? new Date(date) : undefined,
          notes
        },
        include: {
          product: {
            include: {
              unit: true,
              category: true
            }
          },
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
            actionType: 'CHIQIM_TUZATISH',
            quantityBefore: oldStock,
            quantityChange: -quantityDiff,
            quantityAfter: newStock,
            referenceId: stockOut.id,
            referenceType: 'STOCK_OUT_UPDATE',
            notes: `Chiqim tuzatildi: ${recipientName}`
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
      }

      return stockOut;
    });

    res.json({
      success: true,
      message: 'Chiqim yangilandi',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStockOut = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const stockOut = await tx.stockOut.findUnique({
        where: { id }
      });

      if (!stockOut) {
        throw new Error('Chiqim topilmadi');
      }

      const [lockedProduct] = await tx.$queryRaw`
        SELECT id, name, "currentStock"
        FROM "Product"
        WHERE id = ${stockOut.productId}
        FOR UPDATE
      `;

      if (!lockedProduct) {
        throw new Error('Mahsulot topilmadi');
      }

      const quantity = parseFloat(stockOut.quantity);
      const oldStock = parseFloat(lockedProduct.currentStock);
      const newStock = oldStock + quantity;

      await tx.product.update({
        where: { id: lockedProduct.id },
        data: { currentStock: newStock }
      });

      await tx.inventoryLog.create({
        data: {
          productId: lockedProduct.id,
          actionType: 'CHIQIM_BEKOR',
          quantityBefore: oldStock,
          quantityChange: quantity,
          quantityAfter: newStock,
          referenceId: stockOut.id,
          referenceType: 'STOCK_OUT_DELETE',
          notes: `Chiqim bekor qilindi: ${stockOut.recipientName}`
        }
      });

      await tx.stockOut.delete({
        where: { id }
      });
    });

    res.json({
      success: true,
      message: 'Chiqim o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};
