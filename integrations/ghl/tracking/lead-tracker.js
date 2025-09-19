class PrismLeadTracker {
    constructor() {
        this.config = GHL_CONFIG;
        this.sessionData = this.initializeSession();
        this.setupEventListeners();
    }

    initializeSession() {
        const session = {
            sessionId: this.generateSessionId(),
            visitedPages: [],
            contentScore: 0,
            region: this.detectRegion(),
            startTime: Date.now(),
            leadQuality: 'cold'
        };

        // Store in sessionStorage
        sessionStorage.setItem('prismSession', JSON.stringify(session));
        return session;
    }

    generateSessionId() {
        return 'prism_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }

    // Content-based scoring system
    trackPageView(pageType, pageUrl) {
        this.sessionData.visitedPages.push({
            url: pageUrl,
            type: pageType,
            timestamp: Date.now(),
            timeSpent: 0
        });

        // Add content score based on page type
        if (this.config.contentScores[pageType]) {
            this.sessionData.contentScore += this.config.contentScores[pageType];
        }

        this.updateLeadQuality();
        this.syncToGHL();
    }

    // Regional phone number display
    detectRegion() {
        // Logic to detect user region (IP-based or form input)
        // For now, detect from URL or default to DC
        const path = window.location.pathname;
        if (path.includes('virginia') || path.includes('va-')) return 'VA';
        if (path.includes('maryland') || path.includes('md-')) return 'MD';
        return 'DC'; // Default
    }

    updateLeadQuality() {
        const score = this.sessionData.contentScore;
        if (score >= 100) this.sessionData.leadQuality = 'hot';
        else if (score >= 50) this.sessionData.leadQuality = 'warm';
        else this.sessionData.leadQuality = 'cold';

        // Update UI based on lead quality
        this.updatePhoneDisplays();
    }

    // Update phone number displays based on region and lead quality
    updatePhoneDisplays() {
        const phoneNumber = this.config.phoneNumbers[this.sessionData.region];
        const isHighValue = this.sessionData.leadQuality === 'hot' || this.sessionData.leadQuality === 'warm';

        // Update all phone displays
        document.querySelectorAll('[data-phone-region]').forEach(element => {
            const region = element.getAttribute('data-phone-region');
            if (region === this.sessionData.region || region === 'auto') {
                element.textContent = this.config.phoneNumbers[this.sessionData.region];
                element.href = `tel:${this.config.phoneNumbers[this.sessionData.region]}`;

                // Enhance visibility for high-value leads
                if (isHighValue) {
                    element.classList.add('high-value-lead');
                    element.style.animation = 'pulse 2s infinite';
                }
            }
        });
    }

    // Setup event listeners for enhanced tracking
    setupEventListeners() {
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.emergency-phone-cta, [href^="tel:"]')) {
                this.trackEmergencyContact(e.target);
            }

            if (e.target.matches('.restoration-cta, .service-cta')) {
                this.trackServiceInterest(e.target);
            }
        });

        // Track scroll depth for engagement
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent >= 75) {
                    this.sessionData.contentScore += 10;
                    this.updateLeadQuality();
                }
            }
        });

        // Track time spent
        setInterval(() => {
            this.updateTimeSpent();
        }, 30000); // Every 30 seconds
    }

    // Track emergency contact attempts
    trackEmergencyContact(element) {
        this.sessionData.contentScore += 50; // High value action
        this.updateLeadQuality();

        const contactData = {
            type: 'emergency_contact',
            phoneNumber: element.href.replace('tel:', ''),
            timestamp: Date.now(),
            urgency: 'high'
        };

        this.sendImmediateAlert(contactData);
        this.syncToGHL();
    }

    // Track service interest
    trackServiceInterest(element) {
        this.sessionData.contentScore += 25;
        this.updateLeadQuality();

        const serviceType = this.extractServiceType(element);
        this.trackInteraction({
            type: 'service_interest',
            service: serviceType,
            timestamp: Date.now()
        });
    }

    // Extract service type from element
    extractServiceType(element) {
        const text = element.textContent.toLowerCase();
        if (text.includes('textile') || text.includes('wedding') || text.includes('uniform')) return 'textile';
        if (text.includes('art') || text.includes('painting') || text.includes('canvas')) return 'art';
        if (text.includes('document') || text.includes('paper') || text.includes('records')) return 'document';
        if (text.includes('electronics') || text.includes('audio') || text.includes('equipment')) return 'electronics';
        return 'general';
    }

    // Update time spent on current page
    updateTimeSpent() {
        if (this.sessionData.visitedPages.length > 0) {
            const currentPage = this.sessionData.visitedPages[this.sessionData.visitedPages.length - 1];
            currentPage.timeSpent = Date.now() - currentPage.timestamp;

            // Award points for extended engagement
            if (currentPage.timeSpent > 180000) { // 3 minutes
                this.sessionData.contentScore += 15;
                this.updateLeadQuality();
            }
        }
    }

    // Track general interactions
    trackInteraction(interactionData) {
        if (!this.sessionData.interactions) {
            this.sessionData.interactions = [];
        }
        this.sessionData.interactions.push(interactionData);
        this.syncToGHL();
    }

    // Send immediate alert for high-priority actions
    async sendImmediateAlert(alertData) {
        const payload = {
            type: 'immediate_alert',
            sessionId: this.sessionData.sessionId,
            alertData: alertData,
            leadQuality: this.sessionData.leadQuality,
            contactScore: this.sessionData.contentScore,
            timestamp: Date.now()
        };

        // Store locally for development
        localStorage.setItem(`prism_alert_${Date.now()}`, JSON.stringify(payload));

        console.log('🚨 IMMEDIATE ALERT:', payload);

        // In production, this would trigger immediate GHL webhook
        // await fetch('https://hooks.gohighlevel.com/webhook/your-webhook-id', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });
    }

    // GHL API integration
    async syncToGHL() {
        const payload = {
            sessionId: this.sessionData.sessionId,
            contentScore: this.sessionData.contentScore,
            leadQuality: this.sessionData.leadQuality,
            region: this.sessionData.region,
            visitedPages: this.sessionData.visitedPages,
            interactions: this.sessionData.interactions || [],
            sessionDuration: Date.now() - this.sessionData.startTime,
            timestamp: Date.now()
        };

        // Store session data
        sessionStorage.setItem('prismSession', JSON.stringify(this.sessionData));

        // Store for GHL sync (development mode)
        localStorage.setItem(`prism_sync_${Date.now()}`, JSON.stringify(payload));

        console.log('📊 Syncing to GHL:', payload);

        // In production, this would sync to GHL API
        // await fetch(`${this.config.apiBase}/contacts/upsert`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${this.config.apiKey}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(payload)
        // });
    }

    // Get current session status
    getSessionStatus() {
        return {
            sessionId: this.sessionData.sessionId,
            contentScore: this.sessionData.contentScore,
            leadQuality: this.sessionData.leadQuality,
            region: this.sessionData.region,
            pagesVisited: this.sessionData.visitedPages.length,
            sessionDuration: Date.now() - this.sessionData.startTime,
            interactions: (this.sessionData.interactions || []).length
        };
    }

    // Manual lead temperature override (for testing)
    setLeadTemperature(temperature) {
        this.sessionData.leadQuality = temperature;
        this.updatePhoneDisplays();
        this.syncToGHL();
    }
}

// Enhanced automatic page tracking
class AutoPageTracker {
    constructor(leadTracker) {
        this.leadTracker = leadTracker;
        this.initializePageTracking();
    }

    initializePageTracking() {
        const pageType = this.detectPageType();
        const pageUrl = window.location.pathname;

        this.leadTracker.trackPageView(pageType, pageUrl);

        // Track specific content engagement
        this.setupContentTracking(pageType);
    }

    detectPageType() {
        const path = window.location.pathname.toLowerCase();

        // Service-specific pages
        if (path.includes('textile') || path.includes('wedding') || path.includes('uniform')) return 'textileRestoration';
        if (path.includes('document') || path.includes('paper') || path.includes('records')) return 'documentRestoration';
        if (path.includes('art') || path.includes('painting') || path.includes('canvas')) return 'artRestoration';
        if (path.includes('electronics') || path.includes('audio')) return 'electronicsRestoration';

        // High-value content
        if (path.includes('emergency')) return 'emergencyService';
        if (path.includes('museum') || path.includes('government')) return 'authorityContent';

        // Regional pages
        if (path.includes('dc') || path.includes('washington')) return 'dcRegional';
        if (path.includes('virginia') || path.includes('va')) return 'vaRegional';
        if (path.includes('maryland') || path.includes('md')) return 'mdRegional';

        return 'general';
    }

    setupContentTracking(pageType) {
        // Track video engagement
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', () => {
                this.leadTracker.sessionData.contentScore += 20;
                this.leadTracker.updateLeadQuality();
            });
        });

        // Track image gallery engagement
        document.querySelectorAll('.gallery-image, .before-after-image').forEach(image => {
            image.addEventListener('click', () => {
                this.leadTracker.sessionData.contentScore += 5;
                this.leadTracker.updateLeadQuality();
            });
        });

        // Track testimonial engagement
        document.querySelectorAll('.testimonial, .case-study').forEach(element => {
            element.addEventListener('click', () => {
                this.leadTracker.sessionData.contentScore += 10;
                this.leadTracker.updateLeadQuality();
            });
        });
    }
}

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load config if available
    if (typeof GHL_CONFIG === 'undefined') {
        window.GHL_CONFIG = {
            phoneNumbers: {
                DC: '202-335-4240',
                VA: '703-229-1321',
                MD: '301-215-3191'
            },
            contentScores: {
                textileRestoration: 30,
                documentRestoration: 35,
                artRestoration: 25,
                electronicsRestoration: 25,
                emergencyService: 50,
                authorityContent: 40
            }
        };
    }

    // Initialize trackers
    window.prismTracker = new PrismLeadTracker();
    window.autoPageTracker = new AutoPageTracker(window.prismTracker);

    // Add CSS for lead quality enhancements
    const style = document.createElement('style');
    style.textContent = `
        .high-value-lead {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
            color: white !important;
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4) !important;
            transform: scale(1.05) !important;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
    `;
    document.head.appendChild(style);

    console.log('🎯 Prism Lead Tracker initialized');

    // Expose status function for debugging
    window.getPrismStatus = () => window.prismTracker.getSessionStatus();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PrismLeadTracker, AutoPageTracker };
}