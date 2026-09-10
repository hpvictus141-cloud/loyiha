// Real-time notification and update system

class RealtimeManager {
  constructor() {
    this.updateInterval = null;
    this.notificationCheckInterval = null;
    this.lastUpdateTime = null;
    this.subscribers = new Map();
  }

  init() {
    // Start periodic updates
    this.startPeriodicUpdates();
    
    // Check for new notifications
    this.startNotificationCheck();
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  startPeriodicUpdates() {
    // Update dashboard data every 30 seconds
    this.updateInterval = setInterval(() => {
      this.triggerUpdate('dashboard');
    }, 30000);
  }

  startNotificationCheck() {
    // Check for notifications every 60 seconds
    this.notificationCheckInterval = setInterval(() => {
      this.checkNotifications();
    }, 60000);
  }

  async checkNotifications() {
    try {
      // Simulate notification check (replace with actual API call)
      const notifications = await this.fetchNotifications();
      
      if (notifications && notifications.length > 0) {
        this.showNotificationBadge(notifications.length);
        
        // Show toast for new critical notifications
        notifications.forEach(notif => {
          if (notif.priority === 'high' && !notif.read) {
            Toast.info(notif.message, 5000);
          }
        });
      }
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  }

  async fetchNotifications() {
    // Placeholder for actual implementation
    // In production, this would call your API
    return [];
  }

  showNotificationBadge(count) {
    const badge = document.querySelector('.notification-dot');
    if (badge && count > 0) {
      badge.style.display = 'block';
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  triggerUpdate(event) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Subscriber callback error:', error);
        }
      });
    }
  }

  pause() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
      this.notificationCheckInterval = null;
    }
  }

  resume() {
    if (!this.updateInterval) {
      this.startPeriodicUpdates();
    }
    if (!this.notificationCheckInterval) {
      this.startNotificationCheck();
    }
  }

  destroy() {
    this.pause();
    this.subscribers.clear();
  }
}

// Animated counter for stat cards
class AnimatedCounter {
  static animateValue(element, start, end, duration = 1000) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      
      element.textContent = Math.round(current).toLocaleString();
    }, 16);
  }

  static animateAll(selector = '.stat-card-value') {
    document.querySelectorAll(selector).forEach(el => {
      const finalValue = parseInt(el.getAttribute('data-value') || el.textContent.replace(/,/g, ''));
      if (!isNaN(finalValue)) {
        this.animateValue(el, 0, finalValue, 1500);
      }
    });
  }
}

// Enhanced search functionality
class SmartSearch {
  constructor(inputSelector, resultsContainerSelector) {
    this.input = document.querySelector(inputSelector);
    this.resultsContainer = document.querySelector(resultsContainerSelector);
    this.searchTimeout = null;
    this.cache = new Map();
    
    if (this.input) {
      this.init();
    }
  }

  init() {
    this.input.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        this.hideResults();
        return;
      }
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.resultsContainer.contains(e.target)) {
        this.hideResults();
      }
    });
  }

  async performSearch(query) {
    // Check cache first
    if (this.cache.has(query)) {
      this.displayResults(this.cache.get(query));
      return;
    }

    try {
      // Simulate search (replace with actual API call)
      const results = await this.fetchResults(query);
      this.cache.set(query, results);
      this.displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
      this.displayError();
    }
  }

  async fetchResults(query) {
    // Placeholder for actual implementation
    return [];
  }

  displayResults(results) {
    if (!this.resultsContainer) return;
    
    if (results.length === 0) {
      this.resultsContainer.innerHTML = '<div class="search-no-results">Natija topilmadi</div>';
    } else {
      this.resultsContainer.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="navigateTo('${result.url}')">
          <div class="search-result-icon">${result.icon}</div>
          <div class="search-result-content">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-desc">${result.description}</div>
          </div>
        </div>
      `).join('');
    }
    
    this.showResults();
  }

  displayError() {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = '<div class="search-error">Xatolik yuz berdi</div>';
    this.showResults();
  }

  showResults() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'block';
    }
  }

  hideResults() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'none';
    }
  }
}

// Export for use in other files
window.RealtimeManager = RealtimeManager;
window.AnimatedCounter = AnimatedCounter;
window.SmartSearch = SmartSearch;
