import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, productId } = req.query;
    const skip = (page - 1) * limit;
    const where = productId ? { productId } : {};

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
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
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
