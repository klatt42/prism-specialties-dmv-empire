// ALEX ANALYTICS - Comprehensive Performance & Psychology Tracking
// Google Analytics 4 + Authority Reversal Framework Monitoring

// Google Analytics 4 Configuration
(function() {
    // GA4 Measurement ID (replace with actual ID)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    // Load GA4
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
            'geographic_region': 'geographic_region',
            'specialty_type': 'specialty_type',
            'phone_region': 'phone_region',
            'funeral_director_mentions': 'funeral_director_mentions'
        }
    });
    
    // Determine geographic region and phone number
    function getGeographicData() {
        const path = window.location.pathname;
        let region = 'unknown';
        let phone = 'unknown';
        let specialty = 'general';
        
        if (path.includes('northern-virginia')) {
            region = 'northern_virginia';
            phone = '703-229-1321';
        } else if (path.includes('washington-dc')) {
            region = 'washington_dc';
            phone = '202-335-4240';
        } else if (path.includes('western-maryland')) {
            region = 'western_maryland';
            phone = '301-215-3191';
        }
        
        if (path.includes('art-collectibles') || path.includes('art-restoration')) {
            specialty = 'art_collectibles';
        } else if (path.includes('textile-fabric') || path.includes('textile-restoration')) {
            specialty = 'textile_fabric';
        } else if (path.includes('electronics-data') || path.includes('electronics-restoration')) {
            specialty = 'electronics_data';
        } else if (path.includes('document-photo') || path.includes('document-restoration')) {
            specialty = 'document_photo';
        } else if (path.includes('fire-damage')) {
            specialty = 'fire_damage';
        } else if (path.includes('water-damage')) {
            specialty = 'water_damage';
        } else if (path.includes('emergency')) {
            specialty = 'emergency';
        }
        
        return { region, phone, specialty };
    }
    
    // Track page view with custom parameters
    function trackPageView() {
        const geoData = getGeographicData();
        const funeralMentions = document.body.innerHTML.match(/funeral director/gi)?.length || 0;
        
        gtag('event', 'page_view', {
            geographic_region: geoData.region,
            specialty_type: geoData.specialty,
            phone_region: geoData.phone,
            funeral_director_mentions: funeralMentions,
            authority_reversal_present: funeralMentions > 0
        });
    }
    
    // Track Authority Reversal interactions
    function trackAuthorityReversal() {
        const authorityElements = document.querySelectorAll('.authority-reversal');
        authorityElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                gtag('event', 'authority_reversal_click', {
                    element_index: index,
                    page_type: getGeographicData().specialty,
                    geographic_region: getGeographicData().region
                });
            });
        });
        
        // Track hook point interactions
        const hookElements = document.querySelectorAll('.hook-point');
        hookElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                gtag('event', 'hook_point_click', {
                    element_index: index,
                    hook_text: element.textContent.substring(0, 100),
                    geographic_region: getGeographicData().region
                });
            });
        });
    }
    
    // Track phone number clicks by region
    function trackPhoneCalls() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                const phoneNumber = link.href.replace('tel:', '');
                const geoData = getGeographicData();
                
                gtag('event', 'phone_call', {
                    phone_number: phoneNumber,
                    geographic_region: geoData.region,
                    expected_phone: geoData.phone,
                    phone_match: phoneNumber.replace(/\D/g, '') === geoData.phone.replace(/\D/g, ''),
                    value: 25 // Assign value to phone calls
                });
            });
        });
    }
    
    // Track form interactions
    function trackFormInteractions() {
        const ctaButtons = document.querySelectorAll('.btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                gtag('event', 'cta_click', {
                    button_text: button.textContent,
                    button_type: button.classList.contains('btn-primary') ? 'primary' : 'secondary',
                    geographic_region: getGeographicData().region
                });
            });
        });
    }
    
    // Performance monitoring
    function trackPerformance() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            gtag('event', 'page_load_time', {
                load_time: Math.round(loadTime),
                meets_funeral_director_standard: loadTime < 542, // <542ms standard
                geographic_region: getGeographicData().region,
                value: loadTime < 542 ? 10 : 0
            });
        });
    }
    
    // Funeral Director Psychology Metrics
    function trackPsychologyMetrics() {
        const funeralMentions = document.body.innerHTML.match(/funeral director/gi)?.length || 0;
        const authorityElements = document.querySelectorAll('.authority-reversal').length;
        const hookElements = document.querySelectorAll('.hook-point').length;
        
        gtag('event', 'psychology_metrics', {
            funeral_director_mentions: funeralMentions,
            authority_elements: authorityElements,
            hook_elements: hookElements,
            psychology_density: funeralMentions / (document.body.textContent.split(' ').length / 100),
            geographic_region: getGeographicData().region
        });
    }
    
    // Initialize tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTracking);
    } else {
        initializeTracking();
    }
    
    function initializeTracking() {
        trackPageView();
        trackAuthorityReversal();
        trackPhoneCalls();
        trackFormInteractions();
        trackPerformance();
        trackPsychologyMetrics();
        
        console.log('🔍 ALEX ANALYTICS: Comprehensive tracking initialized');
        console.log('📊 Geographic Region:', getGeographicData().region);
        console.log('🎯 Specialty Type:', getGeographicData().specialty);
        console.log('📞 Phone Region:', getGeographicData().phone);
    }
})();