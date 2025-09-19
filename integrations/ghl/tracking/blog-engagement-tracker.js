// Blog Engagement Tracker for GHL Integration
// Tracks user behavior on Prism Specialties blog posts

class BlogEngagementTracker {
    constructor(config) {
        this.config = config;
        this.sessionData = {
            startTime: Date.now(),
            pageViews: [],
            interactions: [],
            leadScore: 0,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            sessionId: this.generateSessionId()
        };
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEngagementTracking();
        this.setupEmergencyCtaTracking();
        this.setupScrollDepthTracking();
        this.setupTimeSpentTracking();
    }

    generateSessionId() {
        return 'prism_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }

    // Track page view and identify content type
    trackPageView() {
        const currentPath = window.location.pathname;
        const contentType = this.identifyContentType(currentPath);
        const region = this.identifyRegion(currentPath);

        const pageView = {
            path: currentPath,
            contentType: contentType,
            region: region,
            timestamp: Date.now(),
            title: document.title
        };

        this.sessionData.pageViews.push(pageView);
        this.addScore(this.config.contentScores.blogView);

        // Add content-specific scoring
        if (contentType) {
            this.addScore(this.config.contentScores[contentType] || 0);
        }

        console.log('GHL Tracking: Page view recorded', pageView);
    }

    // Identify content type from URL
    identifyContentType(path) {
        if (path.includes('textile-restoration')) return 'textileRestoration';
        if (path.includes('document-restoration')) return 'documentRestoration';
        if (path.includes('art-restoration')) return 'artRestoration';
        if (path.includes('electronics-restoration')) return 'electronicsRestoration';
        if (path.includes('wedding-dress')) return 'weddingDressContent';
        if (path.includes('military-uniform')) return 'militaryUniformContent';
        if (path.includes('historic-documents')) return 'governmentRecordsContent';
        return 'general';
    }

    // Identify region from content
    identifyRegion(path) {
        if (path.includes('dc') || path.includes('washington')) return 'DC';
        if (path.includes('va') || path.includes('virginia') || path.includes('alexandria') || path.includes('arlington')) return 'VA';
        if (path.includes('md') || path.includes('maryland') || path.includes('montgomery')) return 'MD';
        return 'general';
    }

    // Track emergency CTA clicks
    setupEmergencyCtaTracking() {
        document.querySelectorAll('.emergency-phone-cta, a[href^="tel:"]').forEach(cta => {
            cta.addEventListener('click', (e) => {
                const phoneNumber = e.target.href.replace('tel:', '');
                const region = this.identifyRegionFromPhone(phoneNumber);

                this.trackInteraction({
                    type: 'emergency_cta_click',
                    element: e.target.textContent,
                    phoneNumber: phoneNumber,
                    region: region,
                    score: this.config.contentScores.emergencyCtaClick
                });

                // High-value interaction for immediate follow-up
                this.addScore(this.config.contentScores.phoneCallClick);
                this.triggerImmediateAlert(phoneNumber, region);
            });
        });
    }

    // Track scroll depth for engagement measurement
    setupScrollDepthTracking() {
        let maxScroll = 0;
        let scrollDepthMarkers = [25, 50, 75, 90];
        let trackedMarkers = [];

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                scrollDepthMarkers.forEach(marker => {
                    if (scrollPercent >= marker && !trackedMarkers.includes(marker)) {
                        trackedMarkers.push(marker);
                        this.trackInteraction({
                            type: 'scroll_depth',
                            depth: marker,
                            score: marker > 75 ? 10 : 5
                        });
                    }
                });
            }
        });
    }

    // Track time spent for engagement scoring
    setupTimeSpentTracking() {
        const timeThresholds = [
            { time: 180000, score: this.config.contentScores.blogTimeSpent3Min }, // 3 minutes
            { time: 300000, score: this.config.contentScores.blogTimeSpent5Min }  // 5 minutes
        ];

        timeThresholds.forEach(threshold => {
            setTimeout(() => {
                if (document.hasFocus()) {
                    this.trackInteraction({
                        type: 'time_spent_milestone',
                        duration: threshold.time,
                        score: threshold.score
                    });
                    this.addScore(threshold.score);
                }
            }, threshold.time);
        });
    }

    // Track general interactions
    trackInteraction(interaction) {
        interaction.timestamp = Date.now();
        this.sessionData.interactions.push(interaction);

        if (interaction.score) {
            this.addScore(interaction.score);
        }

        console.log('GHL Tracking: Interaction recorded', interaction);
    }

    // Add to lead score
    addScore(points) {
        this.sessionData.leadScore += points;
        this.updateLeadTemperature();
        console.log(`GHL Tracking: Score +${points} = ${this.sessionData.leadScore}`);
    }

    // Update lead temperature based on score
    updateLeadTemperature() {
        const score = this.sessionData.leadScore;
        let temperature = 'cold';

        if (score >= this.config.leadTemperature.emergency) {
            temperature = 'emergency';
        } else if (score >= this.config.leadTemperature.hot) {
            temperature = 'hot';
        } else if (score >= this.config.leadTemperature.warm) {
            temperature = 'warm';
        }

        this.sessionData.temperature = temperature;

        // Trigger automation based on temperature
        if (temperature === 'emergency' || temperature === 'hot') {
            this.triggerHotLeadAlert();
        }
    }

    // Identify region from phone number
    identifyRegionFromPhone(phoneNumber) {
        const phone = phoneNumber.replace(/\D/g, '');
        if (phone.includes('202')) return 'DC';
        if (phone.includes('703') || phone.includes('571')) return 'VA';
        if (phone.includes('301') || phone.includes('240')) return 'MD';
        return 'unknown';
    }

    // Trigger immediate alert for emergency CTA clicks
    triggerImmediateAlert(phoneNumber, region) {
        const alertData = {
            type: 'emergency_cta_click',
            phoneNumber: phoneNumber,
            region: region,
            sessionData: this.sessionData,
            timestamp: Date.now(),
            urgency: 'immediate'
        };

        // Send to GHL webhook for immediate notification
        this.sendToGHL('emergency-alert', alertData);
        console.log('GHL Alert: Emergency CTA clicked', alertData);
    }

    // Trigger hot lead alert
    triggerHotLeadAlert() {
        const alertData = {
            type: 'hot_lead',
            score: this.sessionData.leadScore,
            temperature: this.sessionData.temperature,
            sessionData: this.sessionData,
            timestamp: Date.now()
        };

        this.sendToGHL('hot-lead-alert', alertData);
        console.log('GHL Alert: Hot lead detected', alertData);
    }

    // Send data to GHL
    sendToGHL(endpoint, data) {
        // This would integrate with actual GHL API
        // For now, we'll store locally and log
        localStorage.setItem(`ghl_${endpoint}_${Date.now()}`, JSON.stringify(data));

        // In production, this would be:
        // fetch(`${this.config.apiBase}/webhooks/${endpoint}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    }

    // Get session summary for GHL
    getSessionSummary() {
        return {
            sessionId: this.sessionData.sessionId,
            totalScore: this.sessionData.leadScore,
            temperature: this.sessionData.temperature,
            timeSpent: Date.now() - this.sessionData.startTime,
            pageViews: this.sessionData.pageViews.length,
            interactions: this.sessionData.interactions.length,
            contentTypes: [...new Set(this.sessionData.pageViews.map(p => p.contentType))],
            regions: [...new Set(this.sessionData.pageViews.map(p => p.region))]
        };
    }

    // Clean up on page unload
    cleanup() {
        const summary = this.getSessionSummary();
        this.sendToGHL('session-summary', summary);
        console.log('GHL Tracking: Session summary sent', summary);
    }
}

// Initialize tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load config (in production, this would be loaded differently)
    const config = {
        contentScores: {
            blogView: 5,
            blogTimeSpent3Min: 15,
            blogTimeSpent5Min: 25,
            emergencyCtaClick: 50,
            phoneCallClick: 75,
            textileRestoration: 30,
            documentRestoration: 35,
            artRestoration: 25,
            weddingDressContent: 45,
            militaryUniformContent: 40,
            governmentRecordsContent: 35
        },
        leadTemperature: {
            cold: 0,
            warm: 25,
            hot: 50,
            emergency: 100
        }
    };

    window.blogTracker = new BlogEngagementTracker(config);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        window.blogTracker.cleanup();
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogEngagementTracker;
}