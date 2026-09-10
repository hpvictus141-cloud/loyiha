import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  refreshToken, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword 
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { moderateContent } from '../middleware/contentModerator.js';

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Login kamida 3 ta belgidan iborat bo\'lishi kerak'),
  body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  body('fullName').trim().notEmpty().withMessage('To\'liq ism talab qilinadi'),
  validate,
  moderateContent(['fullName', 'username'])
], register);

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Foydalanuvchi nomi talab qilinadi'),
  body('password').notEmpty().withMessage('Parol talab qilinadi'),
  validate
], login);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, [
  body('fullName').trim().notEmpty().withMessage('To\'liq ism talab qilinadi'),
  validate,
  moderateContent(['fullName'])
], updateProfile);

router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Joriy parol talab qilinadi'),
  body('newPassword').isLength({ min: 6 }).withMessage('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  validate
], changePassword);

export default router;
