import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import categoryRoutes from './routes/category.routes.js';
import unitRoutes from './routes/unit.routes.js';
import productRoutes from './routes/product.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import stockInRoutes from './routes/stockIn.routes.js';
import stockOutRoutes from './routes/stockOut.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import reportRoutes from './routes/report.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3010;

// View engine setup - EJS
app.set('view engine', 'ejs');
let viewsPath = path.join(__dirname, 'views');
if (!fs.existsSync(viewsPath)) {
  if (fs.existsSync(path.join(process.cwd(), 'backend/src/views'))) {
    viewsPath = path.join(process.cwd(), 'backend/src/views');
  } else if (fs.existsSync(path.join(process.cwd(), 'src/views'))) {
    viewsPath = path.join(process.cwd(), 'src/views');
  }
}
app.set('views', viewsPath);

const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: (parseInt(process.env.RATE_LIMIT_MAX) || 2500),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Juda ko\'p so\'rov yuborildi. Iltimos, birozdan so\'ng qayta urinib ko\'ring.'
    });
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files - from frontend directory
let frontendPath = path.join(__dirname, '../../frontend');
if (!fs.existsSync(frontendPath)) {
  if (fs.existsSync(path.join(process.cwd(), 'frontend'))) {
    frontendPath = path.join(process.cwd(), 'frontend');
  }
}
app.use('/assets', express.static(path.join(frontendPath, 'assets')));
app.use('/css', express.static(path.join(frontendPath, 'css')));
app.use('/js', express.static(path.join(frontendPath, 'js')));

// Legacy HTML redirects
app.get('/login.html', (req, res) => res.redirect('/login'));
app.get('/index.html', (req, res) => res.redirect('/'));
app.get('/pages/:page.html', (req, res) => res.redirect('/' + req.params.page));

// Rate limiting faqat API uchun
app.use('/api/', limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stock-in', stockInRoutes);
app.use('/api/stock-out', stockOutRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// View Routes - Server-Side Rendered
app.get('/', async (req, res) => {
  try {
    const [productsCount, categoriesCount, suppliersCount, sampleProducts, topCategories] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.supplier.count({ where: { isActive: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          unit: true
        }
      }),
      prisma.category.findMany({
        where: { isActive: true },
        take: 10,
        include: {
          _count: {
            select: { products: true }
          }
        }
      })
    ]);

    res.render('pages/index', {
      title: 'OmborXona - Professional Ombor Boshqaruv Tizimi',
      page: 'home',
      stats: {
        productsCount,
        categoriesCount,
        suppliersCount
      },
      sampleProducts,
      topCategories
    });
  } catch (err) {
    res.render('pages/index', {
      title: 'OmborXona - Bosh sahifa',
      page: 'home',
      stats: { productsCount: 67, categoriesCount: 14, suppliersCount: 15 },
      sampleProducts: [],
      topCategories: []
    });
  }
});

app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Kirish - OmborXona',
    page: 'login',
    error: null
  });
});

app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', {
    title: 'Dashboard - OmborXona',
    page: 'dashboard'
  });
});

app.get('/products', (req, res) => {
  res.render('pages/products', {
    title: 'Mahsulotlar - OmborXona',
    page: 'products'
  });
});

app.get('/categories', (req, res) => {
  res.render('pages/categories', {
    title: 'Kategoriyalar - OmborXona',
    page: 'categories'
  });
});

app.get('/stock-in', (req, res) => {
  res.render('pages/stock-in', {
    title: 'Kirim - OmborXona',
    page: 'stock-in'
  });
});

app.get('/stock-out', (req, res) => {
  res.render('pages/stock-out', {
    title: 'Chiqim - OmborXona',
    page: 'stock-out'
  });
});

app.get('/inventory', (req, res) => {
  res.render('pages/inventory', {
    title: 'Ombor Qoldig\'i - OmborXona',
    page: 'inventory'
  });
});

app.get('/suppliers', (req, res) => {
  res.render('pages/suppliers', {
    title: 'Yetkazib Beruvchilar - OmborXona',
    page: 'suppliers'
  });
});

app.get('/reports', (req, res) => {
  res.render('pages/reports', {
    title: 'Hisobotlar - OmborXona',
    page: 'reports'
  });
});

app.get('/users', (req, res) => {
  res.render('pages/users', {
    title: 'Foydalanuvchilar - OmborXona',
    page: 'users'
  });
});

app.get('/audit-logs', (req, res) => {
  res.render('pages/audit-logs', {
    title: 'Harakatlar Tarixi - OmborXona',
    page: 'audit-logs'
  });
});

app.get('/profile', (req, res) => {
  res.render('pages/profile', {
    title: 'Profil - OmborXona',
    page: 'profile'
  });
});

app.get('/settings', (req, res) => {
  res.render('pages/settings', {
    title: 'Sozlamalar - OmborXona',
    page: 'settings'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 - Sahifa topilmadi',
    page: '404'
  });
});

app.use(errorHandler);

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\nServer ishga tushdi (Node.js):`);
    console.log(`   - Backend API: http://localhost:${PORT}/api`);
    console.log(`   - Frontend (EJS): http://localhost:${PORT}`);
    console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   - Template Engine: EJS`);
    console.log(`   - Database: Connected\n`);
  });
}

export default app;
