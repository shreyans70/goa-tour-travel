const API_BASE_URL = 'http://localhost:5000/api';

// Utility: Show Alert
const showAlert = (message, type = 'success') => {
  let alertDiv = document.getElementById('global-alert');
  if (!alertDiv) {
    alertDiv = document.createElement('div');
    alertDiv.id = 'global-alert';
    alertDiv.className = 'alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '250px';
    document.body.appendChild(alertDiv);
  }
  
  alertDiv.className = `alert alert-${type} show`;
  alertDiv.textContent = message;
  
  setTimeout(() => {
    alertDiv.className = 'alert';
  }, 3000);
};

// Utility: Fetch API wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const isAdminContext = window.location.href.includes('admin');
  const token = isAdminContext ? localStorage.getItem('adminToken') : localStorage.getItem('userToken');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Authentication state management
const checkAuth = () => {
  // Clear old keys to avoid backward compatibility issues
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  const userToken = localStorage.getItem('userToken');
  const userData = JSON.parse(localStorage.getItem('userData'));

  const adminToken = localStorage.getItem('adminToken');
  const adminData = JSON.parse(localStorage.getItem('adminData'));

  const authLinks = document.getElementById('auth-links');
  const guestLinks = document.getElementById('guest-links');
  const navMenu = document.getElementById('nav-menu');
  const isAdminPage = window.location.href.includes('admin');

  if (isAdminPage) {
    if (guestLinks) guestLinks.style.display = 'none';
    if (adminToken && adminData) {
      if (authLinks) {
        authLinks.style.display = 'flex';
        authLinks.innerHTML = `
          <li><a href="admin-dashboard.html" class="btn btn-primary" style="margin-left: 20px;">Admin Dashboard</a></li>
          <li><a href="#" id="logout-btn" class="btn btn-danger" style="margin-left: 10px;">Logout</a></li>
        `;
        if (navMenu) {
          Array.from(navMenu.children).forEach(li => {
            if (li.id !== 'auth-links' && li.id !== 'guest-links' && li.id !== 'hamburger' && li.tagName === 'LI') {
               li.style.display = 'none';
            }
          });
        }
      }
    } else {
      if (authLinks) authLinks.style.display = 'none';
    }
  } else {
    // Public/User pages
    let customAuthLinks = '';
    
    if (userToken && userData) {
      customAuthLinks += `<li><a href="user-dashboard.html" class="btn btn-primary" style="margin-left: 20px;">My Dashboard</a></li>`;
    }
    
    if (adminToken && adminData) {
      customAuthLinks += `<li><a href="admin-dashboard.html" class="btn btn-danger" style="margin-left: 10px;">Admin Dashboard</a></li>`;
    }

    if (customAuthLinks) {
      customAuthLinks += `<li><a href="#" id="logout-btn" class="btn btn-outline" style="margin-left: 10px; background: white; color: black;">Logout</a></li>`;
      if (guestLinks) guestLinks.style.display = 'none';
      if (authLinks) {
        authLinks.style.display = 'flex';
        authLinks.innerHTML = customAuthLinks;
      }
    } else {
      if (guestLinks) {
        guestLinks.style.display = 'flex';
        guestLinks.innerHTML = `
          <li><a href="user-login.html" class="btn btn-primary">User Login</a></li>
          <li><a href="admin-login.html" class="btn btn-outline" style="margin-left: 10px; background: white; color: black;">Admin Login</a></li>
        `;
      }
      if (authLinks) authLinks.style.display = 'none';
    }
  }
  
  // Rebind logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
};

const logout = () => {
  const isAdminPage = window.location.href.includes('admin');
  if (isAdminPage) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = 'admin-login.html';
  } else {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = 'user-login.html';
  }
};

const requireLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  const token = localStorage.getItem('userToken');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('userData')); } catch(e) {}
  
  if (!token || !user || user.role !== 'user') {
    window.location.replace('user-login.html');
    return false;
  }
  return true;
};

const requireAdmin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  const token = localStorage.getItem('adminToken');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('adminData')); } catch(e) {}
  
  if (!token || !user || user.role !== 'admin') {
    window.location.replace('admin-login.html');
    return false;
  }
  return true;
};

// Initialize common DOM interactions
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Logout listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
