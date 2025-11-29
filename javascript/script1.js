// Project 1 Specific JavaScript - E-Commerce Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('E-Commerce Project Page Loaded');
    
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Open modal when view buttons are clicked
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageType = this.getAttribute('data-image');
            openModal(imageType);
        });
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    function openModal(imageType) {
        // In a real project, you would use actual image URLs
        const imageData = {
            homepage: {
                src: 'https://via.placeholder.com/800x600/64ffda/0a192f?text=Homepage+Screenshot',
                caption: 'E-Commerce Homepage - Featured products and categories'
            },
            product: {
                src: 'https://via.placeholder.com/800x600/64ffda/0a192f?text=Product+Page',
                caption: 'Product Detail Page - Product information and add to cart'
            },
            checkout: {
                src: 'https://via.placeholder.com/800x600/64ffda/0a192f?text=Checkout+Process',
                caption: 'Checkout Process - Secure payment and order summary'
            }
        };
        
        modalImg.src = imageData[imageType].src;
        modalCaption.textContent = imageData[imageType].caption;
        modal.style.display = 'block';
        
        // Add animation class
        modal.classList.add('modal-open');
    }
    
    function closeModal() {
        modal.style.display = 'none';
        modal.classList.remove('modal-open');
    }
    
    // Add hover effects to tech stack items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.project-details, .project-gallery, .demo-links');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});