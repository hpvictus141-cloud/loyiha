import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, data: units });
  } catch (error) {
    next(error);
  }
});

export default router;
