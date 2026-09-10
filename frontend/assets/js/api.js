const API_BASE = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? `${window.location.origin}/api`
  : 'http://localhost:3010/api';

const api = {
  getToken() {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      let response = await fetch(`${API_BASE}${endpoint}`, config);

      if (response.status === 401) {
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.getToken()}`;
          response = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
        } else {
          this.clearTokens();
          window.location.href = '/login';
          return;
        }
      }

      // Safely parse JSON or read text without crashing with SyntaxError
      let data = null;
      let rawText = '';
      const contentType = (response.headers && response.headers.get('content-type')) || '';

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          rawText = await response.text().catch(() => '');
        }
      } else {
        rawText = await response.text().catch(() => '');
        try {
          data = JSON.parse(rawText);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        let errorMsg = '';
        if (data && (data.error || data.message)) {
          errorMsg = data.error || data.message;
        } else if (rawText && rawText.length < 150 && !rawText.includes('<html') && !rawText.includes('<!DOCTYPE') && !rawText.includes('{')) {
          errorMsg = rawText.trim();
        } else if (response.status === 404) {
          errorMsg = 'Element topilmadi';
        } else if (response.status === 409) {
          errorMsg = 'Bu elementni o\'chirib bo\'lmaydi, chunki unga bog\'liq ma\'lumotlar mavjud';
        } else if (response.status === 429) {
          errorMsg = 'Juda ko\'p so\'rov yuborildi. Iltimos, birozdan so\'ng qayta urinib ko\'ring.';
        } else if (response.status === 403) {
          errorMsg = 'Ushbu amalni bajarish uchun sizda huquq yetarli emas';
        } else if (response.status >= 500) {
          errorMsg = 'Serverda xatolik yuz berdi';
        } else {
          errorMsg = 'So\'rovda xatolik yuz berdi';
        }

        // Texnik xatolar (Unexpected token, Prisma, stack trace va h.k.) hech qachon ekranga chiqmasin
        if (/unexpected token|syntaxerror|prismaclient|internal server error|cannot read propert/i.test(errorMsg)) {
          errorMsg = 'Serverda xatolik yuz berdi';
        }

        const customErr = new Error(errorMsg);
        customErr.status = response.status;
        customErr.data = data;
        customErr.field = (data && (data.field || (data.details && data.details.field))) || null;
        throw customErr;
      }

      if (!data) {
        throw new Error('Serverdan noto\'g\'ri formatdagi javob keldi');
      }

      return data;
    } catch (error) {
      if (error.name === 'SyntaxError') {
        const err = new Error('Serverda xatolik yuz berdi');
        err.status = 500;
        throw err;
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const err = new Error('Server bilan bog\'lanib bo\'lmadi. Internet aloqasini tekshiring');
        err.status = 0;
        throw err;
      }
      throw error;
    }
  },

  async refreshTokens() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      this.setUser(data.data.user);
      return true;
    } catch {
      return false;
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  async upload(endpoint, formData) {
    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Yuklashda xatolik');
    return data;
  }
};
