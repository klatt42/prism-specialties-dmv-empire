// ALEX ANALYTICS - Advanced Conversion Funnel Tracker
// Comprehensive funnel analysis for Prism Specialties DMV Empire

class ConversionFunnelTracker {
    constructor() {
        this.funnelStages = {
            'awareness': { order: 1, name: 'Page View', events: ['page_view'] },
            'interest': { order: 2, name: 'Content Engagement', events: ['authority_reversal_hover', 'service_card_hover', 'hook_point_view'] },
            'consideration': { order: 3, name: 'Psychology Interaction', events: ['authority_reversal_click', 'hook_point_click', 'funeral_director_focus'] },
            'intent': { order: 4, name: 'Contact Intent', events: ['phone_number_hover', 'cta_button_hover', 'contact_form_focus'] },
            'action': { order: 5, name: 'Contact Action', events: ['phone_call', 'form_submission', 'emergency_cta_click'] }
        };
        
        this.userJourney = [];
        this.conversionData = {};
        this.funnelMetrics = {};
        this.psychologyTriggers = {};
        this.regionalFunnels = {};
        
        this.initializeFunnelTracking();
    }
    
    // Initialize comprehensive funnel tracking
    initializeFunnelTracking() {
        this.trackAwarenessStage();
        this.trackInterestStage();
        this.trackConsiderationStage();
        this.trackIntentStage();
        this.trackActionStage();
        this.setupPsychologyFunnelTracking();
        this.setupRegionalFunnelTracking();
        
        // Set up session tracking
        this.sessionStart = Date.now();
        this.sessionId = this.generateSessionId();
        
        console.log('🎯 Conversion Funnel Tracker initialized');
    }
    
    // Generate unique session ID
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Track awareness stage (page view and initial engagement)
    trackAwarenessStage() {
        // Initial page view
        this.recordFunnelEvent('awareness', 'page_view', {
            page_url: window.location.href,
            page_title: document.title,
            entry_time: Date.now(),
            referrer: document.referrer,
            user_agent: navigator.userAgent
        });
        
        // Track scroll depth for engagement measurement
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Record milestones
                if (scrollPercent >= 25 && !this.hasEvent('awareness', 'scroll_25')) {
                    this.recordFunnelEvent('awareness', 'scroll_25', { scroll_depth: scrollPercent });
                }
                if (scrollPercent >= 50 && !this.hasEvent('awareness', 'scroll_50')) {
                    this.recordFunnelEvent('awareness', 'scroll_50', { scroll_depth: scrollPercent });
                }
                if (scrollPercent >= 75 && !this.hasEvent('awareness', 'scroll_75')) {
                    this.recordFunnelEvent('awareness', 'scroll_75', { scroll_depth: scrollPercent });
                }
            }
        });
        
        // Track time on page milestones
        setTimeout(() => this.recordFunnelEvent('awareness', 'time_30s', { time_on_page: 30 }), 30000);
        setTimeout(() => this.recordFunnelEvent('awareness', 'time_60s', { time_on_page: 60 }), 60000);
        setTimeout(() => this.recordFunnelEvent('awareness', 'time_120s', { time_on_page: 120 }), 120000);
    }
    
    // Track interest stage (content engagement)
    trackInterestStage() {
        // Service card hover tracking
        document.querySelectorAll('.service-card').forEach((card, index) => {
            const serviceName = card.querySelector('h3')?.textContent || 'Unknown Service';
            
            card.addEventListener('mouseenter', () => {
                this.recordFunnelEvent('interest', 'service_card_hover', {
                    service_name: serviceName,
                    card_index: index,
                    hover_time: Date.now()
                });
            });
            
            // Track hover duration
            let hoverStart;
            card.addEventListener('mouseenter', () => { hoverStart = Date.now(); });
            card.addEventListener('mouseleave', () => {
                if (hoverStart) {
                    const hoverDuration = Date.now() - hoverStart;
                    if (hoverDuration > 2000) { // 2+ seconds indicates strong interest
                        this.recordFunnelEvent('interest', 'service_card_extended_hover', {
                            service_name: serviceName,
                            hover_duration: hoverDuration
                        });
                    }
                }
            });
        });
        
        // Authority reversal element hover tracking
        document.querySelectorAll('.authority-reversal').forEach((element, index) => {
            element.addEventListener('mouseenter', () => {
                this.recordFunnelEvent('interest', 'authority_reversal_hover', {
                    element_index: index,
                    has_funeral_director: element.textContent.toLowerCase().includes('funeral director')
                });
            });
        });
        
        // Hook point visibility tracking
        document.querySelectorAll('.hook-point').forEach((element, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.recordFunnelEvent('interest', 'hook_point_view', {
                            element_index: index,
                            hook_text_preview: entry.target.textContent.substring(0, 50)
                        });
                    }
                });
            });
            observer.observe(element);
        });
    }
    
    // Track consideration stage (psychology interactions)
    trackConsiderationStage() {
        // Authority reversal clicks
        document.querySelectorAll('.authority-reversal').forEach((element, index) => {
            element.addEventListener('click', () => {
                const authorityText = element.textContent;
                const hasFuneralDirector = authorityText.toLowerCase().includes('funeral director');
                
                this.recordFunnelEvent('consideration', 'authority_reversal_click', {
                    element_index: index,
                    has_funeral_director: hasFuneralDirector,
                    authority_text_length: authorityText.length,
                    psychology_trigger: this.identifyPsychologyTrigger(authorityText)
                });
                
                // Track psychology effectiveness
                this.trackPsychologyTrigger('authority_reversal', hasFuneralDirector);
            });
        });
        
        // Hook point clicks
        document.querySelectorAll('.hook-point').forEach((element, index) => {
            element.addEventListener('click', () => {
                const hookText = element.textContent;
                
                this.recordFunnelEvent('consideration', 'hook_point_click', {
                    element_index: index,
                    hook_length: hookText.length,
                    is_question: hookText.includes('?'),
                    has_funeral_director: hookText.toLowerCase().includes('funeral director')
                });
                
                this.trackPsychologyTrigger('hook_point', hookText.toLowerCase().includes('funeral director'));
            });
        });
        
        // Funeral director text focus/selection
        this.trackFuneralDirectorTextInteraction();
    }
    
    // Track intent stage (contact intent)
    trackIntentStage() {
        // Phone number hover tracking
        document.querySelectorAll('a[href^="tel:"]').forEach((phoneLink, index) => {
            phoneLink.addEventListener('mouseenter', () => {
                const phoneNumber = phoneLink.href.replace('tel:', '');
                
                this.recordFunnelEvent('intent', 'phone_number_hover', {
                    phone_number: phoneNumber,
                    link_index: index,
                    intent_strength: 'high'
                });
            });
        });
        
        // CTA button hover tracking
        document.querySelectorAll('.btn').forEach((button, index) => {
            button.addEventListener('mouseenter', () => {
                const buttonText = button.textContent.trim();
                const isEmergency = buttonText.toLowerCase().includes('emergency');
                const isPrimary = button.classList.contains('btn-primary');
                
                this.recordFunnelEvent('intent', 'cta_button_hover', {
                    button_text: buttonText,
                    is_emergency: isEmergency,
                    is_primary: isPrimary,
                    button_index: index
                });
            });
        });
        
        // Form field focus (if any forms exist)
        document.querySelectorAll('input, textarea').forEach((field, index) => {
            field.addEventListener('focus', () => {
                this.recordFunnelEvent('intent', 'contact_form_focus', {
                    field_type: field.type || 'textarea',
                    field_index: index,
                    form_progress: this.calculateFormProgress()
                });
            });
        });
    }
    
    // Track action stage (conversions)
    trackActionStage() {
        // Phone call clicks
        document.querySelectorAll('a[href^="tel:"]').forEach((phoneLink, index) => {
            phoneLink.addEventListener('click', () => {
                const phoneNumber = phoneLink.href.replace('tel:', '');
                
                this.recordFunnelEvent('action', 'phone_call', {
                    phone_number: phoneNumber,
                    conversion_type: 'phone_call',
                    conversion_value: 50,
                    journey_duration: Date.now() - this.sessionStart
                });
                
                // Record conversion completion
                this.recordConversion('phone_call', {
                    value: 50,
                    phone_number: phoneNumber,
                    journey_steps: this.userJourney.length
                });
            });
        });
        
        // Emergency CTA clicks
        document.querySelectorAll('.btn').forEach((button, index) => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent.trim();
                const isEmergency = buttonText.toLowerCase().includes('emergency');
                const isPrimary = button.classList.contains('btn-primary');
                
                if (isEmergency) {
                    this.recordFunnelEvent('action', 'emergency_cta_click', {
                        button_text: buttonText,
                        conversion_type: 'emergency_cta',
                        conversion_value: 35,
                        urgency_level: 'high'
                    });
                    
                    this.recordConversion('emergency_cta', {
                        value: 35,
                        button_text: buttonText,
                        journey_steps: this.userJourney.length
                    });
                }
            });
        });
        
        // Form submissions
        document.querySelectorAll('form').forEach((form, index) => {
            form.addEventListener('submit', (e) => {
                this.recordFunnelEvent('action', 'form_submission', {
                    form_index: index,
                    conversion_type: 'form_submission',
                    conversion_value: 30,
                    form_completion_time: this.calculateFormCompletionTime()
                });
                
                this.recordConversion('form_submission', {
                    value: 30,
                    form_index: index,
                    journey_steps: this.userJourney.length
                });
            });
        });
    }
    
    // Record funnel event
    recordFunnelEvent(stage, event, data = {}) {
        const eventData = {
            session_id: this.sessionId,
            timestamp: Date.now(),
            stage: stage,
            event: event,
            stage_order: this.funnelStages[stage].order,
            ...data
        };
        
        this.userJourney.push(eventData);
        
        // Send to Google Analytics
        gtag('event', 'funnel_progression', {
            funnel_stage: stage,
            funnel_event: event,
            stage_order: this.funnelStages[stage].order,
            session_id: this.sessionId,
            journey_length: this.userJourney.length,
            ...data
        });
        
        // Update funnel metrics
        this.updateFunnelMetrics(stage, event);
        
        console.log(`🎯 Funnel Event: ${stage} -> ${event}`, data);
    }
    
    // Check if user has completed a specific event
    hasEvent(stage, event) {
        return this.userJourney.some(item => item.stage === stage && item.event === event);
    }
    
    // Update funnel metrics
    updateFunnelMetrics(stage, event) {
        if (!this.funnelMetrics[stage]) {
            this.funnelMetrics[stage] = {};
        }
        if (!this.funnelMetrics[stage][event]) {
            this.funnelMetrics[stage][event] = 0;
        }
        this.funnelMetrics[stage][event]++;
        
        // Calculate stage completion
        const stageEvents = this.getStageEvents(stage);
        const completionRate = (stageEvents.length / this.getMaxStageEvents(stage)) * 100;
        
        gtag('event', 'funnel_stage_progress', {
            stage: stage,
            completion_rate: completionRate.toFixed(1),
            events_completed: stageEvents.length,
            total_possible_events: this.getMaxStageEvents(stage)
        });
    }
    
    // Get events completed in a stage
    getStageEvents(stage) {
        return this.userJourney.filter(item => item.stage === stage);
    }
    
    // Get maximum possible events for a stage
    getMaxStageEvents(stage) {
        // This would be configured based on page content
        const maxEvents = {
            'awareness': 6, // page_view, scroll milestones, time milestones
            'interest': 10, // hovers on various elements
            'consideration': 8, // clicks on psychology elements
            'intent': 6, // contact intent indicators
            'action': 3 // actual conversions
        };
        return maxEvents[stage] || 1;
    }
    
    // Track psychology trigger effectiveness
    trackPsychologyTrigger(triggerType, hasFuneralDirector) {
        if (!this.psychologyTriggers[triggerType]) {
            this.psychologyTriggers[triggerType] = {
                total_interactions: 0,
                funeral_director_interactions: 0,
                effectiveness_score: 0
            };
        }
        
        this.psychologyTriggers[triggerType].total_interactions++;
        if (hasFuneralDirector) {
            this.psychologyTriggers[triggerType].funeral_director_interactions++;
        }
        
        // Calculate effectiveness score
        const funeralRatio = this.psychologyTriggers[triggerType].funeral_director_interactions / 
                           this.psychologyTriggers[triggerType].total_interactions;
        this.psychologyTriggers[triggerType].effectiveness_score = funeralRatio * 100;
        
        gtag('event', 'psychology_trigger_effectiveness', {
            trigger_type: triggerType,
            has_funeral_director: hasFuneralDirector,
            total_interactions: this.psychologyTriggers[triggerType].total_interactions,
            funeral_director_ratio: funeralRatio.toFixed(2),
            effectiveness_score: this.psychologyTriggers[triggerType].effectiveness_score.toFixed(1)
        });
    }
    
    // Identify psychology trigger type from text
    identifyPsychologyTrigger(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('would you let your funeral director')) {
            return 'funeral_director_authority_reversal';
        } else if (lowerText.includes('would you trust your funeral director')) {
            return 'funeral_director_trust_reversal';
        } else if (lowerText.includes('funeral director')) {
            return 'funeral_director_general';
        } else if (lowerText.includes('would you')) {
            return 'general_authority_reversal';
        }
        
        return 'general_psychology';
    }
    
    // Track funeral director text interactions
    trackFuneralDirectorTextInteraction() {
        // Track text selection of funeral director mentions
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection().toString().toLowerCase();
            if (selection.includes('funeral director')) {
                this.recordFunnelEvent('consideration', 'funeral_director_text_selection', {
                    selected_text: selection.substring(0, 100),
                    selection_length: selection.length
                });
            }
        });
    }
    
    // Calculate form progress
    calculateFormProgress() {
        const forms = document.querySelectorAll('form');
        if (forms.length === 0) return 0;
        
        let totalFields = 0;
        let filledFields = 0;
        
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, textarea, select');
            totalFields += fields.length;
            
            fields.forEach(field => {
                if (field.value && field.value.trim() !== '') {
                    filledFields++;
                }
            });
        });
        
        return totalFields > 0 ? (filledFields / totalFields * 100).toFixed(1) : 0;
    }
    
    // Calculate form completion time
    calculateFormCompletionTime() {
        // This would track from first form field focus to submission
        // For now, return session duration
        return Date.now() - this.sessionStart;
    }
    
    // Record conversion
    recordConversion(conversionType, data) {
        const conversionData = {
            session_id: this.sessionId,
            conversion_type: conversionType,
            conversion_timestamp: Date.now(),
            journey_duration: Date.now() - this.sessionStart,
            journey_steps: this.userJourney.length,
            funnel_completion_rate: this.calculateFunnelCompletion(),
            ...data
        };
        
        gtag('event', 'conversion', conversionData);
        gtag('event', 'purchase', {
            transaction_id: this.sessionId,
            value: data.value,
            currency: 'USD',
            items: [{
                item_id: conversionType,
                item_name: `Prism Specialties ${conversionType}`,
                category: 'restoration_services',
                quantity: 1,
                price: data.value
            }]
        });
        
        console.log('🎯 CONVERSION RECORDED:', conversionData);
    }
    
    // Calculate funnel completion rate
    calculateFunnelCompletion() {
        const stagesCompleted = Object.keys(this.funnelMetrics).length;
        const totalStages = Object.keys(this.funnelStages).length;
        return (stagesCompleted / totalStages * 100).toFixed(1);
    }
    
    // Setup psychology funnel tracking
    setupPsychologyFunnelTracking() {
        // Track psychology-specific funnel
        const psychologyFunnel = {
            'psychology_exposure': 'User sees Authority Reversal elements',
            'psychology_engagement': 'User interacts with psychology triggers', 
            'psychology_persuasion': 'User shows increased intent after psychology',
            'psychology_conversion': 'User converts with psychology attribution'
        };
        
        // This would integrate with the main funnel tracking
        console.log('🎭 Psychology funnel tracking initialized');
    }
    
    // Setup regional funnel tracking
    setupRegionalFunnelTracking() {
        const region = this.detectRegion();
        
        if (region !== 'UNKNOWN') {
            this.regionalFunnels[region] = {
                region: region,
                funnel_start: Date.now(),
                regional_events: []
            };
            
            console.log(`🗺️ Regional funnel tracking initialized for ${region}`);
        }
    }
    
    // Detect region (similar to other files)
    detectRegion() {
        const path = window.location.pathname;
        
        if (path.includes('northern-virginia') || path.includes('fairfax') || path.includes('loudoun') || path.includes('prince-william')) {
            return 'VA';
        } else if (path.includes('washington-dc')) {
            return 'DC';
        } else if (path.includes('western-maryland') || path.includes('montgomery-county')) {
            return 'MD';
        }
        
        return 'UNKNOWN';
    }
    
    // Get funnel summary for reporting
    getFunnelSummary() {
        return {
            session_id: this.sessionId,
            session_duration: Date.now() - this.sessionStart,
            total_events: this.userJourney.length,
            stages_completed: Object.keys(this.funnelMetrics).length,
            completion_rate: this.calculateFunnelCompletion(),
            psychology_triggers: this.psychologyTriggers,
            funnel_metrics: this.funnelMetrics,
            user_journey: this.userJourney
        };
    }
}

// Initialize Conversion Funnel Tracker
const funnelTracker = new ConversionFunnelTracker();

// Export for global access
window.ConversionFunnelTracker = funnelTracker;

// Report funnel summary on page unload
window.addEventListener('beforeunload', () => {
    const summary = funnelTracker.getFunnelSummary();
    gtag('event', 'funnel_session_summary', summary);
});