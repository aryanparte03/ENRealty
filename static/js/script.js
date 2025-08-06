document.addEventListener('DOMContentLoaded', function() {
    // CREATE AND INITIALIZE CUSTOM CURSOR
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Track mouse movement and detect background
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Simple background detection
            detectBackground(e.clientX, e.clientY);
        });

        // Simple function to detect if cursor is over light or dark areas
        function detectBackground(x, y) {
            const elementUnderCursor = document.elementFromPoint(x, y);

            if (elementUnderCursor && cursor) {
                // Remove existing classes
                cursor.classList.remove('light-bg', 'dark-bg');

                // Check specific elements/sections for background type
                if (elementUnderCursor.closest('.footer') ||
                    elementUnderCursor.closest('.hero') ||
                    elementUnderCursor.closest('.header.scrolled') ||
                    elementUnderCursor.closest('.view-all-btn')) {
                    // Dark backgrounds = white cursor
                    cursor.classList.add('dark-bg');
                } else if (elementUnderCursor.closest('.properties-section') ||
                           elementUnderCursor.closest('.blogs-section') ||
                           elementUnderCursor.closest('body') ||
                           elementUnderCursor.closest('.property-card') ||
                           elementUnderCursor.closest('.hero-btn') ||
                           elementUnderCursor.closest('.contact-section') ||
                           elementUnderCursor.closest('.faq-section')) {
                    // Light backgrounds = black cursor
                    cursor.classList.add('light-bg');
                } else {
                    // Default to light background (black cursor)
                    cursor.classList.add('light-bg');
                }
            }
        }

        // Smooth cursor animation
        function animateCursor() {
            const speed = 1.0;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hide cursor when leaving viewport
        document.addEventListener('mouseleave', function() {
            cursor.classList.add('hidden');
        });

        document.addEventListener('mouseenter', function() {
            cursor.classList.remove('hidden');
        });
    }

    // Force black cursor for both properties and blogs sections
    function attachCursorLightBg(sectionSelector) {
        const sections = document.querySelectorAll(sectionSelector);
        if (!sections.length) return;

        sections.forEach(section => {
            section.addEventListener('mouseenter', function () {
                if (cursor) cursor.classList.add('light-bg');
            });

            section.addEventListener('mouseleave', function () {
                if (cursor) cursor.classList.remove('light-bg');
            });
        });
    }

    // Usage (unchanged):
    attachCursorLightBg('.properties-section');
    attachCursorLightBg('.blogs-section');

    // Navigation Mobile Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navMenu.classList.contains('active')
                    ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? '10px' : '0'}, ${index === 1 ? '0' : index === 0 ? '6px' : '-6px'})`
                    : 'none';
                span.style.opacity = index === 1 && navMenu.classList.contains('active') ? '0' : '1';
            });
        });
    }

    // Hero Explore More Button
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            // Smooth scroll to properties section
            const propertiesSection = document.querySelector('.properties-section');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Fix for browser back button - reset loading states
    window.addEventListener('pageshow', function(event) {
        // Reset blur filters (your existing code)
        document.body.style.filter = 'none';
        document.documentElement.style.filter = 'none';

        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.filter = 'none';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'none';
        }

        // NEW: Reset View All Button loading state
        const viewAllBtn = document.querySelector('.view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.innerHTML = 'View All Properties <i class="fas fa-arrow-right"></i>'; // Reset to original text
            viewAllBtn.disabled = false; // Re-enable button
        }

        // Reset any other loading buttons
        const loadingButtons = document.querySelectorAll('button[disabled]');
        loadingButtons.forEach(button => {
            if (button.innerHTML.includes('Loading...')) {
                button.disabled = false;
                // Reset button text based on class or data attribute if needed
            }
        });
    });

    // View All Button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;

            // Simulate navigation to listings page
            setTimeout(() => {
                window.location.href = '/listings';
            }, 1000);
        });
    }

    // Property Cards Interaction
    const propertyCards = document.querySelectorAll('.property-card');

    propertyCards.forEach((card, index) => {
        // Add entrance animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        // SINGLE mouseenter event with both cursor and hover effects
        card.addEventListener('mouseenter', function() {
            if (cursor) cursor.classList.add('hover-property');
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        // SINGLE mouseleave event
        card.addEventListener('mouseleave', function() {
            if (cursor) cursor.classList.remove('hover-property');
            this.style.transform = '';
        });

        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';

            // Add loading state
            this.classList.add('loading');

            setTimeout(() => {
                this.style.transform = '';
                this.classList.remove('loading');

                // Simulate navigation to property details
                const propertyTitle = this.querySelector('.property-title').textContent;
                console.log(`Navigating to ${propertyTitle} details...`);
            }, 800);
        });
    });

    // CURSOR EFFECTS FOR BUTTONS
    const buttons = document.querySelectorAll('.hero-btn, .view-all-btn, .newsletter-btn, .submit-btn, .get-in-touch-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (cursor) cursor.classList.add('hover-button');
        });

        button.addEventListener('mouseleave', function() {
            if (cursor) cursor.classList.remove('hover-button');
        });
    });

    // CURSOR EFFECTS FOR LINKS
    const links = document.querySelectorAll('.nav-link, .footer-links a, .credit-link, .contact-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (cursor) cursor.classList.add('hover-link');
        });

        link.addEventListener('mouseleave', function() {
            if (cursor) cursor.classList.remove('hover-link');
        });
    });

    // UNIVERSAL SCROLL EVENT LISTENER - Works on all pages
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBuilding = document.querySelector('.hero-building');
        const header = document.querySelector('.header');

        // Parallax effect for hero building (only on index page)
        if (heroBuilding) {
            const parallax = scrolled * 0.5;
            heroBuilding.style.transform = `translateY(${parallax}px)`;
        }

        // Universal header color change based on scroll position
        if (header) {
            // Different transition points for different pages
            let transitionPoint = 100; // Default transition point

            // Check which page we're on and set appropriate transition point
            const currentPath = window.location.pathname;

            if (currentPath === '/' || currentPath === '/index') {
                // Index page - detect when hero section ends
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    const heroHeight = heroSection.offsetHeight;
                    const headerHeight = header.offsetHeight;
                    transitionPoint = heroHeight - headerHeight;
                }
            } else if (currentPath === '/listings') {
                // Listings page - detect when listings-hero ends
                const listingsHero = document.querySelector('.listings-hero');
                if (listingsHero) {
                    const heroHeight = listingsHero.offsetHeight;
                    const headerHeight = header.offsetHeight;
                    transitionPoint = heroHeight - headerHeight;
                }
            } else if (currentPath === '/about') {
                // About page - detect when about-hero ends
                const aboutHero = document.querySelector('.about-hero');
                if (aboutHero) {
                    const heroHeight = aboutHero.offsetHeight;
                    const headerHeight = header.offsetHeight;
                    transitionPoint = heroHeight - headerHeight;
                }
            } else if (currentPath === '/contact') {
                // Contact page - detect when contact-hero ends
                const contactHero = document.querySelector('.contact-hero');
                if (contactHero) {
                    const heroHeight = contactHero.offsetHeight;
                    const headerHeight = header.offsetHeight;
                    transitionPoint = heroHeight - headerHeight;
                }
            }

            // Apply header styling based on scroll position
            if (scrolled >= transitionPoint) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Footer links interaction
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();

                // Navigate to the actual link href
                window.location.href = this.href;

            }, 600);

            // Optionally remove or comment this out:
            // const destination = this.textContent;
            // showNotification(`Navigating to ${destination}...`);
        });
    });


    // LISTINGS PAGE FUNCTIONALITY
    // Store original listings content on page load
    const mainContent = document.querySelector('main');
    let originalListingsContent = null;

    if (mainContent && window.location.pathname === '/listings') {
        originalListingsContent = mainContent.innerHTML;
    }

    // Listings page functionality
    const listingCards = document.querySelectorAll('.listing-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Property card click handlers - Updated for page transition
    listingCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking favorite button
            if (e.target.closest('.listing-favorite')) return;

            const propertyId = this.dataset.propertyId;
            showPropertyDetail(propertyId);
        });

        // Cursor effects for listing cards
        card.addEventListener('mouseenter', function() {
            if (cursor) cursor.classList.add('hover-property');
        });

        card.addEventListener('mouseleave', function() {
            if (cursor) cursor.classList.remove('hover-property');
        });
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            filterProperties(filterValue);
        });
    });

    // Filter properties function
    function filterProperties(filter) {
        const cards = document.querySelectorAll('.listing-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const categories = card.dataset.category;

            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} Properties Found`;
        }
    }

    // Show property detail by replacing page content
    function showPropertyDetail(propertyId) {
        const propertyData = getPropertyData(propertyId);
        const mainContent = document.querySelector('main');

        // RESET CURSOR STATE - Remove all cursor classes
        if (cursor) {
            cursor.classList.remove('hover-property', 'hover-button', 'hover-link', 'light-bg', 'dark-bg');
            cursor.classList.add('light-bg'); // Set default state for property detail page
        }

        // Clear current content with fade out effect
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.opacity = '0';

        setTimeout(() => {
            // Replace content
            mainContent.innerHTML = createPropertyDetailPage(propertyData);

            // Apply unblurred entrance animation
            mainContent.style.animation = 'unblurredFromTopLeft 0.8s ease forwards';
            mainContent.style.filter = 'none';  // CHANGE THIS LINE
            mainContent.style.opacity = '1';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Add back button functionality
            const backBtn = document.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', returnToListings);
            }
        }, 300);
    }

    // Return to listings page
    function returnToListings() {
        const mainContent = document.querySelector('main');

        // Fade out current content
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.opacity = '0';

        setTimeout(() => {
            // Restore listings content
            mainContent.innerHTML = getOriginalListingsContent();

            // Apply unblurred entrance animation
            mainContent.style.animation = 'unblurredFromTopLeft 0.8s ease forwards';
            mainContent.style.filter = 'none';  // CHANGE THIS LINE TOO
            mainContent.style.opacity = '1';

            // Re-initialize listings functionality
            initializeListings();
        }, 300);
    }

    // Initialize listings functionality
    function initializeListings() {
        const listingCards = document.querySelectorAll('.listing-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        listingCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.listing-favorite')) return;
                const propertyId = this.dataset.propertyId;
                showPropertyDetail(propertyId);
            });

            card.addEventListener('mouseenter', function() {
                if (cursor) cursor.classList.add('hover-property');
            });

            card.addEventListener('mouseleave', function() {
                if (cursor) cursor.classList.remove('hover-property');
            });
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.dataset.filter;
                filterProperties(filterValue);
            });
        });
    }

    // Get original listings content
    function getOriginalListingsContent() {
        return originalListingsContent || `
            <section class="listings-hero">
                <div class="container">
                    <div class="listings-hero-content">
                        <h1 class="listings-title">Premium Properties</h1>
                        <p class="listings-subtitle">Discover our curated collection of luxury real estate offerings</p>
                    </div>
                </div>
            </section>
        `;
    }

    // Sample property data function
    function getPropertyData(propertyId) {
        const properties = {
            '1': {
                title: 'Raya',
                price: '₹ 270,000',
                location: 'Kharghar, Navi Mumbai',
                beds: 4,
                baths: 3,
                area: '2,650 sq ft',
                yearBuilt: 2023,
                images: [
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop'
                ],
                description: 'Stunning modern estate featuring spacious interiors, premium finishes, and breathtaking views. This exceptional property offers luxury living at its finest.',
                features: [
                    'Gourmet kitchen with premium appliances',
                    'Spacious master suite with walk-in closet',
                    'Private outdoor terrace',
                    'Swimming pool and spa',
                    'Smart home technology',
                    'Three-car garage'
                ]
            },
            '2': {
                title: 'Sunset Bluff',
                price: '₹ 221,500/month',
                location: 'Panvel, Navi Mumbai',
                beds: 3,
                baths: 2,
                area: '2,650 sq ft',
                yearBuilt: 2022,
                images: [
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
                ],
                description: 'Modern apartment with stunning city views and premium amenities.',
                features: [
                    'Floor-to-ceiling windows',
                    'Modern kitchen',
                    'Hardwood floors',
                    'In-unit laundry',
                    'Gym access',
                    'Roof deck'
                ]
            },
            '3': {
                title: 'Silver Birch',
                price: '₹ 112,000',
                location: 'Seawoods-Darave, Navi Mumbai',
                beds: 4,
                baths: 3,
                area: '2,650 sq ft',
                yearBuilt: 2021,
                images: [
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
                ],
                description: 'Beautiful coastal property with ocean views and modern amenities.',
                features: [
                    'Ocean view',
                    'Modern design',
                    'Private beach access',
                    'High-end appliances',
                    'Outdoor deck',
                    'Two-car garage'
                ]
            }
        };

        return properties[propertyId] || properties['1'];
    }

    // Create property detail page HTML
    function createPropertyDetailPage(property) {
        return `
            <section class="property-detail-hero">
                <div class="container">
                    <button class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Back to Listings
                    </button>
                </div>
            </section>
            <section class="property-detail-section">
                <div class="container">
                    <div class="property-detail-grid">
                        <div class="property-images-section">
                            <div class="main-property-image">
                                <img src="${property.images[0]}" alt="${property.title}">
                            </div>
                            <div class="property-image-gallery">
                                ${property.images.slice(1).map(img => `
                                    <div class="gallery-image">
                                        <img src="${img}" alt="${property.title}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="property-info-section">
                            <div class="property-header">
                                <h1 class="property-detail-title">${property.title}</h1>
                                <p class="property-detail-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${property.location}
                                </p>
                                <div class="property-detail-price">${property.price}</div>
                            </div>
                            
                            <div class="property-specs">
                                <div class="spec-item">
                                    <i class="fas fa-bed"></i>
                                    <span class="spec-label">Bedrooms</span>
                                    <span class="spec-value">${property.beds}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-bath"></i>
                                    <span class="spec-label">Bathrooms</span>
                                    <span class="spec-value">${property.baths}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-ruler-combined"></i>
                                    <span class="spec-label">Area</span>
                                    <span class="spec-value">${property.area}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span class="spec-label">Year Built</span>
                                    <span class="spec-value">${property.yearBuilt}</span>
                                </div>
                            </div>
                            
                            <div class="property-description">
                                <h3>Description</h3>
                                <p>${property.description}</p>
                            </div>
                            
                            <div class="property-features">
                                <h3>Features</h3>
                                <ul class="features-list">
                                    ${property.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="property-actions">
                                <button class="contact-agent-btn"  onclick="window.location.href='/contact'">
                                    <i class="fas fa-phone"></i>
                                    Contact Agent
                                </button>
                                <button class="schedule-tour-btn" onclick="window.location.href='/contact'">
                                    <i class="fas fa-calendar"></i>
                                    Schedule Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        `;
    }

    // Favorite button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.listing-favorite')) {
            e.stopPropagation();
            const button = e.target.closest('.listing-favorite');
            const icon = button.querySelector('i');

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.style.color = '#ef4444';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.style.color = '#666';
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
      const curtain = document.getElementById('page-curtain');
      if (!curtain) return;
      const curtainBg = curtain.querySelector('.curtain-bg');
      const logo = curtain.querySelector('.curtain-logo');
      const header = document.querySelector('.header');

      if (!curtainBg || !logo || !header) return;

      // header.classList.add('is-hidden');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        logo.style.animation = 'curtain-logo-out 0.7s cubic-bezier(.83,.12,.48,.98) forwards';
      }, 1300);

      setTimeout(() => {
        curtainBg.style.animation = 'none';
        void curtainBg.offsetWidth;
        curtainBg.style.animation = 'page-curtain-up 0.9s cubic-bezier(.83,.12,.48,.98) forwards';
      }, 1750);

      setTimeout(() => {
        header.classList.remove('is-hidden');
        header.classList.add('is-shown');
      }, 1980);

      setTimeout(() => {
        curtain.style.display = 'none';
        document.body.style.overflow = '';
      }, 2600);
    });


    // ============== CONTACT PAGE FUNCTIONALITY - NEW ADDITION ==============

    // Contact Form Functionality with Email
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Validate form fields
            const requiredFields = ['request', 'fullName', 'phoneNumber', 'emailAddress'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    input.style.borderColor = '#e2e8f0';
                    input.style.boxShadow = 'none';
                }
            });

            // Validate email format
            const emailInput = this.querySelector('[name="emailAddress"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                showNotification('Please enter a valid email address.');
            }

            if (!isValid) {
                showNotification('Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send form data via AJAX
            fetch('/contact', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Reset form on success
                    this.reset();
                    showSuccessNotification(data.message);

                    // Reset form field styles
                    const inputs = this.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        input.style.borderColor = '#e2e8f0';
                        input.style.boxShadow = 'none';
                    });
                } else {
                    showErrorNotification(data.message || 'There was an error sending your message.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorNotification('There was an error sending your message. Please try again.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });

        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    this.style.borderColor = '#e2e8f0';
                    this.style.boxShadow = 'none';
                }
            });

            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    this.style.borderColor = '#e2e8f0';
                    this.style.boxShadow = 'none';
                }
            });
        });
    }

    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqId = this.dataset.faq;
            const answer = document.getElementById(`faq-${faqId}`);
            const isActive = this.classList.contains('active');

            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                const id = q.dataset.faq;
                const ans = document.getElementById(`faq-${id}`);
                if (ans) ans.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                if (answer) answer.classList.add('active');
            }
        });
    });

    // Get in touch button functionality
    const getInTouchBtn = document.querySelector('.get-in-touch-btn');
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function() {
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                const rect = contactForm.getBoundingClientRect();
                const currentScroll = window.pageYOffset;
                const targetPosition = rect.top + currentScroll - 100; // 100px above the form

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Scroll-triggered fade-in animation for multiple sections
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    };

    const scrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-on-scroll');
                // Stop observing after animation is triggered (optional)
                scrollAnimationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);


    //Blogs Section
    const blogsSection = document.querySelector('.blogs-section');
    if (blogsSection) {
      blogsSection.classList.add('fade-in-on-scroll');
    }

    // Animate blog cards entrance with staggered delays and add hover cursor effect
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, idx) => {
      card.style.animationDelay = `${idx * 0.09}s`;

      // Add eye cursor effect on hover (matches existing property-card behavior)
      card.addEventListener('mouseenter', function() {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.classList.add('hover-property');
      });

      card.addEventListener('mouseleave', function() {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.classList.remove('hover-property');
      });

      // Clicking card simulates navigating to blog detail view
      card.addEventListener('click', function() {
        const blogId = this.getAttribute('data-blog-id');
        showBlogDetail(blogId);
      });
    });

    // Sample blog data for 5 blogs (replace with your own content as needed)
    const blogDetailData = {
      "1": {
        tag: "Culturalization",
        title: "Crafting Neighborhood Identity through Thematic Branding",
        author: "Rohan Mehta",
        role: "Head of Marketing",
        date: "June 10, 2024",
        readTime: "7 min read",
        images: [
          "/static/images/blog-1.jpg"
        ],
        content: `
          <p>
            When prospective homeowners land on a project page, they’re seeking more than walls and floors—they want a narrative that resonates with local heritage and future aspirations. To build that narrative, start by researching the community’s founding stories, notable landmarks, and resident demographic profiles. Layer these insights into every customer touchpoint: the project name, logo motifs, signage design, and digital banners. By embedding local lore—whether vintage photographs of the first settlement or curated quotes from lifelong residents—you create an emotional anchor that elevates your development from another cookie-cutter complex to a living, breathing neighborhood.
            <br><br>Translating neighborhood identity into branding requires consistency and collaboration. Your graphic designers should match color palettes and typography to the local culture—for instance, earthy ochres for a heritage district or sleek metallics for an up-and-coming business hub. Marketing copy should employ tone and vocabulary that echo the area’s character, while your sales brochures and website should highlight curated walking tours or community events. When every asset speaks the same story, buyer engagement jumps, inquiries rise, and the project’s brand recognition cements itself in the minds of target audiences.          
            <br><br>
          </p>

        `
      },
      "2": {
        tag: "Connectivity",
        title: "Maximizing ROI with Smart Home Integrations",
        author: "Neha Patel",
        role: "IoT Solutions Lead",
        date: "April 9, 2025",
        readTime: "10 min read",
        images: [
          "/static/images/blog-2.jpg"
        ],
        content: `
          <p>
            Today’s buyers expect their homes to be both comfortable and connected. Introducing a tiered approach to smart home features can boost sale prices by up to 8 percent while giving developers clear budgetary guardrails. At the entry level, integrate voice-activated lighting and basic security cameras that homeowners can manage from a mobile app. Mid-tier packages add smart thermostats, automated blinds, and leak-detection sensors, offering tangible energy savings. Premium offerings include whole-home integration with AI-driven routines, from morning wake-up sequences to dynamic climate control based on occupancy patterns.
            <br><br>To ensure a strong ROI, partner with reliable IoT vendors who provide local installation support and long-term warranties. Train sales agents on feature benefits and demonstrate them live in model units. Collect buyer feedback on pilot homes to refine your integration roadmap, balancing upfront costs against perceived value. Finally, leverage data analytics to track feature usage post-handover—those usage patterns become powerful marketing collateral for future developments, showcasing real-world savings and lifestyle enhancements.
            <br><br>
          </p>
        `
      },
      "3": {
        tag: "Strategization",
        title: "Urban Infill vs. Greenfield Development: A Comparative Analysis",
        author: "Abhishek Verma",
        role: "Land Acquisition Manager",
        date: "March 10, 2025",
        readTime: "8 min read",
        images: [
          "/static/images/blog-3.jpg"
        ],
        content: `
          <p>
            Choosing between urban infill and greenfield sites hinges on infrastructure, community acceptance, and long-term value creation. Urban infill often grants immediate access to utilities, public transit, and established schools, but it carries higher land acquisition costs and potential zoning hurdles. Greenfield parcels may offer lower per-acre prices, yet developers face extended timelines to build roads, install utilities, and navigate environmental impact assessments. A thorough cost-benefit model should quantify not only land and construction expenses but also project approval lead times and community sentiment scores.
            <br><br>Real-world case studies from Mumbai’s densest wards reveal that infill projects, despite steeper upfront outlays, drive higher rental yields and resale premiums within five years. Conversely, suburban greenfield developments can capture first-mover advantages in emerging corridors, but only if developers build robust green spaces, schools, and commercial hubs to entice buyers. The ideal approach often blends both: secure a core urban site for immediate revenue generation and plan a satellite greenfield project that matures into a standalone precinct.
            <br><br>
          </p>
        `
      },
      "4": {
        tag: "Visualization",
        title: "Storytelling in Power BI: Visualizing Real Estate Trends",
        author: "Dridha",
        role: "Business Analyst",
        date: "February 5, 2025",
        readTime: "6 min read",
        images: [
          "/static/images/blog-4.jpg"
        ],
        content: `
          <p>
            Effective dashboards do more than display numbers—they guide users through a narrative arc of market dynamics. Begin with a high-level overview page that surfaces key metrics: month-over-month lead volume, conversion ratios, and average response times. Employ heat maps to illustrate geographic demand clusters, coloring high-interest ZIP codes in vibrant hues and tapering to cooler shades for under-served areas. Embed slicers for price range, property type, and lead source so executives can drill into specific segments at the click of a mouse.
            <br><br>Next, dedicate subsequent pages to deeper analytics. Use clustered bar charts to compare handler performance, and waterfall charts to visualize funnel attrition from inquiry to booking. Incorporate custom DAX measures—such as rolling three-month averages of lead velocity—to smooth out volatility. Complement numeric displays with narrative text boxes that call out anomalies, explain seasonal dips, or highlight emerging trends. When every chart and visual flows logically into the next, stakeholders grasp insights faster, and data-driven decisions become second nature.
            <br><br>
          </p>
        `
      },
      "5": {
        tag: "Flexibility",
        title: "Designing Live-Work Communities for Hybrid Professionals",
        author: "Saloni Deshpande",
        role: "Senior Architect",
        date: "January 15, 2025",
        readTime: "8 min read",
        images: [
          "/static/images/blog-5.jpg"
        ],
        content: `
          <p>
            As remote and hybrid work models solidify, homeowners seek spaces that seamlessly blend productivity and comfort. Flexible floor plates allow residents to convert spare bedrooms into sound-insulated work pods by adding sliding glass partitions and modular acoustic panels. Communal co-working lounges, placed on the podium level or rooftop terraces, can feature adjustable height desks, whiteboard walls, and integrated AV systems for client presentations. Incorporating ample natural light through skylights and floor-to-ceiling windows boosts focus and reduces energy consumption.
            <br><br>Outdoor amenities play a pivotal role in mental well-being. Design landscaped courtyards with shaded seating nooks and Wi-Fi–enabled picnic tables so residents can brainstorm al fresco. Provide high-speed fiber-optic corridors to guarantee stable connectivity throughout the complex. Finally, integrate dedicated mailroom and package lockers near the lobby to streamline logistics for home-based entrepreneurs. With these thoughtful design elements, live-work communities transform from mere housing projects into dynamic hubs that attract the next generation of professionals.
            <br><br>
          </p>
        `
      }
      // ... Add "3" and "4" blogs as needed, each with their own images/content ...
    };

    function showBlogDetail(id) {
      const data = blogDetailData[id];
      if (!data) return;
      const main = document.querySelector('main');
      if (!main) return;

      // RESET CURSOR STATE - Remove all cursor classes
      if (cursor) {
          cursor.classList.remove('hover-property', 'hover-button', 'hover-link', 'light-bg', 'dark-bg');
          cursor.classList.add('light-bg'); // Set default state for property detail page
      }
      // Clear current content with fade out effect
      mainContent.style.filter = 'blur(8px)';
      mainContent.style.opacity = '0';

      // Fade out
      main.style.filter = 'blur(8px)';
      main.style.opacity = '0';
      setTimeout(() => {
        // Generate images gallery HTML
        const imagesGallery = data.images.map(src => `
          <div class="blog-detail-image-wrapper">
            <img class="blog-detail-img" src="${src}" alt="${data.title}">
          </div>
        `).join('');

        main.innerHTML = `
          <section class="blog-detail-hero">
            <div class="container">
              <button class="back-btn">
                <i class="fas fa-arrow-left"></i>
                Back to Blogs
              </button>
            </div>
          </section>
          <section class="blog-detail-section">
            <div class="container">
              <div class="blog-detail-grid">
                <div class="blog-detail-image">
                  ${imagesGallery}
                </div>
                <div class="blog-detail-info">
                  <div class="blog-detail-header">
                    <h1 class="blog-detail-title">${data.title}</h1>
                    <p class="blog-detail-date">
                        <span class="blog-detail-date">${data.readTime}</span>
                        <span class="blog-detail-date">${data.date}</span>
                    </p><br>
                    <p class="blog-detail-meta">
                      <span class="blog-detail-author">${data.author}</span>
                      <span class="blog-detail-role">${data.role}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="blog-detail-section">        
                  <div class="container">
                    ${data.content}
                  </div>
          </section>
        `;
        main.style.animation = 'unblurredFromTopLeft 0.8s ease forwards';
        main.style.filter = 'none';
        main.style.opacity = '1';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Back button reloads the page to show blog list
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', function() {
            window.location.reload();
          });
        }
      }, 280);
    }


    // Observe all sections for scroll-triggered animations
    const sectionsToAnimate = document.querySelectorAll('.properties-section, .blogs-section, .values-section, .faq-section, .features-section');
    sectionsToAnimate.forEach(section => {
        if (section) {
            scrollAnimationObserver.observe(section);
        }
    });

    // Features Section Functionality
    const featureButtons = document.querySelectorAll('.feature-btn');
    const featureImages = document.querySelectorAll('.feature-image');
    const featureDescriptions = document.querySelectorAll('.feature-desc');

    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetFeature = this.getAttribute('data-feature');

            // Remove active class from all buttons
            featureButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Handle image transitions with smooth fade
            featureImages.forEach(img => {
                if (img.getAttribute('data-image') === targetFeature) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });

            // Handle description transitions
            featureDescriptions.forEach(desc => {
                if (desc.getAttribute('data-desc') === targetFeature) {
                    desc.classList.add('active');
                } else {
                    desc.classList.remove('active');
                }
            });
        });

        // Add hover effects for buttons
        button.addEventListener('mouseenter', function() {
            if (cursor) cursor.classList.add('hover-button');
        });

        button.addEventListener('mouseleave', function() {
            if (cursor) cursor.classList.remove('hover-button');
        });
    });


    // ============== END CONTACT PAGE FUNCTIONALITY ==============

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .property-card.animate {
            animation: slideInUp 0.8s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes arrow-luxury-glide-reverse {
            0% {
                transform: translateX(0);
                opacity: 1;
            }
            12% {
                transform: translateX(1px);
                opacity: 1;
            }
            45% {
                transform: translateX(-10px);
                opacity: 0.4;
            }
            55% {
                transform: translateX(-12px);
                opacity: 0;
            }
            75% {
                transform: translateX(6px);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .submit-btn:hover .btn-arrow {
            animation: arrow-luxury-glide-reverse 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);

    // More aggressive blur fix - force reset everything
    function forceResetAllStyles() {
        // Reset document and body
        document.body.style.cssText = '';
        document.documentElement.style.cssText = '';

        // Reset ALL elements with any style filters
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // Remove any inline filter styles
            if (element.style.filter) {
                element.style.filter = '';
            }
            if (element.style.opacity !== '' && element.style.opacity !== '1') {
                element.style.opacity = '';
            }
            if (element.style.transform) {
                element.style.transform = '';
            }
        });

        // Force repaint
        document.body.offsetHeight;
    }

    // Apply on multiple events
    window.addEventListener('pageshow', forceResetAllStyles);
    window.addEventListener('popstate', forceResetAllStyles);
    window.addEventListener('focus', forceResetAllStyles);

    // Also try with a small delay
    window.addEventListener('pageshow', function() {
        setTimeout(forceResetAllStyles, 100);
    });
});

// Utility function for notifications
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(26, 26, 26, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced Notification Functions for Contact Page
function showSuccessNotification(message) {
    showGenericNotification(message, 'success');
}

function showErrorNotification(message) {
    showGenericNotification(message, 'error');
}

function showGenericNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Set colors based on type
    let backgroundColor, iconClass;
    switch(type) {
        case 'success':
            backgroundColor = 'rgba(34, 197, 94, 0.9)';
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            backgroundColor = 'rgba(239, 68, 68, 0.9)';
            iconClass = 'fas fa-exclamation-circle';
            break;
        default:
            backgroundColor = 'rgba(26, 26, 26, 0.9)';
            iconClass = 'fas fa-info-circle';
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="${iconClass}" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        max-width: 350px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after duration based on type
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Add loading animation for page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.3s ease';
});
