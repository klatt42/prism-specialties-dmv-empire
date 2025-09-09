/**
 * Prism Specialties Franchise Main JavaScript
 * Professional functionality with brand compliance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScroll();
    initPhoneTracking();
    initScrollAnimations();
    initFormValidation();
    initEmergencyBanner();
    initAnalyticsTracking();
});

/**
 * Smooth Scroll Navigation
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track smooth scroll events
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'smooth_scroll', {
                        event_category: 'navigation',
                        event_label: targetId,
                        value: 1
                    });
                }
            }
        });
    });
}

/**
 * Phone Click Tracking for 703-229-1321
 */
function initPhoneTracking() {
    const phoneNumbers = document.querySelectorAll('a[href*="703-229-1321"], a[href*="tel:+17032291321"], a[href*="tel:7032291321"]');
    
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function(e) {
            const phoneNumber = '703-229-1321';
            
            // Track phone click event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    event_category: 'engagement',
                    event_label: phoneNumber,
                    value: 1,
                    custom_parameter_1: 'franchise_phone_click'
                });
            }
            
            console.log('Phone call initiated:', phoneNumber);
        });
    });
    
    // Also track any dynamically created phone links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && (target.href.includes('703-229-1321') || target.href.includes('tel:'))) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    event_category: 'engagement',
                    event_label: '703-229-1321',
                    value: 1,
                    custom_parameter_1: 'dynamic_phone_click'
                });
            }
        }
    });
}

/**
 * Service Card Animations with Intersection Observer
 */
function initScrollAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    const trustBadges = document.querySelectorAll('.trust-badge');
    const animatedElements = [...serviceCards, ...trustBadges];
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Track scroll animation event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_animation', {
                        event_category: 'engagement',
                        event_label: entry.target.className,
                        value: 1
                    });
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .service-card.animate-in {
            animation: slideInUp 0.6s ease-out forwards;
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
    `;
    document.head.appendChild(style);
}

/**
 * Professional Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate="true"], .contact-form, form.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    event_category: 'lead_generation',
                    event_label: 'contact_form',
                    value: 1,
                    custom_parameter_1: 'franchise_form_submit'
                });
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Required field validation
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Name validation
    else if (field.name && field.name.toLowerCase().includes('name') && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Emergency Banner - Shows after 30 seconds
 */
function initEmergencyBanner() {
    setTimeout(() => {
        showEmergencyBanner();
    }, 30000); // 30 seconds
}

function showEmergencyBanner() {
    // Check if banner already exists
    if (document.querySelector('.emergency-banner')) return;
    
    const banner = document.createElement('div');
    banner.className = 'emergency-banner';
    banner.innerHTML = `
        <div class="emergency-content">
            <div class="emergency-text">
                <strong>24/7 Emergency Response Available</strong>
                <span>Call Now: <a href="tel:+17032291321">703-229-1321</a></span>
            </div>
            <button class="emergency-close" aria-label="Close emergency banner">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .emergency-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(45deg, #FF6600, #ff8533);
            color: white;
            z-index: 10000;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease-out;
        }
        
        .emergency-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .emergency-text {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: 'Montserrat', sans-serif;
        }
        
        .emergency-text a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            padding: 0.25rem 0.5rem;
            border: 2px solid white;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .emergency-text a:hover {
            background: white;
            color: #FF6600;
        }
        
        .emergency-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background 0.3s ease;
        }
        
        .emergency-close:hover {
            background: rgba(255,255,255,0.2);
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .emergency-text {
                flex-direction: column;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.prepend(banner);
    
    // Add close functionality
    banner.querySelector('.emergency-close').addEventListener('click', function() {
        banner.style.animation = 'slideUp 0.3s ease-in forwards';
        setTimeout(() => banner.remove(), 300);
        
        // Track banner close
        if (typeof gtag !== 'undefined') {
            gtag('event', 'emergency_banner_close', {
                event_category: 'engagement',
                event_label: 'emergency_banner',
                value: 1
            });
        }
    });
    
    // Track banner show
    if (typeof gtag !== 'undefined') {
        gtag('event', 'emergency_banner_show', {
            event_category: 'engagement',
            event_label: 'emergency_banner',
            value: 1,
            custom_parameter_1: 'franchise_emergency_banner'
        });
    }
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
        if (document.querySelector('.emergency-banner')) {
            banner.querySelector('.emergency-close').click();
        }
    }, 15000);
}

/**
 * Google Analytics Event Tracking - Franchise Approved Metrics
 */
function initAnalyticsTracking() {
    // Track page view with franchise parameters
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            event_category: 'franchise',
            event_label: 'prism_specialties',
            custom_parameter_1: 'dmv_empire',
            custom_parameter_2: document.title
        });
    }
    
    // Track CTA button clicks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.cta-button, .btn-primary');
        if (target) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    event_category: 'conversion',
                    event_label: target.textContent.trim(),
                    value: 1,
                    custom_parameter_1: 'franchise_cta'
                });
            }
        }
    });
    
    // Track service card interactions
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.service-card');
        if (target) {
            const serviceName = target.querySelector('h3')?.textContent || 'Unknown Service';
            if (typeof gtag !== 'undefined') {
                gtag('event', 'service_interest', {
                    event_category: 'engagement',
                    event_label: serviceName,
                    value: 1,
                    custom_parameter_1: 'franchise_service_click'
                });
            }
        }
    });
    
    // Track scroll depth
    let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };
    
    window.addEventListener('scroll', throttle(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        event_category: 'engagement',
                        event_label: `${depth}%`,
                        value: parseInt(depth),
                        custom_parameter_1: 'franchise_scroll_tracking'
                    });
                }
            }
        });
    }, 1000));
    
    // Track time on page
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 30;
        if (timeOnPage === 60 || timeOnPage === 180 || timeOnPage === 300) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    event_category: 'engagement',
                    event_label: `${timeOnPage}_seconds`,
                    value: timeOnPage,
                    custom_parameter_1: 'franchise_time_tracking'
                });
            }
        }
    }, 30000);
    
    // Clear interval on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(timeInterval);
    });
}

/**
 * Utility Functions
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add professional form styling
const formStyles = document.createElement('style');
formStyles.textContent = `
    input.error, textarea.error, select.error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .field-error {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: #dc3545;
    }
`;
document.head.appendChild(formStyles);