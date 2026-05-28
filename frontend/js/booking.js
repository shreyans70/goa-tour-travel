document.addEventListener('DOMContentLoaded', async () => {
  if (!requireLogin()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const pkgId = urlParams.get('pkgId');
  const packageIdInput = document.getElementById('packageId');
  
  if (!pkgId) {
    showAlert('No package selected for booking.', 'danger');
    return;
  }

  packageIdInput.value = pkgId;

  // Prefill user data
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user) {
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
  }

  // Fetch package title to display
  try {
    const pkg = await fetchAPI(`/packages/${pkgId}`);
    document.getElementById('pkg-title-display').textContent = `Package: ${pkg.title}`;
  } catch (error) {
    console.error(error);
  }

  const bookingForm = document.getElementById('booking-form');
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingData = {
      packageId: document.getElementById('packageId').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      travelDate: document.getElementById('travelDate').value,
      persons: document.getElementById('persons').value,
      message: document.getElementById('message').value
    };

    try {
      await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });

      showAlert('Your booking request has been sent successfully. Admin will contact you soon.', 'success');
      
      setTimeout(() => {
        window.location.href = 'user-dashboard.html';
      }, 2500);
      
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });
});
