import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Cookie fallback
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Autentifikatsiya tokeni topilmadi',
        message: 'Autentifikatsiya tokeni topilmadi. Iltimos, tizimga kiring.',
        reason: 'token_missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: 'Foydalanuvchi topilmadi yoki faol emas',
        message: 'Foydalanuvchi topilmadi yoki hisob faol emas',
        reason: 'user_inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Sessiya muddati tugadi',
        message: 'Sessiya muddati tugadi. Iltimos, tizimga qayta kiring.',
        reason: 'token_expired'
      });
    }
    return res.status(401).json({ 
      success: false, 
      error: 'Yaroqsiz token',
      message: 'Yaroqsiz token. Iltimos, tizimga qayta kiring.',
      reason: 'invalid_token'
    });
  }
};

export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Autentifikatsiya talab qilinadi',
        message: 'Autentifikatsiya talab qilinadi',
        reason: 'unauthorized'
      });
    }

    const roleName = (req.user.role?.name || '').toLowerCase().trim();

    // 1. Administrator har doim barcha amallarga to'liq ruxsatga ega
    if (roleName === 'admin' || roleName === 'administrator') {
      return next();
    }

    const permissions = req.user.role?.permissions || [];
    const userPermissions = permissions.map(
      p => `${p.module}:${p.action}`
    );

    // 2. Wildcard va maxsus ruxsatlar tekshiruvi (*:*, module:*, yoki aniq module:action)
    const hasPermission = requiredPermissions.some(permission => {
      if (userPermissions.includes(permission)) return true;
      if (userPermissions.includes('*:*')) return true;
      
      const [module, action] = permission.split(':');
      if (userPermissions.includes(`${module}:*`)) return true;
      if (userPermissions.includes(`*:${action}`)) return true;
      return false;
    });

    // 3. Operator va Omborchi rollari uchun standart ombor amallariga ruxsat
    if (!hasPermission && (roleName === 'operator' || roleName === 'omborchi')) {
      const isAllowedForOperator = requiredPermissions.every(p => 
        p.startsWith('products:') || 
        p.startsWith('categories:') || 
        p.startsWith('units:') || 
        p.startsWith('suppliers:') || 
        p.startsWith('stock:') || 
        p.startsWith('inventory:') ||
        p.startsWith('reports:read')
      );
      if (isAllowedForOperator) {
        return next();
      }
    }

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        error: 'Sizda bu amalni bajarish uchun ruxsat yo\'q',
        message: 'Sizda bu amalni bajarish uchun ruxsat yo\'q',
        reason: 'invalid_role',
        details: {
          role: req.user.role?.name,
          requiredPermissions
        }
      });
    }

    next();
  };
};
