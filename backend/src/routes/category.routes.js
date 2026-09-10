import express from 'express';
import { body } from 'express-validator';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategory);

router.post('/', authenticate, authorize('categories:create'), [
  body('name').trim().notEmpty().withMessage('Kategoriya nomi talab qilinadi'),
  validate
], moderateContent(['name', 'description']), auditLog('categories', 'create'), createCategory);

router.put('/:id', authenticate, authorize('categories:update'), [
  body('name').trim().notEmpty().withMessage('Kategoriya nomi talab qilinadi'),
  validate
], moderateContent(['name', 'description']), auditLog('categories', 'update'), updateCategory);

router.delete('/:id', authenticate, authorize('categories:delete'), 
  auditLog('categories', 'delete'), deleteCategory);

export default router;
