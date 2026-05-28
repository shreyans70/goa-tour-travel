document.addEventListener('DOMContentLoaded', async () => {
  try {
    const galleryItems = await fetchAPI('/gallery');
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (galleryGrid) {
      if (galleryItems.length === 0) {
        galleryGrid.innerHTML = '<p>No images in the gallery yet.</p>';
        return;
      }
      
      galleryItems.forEach(item => {
        let aboutPreview = '';
        let hasMore = false;
        if(item.about) {
          if(item.about.length > 100) {
            aboutPreview = item.about.substring(0, 100) + '...';
            hasMore = true;
          } else {
            aboutPreview = item.about;
          }
        }
        
        const readMoreBtn = hasMore ? `<button class="btn btn-sm btn-outline" style="margin-top:10px;" onclick='openReadMore(${JSON.stringify(item).replace(/'/g, "&#39;")})'>Read More</button>` : '';

        galleryGrid.innerHTML += `
          <div class="card" style="box-shadow: none; border: 1px solid #eee; display: flex; flex-direction: column;">
            <img src="${item.image}" alt="${item.title}" class="card-img" style="height: 250px; object-fit: cover;">
            <div style="padding: 15px; text-align: center; flex: 1; display: flex; flex-direction: column;">
              <p style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">${item.title}</p>
              <p style="font-size: 0.9rem; color: #ff5722; margin-bottom: 10px;">${item.category}</p>
              <p style="font-size: 0.9rem; color: #555; line-height: 1.4; flex: 1;">${aboutPreview}</p>
              ${readMoreBtn}
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
  }

  // Modal logic
  const modal = document.getElementById('readMoreModal');
  const span = document.getElementById('close-readmore-modal');
  
  window.openReadMore = (item) => {
    document.getElementById('readmore-title').textContent = item.title;
    document.getElementById('readmore-category').textContent = item.category;
    document.getElementById('readmore-img').src = item.image;
    document.getElementById('readmore-text').innerHTML = item.about.replace(/\n/g, '<br>');
    if(modal) modal.classList.add('show');
  };

  if(span) {
    span.onclick = () => modal.classList.remove('show');
  }
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.classList.remove('show');
    }
  };
});
