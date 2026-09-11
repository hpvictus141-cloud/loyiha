import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 50));
    const skip = Math.max(0, (cleanPage - 1) * cleanLimit);
    const where = {};

    // Admin bo'lmasa faqat o'zining harakatlarini ko'radi
    const userRole = req.user.role?.name;
    if (userRole !== 'Admin') {
      where.userId = req.user.id;
    } else {
      // Admin uchun filter
      if (module) where.module = module;
      if (userId) where.userId = userId;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: cleanLimit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
              username: true
            }
          }
        }
      }),
      prisma.auditLog.count({ where })
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
