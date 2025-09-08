/**
 * Hook Point A/B Testing Framework
 * Tests different messaging variants for Prism Specialties DMV Empire
 */

class HookPointTesting {
    constructor() {
        this.phoneNumber = '703-229-1321';
        this.sessionKey = 'hookpoint_variant';
        this.variants = {
            'A': {
                headline: 'Insurance Adjusters HATE This One Trick...',
                subtext: 'You have the legal right to choose your own restoration company',
                color: '#FF4444',
                weight: 33.3
            },
            'B': {
                headline: '347 DMV Families Trusted Us This Year',
                subtext: 'Join thousands who chose quality over insurance minimums',
                color: '#44AA44',
                weight: 33.3
            },
            'C': {
                headline: '⚠️ Every Minute Counts in Specialty Damage!',
                subtext: 'Immediate response prevents 70% of secondary damage',
                color: '#FF8800',
                weight: 33.4
            }
        };
        this.selectedVariant = null;
        this.init();
    }

    init() {
        this.selectedVariant = this.getOrSelectVariant();
        this.trackVariantView();
        this.setupPhoneTracking();
    }

    getOrSelectVariant() {
        // Check session storage for existing variant
        let storedVariant = sessionStorage.getItem(this.sessionKey);
        
        if (storedVariant && this.variants[storedVariant]) {
            return storedVariant;
        }

        // Select new variant with equal distribution
        const random = Math.random() * 100;
        if (random < 33.3) {
            storedVariant = 'A';
        } else if (random < 66.6) {
            storedVariant = 'B';
        } else {
            storedVariant = 'C';
        }

        // Store in session storage
        sessionStorage.setItem(this.sessionKey, storedVariant);
        return storedVariant;
    }

    getVariantData() {
        return this.variants[this.selectedVariant];
    }

    trackVariantView() {
        // Google Analytics event tracking
        if (typeof gtag === 'function') {
            gtag('event', 'hook_point_view', {
                'event_category': 'A/B Testing',
                'event_label': `Variant ${this.selectedVariant}`,
                'variant': this.selectedVariant,
                'headline': this.variants[this.selectedVariant].headline
            });
        }

        // Fallback for GA Universal Analytics
        if (typeof ga === 'function') {
            ga('send', 'event', 'A/B Testing', 'hook_point_view', `Variant ${this.selectedVariant}`);
        }

        console.log(`Hook Point Variant ${this.selectedVariant} viewed:`, this.variants[this.selectedVariant]);
    }

    trackConversion() {
        // Google Analytics conversion tracking
        if (typeof gtag === 'function') {
            gtag('event', 'hook_point_conversion', {
                'event_category': 'A/B Testing',
                'event_label': `Variant ${this.selectedVariant}`,
                'variant': this.selectedVariant,
                'value': 1
            });
        }

        // Fallback for GA Universal Analytics
        if (typeof ga === 'function') {
            ga('send', 'event', 'A/B Testing', 'hook_point_conversion', `Variant ${this.selectedVariant}`, 1);
        }

        console.log(`Hook Point Variant ${this.selectedVariant} converted`);
    }

    setupPhoneTracking() {
        // Track phone number clicks
        document.addEventListener('click', (event) => {
            const target = event.target;
            const phoneLink = target.closest(`a[href*="${this.phoneNumber}"]`);
            
            if (phoneLink) {
                this.trackConversion();
                
                // Additional phone click tracking
                if (typeof gtag === 'function') {
                    gtag('event', 'phone_click', {
                        'event_category': 'Contact',
                        'event_label': `Variant ${this.selectedVariant} - ${this.phoneNumber}`,
                        'variant': this.selectedVariant,
                        'phone_number': this.phoneNumber
                    });
                }

                console.log(`Phone click tracked for variant ${this.selectedVariant}: ${this.phoneNumber}`);
            }
        });
    }

    renderHookPoint(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        const variant = this.getVariantData();
        
        container.innerHTML = `
            <div class="hook-point-container" data-variant="${this.selectedVariant}" style="
                background: linear-gradient(135deg, ${variant.color}22, ${variant.color}11);
                border-left: 4px solid ${variant.color};
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
                <h2 class="hook-point-headline" style="
                    color: ${variant.color};
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0 0 10px 0;
                    line-height: 1.3;
                ">${variant.headline}</h2>
                <p class="hook-point-subtext" style="
                    color: #333;
                    font-size: 16px;
                    margin: 0 0 15px 0;
                    line-height: 1.5;
                ">${variant.subtext}</p>
                <a href="tel:${this.phoneNumber}" class="hook-point-cta" style="
                    display: inline-block;
                    background: ${variant.color};
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 18px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.3)';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)';">
                    📞 Call ${this.phoneNumber}
                </a>
            </div>
        `;
    }

    // Utility method to get current variant info
    getCurrentVariant() {
        return {
            variant: this.selectedVariant,
            data: this.getVariantData()
        };
    }

    // Method to manually trigger conversion tracking
    triggerConversion() {
        this.trackConversion();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.hookPointTest = new HookPointTesting();
    
    // Auto-render if container exists
    const defaultContainer = document.getElementById('hook-point-container');
    if (defaultContainer) {
        window.hookPointTest.renderHookPoint('hook-point-container');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HookPointTesting;
}