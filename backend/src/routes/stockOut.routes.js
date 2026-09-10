import express from 'express';
import { body } from 'express-validator';
import { 
  getStockOuts, 
  getStockOut, 
  createStockOut, 
  updateStockOut, 
  deleteStockOut 
} from '../controllers/stockOut.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { validateDateNotFuture } from '../utils/dateValidator.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getStockOuts);
router.get('/:id', authenticate, getStockOut);

router.post('/', authenticate, authorize('stock:create'), [
  body('productId').notEmpty().withMessage('Mahsulot talab qilinadi'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Miqdor noto\'g\'ri'),
  body('recipientName').trim().notEmpty().withMessage('Oluvchi ismi talab qilinadi'),
  body('date').optional({ nullable: true, checkFalsy: true }).custom(validateDateNotFuture),
  validate
], moderateContent(['recipientName', 'notes']), auditLog('stock', 'out'), createStockOut);

router.put('/:id', authenticate, authorize('stock:update'), [
  body('quantity').isFloat({ min: 0.01 }).withMessage('Miqdor noto\'g\'ri'),
  body('recipientName').trim().notEmpty().withMessage('Oluvchi ismi talab qilinadi'),
  body('date').optional({ nullable: true, checkFalsy: true }).custom(validateDateNotFuture),
  validate
], moderateContent(['recipientName', 'notes']), auditLog('stock', 'out-update'), updateStockOut);

router.delete('/:id', authenticate, authorize('stock:delete'), 
  auditLog('stock', 'out-delete'), deleteStockOut);

export default router;
