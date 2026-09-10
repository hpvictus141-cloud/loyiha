import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLog } from '../middleware/auditLog.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUser);

router.post('/', authenticate, authorize('users:create'), [
  body('username').trim().notEmpty().withMessage('Username talab qilinadi')
    .isLength({ min: 3 }).withMessage('Username kamida 3 ta belgidan iborat bo\'lishi kerak'),
  body('email').optional().isEmail().withMessage('Email noto\'g\'ri formatda'),
  body('password').trim().notEmpty().withMessage('Parol talab qilinadi')
    .isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  body('fullName').trim().notEmpty().withMessage('To\'liq ism talab qilinadi'),
  body('roleId').trim().notEmpty().withMessage('Rol talab qilinadi'),
  validate
], moderateContent(['fullName', 'username']), auditLog('users', 'create'), createUser);

router.put('/:id', authenticate, authorize('users:update'), [
  body('email').optional().isEmail().withMessage('Email noto\'g\'ri formatda'),
  body('fullName').trim().notEmpty().withMessage('To\'liq ism talab qilinadi'),
  body('roleId').trim().notEmpty().withMessage('Rol talab qilinadi'),
  validate
], moderateContent(['fullName']), auditLog('users', 'update'), updateUser);

router.delete('/:id', authenticate, authorize('users:delete'),
  auditLog('users', 'delete'), deleteUser);

router.post('/:id/change-password', authenticate, authorize('users:update'), [
  body('newPassword').trim().notEmpty().withMessage('Yangi parol talab qilinadi')
    .isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  validate
], auditLog('users', 'update'), changePassword);

export default router;
