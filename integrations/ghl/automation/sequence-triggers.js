class PrismAutomationTriggers {
    constructor() {
        this.ghlConfig = GHL_CONFIG;
        this.triggeredSessions = new Set(); // Prevent duplicate triggers
        this.setupTriggers();
        this.initializeEventListeners();
        console.log('🤖 Prism Automation Triggers initialized');
    }

    setupTriggers() {
        // Monitor session for automation triggers
        this.triggerInterval = setInterval(() => {
            this.checkAutomationTriggers();
        }, 30000); // Check every 30 seconds

        // Check immediately on page events
        this.setupImmediateTriggers();
    }

    setupImmediateTriggers() {
        // Emergency triggers (immediate response)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.emergency-phone-cta, .emergency-cta')) {
                this.triggerEmergencySequence();
            }
        });

        // Form submission triggers
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-automation="contact"]')) {
                this.triggerContactFormSequence(e.target);
            }
        });

        // High-value content triggers
        this.setupContentBasedTriggers();
    }

    setupContentBasedTriggers() {
        // Wedding dress content - high emotional value
        if (window.location.pathname.includes('wedding') ||
            document.body.textContent.toLowerCase().includes('wedding dress')) {
            setTimeout(() => this.triggerWeddingContentSequence(), 180000); // 3 minutes
        }

        // Military uniform content - high emotional value
        if (window.location.pathname.includes('military') ||
            document.body.textContent.toLowerCase().includes('military uniform')) {
            setTimeout(() => this.triggerMilitaryContentSequence(), 180000); // 3 minutes
        }

        // Government/authority content - high trust value
        if (window.location.pathname.includes('government') ||
            document.body.textContent.toLowerCase().includes('museum')) {
            setTimeout(() => this.triggerAuthorityContentSequence(), 240000); // 4 minutes
        }
    }

    initializeEventListeners() {
        // Page visibility changes (user returning)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.triggerReturnVisitorSequence();
            }
        });

        // Extended engagement triggers
        window.addEventListener('scroll', this.handleScrollEngagement.bind(this));

        // Time-based engagement milestones
        this.setupTimeBasedTriggers();
    }

    setupTimeBasedTriggers() {
        // 5-minute engagement milestone
        setTimeout(() => {
            this.triggerEngagementMilestone('5_minute');
        }, 300000);

        // 10-minute deep engagement
        setTimeout(() => {
            this.triggerEngagementMilestone('10_minute');
        }, 600000);

        // 15-minute expert consultation trigger
        setTimeout(() => {
            this.triggerExpertConsultationSequence();
        }, 900000);
    }

    checkAutomationTriggers() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        if (!session.sessionId || this.triggeredSessions.has(session.sessionId)) {
            return; // Skip if already triggered or no session
        }

        // Trigger based on lead quality and behavior
        switch(session.leadQuality || session.temperature) {
            case 'emergency':
                this.triggerEmergencySequence(session);
                break;
            case 'hot':
                this.triggerHotLeadSequence(session);
                break;
            case 'warm':
                this.triggerWarmLeadSequence(session);
                break;
            case 'cold':
                this.triggerColdLeadSequence(session);
                break;
        }
    }

    triggerEmergencySequence(session = null) {
        const sessionData = session || JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        const trigger = {
            type: 'emergency_response',
            sessionId: sessionData.sessionId,
            region: sessionData.region || this.detectCurrentRegion(),
            contentScore: sessionData.contentScore || sessionData.score || 100,
            automationId: 'EMERGENCY_RESTORATION_RESPONSE',
            priority: 'immediate',
            responseTime: 15, // minutes
            actions: [
                'immediate_sms_alert',
                'emergency_call_task',
                'priority_email_notification',
                'regional_specialist_assignment'
            ],
            customFields: {
                urgency: 'emergency',
                service_type: this.detectServiceType(),
                estimated_damage: this.estimateDamageLevel(sessionData),
                contact_preference: 'phone'
            }
        };

        this.sendToGHLAutomation(trigger);
        this.markSessionTriggered(sessionData.sessionId, 'emergency');

        // Local emergency tracking
        localStorage.setItem(`prism_emergency_trigger_${Date.now()}`, JSON.stringify(trigger));

        console.log('🚨 Emergency automation sequence triggered');
    }

    triggerHotLeadSequence(session) {
        // Immediate response - within 5 minutes for restoration services
        const trigger = {
            type: 'hot_lead',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            contentScore: session.contentScore || session.score,
            automationId: 'HOT_RESTORATION_LEAD',
            priority: 'high',
            responseTime: 240, // 4 hours
            actions: [
                'immediate_sms_followup',
                'priority_call_task',
                'custom_quote_email',
                'case_study_attachment',
                'consultation_booking_link'
            ],
            customFields: {
                lead_temperature: 'hot',
                service_type: this.detectServiceType(),
                content_engagement: session.contentScore || session.score,
                regional_specialist: this.getRegionalSpecialist(session.region),
                estimated_project_value: this.estimateProjectValue(session)
            }
        };

        this.sendToGHLAutomation(trigger);
        this.markSessionTriggered(session.sessionId, 'hot');

        console.log('🔥 Hot lead automation sequence triggered');
    }

    triggerWarmLeadSequence(session) {
        // 2-hour follow-up sequence for interested prospects
        const trigger = {
            type: 'warm_lead',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            contentScore: session.contentScore || session.score,
            automationId: 'WARM_RESTORATION_NURTURE',
            priority: 'medium',
            responseTime: 1440, // 24 hours
            actions: [
                'educational_email_series',
                'consultation_offer_sms',
                'retargeting_pixel_activation',
                'social_proof_email',
                'before_after_gallery_link'
            ],
            customFields: {
                lead_temperature: 'warm',
                service_type: this.detectServiceType(),
                content_interest: this.getContentInterests(session),
                nurture_sequence: 'restoration_education',
                follow_up_preference: this.getPreferredContact(session)
            }
        };

        this.sendToGHLAutomation(trigger);
        this.markSessionTriggered(session.sessionId, 'warm');

        console.log('⚡ Warm lead automation sequence triggered');
    }

    triggerColdLeadSequence(session) {
        // 24-hour nurture sequence for early-stage prospects
        const trigger = {
            type: 'cold_lead',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            contentScore: session.contentScore || session.score || 0,
            automationId: 'COLD_RESTORATION_NURTURE',
            priority: 'low',
            responseTime: 2880, // 48 hours
            actions: [
                'general_newsletter_signup',
                'case_study_email_series',
                'social_proof_sequence',
                'educational_content_drip',
                'seasonal_restoration_tips'
            ],
            customFields: {
                lead_temperature: 'cold',
                service_type: this.detectServiceType(),
                content_viewed: window.location.pathname,
                nurture_track: 'general_restoration',
                engagement_level: 'low'
            }
        };

        this.sendToGHLAutomation(trigger);
        this.markSessionTriggered(session.sessionId, 'cold');

        console.log('❄️ Cold lead automation sequence triggered');
    }

    // Specialized content-based triggers
    triggerWeddingContentSequence() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        const trigger = {
            type: 'wedding_content_engagement',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            automationId: 'WEDDING_DRESS_RESTORATION_SPECIALIST',
            priority: 'high',
            actions: [
                'wedding_specialist_introduction',
                'bridal_restoration_portfolio',
                'emergency_wedding_service_info',
                'testimonial_bride_stories',
                'consultation_booking_urgent'
            ],
            customFields: {
                service_type: 'wedding_dress_restoration',
                emotional_value: 'high',
                urgency_potential: 'wedding_date_sensitive',
                specialist_type: 'bridal_restoration'
            }
        };

        this.sendToGHLAutomation(trigger);
        console.log('👰 Wedding content specialization triggered');
    }

    triggerMilitaryContentSequence() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        const trigger = {
            type: 'military_content_engagement',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            automationId: 'MILITARY_UNIFORM_RESTORATION_SPECIALIST',
            priority: 'high',
            actions: [
                'military_specialist_introduction',
                'uniform_restoration_portfolio',
                'veteran_discount_offer',
                'family_heirloom_service_info',
                'military_testimonials'
            ],
            customFields: {
                service_type: 'military_uniform_restoration',
                emotional_value: 'high',
                veteran_status: 'potential',
                specialist_type: 'military_restoration'
            }
        };

        this.sendToGHLAutomation(trigger);
        console.log('🪖 Military content specialization triggered');
    }

    triggerAuthorityContentSequence() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        const trigger = {
            type: 'authority_content_engagement',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            automationId: 'INSTITUTIONAL_RESTORATION_SPECIALIST',
            priority: 'medium',
            actions: [
                'institutional_credentials_presentation',
                'museum_quality_standards_info',
                'government_contract_experience',
                'conservation_certifications',
                'institutional_client_references'
            ],
            customFields: {
                service_type: 'institutional_restoration',
                authority_interest: 'high',
                project_scale: 'professional',
                specialist_type: 'museum_quality'
            }
        };

        this.sendToGHLAutomation(trigger);
        console.log('🏛️ Authority content specialization triggered');
    }

    triggerExpertConsultationSequence() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        if (session.contentScore && session.contentScore > 75) {
            const trigger = {
                type: 'expert_consultation_ready',
                sessionId: session.sessionId,
                region: session.region || this.detectCurrentRegion(),
                automationId: 'EXPERT_CONSULTATION_INVITATION',
                priority: 'high',
                actions: [
                    'expert_consultation_invitation',
                    'free_assessment_offer',
                    'senior_restorer_introduction',
                    'VIP_client_treatment',
                    'expedited_service_options'
                ],
                customFields: {
                    engagement_level: 'expert_level',
                    consultation_readiness: 'high',
                    session_duration: '15_minutes_plus',
                    expertise_interest: 'confirmed'
                }
            };

            this.sendToGHLAutomation(trigger);
            console.log('🎓 Expert consultation sequence triggered');
        }
    }

    triggerReturnVisitorSequence() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        const returnVisits = parseInt(localStorage.getItem('prism_return_visits') || '0') + 1;
        localStorage.setItem('prism_return_visits', returnVisits.toString());

        if (returnVisits >= 3) {
            const trigger = {
                type: 'return_visitor_engagement',
                sessionId: session.sessionId,
                region: session.region || this.detectCurrentRegion(),
                automationId: 'RETURN_VISITOR_CONVERSION',
                priority: 'medium',
                actions: [
                    'return_visitor_special_offer',
                    'consultation_reminder',
                    'limited_time_discount',
                    'priority_booking_access',
                    'personal_restorer_assignment'
                ],
                customFields: {
                    return_visits: returnVisits,
                    visitor_loyalty: 'high',
                    conversion_readiness: 'strong'
                }
            };

            this.sendToGHLAutomation(trigger);
            console.log('🔄 Return visitor conversion sequence triggered');
        }
    }

    triggerEngagementMilestone(milestone) {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        const trigger = {
            type: 'engagement_milestone',
            sessionId: session.sessionId,
            region: session.region || this.detectCurrentRegion(),
            automationId: `ENGAGEMENT_${milestone.toUpperCase()}_MILESTONE`,
            priority: 'medium',
            actions: [
                'engagement_appreciation_message',
                'exclusive_content_access',
                'consultation_discount_offer',
                'restoration_guide_download',
                'expert_tips_series'
            ],
            customFields: {
                milestone: milestone,
                engagement_depth: 'high',
                content_consumption: 'extensive'
            }
        };

        this.sendToGHLAutomation(trigger);
        console.log(`⏱️ ${milestone} engagement milestone triggered`);
    }

    handleScrollEngagement(event) {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        // Deep scroll engagement trigger (90%+ scroll)
        if (scrollPercent >= 90 && !this.deepScrollTriggered) {
            this.deepScrollTriggered = true;

            const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
            if (session.sessionId) {
                const trigger = {
                    type: 'deep_scroll_engagement',
                    sessionId: session.sessionId,
                    region: session.region || this.detectCurrentRegion(),
                    automationId: 'DEEP_ENGAGEMENT_CONVERSION',
                    priority: 'medium',
                    actions: [
                        'content_completion_acknowledgment',
                        'next_step_guidance',
                        'consultation_soft_offer',
                        'related_content_suggestions'
                    ],
                    customFields: {
                        scroll_completion: '90_percent_plus',
                        content_interest: 'high',
                        reading_commitment: 'strong'
                    }
                };

                this.sendToGHLAutomation(trigger);
                console.log('📜 Deep scroll engagement triggered');
            }
        }
    }

    // Helper methods
    detectCurrentRegion() {
        if (window.phoneTracker) {
            return window.phoneTracker.userRegion;
        }

        const path = window.location.pathname.toLowerCase();
        if (path.includes('washington-dc') || path.includes('dc-')) return 'DC';
        if (path.includes('virginia') || path.includes('va-')) return 'VA';
        if (path.includes('maryland') || path.includes('md-')) return 'MD';
        return 'DC'; // Default
    }

    detectServiceType() {
        const path = window.location.pathname.toLowerCase();
        const content = document.body.textContent.toLowerCase();

        if (path.includes('wedding') || content.includes('wedding dress')) return 'wedding_dress_restoration';
        if (path.includes('military') || content.includes('military uniform')) return 'military_uniform_restoration';
        if (path.includes('document') || content.includes('document restoration')) return 'document_restoration';
        if (path.includes('art') || content.includes('art restoration')) return 'art_restoration';
        if (path.includes('textile') || content.includes('textile restoration')) return 'textile_restoration';
        if (path.includes('electronics') || content.includes('electronics restoration')) return 'electronics_restoration';

        return 'general_restoration';
    }

    estimateDamageLevel(session) {
        const score = session.contentScore || session.score || 0;
        if (score > 75) return 'extensive_damage';
        if (score > 50) return 'moderate_damage';
        if (score > 25) return 'minor_damage';
        return 'assessment_needed';
    }

    estimateProjectValue(session) {
        const serviceType = this.detectServiceType();
        const score = session.contentScore || session.score || 0;

        const baseValues = {
            'wedding_dress_restoration': 500,
            'military_uniform_restoration': 400,
            'art_restoration': 800,
            'document_restoration': 200,
            'electronics_restoration': 300,
            'general_restoration': 250
        };

        const base = baseValues[serviceType] || 250;
        const multiplier = score > 75 ? 2.5 : score > 50 ? 2.0 : score > 25 ? 1.5 : 1.0;

        return Math.round(base * multiplier);
    }

    getRegionalSpecialist(region) {
        const specialists = {
            'DC': 'sarah.johnson@prism-specialties.com',
            'VA': 'michael.chen@prism-specialties.com',
            'MD': 'emily.rodriguez@prism-specialties.com'
        };

        return specialists[region] || specialists['DC'];
    }

    getContentInterests(session) {
        const interests = [];
        const path = window.location.pathname;

        if (path.includes('wedding')) interests.push('wedding_restoration');
        if (path.includes('military')) interests.push('military_restoration');
        if (path.includes('art')) interests.push('art_restoration');
        if (path.includes('document')) interests.push('document_restoration');

        return interests.join(',');
    }

    getPreferredContact(session) {
        // Check if user has interacted with phone numbers
        const phoneInteractions = this.getPhoneInteractionCount();
        if (phoneInteractions > 0) return 'phone';

        // Check form interactions
        const formInteractions = document.querySelectorAll('form').length > 0;
        if (formInteractions) return 'email';

        return 'email'; // Default
    }

    getPhoneInteractionCount() {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('prism_phone_')) count++;
        }
        return count;
    }

    markSessionTriggered(sessionId, triggerType) {
        if (sessionId) {
            this.triggeredSessions.add(sessionId);
            localStorage.setItem(`prism_triggered_${sessionId}`, JSON.stringify({
                triggerType,
                timestamp: Date.now()
            }));
        }
    }

    async sendToGHLAutomation(trigger) {
        // Store locally for tracking and debugging
        localStorage.setItem(`prism_automation_${Date.now()}`, JSON.stringify(trigger));

        console.log('🤖 Sending automation trigger to GHL:', trigger);

        // GHL API integration for automation triggers
        if (!this.ghlConfig.locationId || this.ghlConfig.locationId === 'YOUR_GHL_LOCATION_ID') {
            console.log('⚠️ GHL Location ID not configured - storing locally for development');
            return;
        }

        try {
            const payload = {
                locationId: this.ghlConfig.locationId,
                automationId: trigger.automationId,
                contactData: {
                    source: 'Prism Blog Automation',
                    sessionId: trigger.sessionId,
                    region: trigger.region,
                    contentScore: trigger.contentScore,
                    leadTemperature: trigger.type,
                    serviceType: trigger.customFields?.service_type || 'general_restoration'
                },
                customFields: trigger.customFields || {},
                triggerActions: trigger.actions,
                priority: trigger.priority,
                responseTime: trigger.responseTime
            };

            // Production GHL API call
            const response = await fetch(`${this.ghlConfig.apiBase}/automation/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.ghlConfig.apiKey}`,
                    'Location-Id': this.ghlConfig.locationId
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ Automation triggered successfully in GHL');

                // Track successful automation
                localStorage.setItem(`prism_automation_success_${Date.now()}`, JSON.stringify({
                    trigger: trigger.type,
                    automationId: trigger.automationId,
                    timestamp: Date.now()
                }));

            } else {
                console.error('❌ GHL automation failed:', response.status, response.statusText);
            }

        } catch (error) {
            console.error('❌ Failed to trigger GHL automation:', error);

            // Fallback: store for manual processing
            localStorage.setItem(`prism_automation_fallback_${Date.now()}`, JSON.stringify({
                error: error.message,
                trigger: trigger,
                timestamp: Date.now()
            }));
        }
    }

    // Get automation history for debugging
    getAutomationHistory() {
        const history = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('prism_automation_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    history.push({ key, ...data });
                } catch (e) {
                    console.warn('Invalid automation data:', key);
                }
            }
        }
        return history.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Cleanup old automation data
    cleanupAutomationHistory(daysOld = 7) {
        const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('prism_automation_') || key.startsWith('prism_triggered_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && data.timestamp < cutoff) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    keysToRemove.push(key); // Remove invalid data
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`🧹 Cleaned up ${keysToRemove.length} old automation records`);
    }

    // Destroy automation triggers (cleanup on page unload)
    destroy() {
        if (this.triggerInterval) {
            clearInterval(this.triggerInterval);
        }

        // Clean up old data periodically
        this.cleanupAutomationHistory();

        console.log('🤖 Automation triggers destroyed');
    }
}

// Initialize automation triggers after GHL config loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof GHL_CONFIG !== 'undefined') {
            window.prismAutomation = new PrismAutomationTriggers();
            console.log('🤖 Prism Automation System Active');

            // Expose debugging functions
            window.getAutomationHistory = () => window.prismAutomation.getAutomationHistory();
            window.cleanupAutomations = (days) => window.prismAutomation.cleanupAutomationHistory(days);
        } else {
            console.warn('⚠️ GHL_CONFIG not found - automation triggers disabled');
        }
    }, 1200); // Load after other GHL components
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.prismAutomation) {
        window.prismAutomation.destroy();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrismAutomationTriggers;
}