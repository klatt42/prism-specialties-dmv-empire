// Main GHL Integration Controller for Prism Specialties Blog
// Coordinates tracking, scoring, and workflow automation

class GHLIntegration {
    constructor() {
        this.config = null;
        this.tracker = null;
        this.scoringEngine = null;
        this.workflowTriggers = null;
        this.initialized = false;
    }

    // Initialize the complete GHL integration
    async initialize() {
        try {
            // Load configuration
            this.config = await this.loadConfig();

            // Initialize components
            this.scoringEngine = new LeadScoringEngine(this.config);
            this.tracker = new BlogEngagementTracker(this.config);
            this.workflowTriggers = new WorkflowTriggers(this.config, this.scoringEngine);

            // Set up session monitoring
            this.setupSessionMonitoring();

            // Set up periodic scoring updates
            this.setupPeriodicScoring();

            this.initialized = true;
            console.log('GHL Integration initialized successfully');

            return true;
        } catch (error) {
            console.error('GHL Integration initialization failed:', error);
            return false;
        }
    }

    // Load configuration (in production, this would come from environment/API)
    async loadConfig() {
        // For development, return hardcoded config
        return {
            apiBase: 'https://services.leadconnectorhq.com',
            locationId: 'prism_specialties_dmv',

            phoneNumbers: {
                DC: '202-335-4240',
                VA: '703-229-1321',
                MD: '301-215-3191'
            },

            contentScores: {
                blogView: 5,
                blogTimeSpent3Min: 15,
                blogTimeSpent5Min: 25,
                emergencyCtaClick: 50,
                phoneCallClick: 75,
                contactFormSubmit: 100,
                textileRestoration: 30,
                documentRestoration: 35,
                artRestoration: 25,
                weddingDressContent: 45,
                militaryUniformContent: 40,
                governmentRecordsContent: 35,
                emergencyResponse: 60
            },

            leadTemperature: {
                cold: 0,
                warm: 25,
                hot: 50,
                emergency: 100
            }
        };
    }

    // Set up session monitoring
    setupSessionMonitoring() {
        // Monitor for high-value interactions
        document.addEventListener('click', (event) => {
            this.handleClick(event);
        });

        // Monitor scroll behavior for engagement
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateEngagementScore();
            }, 1000);
        });

        // Monitor for form interactions
        document.addEventListener('input', (event) => {
            if (event.target.closest('form')) {
                this.handleFormInteraction(event);
            }
        });

        // Monitor for video/media engagement
        document.addEventListener('play', (event) => {
            this.handleMediaEngagement(event, 'play');
        });

        // Monitor tab visibility for engagement quality
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    // Handle click events
    handleClick(event) {
        const target = event.target;

        // Emergency CTA clicks
        if (target.matches('.emergency-phone-cta, a[href^="tel:"]')) {
            this.handleEmergencyCtaClick(target);
        }

        // Blog navigation clicks
        if (target.matches('a[href*="/blog/"]')) {
            this.handleBlogNavigation(target);
        }

        // Contact form elements
        if (target.matches('input[type="submit"], button[type="submit"]')) {
            this.handleFormSubmission(target);
        }

        // Social proof elements
        if (target.matches('.testimonial, .case-study-link')) {
            this.handleSocialProofEngagement(target);
        }
    }

    // Handle emergency CTA clicks
    handleEmergencyCtaClick(element) {
        const phoneNumber = element.href ? element.href.replace('tel:', '') : '';
        const region = this.identifyRegionFromPhone(phoneNumber);

        const interaction = {
            type: 'emergency_cta_click',
            element: element.textContent.trim(),
            phoneNumber: phoneNumber,
            region: region,
            timestamp: Date.now(),
            urgency: 'immediate'
        };

        // Track with high score
        this.tracker.trackInteraction(interaction);
        this.tracker.addScore(this.config.contentScores.emergencyCtaClick);

        // Trigger immediate workflow
        this.triggerEmergencyWorkflow(interaction);

        console.log('Emergency CTA clicked - immediate response triggered', interaction);
    }

    // Handle blog navigation
    handleBlogNavigation(element) {
        const href = element.getAttribute('href');
        const contentType = this.identifyContentTypeFromUrl(href);

        if (contentType) {
            this.tracker.addScore(this.config.contentScores[contentType] || 5);

            const interaction = {
                type: 'blog_navigation',
                href: href,
                contentType: contentType,
                timestamp: Date.now()
            };

            this.tracker.trackInteraction(interaction);
        }
    }

    // Handle form submissions
    handleFormSubmission(element) {
        const form = element.closest('form');
        if (!form) return;

        const formData = new FormData(form);
        const formType = this.identifyFormType(form);

        const interaction = {
            type: 'form_submission',
            formType: formType,
            timestamp: Date.now(),
            fields: Array.from(formData.keys())
        };

        this.tracker.trackInteraction(interaction);
        this.tracker.addScore(this.config.contentScores.contactFormSubmit);

        // Trigger high-value workflow
        this.triggerFormSubmissionWorkflow(interaction, formData);
    }

    // Set up periodic scoring updates
    setupPeriodicScoring() {
        // Update engagement score every 30 seconds
        setInterval(() => {
            if (document.hasFocus()) {
                this.updateEngagementScore();
            }
        }, 30000);

        // Major score evaluation every 2 minutes
        setInterval(() => {
            this.evaluateLeadScore();
        }, 120000);
    }

    // Update engagement score based on current behavior
    updateEngagementScore() {
        const currentScore = this.tracker.sessionData.leadScore;
        const timeSpent = Date.now() - this.tracker.sessionData.startTime;

        // Time-based scoring milestones
        if (timeSpent > 180000 && !this.tracker.sessionData.scored3Min) {
            this.tracker.addScore(this.config.contentScores.blogTimeSpent3Min);
            this.tracker.sessionData.scored3Min = true;
        }

        if (timeSpent > 300000 && !this.tracker.sessionData.scored5Min) {
            this.tracker.addScore(this.config.contentScores.blogTimeSpent5Min);
            this.tracker.sessionData.scored5Min = true;
        }

        // Engagement quality scoring
        const scrollPercent = this.calculateScrollPercent();
        if (scrollPercent > 75 && !this.tracker.sessionData.deepScroll) {
            this.tracker.addScore(10);
            this.tracker.sessionData.deepScroll = true;
        }
    }

    // Evaluate and act on current lead score
    evaluateLeadScore() {
        const leadScore = this.scoringEngine.calculateLeadScore(this.tracker.sessionData);

        // Check for workflow triggers
        const workflowResults = this.workflowTriggers.processSession(this.tracker.sessionData);

        // Update UI based on temperature
        this.updateUIForLeadTemperature(leadScore.temperature);

        // Send periodic update to GHL
        this.sendPeriodicUpdate(leadScore, workflowResults);

        console.log('Lead score evaluation:', {
            score: leadScore.totalScore,
            temperature: leadScore.temperature,
            workflows: workflowResults.triggeredWorkflows.length
        });
    }

    // Trigger emergency workflow
    triggerEmergencyWorkflow(interaction) {
        // Create immediate alert
        const alert = {
            type: 'emergency_cta_alert',
            priority: 'IMMEDIATE',
            interaction: interaction,
            sessionData: this.tracker.getSessionSummary(),
            timestamp: Date.now(),
            sla: '15_minutes'
        };

        this.sendToGHL('emergency-alert', alert);

        // Update UI to show response confirmation
        this.showEmergencyResponseConfirmation(interaction.region);
    }

    // Trigger form submission workflow
    triggerFormSubmissionWorkflow(interaction, formData) {
        const lead = {
            type: 'form_submission_lead',
            interaction: interaction,
            formData: Object.fromEntries(formData),
            sessionData: this.tracker.getSessionSummary(),
            leadScore: this.scoringEngine.calculateLeadScore(this.tracker.sessionData),
            timestamp: Date.now()
        };

        this.sendToGHL('form-submission', lead);
    }

    // Update UI based on lead temperature
    updateUIForLeadTemperature(temperature) {
        // Add visual indicators for hot leads
        if (temperature === 'hot' || temperature === 'emergency') {
            this.showHotLeadIndicators();
        }

        // Adjust CTA prominence
        if (temperature === 'warm' || temperature === 'hot') {
            this.enhanceCtaVisibility();
        }
    }

    // Show emergency response confirmation
    showEmergencyResponseConfirmation(region) {
        const phoneNumber = this.config.phoneNumbers[region] || this.config.phoneNumbers.VA;

        // Create confirmation overlay
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; max-width: 400px;">
                    <h3 style="color: #d32f2f; margin-bottom: 1rem;">Emergency Response Activated</h3>
                    <p>We've received your urgent request. Our emergency response team will contact you within 15 minutes.</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #1976D2;">Direct Line: ${phoneNumber}</p>
                    <button onclick="this.closest('div').remove()" style="background: #1976D2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 1rem;">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 10000);
    }

    // Show hot lead indicators
    showHotLeadIndicators() {
        // Add visual enhancement to CTAs
        document.querySelectorAll('.emergency-phone-cta').forEach(cta => {
            if (!cta.classList.contains('hot-lead-enhanced')) {
                cta.classList.add('hot-lead-enhanced');
                cta.style.animation = 'pulse 2s infinite';

                // Add urgency text
                const urgencyBadge = document.createElement('span');
                urgencyBadge.textContent = 'High Priority';
                urgencyBadge.style.cssText = 'background: #ff5722; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; margin-left: 10px;';
                cta.appendChild(urgencyBadge);
            }
        });
    }

    // Enhance CTA visibility
    enhanceCtaVisibility() {
        // Make emergency CTAs more prominent
        document.querySelectorAll('.emergency-phone-cta').forEach(cta => {
            cta.style.transform = 'scale(1.05)';
            cta.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.4)';
        });
    }

    // Utility methods
    identifyRegionFromPhone(phoneNumber) {
        const phone = phoneNumber.replace(/\D/g, '');
        if (phone.includes('202')) return 'DC';
        if (phone.includes('703') || phone.includes('571')) return 'VA';
        if (phone.includes('301') || phone.includes('240')) return 'MD';
        return 'unknown';
    }

    identifyContentTypeFromUrl(url) {
        if (url.includes('textile-restoration')) return 'textileRestoration';
        if (url.includes('document-restoration')) return 'documentRestoration';
        if (url.includes('art-restoration')) return 'artRestoration';
        if (url.includes('electronics-restoration')) return 'electronicsRestoration';
        if (url.includes('wedding-dress')) return 'weddingDressContent';
        if (url.includes('military-uniform')) return 'militaryUniformContent';
        if (url.includes('historic-documents')) return 'governmentRecordsContent';
        return null;
    }

    identifyFormType(form) {
        const action = form.getAttribute('action') || '';
        const classes = form.className;

        if (action.includes('contact') || classes.includes('contact')) return 'contact';
        if (action.includes('quote') || classes.includes('quote')) return 'quote';
        if (action.includes('emergency') || classes.includes('emergency')) return 'emergency';
        return 'general';
    }

    calculateScrollPercent() {
        return Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.tracker.sessionData.backgroundTime = Date.now();
        } else if (this.tracker.sessionData.backgroundTime) {
            const backgroundDuration = Date.now() - this.tracker.sessionData.backgroundTime;
            this.tracker.sessionData.totalBackgroundTime =
                (this.tracker.sessionData.totalBackgroundTime || 0) + backgroundDuration;
        }
    }

    // Send periodic updates to GHL
    sendPeriodicUpdate(leadScore, workflowResults) {
        const update = {
            type: 'periodic_update',
            sessionId: this.tracker.sessionData.sessionId,
            leadScore: leadScore,
            workflowResults: workflowResults,
            timestamp: Date.now(),
            sessionSummary: this.tracker.getSessionSummary()
        };

        this.sendToGHL('periodic-update', update);
    }

    // Send data to GHL
    sendToGHL(endpoint, data) {
        // Store locally for development
        const storageKey = `ghl_${endpoint}_${Date.now()}`;
        localStorage.setItem(storageKey, JSON.stringify(data));

        console.log(`GHL Integration: ${endpoint}`, data);

        // In production, this would make actual API calls
        // return fetch(`${this.config.apiBase}/${endpoint}`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${this.config.apiKey}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });
    }

    // Get integration status
    getStatus() {
        return {
            initialized: this.initialized,
            sessionId: this.tracker?.sessionData?.sessionId,
            currentScore: this.tracker?.sessionData?.leadScore || 0,
            temperature: this.tracker?.sessionData?.temperature || 'cold',
            timeSpent: this.tracker ? Date.now() - this.tracker.sessionData.startTime : 0,
            interactions: this.tracker?.sessionData?.interactions?.length || 0
        };
    }
}

// Initialize GHL integration when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Add CSS for hot lead animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); }
            100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
        }

        .hot-lead-enhanced {
            position: relative;
            overflow: visible;
        }
    `;
    document.head.appendChild(style);

    // Initialize the integration
    window.ghlIntegration = new GHLIntegration();
    const initialized = await window.ghlIntegration.initialize();

    if (initialized) {
        console.log('Prism Specialties GHL Integration active');

        // Make status available for debugging
        window.ghlStatus = () => window.ghlIntegration.getStatus();
    } else {
        console.error('Failed to initialize GHL Integration');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GHLIntegration;
}