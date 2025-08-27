// ALEX ANALYTICS - Phase 5: Enhanced Empire Performance Monitoring
// Advanced tracking for 57+ pages with Authority Reversal Framework

(function() {
    'use strict';
    
    // Enhanced Analytics Configuration
    const ALEX_ANALYTICS = {
        GA_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
        EMPIRE_VERSION: '5.0',
        TOTAL_PAGES: 57,
        REGIONS: {
            MD: { phone: '301-215-3191', name: 'Maryland', pages: 22 },
            DC: { phone: '202-335-4240', name: 'Washington DC', pages: 6 },
            VA: { phone: '703-229-1321', name: 'Northern Virginia', pages: 29 }
        },
        SPECIALTIES: ['art-collectibles', 'textile-fabric', 'electronics-data', 'document-photo'],
        DAMAGE_TYPES: ['fire-damage', 'water-damage', 'storm-mold', 'emergency']
    };
    
    // Page Classification Engine
    class PageClassifier {
        constructor() {
            this.currentPage = this.analyzePage();
        }
        
        analyzePage() {
            const path = window.location.pathname;
            const title = document.title;
            
            return {
                region: this.determineRegion(path),
                specialty: this.determineSpecialty(path, title),
                damageType: this.determineDamageType(path),
                pageType: this.determinePageType(path),
                phone: this.determinePhone(path),
                funeralMentions: this.countFuneralMentions(),
                authorityElements: this.countAuthorityElements(),
                hookElements: this.countHookElements()
            };
        }
        
        determineRegion(path) {
            if (path.includes('northern-virginia') || path.includes('fairfax') || path.includes('loudoun') || path.includes('prince-william')) {
                return 'VA';
            } else if (path.includes('washington-dc')) {
                return 'DC';
            } else if (path.includes('western-maryland') || path.includes('montgomery-county')) {
                return 'MD';
            }
            return 'UNKNOWN';
        }
        
        determineSpecialty(path, title) {
            for (let specialty of ALEX_ANALYTICS.SPECIALTIES) {
                if (path.includes(specialty) || title.toLowerCase().includes(specialty.replace('-', ' '))) {
                    return specialty;
                }
            }
            return 'general';
        }
        
        determineDamageType(path) {
            for (let damage of ALEX_ANALYTICS.DAMAGE_TYPES) {
                if (path.includes(damage)) {
                    return damage;
                }
            }
            return 'none';
        }
        
        determinePageType(path) {
            if (path.includes('/geographic/')) return 'geographic_hub';
            if (path.includes('/public/')) return 'public_service';
            if (path.includes('/specialties/')) return 'specialty_master';
            if (path === '/' || path === '/index.html') return 'homepage';
            return 'other';
        }
        
        determinePhone(region) {
            return ALEX_ANALYTICS.REGIONS[region]?.phone || 'unknown';
        }
        
        countFuneralMentions() {
            const content = document.body.textContent.toLowerCase();
            const matches = content.match(/funeral director/g);
            return matches ? matches.length : 0;
        }
        
        countAuthorityElements() {
            return document.querySelectorAll('.authority-reversal').length;
        }
        
        countHookElements() {
            return document.querySelectorAll('.hook-point').length;
        }
    }
    
    // Enhanced Performance Monitor
    class PerformanceMonitor {
        constructor() {
            this.metrics = {};
            this.startTime = performance.now();
        }
        
        trackPageLoad() {
            window.addEventListener('load', () => {
                const loadTime = performance.now() - this.startTime;
                const perfData = performance.getEntriesByType('navigation')[0];
                
                this.metrics = {
                    loadTime: Math.round(loadTime),
                    domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    firstContentfulPaint: this.getFCP(),
                    largestContentfulPaint: this.getLCP(),
                    cumulativeLayoutShift: this.getCLS(),
                    meetsFuneralDirectorStandard: loadTime < 542
                };
                
                this.reportPerformance();
            });
        }
        
        getFCP() {
            const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
            return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
        }
        
        getLCP() {
            return new Promise((resolve) => {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(Math.round(lastEntry.startTime));
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            });
        }
        
        getCLS() {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
            return clsValue;
        }
        
        reportPerformance() {
            gtag('event', 'empire_performance', {
                load_time: this.metrics.loadTime,
                dom_content_loaded: this.metrics.domContentLoaded,
                first_contentful_paint: this.metrics.firstContentfulPaint,
                meets_funeral_director_standard: this.metrics.meetsFuneralDirectorStandard,
                page_type: pageClassifier.currentPage.pageType,
                region: pageClassifier.currentPage.region,
                specialty: pageClassifier.currentPage.specialty
            });
        }
    }
    
    // Authority Reversal Effectiveness Tracker
    class AuthorityReversalTracker {
        constructor() {
            this.interactionCount = 0;
            this.conversionEvents = [];
        }
        
        trackAuthorityInteractions() {
            // Track authority reversal element clicks
            document.querySelectorAll('.authority-reversal').forEach((element, index) => {
                element.addEventListener('click', () => {
                    this.interactionCount++;
                    const funeralText = element.textContent.toLowerCase();
                    
                    gtag('event', 'authority_reversal_interaction', {
                        element_index: index,
                        interaction_count: this.interactionCount,
                        funeral_director_present: funeralText.includes('funeral director'),
                        region: pageClassifier.currentPage.region,
                        specialty: pageClassifier.currentPage.specialty,
                        value: 10 // Authority interaction value
                    });
                    
                    this.trackPsychologyTrigger('authority_click');
                });
                
                // Track hover events for engagement
                element.addEventListener('mouseenter', () => {
                    gtag('event', 'authority_reversal_hover', {
                        element_index: index,
                        region: pageClassifier.currentPage.region,
                        value: 2
                    });
                });
            });
            
            // Track hook point effectiveness
            document.querySelectorAll('.hook-point').forEach((element, index) => {
                element.addEventListener('click', () => {
                    const hookText = element.textContent;
                    
                    gtag('event', 'hook_point_effectiveness', {
                        element_index: index,
                        hook_length: hookText.length,
                        funeral_director_in_hook: hookText.toLowerCase().includes('funeral director'),
                        region: pageClassifier.currentPage.region,
                        value: 15 // Hook interaction value
                    });
                    
                    this.trackPsychologyTrigger('hook_click');
                });
            });
        }
        
        trackPsychologyTrigger(triggerType) {
            const psychologyData = {
                trigger_type: triggerType,
                funeral_mentions: pageClassifier.currentPage.funeralMentions,
                authority_elements: pageClassifier.currentPage.authorityElements,
                psychology_density: this.calculatePsychologyDensity(),
                region: pageClassifier.currentPage.region,
                specialty: pageClassifier.currentPage.specialty
            };
            
            gtag('event', 'psychology_trigger', psychologyData);
            this.conversionEvents.push({ type: triggerType, timestamp: Date.now(), data: psychologyData });
        }
        
        calculatePsychologyDensity() {
            const totalWords = document.body.textContent.split(' ').length;
            const funeralMentions = pageClassifier.currentPage.funeralMentions;
            return (funeralMentions / totalWords * 1000).toFixed(2); // Per 1000 words
        }
    }
    
    // Regional Phone Number Tracker
    class PhoneTracker {
        constructor() {
            this.callAttempts = 0;
        }
        
        trackPhoneCalls() {
            document.querySelectorAll('a[href^="tel:"]').forEach((phoneLink, index) => {
                phoneLink.addEventListener('click', () => {
                    this.callAttempts++;
                    const phoneNumber = phoneLink.href.replace('tel:', '');
                    const cleanPhone = phoneNumber.replace(/\D/g, '');
                    const expectedPhone = pageClassifier.currentPage.phone.replace(/\D/g, '');
                    const isCorrectRegion = cleanPhone === expectedPhone;
                    
                    gtag('event', 'phone_call_attempt', {
                        phone_number: phoneNumber,
                        expected_phone: pageClassifier.currentPage.phone,
                        region_match: isCorrectRegion,
                        call_sequence: this.callAttempts,
                        region: pageClassifier.currentPage.region,
                        specialty: pageClassifier.currentPage.specialty,
                        page_type: pageClassifier.currentPage.pageType,
                        value: isCorrectRegion ? 50 : 25 // Higher value for correct regional calls
                    });
                    
                    // Track regional phone performance
                    this.trackRegionalPhonePerformance(phoneNumber, isCorrectRegion);
                });
            });
        }
        
        trackRegionalPhonePerformance(phoneNumber, isCorrect) {
            const regionData = ALEX_ANALYTICS.REGIONS[pageClassifier.currentPage.region];
            
            gtag('event', 'regional_phone_performance', {
                region_name: regionData?.name || 'Unknown',
                region_code: pageClassifier.currentPage.region,
                total_region_pages: regionData?.pages || 0,
                phone_accuracy: isCorrect,
                conversion_potential: isCorrect ? 'high' : 'medium'
            });
        }
    }
    
    // Specialty Service Performance Analyzer
    class SpecialtyAnalyzer {
        constructor() {
            this.serviceInteractions = {};
        }
        
        trackSpecialtyPerformance() {
            // Track service card interactions
            document.querySelectorAll('.service-card').forEach((card, index) => {
                const serviceName = card.querySelector('h3')?.textContent || 'Unknown Service';
                
                card.addEventListener('click', () => {
                    if (!this.serviceInteractions[serviceName]) {
                        this.serviceInteractions[serviceName] = 0;
                    }
                    this.serviceInteractions[serviceName]++;
                    
                    gtag('event', 'specialty_service_interest', {
                        service_name: serviceName,
                        service_index: index,
                        interaction_count: this.serviceInteractions[serviceName],
                        specialty_category: pageClassifier.currentPage.specialty,
                        region: pageClassifier.currentPage.region,
                        damage_type: pageClassifier.currentPage.damageType,
                        value: 8
                    });
                });
                
                // Track hover for interest measurement
                card.addEventListener('mouseenter', () => {
                    gtag('event', 'specialty_service_hover', {
                        service_name: serviceName,
                        specialty_category: pageClassifier.currentPage.specialty,
                        region: pageClassifier.currentPage.region,
                        value: 3
                    });
                });
            });
            
            // Track CTA button effectiveness by specialty
            document.querySelectorAll('.btn').forEach((button, index) => {
                button.addEventListener('click', () => {
                    const buttonText = button.textContent.trim();
                    const isEmergency = buttonText.toLowerCase().includes('emergency');
                    const isPrimary = button.classList.contains('btn-primary');
                    
                    gtag('event', 'specialty_cta_click', {
                        button_text: buttonText,
                        button_type: isPrimary ? 'primary' : 'secondary',
                        is_emergency_cta: isEmergency,
                        specialty_category: pageClassifier.currentPage.specialty,
                        region: pageClassifier.currentPage.region,
                        value: isEmergency ? 20 : (isPrimary ? 15 : 8)
                    });
                });
            });
        }
    }
    
    // Initialize all tracking systems
    const pageClassifier = new PageClassifier();
    const performanceMonitor = new PerformanceMonitor();
    const authorityTracker = new AuthorityReversalTracker();
    const phoneTracker = new PhoneTracker();
    const specialtyAnalyzer = new SpecialtyAnalyzer();
    
    // Start tracking when DOM is ready
    function initializeAlexAnalytics() {
        // Track initial page view with comprehensive data
        gtag('event', 'empire_page_view', {
            empire_version: ALEX_ANALYTICS.EMPIRE_VERSION,
            region: pageClassifier.currentPage.region,
            specialty: pageClassifier.currentPage.specialty,
            damage_type: pageClassifier.currentPage.damageType,
            page_type: pageClassifier.currentPage.pageType,
            funeral_mentions: pageClassifier.currentPage.funeralMentions,
            authority_elements: pageClassifier.currentPage.authorityElements,
            hook_elements: pageClassifier.currentPage.hookElements,
            phone_region: pageClassifier.currentPage.phone,
            psychology_implemented: pageClassifier.currentPage.funeralMentions > 0
        });
        
        // Initialize all tracking systems
        performanceMonitor.trackPageLoad();
        authorityTracker.trackAuthorityInteractions();
        phoneTracker.trackPhoneCalls();
        specialtyAnalyzer.trackSpecialtyPerformance();
        
        console.log('📊 ALEX ANALYTICS Phase 5 initialized');
        console.log('🎯 Tracking 57+ empire pages');
        console.log('🎭 Authority Reversal Framework: Active');
        console.log('📞 Regional phone tracking: Enabled');
        console.log('⚡ Performance monitoring: Funeral Director Standard™');
    }
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAlexAnalytics);
    } else {
        initializeAlexAnalytics();
    }
    
    // Global ALEX ANALYTICS interface
    window.ALEX_ANALYTICS = {
        version: ALEX_ANALYTICS.EMPIRE_VERSION,
        pageData: pageClassifier.currentPage,
        trackCustomEvent: (eventName, eventData) => {
            gtag('event', eventName, eventData);
        },
        getEmpireStats: () => ({
            totalPages: ALEX_ANALYTICS.TOTAL_PAGES,
            regions: Object.keys(ALEX_ANALYTICS.REGIONS).length,
            specialties: ALEX_ANALYTICS.SPECIALTIES.length,
            currentPage: pageClassifier.currentPage
        })
    };
})();