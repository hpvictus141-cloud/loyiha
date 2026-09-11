import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = Math.max(0, (cleanPage - 1) * cleanLimit);
    const where = productId ? { productId } : {};

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        skip,
        take: cleanLimit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              unit: true
            }
          }
        }
      }),
      prisma.inventoryLog.count({ where })
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: cleanPage,
        limit: cleanLimit,
        total,
        pages: Math.ceil(total / cleanLimit)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
