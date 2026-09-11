import prisma from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      productsCount,
      categoriesCount,
      suppliersCount,
      lowStockCount,
      todayStockInsCount,
      todayStockOutsCount,
      todayStockInValue,
      todayStockOutsData,
      recentStockIns,
      recentStockOuts,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.supplier.count({ where: { isActive: true } }),
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "Product" WHERE "isActive" = true AND "currentStock" <= "minStock"`,
      prisma.stockIn.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.stockOut.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.stockIn.aggregate({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      prisma.stockOut.findMany({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        },
        include: {
          product: true
        }
      }),
      prisma.stockIn.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          product: {
            include: {
              unit: true
            }
          },
          supplier: true,
          user: {
            select: {
              fullName: true
            }
          }
        }
      }),
      prisma.stockOut.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          product: {
            include: {
              unit: true
            }
          },
          user: {
            select: {
              fullName: true
            }
          }
        }
      }),
      prisma.$queryRaw`
        SELECT p.*, u.name as unit_name, u.symbol as unit_symbol, c.name as category_name
        FROM "Product" p
        LEFT JOIN "Unit" u ON p."unitId" = u.id
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        WHERE p."isActive" = true AND p."currentStock" <= p."minStock"
        ORDER BY p."currentStock" ASC
        LIMIT 10
      `
    ]);

    // Bugungi chiqim qiymatini hisoblash
    let todayStockOutTotal = 0;
    if (Array.isArray(todayStockOutsData)) {
      todayStockOutsData.forEach(out => {
        const quantity = parseFloat(out.quantity || 0);
        const price = out.product ? parseFloat(out.product.salePrice || 0) : 0;
        todayStockOutTotal += quantity * price;
      });
    }

    // Low stock mahsulotlarni formatlash
    const formattedLowStock = (lowStockProducts || []).map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      currentStock: p.currentStock,
      minStock: p.minStock,
      unit: {
        name: p.unit_name,
        symbol: p.unit_symbol
      },
      category: {
        name: p.category_name
      }
    }));

    res.json({
      success: true,
      data: {
        stats: {
          products: productsCount,
          categories: categoriesCount,
          suppliers: suppliersCount,
          lowStock: (lowStockCount && lowStockCount[0] && lowStockCount[0].count !== undefined) ? parseInt(lowStockCount[0].count) : 0,
          todayStockIns: todayStockInsCount,
          todayStockOuts: todayStockOutsCount,
          todayStockInValue: parseFloat(todayStockInValue?._sum?.totalAmount || 0),
          todayStockOutValue: todayStockOutTotal
        },
        recentStockIns,
        recentStockOuts,
        lowStockProducts: formattedLowStock
      }
    });
  } catch (error) {
    next(error);
  }
};
