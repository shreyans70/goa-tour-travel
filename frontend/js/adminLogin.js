document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('adminData'));
  } catch (e) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  if (token && user && user.role === 'admin') {
    window.location.replace('admin-dashboard.html');
    return;
  } else if (!token || !user) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const data = await fetchAPI('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        
        if (data.role !== 'admin') {
          showAlert('Access denied. Admin only.', 'danger');
          setTimeout(() => {
            window.location.href = 'user-login.html';
          }, 1500);
          return;
        }

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));

        showAlert('Admin Login successful!', 'success');
        
        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 1500);

      } catch (error) {
        showAlert(error.message, 'danger');
      }
    });
  }
});
