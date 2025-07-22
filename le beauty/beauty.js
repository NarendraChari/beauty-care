// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initSmoothScrolling();
    initAnimations();
    initContactForm();
    initCart();
    initGallery();
    initMobileMenu();
    initServicesDropdown();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(252, 238, 234, 0.98)';
        } else {
            navbar.style.background = 'rgba(252, 238, 234, 0.95)';
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Fade in nav items on load
    document.querySelectorAll('.nav-links li a').forEach((link, i) => {
        link.style.opacity = 0;
        link.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            link.style.transition = 'opacity .5s ease, transform .5s ease';
            link.style.opacity = 1;
            link.style.transform = 'translateY(0)';
        }, 300 + 100 * i);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .specialist-card, .testimonial-card, .product-card, .blog-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.service) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
        });
    }
}

// Shopping cart functionality
function initCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            const product = {
                id: Date.now(),
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            // Check if product already in cart
            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart icon
            updateCartIcon();
            
            // Show notification
            showNotification(`${productName} added to cart!`, 'success');
        });
    });
    
    // Cart icon click
    const cartIcon = document.querySelector('.bi-cart3');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCart();
        });
    }
}

// Update cart icon with item count
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.bi-cart3');
    
    if (cartIcon) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Remove existing badge
        const existingBadge = cartIcon.parentElement.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add new badge if items exist
        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #d38ca2;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(badge);
        }
    }
}

// Show cart modal
function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'info');
        return;
    }
    
    // Create cart modal
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let cartHTML = '<h3>Shopping Cart</h3>';
    let total = 0;
    
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        const itemTotal = price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div style="display: flex; align-items: center; gap: 15px; margin: 15px 0; padding: 15px; border: 1px solid #f2d4dd; border-radius: 10px;">
                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                    <p style="margin: 0; color: #666;">${item.price} x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: #d38ca2; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
            </div>
        `;
    });
    
    cartHTML += `
        <div style="border-top: 2px solid #f2d4dd; padding-top: 20px; margin-top: 20px;">
            <h3>Total: $${total.toFixed(2)}</h3>
            <button onclick="checkout()" style="background: linear-gradient(135deg, #d38ca2, #f9c8d5); color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; margin-top: 15px;">Checkout</button>
        </div>
    `;
    
    modalContent.innerHTML = cartHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Remove item from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showCart(); // Refresh cart display
}

// Checkout function
function checkout() {
    showNotification('Thank you for your purchase! Redirecting to payment...', 'success');
    setTimeout(() => {
        localStorage.removeItem('cart');
        updateCartIcon();
        document.querySelector('.cart-modal').remove();
    }, 2000);
}

// Gallery functionality
function initGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            showLightbox(img.src, img.alt);
        });
    });
}

// Lightbox for gallery
function showLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
    
    lightbox.addEventListener('click', function() {
        lightbox.remove();
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('mobile-open');
            hamburger.classList.remove('active');
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#4CAF50';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'info':
            notification.style.background = '#2196F3';
            break;
        default:
            notification.style.background = '#d38ca2';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize cart icon on load
updateCartIcon();

// Add CSS for mobile menu
const mobileMenuCSS = `
    @media (max-width: 768px) {
        nav {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(252, 238, 234, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 40px;
            transition: left 0.3s ease;
        }
        
        nav.mobile-open {
            left: 0;
        }
        
        .nav-links {
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .nav-icons {
            flex-direction: column;
            gap: 20px;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add mobile menu CSS to head
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);

// Add animation CSS
const animationCSS = `
    .service-card,
    .specialist-card,
    .testimonial-card,
    .product-card,
    .blog-card,
    .gallery-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate-in,
    .specialist-card.animate-in,
    .testimonial-card.animate-in,
    .product-card.animate-in,
    .blog-card.animate-in,
    .gallery-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

const animationStyle = document.createElement('style');
animationStyle.textContent = animationCSS;
document.head.appendChild(animationStyle);

// Services dropdown and modal functionality
function initServicesDropdown() {
    const modal = document.getElementById('servicesModal');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Service data
    const servicesData = {
        hairdresser: {
            title: 'Hairdresser Services',
            icon: 'bi-scissors',
            description: 'Professional hair styling and coloring services. Our expert hairdressers will help you achieve the perfect look with premium products and techniques.',
            pricing: [
                { service: 'Long hairstyle', price: '$20' },
                { service: 'Medium hairstyle', price: '$25' },
                { service: 'Regular coloring', price: '$46' },
                { service: 'Ombre coloring', price: '$50' },
                { service: 'Haircut & styling', price: '$35' },
                { service: 'Highlights', price: '$65' }
            ]
        },
        manicure: {
            title: 'Manicure & Pedicure',
            icon: 'bi-hand-index',
            description: 'Relaxing and professional nail care services. From classic French manicures to trendy nail art, we provide the highest quality nail treatments.',
            pricing: [
                { service: 'French style manicure', price: '$10' },
                { service: 'Gelish with accents', price: '$20' },
                { service: 'Regular nail coloring', price: '$30' },
                { service: 'Pedicure treatment', price: '$25' },
                { service: 'Nail art design', price: '$15' },
                { service: 'Gel extensions', price: '$45' }
            ]
        },
        massage: {
            title: 'Massage Therapy',
            icon: 'bi-heart-pulse',
            description: 'Therapeutic massage services to relax your body and mind. Our skilled therapists use various techniques to relieve tension and promote wellness.',
            pricing: [
                { service: 'Arms and legs massage', price: '$20' },
                { service: 'Face massage', price: '$20' },
                { service: 'Full body massage', price: '$30' },
                { service: 'Deep tissue massage', price: '$40' },
                { service: 'Relaxation massage', price: '$35' },
                { service: 'Hot stone massage', price: '$50' }
            ]
        },
        skincare: {
            title: 'Skin Care Treatments',
            icon: 'bi-droplet',
            description: 'Advanced skincare treatments using premium products. Our estheticians will help you achieve healthy, glowing skin with personalized treatments.',
            pricing: [
                { service: 'Facial treatment', price: '$35' },
                { service: 'Deep cleansing facial', price: '$45' },
                { service: 'Anti-aging treatment', price: '$55' },
                { service: 'Acne treatment', price: '$40' },
                { service: 'Hydrating facial', price: '$50' },
                { service: 'Chemical peel', price: '$75' }
            ]
        },
        consultation: {
            title: 'Beauty Consultation',
            icon: 'bi-chat-dots',
            description: 'Professional beauty consultations to help you discover the best treatments and products for your unique needs and preferences.',
            pricing: [
                { service: 'Initial consultation', price: '$15' },
                { service: 'Style consultation', price: '$25' },
                { service: 'Full beauty assessment', price: '$35' },
                { service: 'Product recommendation', price: '$20' },
                { service: 'Treatment planning', price: '$30' },
                { service: 'Follow-up consultation', price: '$10' }
            ]
        }
    };
    
    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceData = servicesData[serviceType];
            
            if (serviceData) {
                showServiceModal(serviceData);
            }
        });
    });
    
    // Handle close button clicks
    closeButtons.forEach(button => {
        button.addEventListener('click', closeServiceModal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeServiceModal();
        }
    });
    
    // Handle book service button
    document.querySelector('.book-service').addEventListener('click', function() {
        const serviceTitle = document.getElementById('modalTitle').textContent;
        showNotification(`Booking request sent for ${serviceTitle}! We'll contact you soon.`, 'success');
        closeServiceModal();
    });
}

// Show service modal with data
function showServiceModal(serviceData) {
    const modal = document.getElementById('servicesModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalDescription = document.getElementById('modalDescription');
    const modalPricing = document.getElementById('modalPricing');
    
    // Update modal content
    modalTitle.textContent = serviceData.title;
    modalIcon.className = `bi ${serviceData.icon}`;
    modalDescription.textContent = serviceData.description;
    
    // Update pricing list
    modalPricing.innerHTML = '';
    serviceData.pricing.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.service}</span>
            <span class="price">${item.price}</span>
        `;
        modalPricing.appendChild(li);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close service modal
function closeServiceModal() {
    const modal = document.getElementById('servicesModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
  