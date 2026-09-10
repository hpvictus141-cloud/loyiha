import express from 'express';
import { body } from 'express-validator';
import { 
  getStockIns, 
  getStockIn, 
  createStockIn, 
  updateStockIn, 
  deleteStockIn 
} from '../controllers/stockIn.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { validateDateNotFuture } from '../utils/dateValidator.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getStockIns);
router.get('/:id', authenticate, getStockIn);

router.post('/', authenticate, authorize('stock:create'), [
  body('productId').notEmpty().withMessage('Mahsulot talab qilinadi'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Miqdor noto\'g\'ri'),
  body('price').isFloat({ min: 0 }).withMessage('Narx noto\'g\'ri'),
  body('date').optional({ nullable: true, checkFalsy: true }).custom(validateDateNotFuture),
  validate
], moderateContent(['notes', 'invoiceNumber']), auditLog('stock', 'in'), createStockIn);

router.put('/:id', authenticate, authorize('stock:update'), [
  body('quantity').isFloat({ min: 0.01 }).withMessage('Miqdor noto\'g\'ri'),
  body('price').isFloat({ min: 0 }).withMessage('Narx noto\'g\'ri'),
  body('date').optional({ nullable: true, checkFalsy: true }).custom(validateDateNotFuture),
  validate
], moderateContent(['notes', 'invoiceNumber']), auditLog('stock', 'in-update'), updateStockIn);

router.delete('/:id', authenticate, authorize('stock:delete'), 
  auditLog('stock', 'in-delete'), deleteStockIn);

export default router;
