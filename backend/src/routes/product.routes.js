import express from 'express';
import { body } from 'express-validator';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getLowStockProducts 
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/low-stock', authenticate, getLowStockProducts);
router.get('/:id', authenticate, getProduct);

router.post('/', authenticate, authorize('products:create'), [
  body('code').trim().notEmpty().withMessage('Mahsulot kodi talab qilinadi'),
  body('name').trim().notEmpty().withMessage('Mahsulot nomi talab qilinadi'),
  body('categoryId').notEmpty().withMessage('Kategoriya talab qilinadi'),
  body('unitId').notEmpty().withMessage('O\'lchov birligi talab qilinadi'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Sotib olish narxi noto\'g\'ri'),
  body('salePrice').isFloat({ min: 0 }).withMessage('Sotish narxi noto\'g\'ri'),
  validate
], moderateContent(['name', 'description']), auditLog('products', 'create'), createProduct);

router.put('/:id', authenticate, authorize('products:update'), [
  body('name').trim().notEmpty().withMessage('Mahsulot nomi talab qilinadi'),
  body('purchasePrice').optional().isFloat({ min: 0 }).withMessage('Sotib olish narxi noto\'g\'ri'),
  body('salePrice').optional().isFloat({ min: 0 }).withMessage('Sotish narxi noto\'g\'ri'),
  body('minStock').optional().isFloat({ min: 0 }).withMessage('Minimal qoldiq noto\'g\'ri'),
  validate
], moderateContent(['name', 'description']), auditLog('products', 'update'), updateProduct);

router.delete('/:id', authenticate, authorize('products:delete'), 
  auditLog('products', 'delete'), deleteProduct);

export default router;
