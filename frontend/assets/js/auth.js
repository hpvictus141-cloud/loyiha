const Auth = {
  isAuthenticated() {
    return !!api.getToken() && !!api.getUser();
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  requireGuest() {
    if (this.isAuthenticated()) {
      window.location.href = '/dashboard';
      return false;
    }
    return true;
  },

  hasPermission(permission) {
    const user = api.getUser();
    if (!user || !user.role) return false;

    if (user.role.name === 'Admin') return true;

    const permissions = user.role.permissions || [];
    return permissions.some(p =>
      `${p.module}:${p.action}` === permission || p.module === '*'
    );
  },

  async logout() {
    try {
      await api.post('/auth/logout', {
        refreshToken: api.getRefreshToken()
      });
    } catch (e) { }
    api.clearTokens();
    window.location.href = '/login';
  },

  getUser() {
    return api.getUser();
  }
};

// Theme management
const ThemeManager = {
  // Kalit v2: eski 'light' qiymati saqlanib qolmasligi uchun almashtirildi
  STORAGE_KEY: 'warehouse-theme-v2',
  DEFAULT: 'dark',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.apply(saved === 'light' || saved === 'dark' ? saved : this.DEFAULT);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const lightIcon = toggleBtn.querySelector('.theme-icon-light');
      const darkIcon = toggleBtn.querySelector('.theme-icon-dark');
      if (lightIcon) lightIcon.style.display = theme === 'dark' ? 'none' : 'block';
      if (darkIcon) darkIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
  },

  toggle() {
    this.apply(this.getCurrent() === 'light' ? 'dark' : 'light');
  },

  getCurrent() {
    return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT;
  }
};
