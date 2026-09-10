import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Autentifikatsiya tokeni topilmadi' 
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
        message: 'Foydalanuvchi topilmadi yoki faol emas' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token muddati tugagan' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Yaroqsiz token' 
    });
  }
};

export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Autentifikatsiya talab qilinadi' 
      });
    }

    const userPermissions = req.user.role.permissions.map(
      p => `${p.module}:${p.action}`
    );

    const hasPermission = requiredPermissions.some(
      permission => userPermissions.includes(permission) || userPermissions.includes('*:*')
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: 'Ruxsat berilmagan' 
      });
    }

    next();
  };
};
