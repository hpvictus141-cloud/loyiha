const Utils = {
  formatNumber(number, decimals = 0) {
    if (number === null || number === undefined) return '0';
    return parseFloat(number).toLocaleString('uz-UZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  formatCurrency(amount, currency = 'so\'m') {
    if (amount === null || amount === undefined) return '0 ' + currency;
    return this.formatNumber(amount, 0) + ' ' + currency;
  },

  formatDate(dateString, format = 'DD.MM.YYYY') {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    if (format === 'DD.MM.YYYY HH:mm') {
      return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
    }
    return `${dd}.${mm}.${yyyy}`;
  },

  getTodayString() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  isFutureDate(dateString) {
    if (!dateString) return false;
    const today = this.getTodayString();
    if (typeof dateString === 'string') {
      const trimmed = dateString.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed > today;
      }
      if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.substring(0, 10) > today;
      }
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return d.getTime() > endOfToday.getTime();
  },

  initDateConstraints() {
    const today = this.getTodayString();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      if (!input.hasAttribute('max') || input.getAttribute('max') > today) {
        input.setAttribute('max', today);
      }

      if (!input.dataset.maxBound) {
        input.dataset.maxBound = 'true';
        input.addEventListener('change', () => {
          if (input.value && input.value > today) {
            Toast.warning('Sana bugungi kundan katta bo\'lishi mumkin emas');
            input.value = today;
          }
        });
      }
    });
  },

  formatDateInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(text)));
    return div.innerHTML;
  },

  truncate(text, length = 30) {
    if (!text) return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },

  generatePaginationHTML(pagination) {
    const { page, pages } = pagination;
    if (pages <= 1) return '';

    let html = '<div class="pagination">';

    html += `<button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>`;

    let start = Math.max(1, page - 2);
    let end = Math.min(pages, page + 2);

    if (start > 1) {
      html += `<button class="pagination-btn" data-page="1">1</button>`;
      if (start > 2) html += `<span class="pagination-btn" style="cursor:default">...</span>`;
    }

    for (let i = start; i <= end; i++) {
      html += `<button class="pagination-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (end < pages) {
      if (end < pages - 1) html += `<span class="pagination-btn" style="cursor:default">...</span>`;
      html += `<button class="pagination-btn" data-page="${pages}">${pages}</button>`;
    }

    html += `<button class="pagination-btn" ${page >= pages ? 'disabled' : ''} data-page="${page + 1}">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>`;

    html += '</div>';
    return html;
  },

  setupPagination(container, onPageChange) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.pagination-btn');
      if (btn && !btn.disabled && btn.dataset.page) {
        onPageChange(parseInt(btn.dataset.page));
      }
    });
  },

  getSkeletonRows(cols, rows = 5) {
    let html = '';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) {
        html += `<td><div class="skeleton" style="height:16px;width:${60 + Math.random() * 40}%"></div></td>`;
      }
      html += '</tr>';
    }
    return html;
  },

  // Telefon raqam formatlash
  formatPhoneInput(input) {
    let value = input.value.replace(/\D/g, ''); // Faqat raqamlar
    
    // +998 bilan boshlash
    if (value.length > 0 && !value.startsWith('998')) {
      if (value.startsWith('998')) {
        // OK
      } else if (value.length >= 1) {
        value = '998' + value;
      }
    }
    
    // Maksimal 12 raqam (998 + 9 raqam)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    // Formatlash: +998 XX XXX XX XX
    let formatted = '';
    if (value.length > 0) {
      formatted = '+' + value.substring(0, 3); // +998
      if (value.length > 3) {
        formatted += ' ' + value.substring(3, 5); // 91
      }
      if (value.length > 5) {
        formatted += ' ' + value.substring(5, 8); // 257
      }
      if (value.length > 8) {
        formatted += ' ' + value.substring(8, 10); // 58
      }
      if (value.length > 10) {
        formatted += ' ' + value.substring(10, 12); // 69
      }
    }
    
    input.value = formatted;
  },

  // Input ga faqat harflar
  allowOnlyLetters(event) {
    const char = String.fromCharCode(event.which || event.keyCode);
    if (!/^[a-zA-Zа-яА-ЯўғҳқўҚҒҲЎ\s'-]$/.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  },

  // Input ga faqat raqamlar
  allowOnlyNumbers(event) {
    const char = String.fromCharCode(event.which || event.keyCode);
    // Backspace, delete, arrows, tab
    if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 9) {
      return true;
    }
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  },

  // Telefon inputni sozlash
  setupPhoneInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('placeholder', '+998 XX XXX XX XX');
    
    // Input event
    input.addEventListener('input', function(e) {
      Utils.formatPhoneInput(this);
    });
    
    // Keypress event - faqat raqamlar
    input.addEventListener('keypress', function(e) {
      return Utils.allowOnlyNumbers(e);
    });
    
    // Focus event - avtomatik +998 qo'shish
    input.addEventListener('focus', function(e) {
      if (!this.value || this.value.trim() === '') {
        this.value = '+998 ';
      }
    });
  },

  // Formadagi xatoliklarni tozalash
  clearFormErrors(containerIdOrEl) {
    const root = typeof containerIdOrEl === 'string' 
      ? document.getElementById(containerIdOrEl) 
      : containerIdOrEl;
    if (!root) return;

    // Mavjud alert bannerlarni tozalash
    root.querySelectorAll('.form-alert-danger').forEach(el => el.remove());

    // Qizil ramkalarni olib tashlash
    root.querySelectorAll('.is-invalid, .error').forEach(el => {
      el.classList.remove('is-invalid');
      el.classList.remove('error');
    });

    // Error span larni tozalash
    root.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
  },

  // Formada xatolik xabarini ko'rsatish va kerakli maydonni qizil ramka qilish
  showFormError(containerIdOrEl, error) {
    const root = typeof containerIdOrEl === 'string' 
      ? document.getElementById(containerIdOrEl) 
      : containerIdOrEl;
    if (!root) return;

    const errorMsg = typeof error === 'string' 
      ? error 
      : (error?.message || error?.error || 'Xatolik yuz berdi');

    const fieldName = error?.field || (error?.data && (error.data.field || error.data.details?.field));

    // Formaning body yoki form qismini topamiz
    const body = root.querySelector('.modal-body') || root.querySelector('form') || root;

    // Eski bannerni olib tashlaymiz
    body.querySelectorAll('.form-alert-danger').forEach(el => el.remove());

    // Yangi ogohlantirish bannerini qo'shamiz
    const alertDiv = document.createElement('div');
    alertDiv.className = 'form-alert form-alert-danger';
    alertDiv.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <span>${this.escapeHtml(errorMsg)}</span>
    `;
    body.insertBefore(alertDiv, body.firstChild);

    // Agar aniq maydonda xatolik bo'lsa (masalan profanity / nomaqbul so'z):
    if (fieldName) {
      // Ehtimoliy ID variantlari: field, cat-field, sup-field, so-field, si-field, u-field
      const candidateIds = [
        fieldName,
        `cat-${fieldName}`,
        `sup-${fieldName}`,
        `so-${fieldName}`,
        `si-${fieldName}`,
        `u-${fieldName}`
      ];

      let targetInput = null;
      for (const id of candidateIds) {
        const el = root.querySelector(`#${id}`) || root.querySelector(`[name="${fieldName}"]`);
        if (el) {
          targetInput = el;
          break;
        }
      }

      if (targetInput) {
        targetInput.classList.add('is-invalid');
        targetInput.classList.add('error');

        // Maydon ostidagi xato xabarini topish
        const fieldSpecificErrorEl = root.querySelector(`#${targetInput.id}-error`) || 
                                     root.querySelector(`#${fieldName}-error`) ||
                                     targetInput.parentElement?.querySelector('.form-error');

        if (fieldSpecificErrorEl) {
          const isProfanity = errorMsg.toLowerCase().includes('nomaqbul') || errorMsg.toLowerCase().includes('so\'z');
          fieldSpecificErrorEl.textContent = isProfanity 
            ? 'Bu maydonda nomaqbul so\'z ishlatilgan.' 
            : errorMsg;
        }

        // Foydalanuvchi maydonni tahrirlashni boshlasa qizil ramkani olib tashlaymiz
        const onInputChange = () => {
          targetInput.classList.remove('is-invalid');
          targetInput.classList.remove('error');
          if (fieldSpecificErrorEl) fieldSpecificErrorEl.textContent = '';
          targetInput.removeEventListener('input', onInputChange);
        };
        targetInput.addEventListener('input', onInputChange);

        // Inputga fokus berish
        targetInput.focus();
      }
    }
  },

  // Markazlashgan API xatolik boshqaruvchisi
  handleApiError(error, modalOrFormId = null) {
    const message = error?.message || error?.error || 'Kutilmagan xatolik yuz berdi';
    
    // Har doim Toast ko'rsatish
    if (typeof Toast !== 'undefined') {
      Toast.error(message);
    }

    // Agar forma / modal ID berilgan bo'lsa, xatoni forma ichida ham ko'rsatish
    if (modalOrFormId) {
      this.showFormError(modalOrFormId, error);
    }
  }
};

// Toast notification system
const Toast = {
  container: null,
  recentToasts: new Map(),

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', title = null, duration = 3500) {
    if (!message) return;
    if (!this.container) this.init();

    // Deduplication: bir xil tur va matndagi bildirishnomani 2.2 soniya ichida qayta chiqarmaslik
    const key = `${type}:${String(message).trim()}`;
    const now = Date.now();
    const lastTime = this.recentToasts.get(key) || 0;
    if (now - lastTime < 2200) {
      return;
    }
    this.recentToasts.set(key, now);
    setTimeout(() => this.recentToasts.delete(key), 2500);

    // Ekranda bir vaqtning o'zida ko'pi bilan 3 ta toast ko'rsatish
    while (this.container && this.container.children.length >= 3) {
      this.container.removeChild(this.container.firstChild);
    }

    const titles = {
      success: 'Muvaffaqiyatli',
      error: 'Xatolik',
      warning: 'Ogohlantirish',
      info: 'Ma\'lumot'
    };

    const icons = {
      success: `<svg class="toast-icon" fill="none" stroke="#057a55" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      error: `<svg class="toast-icon" fill="none" stroke="#c81e1e" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      warning: `<svg class="toast-icon" fill="none" stroke="#9f580a" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
      info: `<svg class="toast-icon" fill="none" stroke="#1c64f2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      ${icons[type]}
      <div class="toast-content">
        <div class="toast-title">${Utils.escapeHtml(title || titles[type])}</div>
        <div class="toast-message">${Utils.escapeHtml(message)}</div>
      </div>
    `;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  },

  success(message, title) { this.show(message, 'success', title); },
  error(message, title) { this.show(message, 'error', title); },
  warning(message, title) { this.show(message, 'warning', title); },
  info(message, title) { this.show(message, 'info', title); }
};

// Confirm dialog
const Confirm = {
  show(message, title = 'Tasdiqlash', onConfirm) {
    let overlay = document.getElementById('confirm-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirm-overlay';
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-dialog">
          <h3 id="confirm-title" style="font-size:17px;font-weight:600;margin-bottom:10px"></h3>
          <p id="confirm-message" style="font-size:14px;color:var(--text-secondary);margin-bottom:24px"></p>
          <div style="display:flex;justify-content:flex-end;gap:12px">
            <button id="confirm-cancel" class="btn btn-secondary">Bekor qilish</button>
            <button id="confirm-ok" class="btn btn-danger">Tasdiqlash</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });

      document.getElementById('confirm-cancel').addEventListener('click', () => {
        overlay.classList.remove('active');
      });
    }

    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    overlay.classList.add('active');

    const okBtn = document.getElementById('confirm-ok');
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    newOkBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      if (onConfirm) onConfirm();
    });
  },

  setupAutoGrow(elementId, maxHeight = 140) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (!el) return;
    el.style.resize = 'none';
    const adjust = () => {
      el.style.height = 'auto';
      const targetHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = Math.max(targetHeight, 48) + 'px';
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    };
    el.addEventListener('input', adjust);
    adjust();
    setTimeout(adjust, 50);
  }
};

// Avtomatik ravishda barcha sana maydonlariga max={bugungi_sana} va kelajak sanani bloklashni ulash
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Utils.initDateConstraints());
  } else {
    Utils.initDateConstraints();
  }

  if (window.MutationObserver) {
    const dateObserver = new MutationObserver(() => {
      Utils.initDateConstraints();
    });
    dateObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
}
