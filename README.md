# 🚀 OmborXona - 100% Node.js Full-Stack

**Professional Omborxona Boshqaruv Tizimi** - To'liq Node.js, Server-Side Rendering (EJS)

## ✨ Texnologiyalar

### Backend + Frontend (100% Node.js)
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **EJS** - Template engine (Server-Side Rendering)
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Sessions** - Cookie-based sessions

### Styling
- **CSS3** - Modern styling
- **CSS Variables** - Theming
- **Responsive Design** - Mobile-first

## 🎯 Nima 100% Node.js?

- ✅ **Backend** - Node.js Express
- ✅ **Frontend** - EJS templates (Node.js render qiladi)
- ✅ **Database** - Prisma ORM (Node.js)
- ✅ **Session** - Express session (Node.js)
- ✅ **Static files** - Express static (Node.js)
- ✅ **Routing** - Express router (Node.js)

**Xulosa:** Hech qanday alohida frontend framework yoki build tool kerak emas!

## 📦 O'rnatish

### 1. Dependencies

```powershell
cd backend
npm install
```

### 2. Database

```powershell
# Prisma generate
npm run generate

# Migration
npm run migrate

# Seed data
npm run seed
```

### 3. Server

```powershell
npm run dev
```

## 🌐 Kirish

Server ishga tushgandan keyin:

- **Bosh sahifa:** http://localhost:3010
- **Login (EJS):** http://localhost:3010/login
- **Dashboard:** http://localhost:3010/dashboard
- **API:** http://localhost:3010/api

## 👤 Login

- **Admin:** admin / admin123
- **Operator:** operator / operator123

## 📁 Struktura

```
backend/
├── src/
│   ├── views/              # EJS Templates (100% Node.js)
│   │   ├── pages/          # Sahifalar
│   │   │   ├── login.ejs
│   │   │   ├── dashboard.ejs
│   │   │   ├── products.ejs
│   │   │   └── ...
│   │   └── partials/       # Reusable qismlar
│   │       ├── head.ejs
│   │       └── scripts.ejs
│   ├── routes/             # API routes
│   ├── controllers/        # Controllers
│   ├── middleware/         # Middleware
│   └── server.js           # Main server
│
frontend/
├── assets/
│   ├── css/                # Styles
│   └── js/                 # Client JS
└── ...
```

## 🔄 Qanday ishlaydi?

### 1. User request yuboradi
```
GET http://localhost:3010/login
```

### 2. Express router catch qiladi
```javascript
app.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login', page: 'login' });
});
```

### 3. EJS template render qilinadi (Server-side)
```ejs
<!DOCTYPE html>
<html>
  <head>
    <%- include('../partials/head') %>
  </head>
  <body>
    <!-- HTML content -->
  </body>
</html>
```

### 4. Tayyor HTML browser'ga yuboriladi
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>...</body>
</html>
```

## ✨ Xususiyatlar

### Server-Side Rendering
- ✅ SEO friendly
- ✅ Fast initial load
- ✅ No build step
- ✅ Simple deployment

### Session Management
- ✅ Express sessions
- ✅ Cookie-based auth
- ✅ Secure & HTTP-only

### Static Assets
- ✅ CSS - Express static
- ✅ JS - Express static
- ✅ Images - Express static

### API
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Error handling

## 🚀 Production

```powershell
npm start
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3010
NODE_ENV="production"
```

## 📊 Afzalliklar

### 100% Node.js
1. **Bir til** - Frontend va backend JavaScript
2. **Bir runtime** - Node.js
3. **Sodda deployment** - Bitta server
4. **NPM ecosystem** - 2M+ packages

### EJS Template Engine
1. **Simple** - HTML + JavaScript
2. **Fast** - Server-side rendering
3. **Powerful** - Partials, includes, loops
4. **No build** - No webpack, no babel

### Express.js
1. **Minimal** - Lightweight
2. **Flexible** - Middleware-based
3. **Stable** - Production-proven
4. **Fast** - High performance

## 🛠️ Development

```powershell
# Dev mode (auto-restart)
npm run dev

# Database GUI
npm run studio

# Migration
npm run migrate

# Seed
npm run seed
```

## 📝 Route Examples

### View Routes (EJS)
```javascript
app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', {
    title: 'Dashboard',
    page: 'dashboard'
  });
});
```

### API Routes (JSON)
```javascript
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json({ data: products });
});
```

## 🎨 Styling

### CSS Structure
```
assets/css/
├── variables.css    # CSS variables
├── global.css       # Global styles
└── dashboard.css    # Dashboard styles
```

### Theme Support
- Dark mode
- Light mode
- CSS variables

## 🔐 Security

- ✅ Helmet.js
- ✅ CORS
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection

## 📞 API Docs

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`

### Products
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### More...
- Categories, Units, Suppliers
- Stock In/Out, Inventory
- Reports, Users, Audit Logs

## 🎯 Why 100% Node.js?

### Traditional Stack
```
Frontend (React/Vue) → Build → Bundle → Deploy
Backend (Node.js)    → Deploy
Database             → Deploy
```

### 100% Node.js Stack
```
Node.js (Express + EJS) → Deploy
Database                → Deploy
```

**Result:** Simpler, faster, easier!

## ✅ Checklist

- [x] Node.js backend
- [x] EJS templates
- [x] Express routing
- [x] Session management
- [x] Static file serving
- [x] Database (Prisma)
- [x] Authentication (JWT)
- [x] Real-time updates
- [x] Responsive design
- [x] Dark/Light theme
- [x] No build step
- [x] Production ready

---

**Made with ❤️ using 100% Node.js**

🌟 Star on GitHub if you like it!
