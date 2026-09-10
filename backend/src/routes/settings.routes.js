import express from 'express';
import prisma from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    let settings = await prisma.companySettings.findFirst();

    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          companyName: 'Kompaniya nomi',
          currency: 'UZS',
          dateFormat: 'DD.MM.YYYY'
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

router.put('/', authenticate, authorize('settings:update'), moderateContent(['companyName', 'address']), async (req, res, next) => {
  try {
    const { companyName, phone, address, taxId, currency, dateFormat } = req.body;

    let settings = await prisma.companySettings.findFirst();

    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          companyName,
          phone,
          address,
          taxId,
          currency,
          dateFormat
        }
      });
    } else {
      settings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          companyName,
          phone,
          address,
          taxId,
          currency,
          dateFormat
        }
      });
    }

    res.json({ success: true, message: 'Sozlamalar yangilandi', data: settings });
  } catch (error) {
    next(error);
  }
});

export default router;
