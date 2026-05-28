document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('userData'));
  } catch (e) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  if (token && user && user.role === 'user') {
    window.location.replace('index.html');
    return;
  } else if (!token || !user) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  const loginForm = document.getElementById('user-login-form');
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
        
        if (data.role === 'admin') {
          showAlert('Please use Admin Login', 'danger');
          setTimeout(() => {
            window.location.href = 'admin-login.html';
          }, 1500);
          return;
        }

        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));

        showAlert('Login successful!', 'success');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);

      } catch (error) {
        showAlert(error.message, 'danger');
      }
    });
  }
});
