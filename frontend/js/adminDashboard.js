document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAdmin()) return;

  // Sidebar navigation logic
  const links = document.querySelectorAll('.sidebar-menu a');
  const sections = document.querySelectorAll('.admin-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(sec => sec.style.display = 'none');
      document.getElementById(`section-${targetId}`).style.display = 'block';

      // Load data based on tab
      if (targetId === 'overview') loadOverview();
      if (targetId === 'packages') loadPackages();
      if (targetId === 'places') loadPlaces();
      if (targetId === 'gallery') loadGallery();
      if (targetId === 'bookings') loadBookings();
      if (targetId === 'users') loadUsers();
      if (targetId === 'contacts') loadContacts();
    });
  });

  // Initial load
  loadOverview();

  // --- Data Loading Functions ---

  async function loadOverview() {
    try {
      const [packages, places, bookings, users] = await Promise.all([
        fetchAPI('/packages'),
        fetchAPI('/places'),
        fetchAPI('/bookings/admin'),
        fetchAPI('/auth/admin/users')
      ]);

      document.getElementById('stat-packages').textContent = packages.length;
      document.getElementById('stat-places').textContent = places.length;
      document.getElementById('stat-bookings').textContent = bookings.length;
      document.getElementById('stat-users').textContent = users.length;
    } catch (error) {
      console.error(error);
    }
  }

  async function loadPackages() {
    try {
      const packages = await fetchAPI('/packages');
      const tbody = document.getElementById('admin-packages-tbody');
      tbody.innerHTML = '';
      packages.forEach(pkg => {
        tbody.innerHTML += `
          <tr>
            <td data-label="Title">${pkg.title}</td>
            <td data-label="Price">₹${pkg.price}</td>
            <td data-label="Category">${pkg.category}</td>
            <td data-label="Status">${pkg.status}</td>
            <td data-label="Actions">
              <button class="action-btn btn-edit" onclick='editPackage(${JSON.stringify(pkg).replace(/'/g, "&#39;")})'>Edit</button>
              <button class="action-btn btn-delete" onclick="deletePackage('${pkg._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  async function loadPlaces() {
    try {
      const places = await fetchAPI('/places');
      const tbody = document.getElementById('admin-places-tbody');
      tbody.innerHTML = '';
      places.forEach(place => {
        tbody.innerHTML += `
          <tr>
            <td data-label="Name">${place.name}</td>
            <td data-label="Category">${place.category}</td>
            <td data-label="Location">${place.location}</td>
            <td data-label="Status">${place.status}</td>
            <td data-label="Actions">
              <button class="action-btn btn-edit" onclick='editPlace(${JSON.stringify(place).replace(/'/g, "&#39;")})'>Edit</button>
              <button class="action-btn btn-delete" onclick="deletePlace('${place._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  async function loadGallery() {
    try {
      const gallery = await fetchAPI('/gallery');
      const tbody = document.getElementById('admin-gallery-tbody');
      tbody.innerHTML = '';
      gallery.forEach(img => {
        tbody.innerHTML += `
          <tr>
            <td data-label="Image"><img src="${img.image}" height="50" style="border-radius:4px;"></td>
            <td data-label="Title">${img.title}</td>
            <td data-label="Category">${img.category}</td>
            <td data-label="Actions">
              <button class="action-btn btn-edit" onclick='editGallery(${JSON.stringify(img).replace(/'/g, "&#39;")})'>Edit</button>
              <button class="action-btn btn-delete" onclick="deleteGallery('${img._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  async function loadBookings() {
    try {
      const bookings = await fetchAPI('/bookings/admin');
      const tbody = document.getElementById('admin-bookings-tbody');
      tbody.innerHTML = '';
      bookings.forEach(b => {
        const pkgTitle = b.packageId ? b.packageId.title : 'Deleted';
        const userName = b.userId ? b.userId.name : 'Unknown';
        const tDate = new Date(b.travelDate).toLocaleDateString();
        tbody.innerHTML += `
          <tr>
            <td data-label="ID">${b._id.substring(b._id.length - 6)}</td>
            <td data-label="User">${userName}<br><small>${b.email}</small></td>
            <td data-label="Package">${pkgTitle}</td>
            <td data-label="Date">${tDate}</td>
            <td data-label="Status"><strong>${b.status}</strong></td>
            <td data-label="Actions">
              <button class="action-btn btn-edit" onclick='viewBookingSlip(${JSON.stringify(b).replace(/'/g, "&#39;")})'>View Details</button>
            </td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  async function loadUsers() {
    try {
      const users = await fetchAPI('/auth/admin/users');
      const tbody = document.getElementById('admin-users-tbody');
      tbody.innerHTML = '';
      users.forEach(u => {
        tbody.innerHTML += `
          <tr>
            <td data-label="Name">${u.name}</td>
            <td data-label="Email">${u.email}</td>
            <td data-label="Role">${u.role}</td>
            <td data-label="Joined">${new Date(u.createdAt).toLocaleDateString()}</td>
            <td data-label="Actions">
              <button class="action-btn btn-edit" onclick='editUser(${JSON.stringify(u).replace(/'/g, "&#39;")})'>View/Edit Profile</button>
            </td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  async function loadContacts() {
    try {
      const contacts = await fetchAPI('/contact/admin');
      const tbody = document.getElementById('admin-contacts-tbody');
      tbody.innerHTML = '';
      contacts.forEach(c => {
        tbody.innerHTML += `
          <tr>
            <td data-label="Name">${c.name}<br><small>${c.phone}</small></td>
            <td data-label="Email">${c.email}</td>
            <td data-label="Message">${c.message}</td>
            <td data-label="Date">${new Date(c.createdAt).toLocaleDateString()}</td>
          </tr>
        `;
      });
    } catch (error) { console.error(error); }
  }

  // Global actions for buttons generated dynamically
  window.deletePackage = async (id) => {
    if(confirm('Are you sure you want to delete this package?')) {
      try {
        await fetchAPI(`/packages/admin/${id}`, { method: 'DELETE' });
        showAlert('Package deleted', 'success');
        loadPackages();
      } catch (err) { showAlert(err.message, 'danger'); }
    }
  };

  window.deletePlace = async (id) => {
    if(confirm('Are you sure you want to delete this place?')) {
      try {
        await fetchAPI(`/places/admin/${id}`, { method: 'DELETE' });
        showAlert('Place deleted', 'success');
        loadPlaces();
      } catch (err) { showAlert(err.message, 'danger'); }
    }
  };

  window.deleteGallery = async (id) => {
    if(confirm('Delete this image?')) {
      try {
        await fetchAPI(`/gallery/admin/${id}`, { method: 'DELETE' });
        showAlert('Image deleted', 'success');
        loadGallery();
      } catch (err) { showAlert(err.message, 'danger'); }
    }
  };

  // Booking Modal / Slip
  const modal = document.getElementById('bookingModal');
  const span = document.getElementById('close-booking-modal');
  const form = document.getElementById('booking-status-form');
  const cancelBookingBtn = document.getElementById('cancel-booking-btn');
  const printSlipBtn = document.getElementById('btn-print-slip');

  if(cancelBookingBtn) {
    cancelBookingBtn.onclick = () => modal.classList.remove('show');
  }

  if(printSlipBtn) {
    printSlipBtn.onclick = () => window.print();
  }

  window.viewBookingSlip = (b) => {
    document.getElementById('slip-id').textContent = b._id.substring(b._id.length - 8);
    document.getElementById('slip-created').textContent = new Date(b.createdAt).toLocaleString();
    document.getElementById('slip-updated').textContent = b.updatedAt ? new Date(b.updatedAt).toLocaleString() : new Date(b.createdAt).toLocaleString();
    
    let statusBadgeColor = 'badge-yellow';
    if(b.status === 'Confirmed') statusBadgeColor = 'badge-green';
    if(b.status === 'Cancelled') statusBadgeColor = 'badge-red';
    if(b.status === 'Completed') statusBadgeColor = 'badge-blue';
    
    const badge = document.getElementById('slip-status-badge');
    badge.className = `badge ${statusBadgeColor}`;
    badge.textContent = b.status;

    document.getElementById('slip-name').textContent = b.name || (b.userId && b.userId.name ? b.userId.name : 'Unknown');
    document.getElementById('slip-email').textContent = b.email || (b.userId && b.userId.email ? b.userId.email : 'Unknown');
    document.getElementById('slip-phone').textContent = b.phone || 'N/A';

    document.getElementById('slip-package').textContent = b.packageId ? b.packageId.title : 'Package Deleted';
    document.getElementById('slip-price').textContent = b.packageId && b.packageId.price ? b.packageId.price : 'N/A';
    document.getElementById('slip-travelDate').textContent = new Date(b.travelDate).toLocaleDateString();
    document.getElementById('slip-persons').textContent = b.persons;
    
    if (b.packageId && b.packageId.price) {
      document.getElementById('slip-total').textContent = Number(b.packageId.price) * Number(b.persons);
    } else {
      document.getElementById('slip-total').textContent = 'N/A';
    }

    if (b.message) {
      document.getElementById('slip-message-container').style.display = 'block';
      document.getElementById('slip-message').textContent = b.message;
    } else {
      document.getElementById('slip-message-container').style.display = 'none';
    }

    // Set hidden inputs for status update form
    document.getElementById('edit-booking-id').value = b._id;
    document.getElementById('edit-booking-status').value = b.status;

    modal.classList.add('show');
  };

  span.onclick = () => modal.classList.remove('show');
  window.onclick = (e) => { if (e.target == modal) modal.classList.remove('show'); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-booking-id').value;
    const status = document.getElementById('edit-booking-status').value;

    try {
      await fetchAPI(`/bookings/admin/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      showAlert('Status updated', 'success');
      modal.classList.remove('show');
      loadBookings();
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  });

  // Add Modals functionality
  const packageModal = document.getElementById('packageModal');
  const placeModal = document.getElementById('placeModal');
  const galleryModal = document.getElementById('galleryModal');
  const userModal = document.getElementById('userProfileModal');

  document.getElementById('close-package-modal').onclick = () => packageModal.classList.remove('show');
  document.getElementById('close-place-modal').onclick = () => placeModal.classList.remove('show');
  document.getElementById('close-gallery-modal').onclick = () => galleryModal.classList.remove('show');
  if(document.getElementById('close-user-modal')) {
    document.getElementById('close-user-modal').onclick = () => userModal.classList.remove('show');
  }
  
  if(document.getElementById('cancel-package-btn')) {
    document.getElementById('cancel-package-btn').onclick = () => packageModal.classList.remove('show');
  }
  if(document.getElementById('cancel-place-btn')) {
    document.getElementById('cancel-place-btn').onclick = () => placeModal.classList.remove('show');
  }

  if(document.getElementById('cancel-gallery-btn')) {
    document.getElementById('cancel-gallery-btn').onclick = () => galleryModal.classList.remove('show');
  }
  if(document.getElementById('cancel-user-btn')) {
    document.getElementById('cancel-user-btn').onclick = () => userModal.classList.remove('show');
  }

  // Open Modals for Adding
  document.getElementById('btn-add-package').addEventListener('click', () => {
    document.getElementById('package-form').reset();
    document.getElementById('pkg-id').value = '';
    document.getElementById('package-modal-title').textContent = 'Add Package';
    if(document.getElementById('package-form-error')) document.getElementById('package-form-error').style.display = 'none';
    packageModal.classList.add('show');
  });

  document.getElementById('btn-add-place').addEventListener('click', () => {
    document.getElementById('place-form').reset();
    document.getElementById('place-id').value = '';
    document.getElementById('place-modal-title').textContent = 'Add Place';
    if(document.getElementById('place-form-error')) document.getElementById('place-form-error').style.display = 'none';
    placeModal.classList.add('show');
  });

  document.getElementById('btn-add-gallery').addEventListener('click', () => {
    document.getElementById('gallery-form').reset();
    document.getElementById('gallery-id').value = '';
    document.getElementById('gallery-modal-title').textContent = 'Add Gallery Image';
    if(document.getElementById('gallery-form-error')) document.getElementById('gallery-form-error').style.display = 'none';
    galleryModal.classList.add('show');
  });

  // Edit logic
  
  // Price Auto calculation
  function calculateFinalPrice() {
    const origPrice = parseFloat(document.getElementById('pkg-originalPrice').value);
    const discount = parseFloat(document.getElementById('pkg-discountPercent').value);
    if (!isNaN(origPrice)) {
      if (!isNaN(discount) && discount > 0) {
        const finalPrice = origPrice - (origPrice * discount / 100);
        document.getElementById('pkg-price').value = Math.round(finalPrice);
      } else {
        document.getElementById('pkg-price').value = Math.round(origPrice);
      }
    }
  }
  document.getElementById('pkg-originalPrice').addEventListener('input', calculateFinalPrice);
  document.getElementById('pkg-discountPercent').addEventListener('input', calculateFinalPrice);

  window.editPackage = (pkg) => {
    document.getElementById('package-form').reset();
    if(document.getElementById('package-form-error')) document.getElementById('package-form-error').style.display = 'none';
    document.getElementById('pkg-id').value = pkg._id;
    document.getElementById('package-modal-title').textContent = 'Edit Package';
    document.getElementById('pkg-title').value = pkg.title;
    document.getElementById('pkg-originalPrice').value = pkg.originalPrice || '';
    document.getElementById('pkg-discountPercent').value = pkg.discountPercent || '';
    document.getElementById('pkg-price').value = pkg.price;
    document.getElementById('pkg-offerTag').value = pkg.offerTag || '';
    document.getElementById('pkg-duration').value = pkg.duration;
    document.getElementById('pkg-category').value = pkg.category;
    document.getElementById('pkg-location').value = pkg.location;
    
    document.getElementById('pkg-image').value = pkg.image;
    if(pkg.images && pkg.images.length > 0) {
      document.getElementById('pkg-image').value = pkg.images[0] || '';
      document.getElementById('pkg-image2').value = pkg.images[1] || '';
      document.getElementById('pkg-image3').value = pkg.images[2] || '';
      document.getElementById('pkg-image4').value = pkg.images[3] || '';
      document.getElementById('pkg-image5').value = pkg.images[4] || '';
    } else {
      document.getElementById('pkg-image2').value = '';
      document.getElementById('pkg-image3').value = '';
      document.getElementById('pkg-image4').value = '';
      document.getElementById('pkg-image5').value = '';
    }

    document.getElementById('pkg-description').value = pkg.description;
    document.getElementById('pkg-placesCovered').value = pkg.placesCovered.join(', ');
    document.getElementById('pkg-hotelIncluded').checked = pkg.hotelIncluded;
    document.getElementById('pkg-foodIncluded').checked = pkg.foodIncluded;
    document.getElementById('pkg-transportIncluded').checked = pkg.transportIncluded;
    
    // Join by double newline for the textarea
    document.getElementById('pkg-itinerary').value = pkg.itinerary.join('\n\n');
    packageModal.classList.add('show');
  };

  window.editPlace = (place) => {
    document.getElementById('place-form').reset();
    if(document.getElementById('place-form-error')) document.getElementById('place-form-error').style.display = 'none';
    document.getElementById('place-id').value = place._id;
    document.getElementById('place-modal-title').textContent = 'Edit Place';
    document.getElementById('place-name').value = place.name;
    document.getElementById('place-category').value = place.category;
    document.getElementById('place-image').value = place.image;
    document.getElementById('place-description').value = place.description;
    document.getElementById('place-location').value = place.location;
    document.getElementById('place-about').value = place.about || '';
    document.getElementById('place-bestTime').value = place.bestTime;
    document.getElementById('place-entryFee').value = place.entryFee;
    document.getElementById('place-status').value = place.status || 'active';
    placeModal.classList.add('show');
  };

  window.editGallery = (img) => {
    document.getElementById('gallery-form').reset();
    if(document.getElementById('gallery-form-error')) document.getElementById('gallery-form-error').style.display = 'none';
    document.getElementById('gallery-id').value = img._id;
    document.getElementById('gallery-modal-title').textContent = 'Edit Gallery Image';
    document.getElementById('gallery-title').value = img.title;
    document.getElementById('gallery-image').value = img.image;
    document.getElementById('gallery-category').value = img.category;
    document.getElementById('gallery-about').value = img.about || '';
    galleryModal.classList.add('show');
  };

  // User Edit profile logic
  window.editUser = (user) => {
    document.getElementById('user-profile-form').reset();
    if(document.getElementById('user-form-error')) document.getElementById('user-form-error').style.display = 'none';
    
    document.getElementById('user-id').value = user._id;
    document.getElementById('user-name').value = user.name || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-phone').value = user.phone || '';
    document.getElementById('user-role').value = user.role || '';
    document.getElementById('user-address').value = user.address || '';
    document.getElementById('user-about').value = user.about || '';
    document.getElementById('user-profileImage').value = user.profileImage || '';
    
    const preview = document.getElementById('user-avatar-preview');
    const initials = document.getElementById('user-avatar-initials');
    
    if (user.profileImage) {
      preview.src = user.profileImage;
      preview.style.display = 'block';
      initials.style.display = 'none';
    } else {
      preview.style.display = 'none';
      initials.style.display = 'flex';
      initials.textContent = user.name ? user.name.charAt(0).toUpperCase() : '?';
    }

    // Live update preview when input changes
    document.getElementById('user-profileImage').oninput = (e) => {
      if(e.target.value) {
        preview.src = e.target.value;
        preview.style.display = 'block';
        initials.style.display = 'none';
      } else {
        preview.style.display = 'none';
        initials.style.display = 'flex';
      }
    };
    
    userModal.classList.add('show');
  };

  // Submissions
  document.getElementById('package-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pkg-id').value;
    
    const img1 = document.getElementById('pkg-image').value;
    const img2 = document.getElementById('pkg-image2').value;
    const img3 = document.getElementById('pkg-image3').value;
    const img4 = document.getElementById('pkg-image4').value;
    const img5 = document.getElementById('pkg-image5').value;
    
    const imagesArray = [img1, img2, img3, img4, img5].filter(url => url.trim() !== '');

    const body = {
      title: document.getElementById('pkg-title').value,
      originalPrice: document.getElementById('pkg-originalPrice').value ? Number(document.getElementById('pkg-originalPrice').value) : undefined,
      discountPercent: document.getElementById('pkg-discountPercent').value ? Number(document.getElementById('pkg-discountPercent').value) : undefined,
      price: document.getElementById('pkg-price').value,
      offerTag: document.getElementById('pkg-offerTag').value,
      duration: document.getElementById('pkg-duration').value,
      category: document.getElementById('pkg-category').value,
      location: document.getElementById('pkg-location').value,
      image: img1,
      images: imagesArray,
      description: document.getElementById('pkg-description').value,
      placesCovered: document.getElementById('pkg-placesCovered').value.split(',').map(s=>s.trim()),
      hotelIncluded: document.getElementById('pkg-hotelIncluded').checked,
      foodIncluded: document.getElementById('pkg-foodIncluded').checked,
      transportIncluded: document.getElementById('pkg-transportIncluded').checked,
      // Split by double newline
      itinerary: document.getElementById('pkg-itinerary').value.split('\n\n').map(s=>s.trim()).filter(s => s !== '')
    };
    try {
      if (id) {
        await fetchAPI(`/packages/admin/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showAlert('Package updated', 'success');
      } else {
        await fetchAPI('/packages/admin', { method: 'POST', body: JSON.stringify(body) });
        showAlert('Package added', 'success');
      }
      packageModal.classList.remove('show');
      loadPackages();
      loadOverview();
    } catch (err) { 
      const errBox = document.getElementById('package-form-error');
      if(errBox) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      } else {
        showAlert(err.message, 'danger'); 
      }
    }
  });

  document.getElementById('place-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('place-id').value;
    const body = {
      name: document.getElementById('place-name').value,
      category: document.getElementById('place-category').value,
      image: document.getElementById('place-image').value,
      description: document.getElementById('place-description').value,
      location: document.getElementById('place-location').value,
      about: document.getElementById('place-about').value,
      bestTime: document.getElementById('place-bestTime').value,
      entryFee: document.getElementById('place-entryFee').value,
      status: document.getElementById('place-status').value
    };
    try {
      if (id) {
        await fetchAPI(`/places/admin/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showAlert('Place updated', 'success');
      } else {
        await fetchAPI('/places/admin', { method: 'POST', body: JSON.stringify(body) });
        showAlert('Place added', 'success');
      }
      placeModal.classList.remove('show');
      loadPlaces();
      loadOverview();
    } catch (err) { 
      const errBox = document.getElementById('place-form-error');
      if(errBox) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      } else {
        showAlert(err.message, 'danger'); 
      }
    }
  });

  document.getElementById('gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('gallery-id').value;
    const body = {
      title: document.getElementById('gallery-title').value,
      image: document.getElementById('gallery-image').value,
      category: document.getElementById('gallery-category').value,
      about: document.getElementById('gallery-about').value
    };
    try {
      if (id) {
        await fetchAPI(`/gallery/admin/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showAlert('Gallery image updated', 'success');
      } else {
        await fetchAPI('/gallery/admin', { method: 'POST', body: JSON.stringify(body) });
        showAlert('Gallery image added', 'success');
      }
      galleryModal.classList.remove('show');
      loadGallery();
    } catch (err) {
      const errBox = document.getElementById('gallery-form-error');
      if(errBox) {
        errBox.textContent = err.message;
        errBox.style.display = 'block';
      } else {
        showAlert(err.message, 'danger'); 
      }
    }
  });

  if(document.getElementById('user-profile-form')) {
    document.getElementById('user-profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('user-id').value;
      const body = {
        name: document.getElementById('user-name').value,
        phone: document.getElementById('user-phone').value,
        address: document.getElementById('user-address').value,
        about: document.getElementById('user-about').value,
        profileImage: document.getElementById('user-profileImage').value
      };
      try {
        await fetchAPI(`/auth/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        showAlert('User profile updated', 'success');
        userModal.classList.remove('show');
        loadUsers();
      } catch (err) {
        const errBox = document.getElementById('user-form-error');
        if(errBox) {
          errBox.textContent = err.message;
          errBox.style.display = 'block';
        } else {
          showAlert(err.message, 'danger'); 
        }
      }
    });
  }
});
