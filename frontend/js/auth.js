document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('userData'));
  if (token && user && user.role === 'user') {
    window.location.replace('index.html');
    return;
  }

  // Handle Signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (password !== confirmPassword) {
        return showAlert('Passwords do not match', 'danger');
      }

      try {
        const data = await fetchAPI('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ name, email, password })
        });
        
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));

        showAlert('Registration successful!', 'success');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);

      } catch (error) {
        showAlert(error.message, 'danger');
      }
    });
  }
});
