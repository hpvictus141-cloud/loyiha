import express from 'express';
import { body } from 'express-validator';
import { 
  getSuppliers, 
  getSupplier, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/supplier.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getSuppliers);
router.get('/:id', authenticate, getSupplier);

router.post('/', authenticate, authorize('suppliers:create'), [
  body('companyName').trim().notEmpty().withMessage('Korxona nomi talab qilinadi'),
  body('contactPerson').trim().notEmpty().withMessage('Mas\'ul shaxs talab qilinadi'),
  body('phone').trim().notEmpty().withMessage('Telefon raqami talab qilinadi'),
  validate
], moderateContent(['companyName', 'contactPerson', 'description', 'address']), auditLog('suppliers', 'create'), createSupplier);

router.put('/:id', authenticate, authorize('suppliers:update'), [
  body('companyName').trim().notEmpty().withMessage('Korxona nomi talab qilinadi'),
  body('contactPerson').trim().notEmpty().withMessage('Mas\'ul shaxs talab qilinadi'),
  body('phone').trim().notEmpty().withMessage('Telefon raqami talab qilinadi'),
  validate
], moderateContent(['companyName', 'contactPerson', 'description', 'address']), auditLog('suppliers', 'update'), updateSupplier);

router.delete('/:id', authenticate, authorize('suppliers:delete'), 
  auditLog('suppliers', 'delete'), deleteSupplier);

export default router;
