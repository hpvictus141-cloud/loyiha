import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { isFutureDate } from '../utils/dateValidator.js';

const router = express.Router();

router.get('/stock-summary', authenticate, async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        unit: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/stock-movements', authenticate, async (req, res, next) => {
  try {
    const { startDate, endDate, productId } = req.query;

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

    const where = {};

    if (productId) {
      where.productId = productId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        if (typeof endDate === 'string' && !endDate.includes('T')) {
          end.setHours(23, 59, 59, 999);
        }
        where.createdAt.lte = end;
      }
    }

    const logs = await prisma.inventoryLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            unit: true,
            category: true
          }
        }
      }
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
});

export default router;
