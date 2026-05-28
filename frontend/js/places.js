document.addEventListener('DOMContentLoaded', async () => {
  try {
    const places = await fetchAPI('/places');
    const placesGrid = document.getElementById('places-grid');
    
    if (placesGrid) {
      if (places.length === 0) {
        placesGrid.innerHTML = '<p>No places available at the moment.</p>';
        return;
      }
      
      places.forEach(place => {
        placesGrid.innerHTML += `
          <div class="card">
            <img src="${place.image}" alt="${place.name}" class="card-img">
            <div class="card-body">
              <span class="badge badge-green">${place.category}</span>
              <h3 class="card-title" style="margin-top: 10px;">${place.name}</h3>
              <p class="card-text">${place.location}</p>
              <div class="card-footer">
                <a href="place-details.html?id=${place._id}" class="btn btn-primary">View More</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Error loading places:', error);
  }
});
