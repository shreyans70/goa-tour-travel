document.addEventListener('DOMContentLoaded', async () => {
  try {
    const packages = await fetchAPI('/packages');
    const places = await fetchAPI('/places');

    // Render top 3 Best Deals
    const dealsGrid = document.getElementById('deals-grid');
    if (dealsGrid) {
      // Find packages with highest discount
      const deals = packages.filter(p => p.discountPercent).sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 3);
      // Fallback to any packages if no discounts
      const displayPackages = deals.length > 0 ? deals : packages.slice(0, 3);
      
      displayPackages.forEach(pkg => {
        dealsGrid.innerHTML += `
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

    // Render top 3 places
    const placesGrid = document.getElementById('places-grid');
    if (placesGrid) {
      places.slice(0, 3).forEach(place => {
        placesGrid.innerHTML += `
          <div class="card">
            <img src="${place.image}" alt="${place.name}" class="card-img">
            <div class="card-body">
              <span class="badge badge-green">${place.category}</span>
              <h3 class="card-title" style="margin-top: 10px;">${place.name}</h3>
              <p class="card-text">${place.location}</p>
              <div class="card-footer">
                <a href="place-details.html?id=${place._id}" class="btn btn-primary">View</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Error loading home data:', error);
  }
});
