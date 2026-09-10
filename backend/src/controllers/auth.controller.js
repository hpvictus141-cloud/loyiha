import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { username, password, fullName, phone } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu login allaqachon mavjud'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let finalRoleId;
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      let adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: {
            name: 'Admin',
            description: 'Tizim administratori'
          }
        });
      }
      finalRoleId = adminRole.id;
    } else {
      let operatorRole = await prisma.role.findFirst({ where: { name: 'Operator' } });
      if (!operatorRole) {
        operatorRole = await prisma.role.create({
          data: {
            name: 'Operator',
            description: 'Operator'
          }
        });
      }
      finalRoleId = operatorRole.id;
    }

    const user = await prisma.user.create({
      data: {
        username,
        email: username + '@warehouse.local', // Backend uchun email kerak
        password: hashedPassword,
        fullName,
        phone,
        roleId: finalRoleId
      },
      include: {
        role: true
      }
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username: username
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi nomi yoki parol noto\'g\'ri'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Foydalanuvchi faol emas'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi nomi yoki parol noto\'g\'ri'
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Tizimga kirish muvaffaqiyatli',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token talab qilinadi'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Yaroqsiz yoki muddati tugagan refresh token'
      });
    }

    const newAccessToken = generateAccessToken(session.userId);
    const newRefreshToken = generateRefreshToken(session.userId);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const { password: _, ...userWithoutPassword } = session.user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken }
      });
    }

    res.json({
      success: true,
      message: 'Tizimdan chiqish muvaffaqiyatli'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        fullName,
        phone
      },
      include: {
        role: true
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Profil yangilandi',
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Joriy parol noto\'g\'ri'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    await prisma.session.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: 'Parol o\'zgartirildi. Iltimos, qaytadan kiring'
    });
  } catch (error) {
    next(error);
  }
};
