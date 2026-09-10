import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { userId: null }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
});

router.put('/read-all', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: {
        OR: [
          { userId: req.user.id },
          { userId: null }
        ],
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ success: true, message: 'Barcha bildirishnomalar o\'qildi' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const notif = await prisma.notification.findUnique({ where: { id } });
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Bildirishnoma topilmadi' });
    }

    if (notif.userId && notif.userId !== req.user.id && req.user.role?.name !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Ruxsat berilmagan' });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
});

export default router;
