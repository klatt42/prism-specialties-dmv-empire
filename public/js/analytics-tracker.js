// PDF Engagement Tracking System for Prism Specialties DMV
// Comprehensive analytics for conversion funnel and user behavior

class PDFAnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.userAgent = navigator.userAgent;
        this.referrer = document.referrer;
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.device = this.detectDevice();
        this.connection = this.detectConnection();

        this.initializeTracking();
    }

    // Generate unique session identifier
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Device detection
    detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);

        return {
            type: isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop',
            platform: isIOS ? 'ios' : (isAndroid ? 'android' : 'desktop'),
            isMobile: isMobile,
            isTablet: isTablet,
            touchCapable: 'ontouchstart' in window
        };
    }

    // Connection detection
    detectConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return {
            effectiveType: connection?.effectiveType || 'unknown',
            downlink: connection?.downlink || 0,
            rtt: connection?.rtt || 0,
            saveData: connection?.saveData || false
        };
    }

    // Initialize tracking
    initializeTracking() {
        this.trackEvent('page_load', {
            url: window.location.href,
            title: document.title,
            referrer: this.referrer,
            device: this.device,
            connection: this.connection,
            viewport: this.viewport,
            timestamp: Date.now()
        });

        this.setupEventListeners();
        this.trackPageVisibility();
        this.startHeartbeat();
    }

    // Track specific events
    trackEvent(eventType, data = {}) {
        const event = {
            sessionId: this.sessionId,
            eventType: eventType,
            timestamp: Date.now(),
            timeOnPage: Date.now() - this.startTime,
            url: window.location.href,
            device: this.device.type,
            platform: this.device.platform,
            ...data
        };

        this.events.push(event);

        // Send to analytics endpoint
        this.sendToAnalytics(event);

        console.log('Analytics Event:', eventType, data);
    }

    // Track conversion funnel steps
    trackFunnelStep(step, data = {}) {
        const funnelEvents = {
            1: 'page_view',
            2: 'modal_opened',
            3: 'form_submitted',
            4: 'pdf_viewed',
            5: 'pdf_downloaded',
            6: 'contact_converted'
        };

        this.trackEvent('funnel_step', {
            step: step,
            stepName: funnelEvents[step],
            ...data
        });
    }

    // Track form interactions
    trackFormAnalytics() {
        // Form focus events
        document.querySelectorAll('input[type="email"], input[type="text"], input[type="tel"]').forEach(input => {
            input.addEventListener('focus', () => {
                this.trackEvent('form_field_focus', {
                    fieldType: input.type,
                    fieldName: input.name || input.id,
                    placeholder: input.placeholder
                });
            });

            input.addEventListener('blur', () => {
                this.trackEvent('form_field_blur', {
                    fieldType: input.type,
                    fieldName: input.name || input.id,
                    hasValue: input.value.length > 0,
                    valueLength: input.value.length
                });
            });
        });

        // Form submission tracking
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = key === 'email' ? '***@***.***' : (value ? '[PROVIDED]' : '[EMPTY]');
                }

                this.trackEvent('form_submitted', {
                    formId: form.id || 'unnamed',
                    fields: data,
                    zipCode: formData.get('zip') || formData.get('userZip'),
                    hasEmail: !!(formData.get('email') || formData.get('userEmail')),
                    hasPhone: !!(formData.get('phone')),
                    submissionTime: Date.now() - this.startTime
                });

                this.trackFunnelStep(3, { formType: form.id });
            });
        });
    }

    // Track PDF engagement
    trackPDFEngagement() {
        let pdfViewStartTime = null;
        let pdfScrollPercentage = 0;
        let maxScrollPercentage = 0;

        // PDF iframe load tracking
        const pdfFrame = document.getElementById('pdfFrame');
        if (pdfFrame) {
            pdfFrame.addEventListener('load', () => {
                pdfViewStartTime = Date.now();
                this.trackEvent('pdf_loaded', {
                    loadTime: Date.now() - this.startTime,
                    pdfSrc: pdfFrame.src
                });

                this.trackFunnelStep(4, { pdfType: this.extractChecklistType() });
            });

            // Track PDF interaction time
            setInterval(() => {
                if (pdfViewStartTime && this.isElementVisible(pdfFrame)) {
                    const viewTime = Date.now() - pdfViewStartTime;

                    // Track milestones
                    if (viewTime >= 30000 && !this.hasTracked('pdf_30_seconds')) {
                        this.trackEvent('pdf_engagement', { milestone: '30_seconds', viewTime });
                        this.setTracked('pdf_30_seconds');
                    }
                    if (viewTime >= 60000 && !this.hasTracked('pdf_1_minute')) {
                        this.trackEvent('pdf_engagement', { milestone: '1_minute', viewTime });
                        this.setTracked('pdf_1_minute');
                    }
                    if (viewTime >= 180000 && !this.hasTracked('pdf_3_minutes')) {
                        this.trackEvent('pdf_engagement', { milestone: '3_minutes', viewTime });
                        this.setTracked('pdf_3_minutes');
                    }
                }
            }, 5000);
        }

        // PDF download tracking
        document.querySelectorAll('[id*="download"], [class*="download"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('pdf_download_initiated', {
                    buttonText: btn.textContent.trim(),
                    timeBeforeDownload: Date.now() - this.startTime,
                    pdfViewTime: pdfViewStartTime ? Date.now() - pdfViewStartTime : 0
                });

                this.trackFunnelStep(5, { downloadMethod: 'button_click' });
            });
        });
    }

    // Track user behavior patterns
    trackBehaviorPatterns() {
        let scrollDepth = 0;
        let maxScrollDepth = 0;
        let scrollEvents = 0;

        // Scroll tracking
        window.addEventListener('scroll', () => {
            scrollEvents++;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollDepth = Math.round((scrollTop / docHeight) * 100);

            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;

                // Track scroll milestones
                [25, 50, 75, 90].forEach(milestone => {
                    if (scrollDepth >= milestone && !this.hasTracked(`scroll_${milestone}`)) {
                        this.trackEvent('scroll_depth', {
                            percentage: milestone,
                            actualPercentage: scrollDepth
                        });
                        this.setTracked(`scroll_${milestone}`);
                    }
                });
            }
        });

        // Exit intent tracking (desktop only)
        if (this.device.type === 'desktop') {
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && !this.hasTracked('exit_intent')) {
                    this.trackEvent('exit_intent', {
                        timeOnPage: Date.now() - this.startTime,
                        maxScrollDepth: maxScrollDepth,
                        scrollEvents: scrollEvents
                    });
                    this.setTracked('exit_intent');
                }
            });
        }

        // Click tracking for important elements
        document.addEventListener('click', (e) => {
            const element = e.target;

            // Track emergency calls
            if (element.href && element.href.includes('tel:')) {
                this.trackEvent('emergency_call_clicked', {
                    phoneNumber: element.href.replace('tel:', ''),
                    elementText: element.textContent.trim(),
                    timeOnPage: Date.now() - this.startTime
                });
            }

            // Track share actions
            if (element.id && element.id.includes('share')) {
                this.trackEvent('share_clicked', {
                    shareMethod: element.id,
                    elementText: element.textContent.trim()
                });
            }
        });
    }

    // Track geographic data
    trackGeographicData(zipCode) {
        if (zipCode) {
            const dmvZipCodes = {
                // DC
                '20001': 'Washington DC', '20002': 'Washington DC', '20003': 'Washington DC',
                '20004': 'Washington DC', '20005': 'Washington DC', '20006': 'Washington DC',

                // Maryland
                '20852': 'Rockville, MD', '20854': 'Potomac, MD', '20878': 'Gaithersburg, MD',
                '20901': 'Silver Spring, MD', '20910': 'Silver Spring, MD',

                // Virginia
                '22101': 'McLean, VA', '22102': 'McLean, VA', '22182': 'Vienna, VA',
                '22180': 'Vienna, VA', '22031': 'Fairfax, VA', '22032': 'Fairfax, VA'
            };

            const location = dmvZipCodes[zipCode] || 'Outside DMV';
            const state = zipCode.startsWith('20') ?
                (zipCode >= '20001' && zipCode <= '20599' ? 'DC' : 'MD') : 'VA';

            this.trackEvent('geographic_data', {
                zipCode: zipCode,
                location: location,
                state: state,
                inServiceArea: !!dmvZipCodes[zipCode]
            });
        }
    }

    // Track referral sources
    trackReferralSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const fbclid = urlParams.get('fbclid');
        const gclid = urlParams.get('gclid');

        let source = 'direct';
        if (this.referrer) {
            if (this.referrer.includes('google')) source = 'google_organic';
            else if (this.referrer.includes('facebook')) source = 'facebook';
            else if (this.referrer.includes('bing')) source = 'bing';
            else source = 'referral';
        }

        if (utmSource) source = utmSource;
        if (gclid) source = 'google_ads';
        if (fbclid) source = 'facebook_ads';

        this.trackEvent('traffic_source', {
            source: source,
            medium: utmMedium,
            campaign: utmCampaign,
            referrer: this.referrer,
            hasUTM: !!(utmSource || utmMedium || utmCampaign),
            hasPaidClick: !!(gclid || fbclid)
        });
    }

    // Setup event listeners
    setupEventListeners() {
        this.trackFormAnalytics();
        this.trackPDFEngagement();
        this.trackBehaviorPatterns();
        this.trackReferralSource();

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('page_visibility_change', {
                hidden: document.hidden,
                timeOnPage: Date.now() - this.startTime
            });
        });

        // Window beforeunload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_unload', {
                totalTimeOnPage: Date.now() - this.startTime,
                eventCount: this.events.length
            });
        });
    }

    // Heartbeat to track session duration
    startHeartbeat() {
        setInterval(() => {
            if (!document.hidden) {
                this.trackEvent('heartbeat', {
                    timeOnPage: Date.now() - this.startTime,
                    eventCount: this.events.length
                });
            }
        }, 30000); // Every 30 seconds
    }

    // Track page visibility
    trackPageVisibility() {
        let visibilityStart = Date.now();

        document.addEventListener('visibilitychange', () => {
            const now = Date.now();
            if (document.hidden) {
                this.trackEvent('page_hidden', {
                    visibleTime: now - visibilityStart
                });
            } else {
                visibilityStart = now;
                this.trackEvent('page_visible');
            }
        });
    }

    // Utility functions
    extractChecklistType() {
        const url = window.location.href;
        if (url.includes('fire')) return 'fire_damage';
        if (url.includes('water')) return 'water_damage';
        if (url.includes('document')) return 'document_recovery';
        if (url.includes('lightning')) return 'lightning_strike';
        return 'general';
    }

    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    hasTracked(eventKey) {
        return localStorage.getItem(`tracked_${eventKey}`) === 'true';
    }

    setTracked(eventKey) {
        localStorage.setItem(`tracked_${eventKey}`, 'true');
    }

    // Send to analytics endpoint
    async sendToAnalytics(event) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    // Public methods for manual tracking
    trackModalOpen(modalType) {
        this.trackEvent('modal_opened', { modalType });
        this.trackFunnelStep(2, { modalType });
    }

    trackFormStart(formType) {
        this.trackEvent('form_started', { formType });
    }

    trackPDFView(checklistType) {
        this.trackEvent('pdf_view_started', { checklistType });
        this.trackFunnelStep(4, { checklistType });
    }

    trackContactConversion(conversionType) {
        this.trackEvent('contact_conversion', { conversionType });
        this.trackFunnelStep(6, { conversionType });
    }

    // Get session summary
    getSessionSummary() {
        return {
            sessionId: this.sessionId,
            totalTime: Date.now() - this.startTime,
            eventCount: this.events.length,
            device: this.device,
            events: this.events
        };
    }
}

// Initialize analytics tracker
const analytics = new PDFAnalyticsTracker();

// Export for global use
window.PDFAnalytics = analytics;

// Track page view immediately
analytics.trackFunnelStep(1, {
    page: window.location.pathname,
    title: document.title
});

console.log('PDF Analytics Tracker initialized');