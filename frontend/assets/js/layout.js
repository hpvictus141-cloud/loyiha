const Layout = {
  init() {
    if (!Auth.requireAuth()) return false;

    try { ThemeManager.init(); } catch (e) { console.warn('Theme init warning:', e); }
    try { this.renderSidebar(); } catch (e) { console.warn('Sidebar render warning:', e); }
    try { this.renderNavbar(); } catch (e) { console.warn('Navbar render warning:', e); }
    try { this.setupSidebarToggle(); } catch (e) { console.warn('Sidebar toggle warning:', e); }
    try { this.setupDropdownListeners(); } catch (e) { console.warn('Dropdown warning:', e); }
    try { this.loadNotifications(); } catch (e) { console.warn('Notifications warning:', e); }
    try { this.markActiveNav(); } catch (e) { console.warn('Active nav warning:', e); }
    return true;
  },

  renderSidebar() {
    const user = Auth.getUser();
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const initials = user?.fullName
      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

    const userRole = user?.role?.name || '';
    const isAdmin = userRole === 'Admin';
    const isOperator = userRole === 'Operator';
    const canManageStock = isAdmin || isOperator || Auth.hasPermission('stock:create') || Auth.hasPermission('stock:read');
    const canViewSuppliers = isAdmin || isOperator || Auth.hasPermission('suppliers:read') || Auth.hasPermission('suppliers:create');

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="sidebar-logo">
            <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <span class="sidebar-title">OmborXona</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">Asosiy</div>
          <a href="/dashboard" class="nav-item" data-page="dashboard">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard
          </a>
        </div>

        ${canManageStock ? `
        <div class="nav-section">
          <div class="nav-section-title">Omborxona</div>
          <a href="/stock-in" class="nav-item" data-page="stock-in">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4"/>
            </svg>
            Kirim
          </a>
          <a href="/stock-out" class="nav-item" data-page="stock-out">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 12H4"/>
            </svg>
            Chiqim
          </a>
          <a href="/inventory" class="nav-item" data-page="inventory">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Ombor qoldig'i
          </a>
        </div>
        ` : ''}

        <div class="nav-section">
          <div class="nav-section-title">Ma'lumotlar</div>
          <a href="/products" class="nav-item" data-page="products">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
            Mahsulotlar
          </a>
          <a href="/categories" class="nav-item" data-page="categories">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Kategoriyalar
          </a>
          ${canViewSuppliers ? `
          <a href="/suppliers" class="nav-item" data-page="suppliers">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Yetkazib beruvchilar
          </a>
          ` : ''}
        </div>

        ${isAdmin ? `
        <div class="nav-section">
          <div class="nav-section-title">Tahlil</div>
          <a href="/reports" class="nav-item" data-page="reports">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Hisobotlar
          </a>
          <a href="/audit-logs" class="nav-item" data-page="audit-logs">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Harakatlar tarixi
          </a>
        </div>
        ` : `
        <div class="nav-section">
          <div class="nav-section-title">Tahlil</div>
          <a href="/audit-logs" class="nav-item" data-page="audit-logs">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Harakatlar tarixi
          </a>
        </div>
        `}

        <div class="nav-section">
          <div class="nav-section-title">Boshqaruv</div>
          <a href="/boshqaruv" class="nav-item" data-page="boshqaruv">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Boshqaruv paneli
          </a>
          ${isAdmin ? `
          <a href="/users" class="nav-item" data-page="users">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Foydalanuvchilar
          </a>
          ` : ''}
          <a href="/profile" class="nav-item" data-page="profile">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Profil
          </a>
          <a href="/settings" class="nav-item" data-page="settings">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Sozlamalar
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="sidebar-logout-card" onclick="Auth.logout()" title="Tizimdan chiqish (Logout)">
          <div class="logout-icon-badge">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10"/>
            </svg>
          </div>
          <div class="sidebar-user-meta">
            <div class="sidebar-user-name">${Utils.escapeHtml(user?.fullName || 'Administrator')}</div>
            <div class="sidebar-user-sub">${Utils.escapeHtml(userRole || 'Admin')} &bull; ${Utils.escapeHtml(user?.username || 'admin')}</div>
          </div>
        </button>
      </div>
    `;
  },

  renderNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const user = Auth.getUser();
    const userRole = user?.role?.name || '';
    const initials = user?.fullName
      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

    navbar.innerHTML = `
      <div class="navbar-left">
        <button class="sidebar-toggle" id="sidebar-toggle" onclick="Layout.toggleSidebar()">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="breadcrumb" id="breadcrumb"></div>
      </div>
      <div class="navbar-right">
        <!-- Bildirishnomalar -->
        <div class="dropdown notif-dropdown-container">
          <button class="navbar-action-btn" id="notif-btn" title="Bildirishnomalar" onclick="Layout.toggleNotifPanel(event)">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="notification-dot" id="notif-dot" style="display:none"></span>
          </button>
          <div class="notification-panel" id="notification-panel">
            <div class="notification-header">
              <span style="font-size:14px;font-weight:600">Bildirishnomalar</span>
              <button onclick="Layout.markAllRead(event)" style="font-size:12px;color:var(--primary);background:none;border:none;cursor:pointer;font-weight:500">Barchani o'qilgan deb belgilash</button>
            </div>
            <div class="notification-list" id="notification-list">
              <div style="padding:24px;text-align:center;font-size:14px;color:var(--text-secondary)">Bildirishnoma yo'q</div>
            </div>
          </div>
        </div>

        <!-- Profil menyusi (Dropdown) -->
        <div class="dropdown navbar-user-container">
          <button class="navbar-user-btn" id="navbar-user-btn" onclick="Layout.toggleUserMenu(event)" title="Foydalanuvchi menyusi" aria-haspopup="true" aria-expanded="false">
            <div class="user-avatar navbar-avatar">${initials}</div>
            <div class="navbar-user-info">
              <div class="navbar-user-name">${Utils.escapeHtml(user?.fullName || 'Administrator')}</div>
              <div class="navbar-user-role">${Utils.escapeHtml(userRole || 'Admin')} &bull; ${Utils.escapeHtml(user?.username || 'admin')}</div>
            </div>
            <svg class="navbar-user-arrow" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div class="navbar-user-dropdown" id="navbar-user-dropdown">
            <div class="dropdown-user-header">
              <div class="dropdown-user-name">${Utils.escapeHtml(user?.fullName || 'Administrator')}</div>
              <div class="dropdown-user-role">${Utils.escapeHtml(userRole || 'Admin')} &bull; ${Utils.escapeHtml(user?.username || 'admin')}</div>
            </div>
            <div class="user-dropdown-divider"></div>
            <a href="/profile" class="user-dropdown-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Profilni ko'rish
            </a>
            <a href="/settings" class="user-dropdown-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Sozlamalar
            </a>
            <div class="user-dropdown-divider"></div>
            <button type="button" class="user-dropdown-item item-danger" onclick="Auth.logout()">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Chiqish
            </button>
          </div>
        </div>
      </div>
    `;

    ThemeManager.init();
  },

  markActiveNav() {
    const path = window.location.pathname;
    const page = path.split('/').filter(p => p).pop() || 'dashboard';
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === page) {
        item.classList.add('active');
      }
    });
  },

  setBreadcrumb(items) {
    const bc = document.getElementById('breadcrumb');
    if (!bc || !Array.isArray(items)) return;
    bc.innerHTML = items.map((rawItem, i) => {
      const item = typeof rawItem === 'string' ? { label: rawItem } : rawItem;
      const isLast = i === items.length - 1;
      const sep = i > 0 
        ? '<svg class="breadcrumb-sep" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' 
        : '';
      const label = (window.Utils && typeof window.Utils.escapeHtml === 'function')
        ? window.Utils.escapeHtml(item.label || '')
        : (item.label || '');

      if (isLast) {
        // Oxirgi element — joriy sahifa nomi (aktiv, qalin, link emas)
        return `${sep}<span class="breadcrumb-item breadcrumb-current active" aria-current="page">${label}</span>`;
      }

      // Agar 'Boshqaruv' bo'lsa va href berilmagan bo'lsa, avtomatik /boshqaruv sahifasiga ulaymiz
      let href = item.href;
      if (!href && item.label && item.label.toLowerCase().trim() === 'boshqaruv') {
        href = '/boshqaruv';
      }

      if (href) {
        // Faqat haqiqiy sahifa linki bo'lsagina <a> qilib chiziladi
        return `${sep}<a href="${href}" class="breadcrumb-item breadcrumb-link">${label}</a>`;
      }

      // Guruh nomi — oddiy, bosilmaydigan matn
      return `${sep}<span class="breadcrumb-item breadcrumb-group">${label}</span>`;
    }).join('');
  },

  toggleCard(btn) {
    const card = btn.closest('.card');
    if (!card) return;
    const isCollapsed = card.classList.toggle('collapsed');
    const icon = card.querySelector('.card-toggle-icon');
    if (icon) {
      icon.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
    }
  },

  setupSidebarToggle() {
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }
    // Har doim overlay bosilganda sidebarni yopish
    overlay.onclick = () => this.closeSidebar();

    // Mobil ekranda menyu punkti bosilganda sidebarni yopish
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 1024) {
            this.closeSidebar();
          }
        });
      });
    }
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = sidebar?.classList.contains('open');
    if (isOpen) {
      this.closeSidebar();
    } else {
      // Sidebarni ochganda barcha ochiq dropdownlarni yopish
      this.closeAllDropdowns();
      sidebar?.classList.add('open');
      overlay?.classList.add('open');
      document.body.classList.add('sidebar-open');
    }
  },

  closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  },

  toggleUserMenu(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const dropdown = document.getElementById('navbar-user-dropdown');
    const btn = document.getElementById('navbar-user-btn');
    if (!dropdown || !btn) return;
    const isOpen = dropdown.classList.contains('show');
    
    // Avval bildirishnomalar va boshqa barcha dropdownlarni yopish
    this.closeNotifPanel();
    document.querySelectorAll('.dropdown-menu.open, .dropdown.open').forEach(el => el.classList.remove('open'));

    if (isOpen) {
      this.closeUserMenu();
    } else {
      dropdown.classList.add('show');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  },

  closeUserMenu() {
    const dropdown = document.getElementById('navbar-user-dropdown');
    const btn = document.getElementById('navbar-user-btn');
    dropdown?.classList.remove('show');
    btn?.classList.remove('active');
    btn?.setAttribute('aria-expanded', 'false');
  },

  toggleNotifPanel(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const panel = document.getElementById('notification-panel');
    if (!panel) return;
    const isOpen = panel.classList.contains('open');

    // Avval foydalanuvchi menyusi va boshqa barcha dropdownlarni yopish
    this.closeUserMenu();
    document.querySelectorAll('.dropdown-menu.open, .dropdown.open').forEach(el => el.classList.remove('open'));

    if (isOpen) {
      this.closeNotifPanel();
    } else {
      panel.classList.add('open');
    }
  },

  closeNotifPanel() {
    document.getElementById('notification-panel')?.classList.remove('open');
  },

  closeAllDropdowns() {
    this.closeNotifPanel();
    this.closeUserMenu();
    document.querySelectorAll('.dropdown-menu.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.dropdown.open').forEach(el => el.classList.remove('open'));
  },

  setupDropdownListeners() {
    if (this._dropdownListenersSetup) return;
    this._dropdownListenersSetup = true;

    // 1. Tashqariga bosilganda avtomatik yopilish (pointerdown & click)
    const handleOutsideClick = (e) => {
      // Bildirishnomalar tashqarisiga bosilganda
      const notifContainer = document.querySelector('.notif-dropdown-container');
      if (notifContainer && !notifContainer.contains(e.target)) {
        this.closeNotifPanel();
      }

      // Profil menyusi tashqarisiga bosilganda
      const userContainer = document.querySelector('.navbar-user-container');
      if (userContainer && !userContainer.contains(e.target)) {
        this.closeUserMenu();
      }

      // Umumiy dropdown komponentlari
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          dropdown.querySelector('.dropdown-menu')?.classList.remove('open');
        }
      });
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('click', handleOutsideClick);

    // 2. Escape klavishi bosilganda barcha dropdown, modal va sidebarni yopish
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.closeAllDropdowns();
        this.closeSidebar();
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });

    // 3. Sahifa scroll bo'lganda ochiq floating menyularni yopish (muallaq qolishini oldini oladi)
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          this.closeAllDropdowns();
          scrollTimer = null;
        }, 80);
      }
    }, { passive: true });

    // 4. Oyna o'lchami o'zgarganda dropdownlarni tozalash
    window.addEventListener('resize', () => {
      this.closeAllDropdowns();
      if (window.innerWidth > 1024) {
        this.closeSidebar();
      }
    });

    // 5. Biror link yoki navigatsiya bosilganda darhol barcha dropdownlarni yopish
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && (link.getAttribute('href') || link.getAttribute('data-page'))) {
        this.closeAllDropdowns();
        if (window.innerWidth <= 1024) {
          this.closeSidebar();
        }
      }
    });

    // 6. Sahifa almashganda state tozalanishi
    window.addEventListener('pagehide', () => this.closeAllDropdowns());
    window.addEventListener('beforeunload', () => this.closeAllDropdowns());
  },

  getNotificationRoute(n) {
    const text = ((n.title || '') + ' ' + (n.message || '') + ' ' + (n.type || '')).toLowerCase();
    if (text.includes('kirim') || text.includes('stock_in')) return '/stock-in';
    if (text.includes('chiqim') || text.includes('stock_out')) return '/stock-out';
    if (text.includes('qoldiq') || text.includes('kam') || text.includes('minimal') || text.includes('warning') || text.includes('inventory')) return '/inventory';
    if (text.includes('mahsulot') || text.includes('product')) return '/products';
    if (text.includes('kategoriya') || text.includes('category')) return '/categories';
    if (text.includes('yetkazib') || text.includes('ta\'minot') || text.includes('supplier')) return '/suppliers';
    if (text.includes('foydalanuvchi') || text.includes('user')) return '/users';
    return '/inventory';
  },

  async loadNotifications() {
    try {
      const data = await api.get('/notifications');
      this.notifications = data.data || [];
      this.updateNotifUI();
    } catch (e) { }
  },

  updateNotifUI() {
    const notifications = this.notifications || [];
    const unread = notifications.filter(n => !n.isRead);

    const dot = document.getElementById('notif-dot');
    if (dot) {
      dot.style.display = unread.length > 0 ? 'block' : 'none';
    }

    const list = document.getElementById('notification-list');
    if (!list) return;

    if (notifications.length === 0) {
      list.innerHTML = '<div style="padding:24px;text-align:center;font-size:14px;color:var(--text-secondary)">Bildirishnoma yo\'q</div>';
      return;
    }

    list.innerHTML = notifications.slice(0, 20).map(n => {
      const route = this.getNotificationRoute(n);
      return `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" id="notif-item-${n.id}" onclick="Layout.handleNotificationClick('${n.id}', '${route}', event)" style="cursor:pointer">
          <div class="notification-item-title">${Utils.escapeHtml(n.title)}</div>
          <div class="notification-item-msg">${Utils.escapeHtml(n.message)}</div>
          <div class="notification-item-time">${Utils.formatDate(n.createdAt, 'DD.MM.YYYY HH:mm')}</div>
        </div>
      `;
    }).join('');
  },

  handleNotificationClick(id, targetRoute, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Optimistic update
    const n = (this.notifications || []).find(item => item.id === id);
    if (n) n.isRead = true;

    const el = document.getElementById(`notif-item-${id}`);
    if (el) el.classList.remove('unread');

    const unread = (this.notifications || []).filter(item => !item.isRead);
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = unread.length > 0 ? 'block' : 'none';

    // 2. Background API call
    api.put(`/notifications/${id}/read`).catch(() => {});

    // 3. Close panel and navigate
    this.closeAllDropdowns();
    if (targetRoute) {
      window.location.href = targetRoute;
    }
  },

  async markAllRead(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Optimistic update
    (this.notifications || []).forEach(n => n.isRead = true);
    document.querySelectorAll('.notification-item.unread').forEach(el => el.classList.remove('unread'));
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'none';

    // 2. Backend call
    try {
      await api.put('/notifications/read-all');
      Toast.success('Barcha bildirishnomalar o\'qildi');
    } catch (e) {
      Toast.error('Bildirishnomalarni yangilab bo\'lmadi');
      this.loadNotifications();
    }
  }
};
