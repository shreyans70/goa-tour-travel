document.addEventListener('DOMContentLoaded', async () => {
  try {
    const packages = await fetchAPI('/packages');
    const packagesGrid = document.getElementById('packages-grid');
    
    if (packagesGrid) {
      if (packages.length === 0) {
        packagesGrid.innerHTML = '<p>No packages available at the moment.</p>';
        return;
      }
      
      packages.forEach(pkg => {
        packagesGrid.innerHTML += `
          <div class="card fade-in">
            <div class="card-img-container">
              ${pkg.offerTag ? `<span class="offer-tag">${pkg.offerTag}</span>` : ''}
              <img src="${pkg.image}" alt="${pkg.title}" class="card-img hover-zoom">
            </div>
            <div class="card-body">
              <span class="badge badge-blue">${pkg.category}</span>
              <h3 class="card-title" style="margin-top: 10px;">${pkg.title}</h3>
              <p class="card-text">${pkg.duration} | ${pkg.location}</p>
              <div class="card-footer" style="align-items: flex-end;">
                <div class="price-container">
                  ${pkg.originalPrice ? `<span class="original-price">₹${pkg.originalPrice}</span>` : ''}
                  <div>
                    <span class="price">₹${pkg.price}</span>
                    ${pkg.discountPercent ? `<span class="discount-badge">${pkg.discountPercent}% OFF</span>` : ''}
                  </div>
                </div>
                <a href="package-details.html?id=${pkg._id}" class="btn btn-primary">Details</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Error loading packages:', error);
  }
});
