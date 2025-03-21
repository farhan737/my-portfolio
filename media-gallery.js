document.addEventListener('DOMContentLoaded', function() {
    // GitHub repository information
    const owner = 'farhan737';
    const repo = 'porfolio-collage-images';
    const branch = 'main'; // or 'master' depending on your repository's default branch
    
    // Elements
    const galleryContainer = document.querySelector('.gallery-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    // Gallery state
    let images = [];
    let currentImageIndex = 0;
    
    // Fetch repository contents
    async function fetchImages() {
        try {
            // First, try to get the contents of the repository
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repository contents');
            }
            
            const data = await response.json();
            
            // Filter for image files
            const imageFiles = data.filter(file => {
                const extension = file.name.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
            });
            
            // Process image files
            images = imageFiles.map((file, index) => {
                // For GitHub hosted images, we can use the raw URL
                const imageUrl = file.download_url;
                
                // Generate a title from the filename (remove extension and replace dashes/underscores with spaces)
                const title = file.name.split('.')[0].replace(/[-_]/g, ' ');
                
                // Determine size class for the grid layout (randomly assign for visual interest)
                let sizeClass = '';
                const random = Math.random();
                if (random < 0.2) {
                    sizeClass = 'wide';
                } else if (random < 0.4) {
                    sizeClass = 'tall';
                } else if (random < 0.5) {
                    sizeClass = 'large';
                }
                
                return {
                    id: index,
                    url: imageUrl,
                    title: title,
                    description: `Image from ${title}`,
                    sizeClass: sizeClass
                };
            });
            
            // Render the gallery
            renderGallery();
            
        } catch (error) {
            console.error('Error fetching images:', error);
            galleryContainer.innerHTML = `
                <div class="error-message">
                    <h3>Failed to load images</h3>
                    <p>There was an error loading images from the repository. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Render the gallery with images
    function renderGallery() {
        if (images.length === 0) {
            galleryContainer.innerHTML = '<p>No images found in the repository.</p>';
            return;
        }
        
        // Create the gallery grid
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        
        // Add each image to the grid
        images.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${image.sizeClass}`;
            galleryItem.dataset.id = image.id;
            
            galleryItem.innerHTML = `
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="gallery-item-info">
                    <h3 class="gallery-item-title">${image.title}</h3>
                    <p class="gallery-item-desc">${image.description}</p>
                </div>
            `;
            
            // Add click event to open lightbox
            galleryItem.addEventListener('click', () => {
                openLightbox(image.id);
            });
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Replace loading indicator with gallery grid
        galleryContainer.innerHTML = '';
        galleryContainer.appendChild(galleryGrid);
    }
    
    // Open lightbox with the selected image
    function openLightbox(imageId) {
        currentImageIndex = parseInt(imageId);
        updateLightboxContent();
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }
    
    // Close lightbox
    function closeLightboxHandler() {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Update lightbox content based on current image index
    function updateLightboxContent() {
        const image = images[currentImageIndex];
        lightboxImage.src = image.url;
        lightboxImage.alt = image.title;
        lightboxCaption.textContent = `${image.title} - ${image.description}`;
    }
    
    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxContent();
    }
    
    // Event listeners for lightbox navigation
    closeLightbox.addEventListener('click', closeLightboxHandler);
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightboxHandler();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(event) {
        if (lightbox.style.display === 'block') {
            if (event.key === 'Escape') {
                closeLightboxHandler();
            } else if (event.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // Initialize by fetching images
    fetchImages();
});
