import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, module, userId } = req.query;
    const skip = (page - 1) * limit;
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
        skip: parseInt(skip),
        take: parseInt(limit),
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
