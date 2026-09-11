import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      roleId,
      isActive 
    } = req.query;

    const cleanPage = Math.max(1, parseInt(page) || 1);
    const cleanLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const skip = (cleanPage - 1) * cleanLimit;
    const where = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (roleId) {
      where.roleId = roleId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: cleanLimit,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          phone: true,
          profileImage: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: cleanPage,
        limit: cleanLimit,
        total,
        pages: Math.ceil(total / cleanLimit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        profileImage: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                id: true,
                module: true,
                action: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName, phone, roleId } = req.body;

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu username allaqachon mavjud'
      });
    }

    const trimmedUsername = username.trim();
    const finalEmail = (email && email.trim()) ? email.trim() : `${trimmedUsername}@warehouse.local`;

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: finalEmail }
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Bu email allaqachon mavjud'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,
        email: finalEmail,
        password: hashedPassword,
        fullName,
        phone,
        roleId,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Foydalanuvchi qo\'shildi',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, fullName, phone, roleId, isActive } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    // Check if email is being changed and if new email exists
    const trimmedEmail = (email && typeof email === 'string' && email.trim()) ? email.trim() : undefined;
    if (trimmedEmail && trimmedEmail !== existingUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: trimmedEmail }
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Bu email allaqachon mavjud'
        });
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: trimmedEmail,
        fullName,
        phone,
        roleId,
        isActive
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Foydalanuvchi yangilandi',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Element topilmadi',
        message: 'Element topilmadi'
      });
    }

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "O'zingizni o'chira olmaysiz",
        message: "O'zingizni o'chira olmaysiz"
      });
    }

    // Check if user has related records (audit logs, stock in/out)
    const [auditCount, stockInCount, stockOutCount] = await Promise.all([
      prisma.auditLog.count({ where: { userId: id } }),
      prisma.stockIn.count({ where: { userId: id } }),
      prisma.stockOut.count({ where: { userId: id } })
    ]);

    if (auditCount > 0 || stockInCount > 0 || stockOutCount > 0) {
      return res.status(409).json({
        success: false,
        error: "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud",
        message: "Bu elementni o'chirib bo'lmaydi, chunki unga bog'liq ma'lumotlar mavjud"
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Foydalanuvchi o\'chirildi'
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    // Invalidate all active sessions for this user
    await prisma.session.deleteMany({
      where: { userId: id }
    });

    res.json({
      success: true,
      message: 'Parol o\'zgartirildi va faol sessiyalar bekor qilindi'
    });
  } catch (error) {
    next(error);
  }
};
