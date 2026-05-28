document.addEventListener('DOMContentLoaded', async () => {
  if (!requireLogin()) return;

  const user = JSON.parse(localStorage.getItem('userData'));
  if (user.role === 'admin') {
    window.location.replace('admin-dashboard.html');
    return;
  }

  document.getElementById('welcome-text').textContent = `Welcome, ${user.name}!`;

  // Fetch latest profile from DB to get newly added fields (phone, address, etc)
  try {
    const fullProfile = await fetchAPI('/auth/me');
    
    document.getElementById('profile-name').textContent = fullProfile.name;
    document.getElementById('profile-email').textContent = fullProfile.email;
    document.getElementById('profile-role').textContent = fullProfile.role;
    document.getElementById('profile-phone').textContent = fullProfile.phone || 'Not provided';
    document.getElementById('profile-address').textContent = fullProfile.address || 'Not provided';
    document.getElementById('profile-about').textContent = fullProfile.about || 'Not provided';

    const preview = document.getElementById('dashboard-avatar-preview');
    const initials = document.getElementById('dashboard-avatar-initials');
    
    if (fullProfile.profileImage) {
      preview.src = fullProfile.profileImage;
      preview.style.display = 'block';
      initials.style.display = 'none';
    } else {
      preview.style.display = 'none';
      initials.style.display = 'flex';
      initials.textContent = fullProfile.name ? fullProfile.name.charAt(0).toUpperCase() : '?';
    }
  } catch (err) {
    console.error('Error fetching profile', err);
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = user.role;
  }

  // Navigation
  const navProfile = document.getElementById('nav-profile');
  const navBookings = document.getElementById('nav-bookings');
  const sectionProfile = document.getElementById('section-profile');
  const sectionBookings = document.getElementById('section-bookings');
  const notificationBtn = document.getElementById('notification-btn');

  navProfile.addEventListener('click', (e) => {
    e.preventDefault();
    navProfile.classList.add('active');
    navBookings.classList.remove('active');
    sectionProfile.style.display = 'block';
    sectionBookings.style.display = 'none';
  });

  navBookings.addEventListener('click', (e) => {
    e.preventDefault();
    navBookings.classList.add('active');
    navProfile.classList.remove('active');
    sectionBookings.style.display = 'block';
    sectionProfile.style.display = 'none';
    loadMyBookings();
  });

  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navBookings.click();
    });
  }

  async function loadMyBookings() {
    try {
      const bookings = await fetchAPI('/bookings/my');
      
      // Update notification badge
      const badge = document.getElementById('notification-badge');
      if (badge) {
        if (bookings.length > 0) {
          badge.textContent = bookings.length;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }

      const tbody = document.getElementById('bookings-tbody');
      if(!tbody) return;
      
      if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">You have no bookings yet.</td></tr>';
        return;
      }

      tbody.innerHTML = '';
      bookings.forEach(b => {
        const pkgTitle = b.packageId ? b.packageId.title : 'Package Deleted';
        const tDate = new Date(b.travelDate).toLocaleDateString();
        const updateDate = b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : new Date(b.createdAt).toLocaleDateString();
        
        let statusBadge = 'badge-yellow'; // Pending
        let statusMessage = 'Your booking request is waiting for admin approval.';
        
        if (b.status === 'Confirmed') {
          statusBadge = 'badge-green';
          statusMessage = 'Your booking has been confirmed by admin.';
        } else if (b.status === 'Cancelled') {
          statusBadge = 'badge-red';
          statusMessage = 'Your booking has been rejected/cancelled by admin.';
        } else if (b.status === 'Completed') {
          statusBadge = 'badge-blue';
          statusMessage = 'Your trip has been completed.';
        }

        tbody.innerHTML += `
          <tr>
            <td data-label="Package"><strong>${pkgTitle}</strong></td>
            <td data-label="Travel Date">${tDate}</td>
            <td data-label="Persons">${b.persons}</td>
            <td data-label="Status">
              <span class="badge ${statusBadge}">${b.status}</span><br>
              <small style="color: #666; display: block; margin-top: 5px;">${statusMessage}</small>
              <small style="color: #999; display: block; margin-top: 5px;">Last updated: ${updateDate}</small>
            </td>
            <td data-label="Booked On">${new Date(b.createdAt).toLocaleDateString()}</td>
          </tr>
        `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Load initially to populate badge
  loadMyBookings();
});
