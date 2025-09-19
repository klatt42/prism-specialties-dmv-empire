class RegionalPhoneDisplay {
    constructor() {
        this.config = GHL_CONFIG;
        this.userRegion = this.detectUserRegion();
        this.initializePhoneTracking();
        this.updatePhoneNumbers();
        this.trackPhoneCalls();
        this.setupAdvancedTracking();
    }

    detectUserRegion() {
        // Check session storage first (from existing tracker)
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        if (session.region) return session.region;

        // URL-based detection for regional pages
        const path = window.location.pathname.toLowerCase();
        if (path.includes('washington-dc') || path.includes('dc-')) return 'DC';
        if (path.includes('virginia') || path.includes('va-') || path.includes('northern-va')) return 'VA';
        if (path.includes('maryland') || path.includes('md-') || path.includes('montgomery')) return 'MD';

        // Check for area codes in existing page content
        const pageContent = document.body.textContent;
        if (pageContent.includes('202-')) return 'DC';
        if (pageContent.includes('703-') || pageContent.includes('571-')) return 'VA';
        if (pageContent.includes('301-') || pageContent.includes('240-')) return 'MD';

        // Default to DC area for primary market
        return 'DC';
    }

    initializePhoneTracking() {
        // Store user region in session for consistency
        const sessionData = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        sessionData.region = this.userRegion;
        sessionStorage.setItem('prismSession', JSON.stringify(sessionData));

        console.log(`📞 Regional Phone Display initialized for: ${this.userRegion}`);
    }

    updatePhoneNumbers() {
        const phoneNumber = this.config.phoneNumbers[this.userRegion];
        const formattedPhone = this.formatPhoneDisplay(phoneNumber);

        // Update all regional phone displays
        document.querySelectorAll('[data-phone="regional"], [data-phone-region]').forEach(element => {
            const region = element.getAttribute('data-phone-region');

            // If element specifies a region, use that; otherwise use user's region
            const targetRegion = region && region !== 'auto' ? region.toUpperCase() : this.userRegion;
            const targetPhone = this.config.phoneNumbers[targetRegion];

            if (targetPhone) {
                element.textContent = this.formatPhoneDisplay(targetPhone);
                element.href = `tel:${targetPhone}`;
            }
        });

        // Update emergency CTAs with regional numbers
        document.querySelectorAll('.emergency-cta, .emergency-phone-cta').forEach(cta => {
            const phoneLink = cta.querySelector('a[href^="tel:"]') || cta;
            if (phoneLink && phoneLink.href && phoneLink.href.startsWith('tel:')) {
                // Only update if it doesn't already have a specific regional number
                const currentPhone = phoneLink.href.replace('tel:', '');
                if (!this.isRegionalPhone(currentPhone)) {
                    phoneLink.href = `tel:${phoneNumber}`;
                    if (phoneLink.textContent.includes('202-') || phoneLink.textContent.includes('703-') || phoneLink.textContent.includes('301-')) {
                        phoneLink.textContent = phoneLink.textContent.replace(/\d{3}-\d{3}-\d{4}/, formattedPhone);
                    }
                }
            }
        });

        // Update any generic phone placeholders
        document.querySelectorAll('[data-phone="auto"]').forEach(element => {
            element.textContent = formattedPhone;
            if (element.tagName === 'A') {
                element.href = `tel:${phoneNumber}`;
            }
        });

        console.log(`📞 Updated phone displays for ${this.userRegion}: ${formattedPhone}`);
    }

    formatPhoneDisplay(phoneNumber) {
        // Format phone number for display (XXX-XXX-XXXX)
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
        }
        return phoneNumber;
    }

    isRegionalPhone(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        return Object.values(this.config.phoneNumbers).some(regional =>
            regional.replace(/\D/g, '') === cleaned
        );
    }

    trackPhoneCalls() {
        document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
            phoneLink.addEventListener('click', (e) => {
                const phoneNumber = e.target.href.replace('tel:', '');
                const region = this.identifyRegionFromPhone(phoneNumber);

                // Track high-value phone call action
                this.trackPhoneCallAction(phoneNumber, region, e.target);

                // Trigger immediate hot lead sequence
                this.triggerHotLeadSequence(phoneNumber, region);
            });
        });
    }

    setupAdvancedTracking() {
        // Track hover events on phone numbers (indicates interest)
        document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
            let hoverStartTime = null;

            phoneLink.addEventListener('mouseenter', () => {
                hoverStartTime = Date.now();
            });

            phoneLink.addEventListener('mouseleave', () => {
                if (hoverStartTime) {
                    const hoverDuration = Date.now() - hoverStartTime;
                    if (hoverDuration > 2000) { // 2+ second hover indicates strong interest
                        this.trackPhoneHover(phoneLink.href.replace('tel:', ''), hoverDuration);
                    }
                }
                hoverStartTime = null;
            });
        });

        // Track copy events on phone numbers
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection().toString();
            const phoneRegex = /(\d{3}[-.]?\d{3}[-.]?\d{4})/;
            if (phoneRegex.test(selection)) {
                this.trackPhoneCopy(selection);
            }
        });
    }

    trackPhoneCallAction(phoneNumber, region, element) {
        // Add high score for phone call action
        if (window.prismTracker) {
            window.prismTracker.sessionData.contentScore += 75; // High-value action
            window.prismTracker.updateLeadQuality();
        }

        // Track in GHL-compatible format
        const callData = {
            type: 'phone_call_click',
            phoneNumber: phoneNumber,
            region: region,
            timestamp: Date.now(),
            elementType: element.className,
            sessionId: this.getSessionId(),
            urgency: this.determineCallUrgency(element)
        };

        // Store for GHL sync
        localStorage.setItem(`prism_phone_call_${Date.now()}`, JSON.stringify(callData));

        console.log('📞 Phone call tracked:', callData);
    }

    trackPhoneHover(phoneNumber, duration) {
        if (window.prismTracker) {
            window.prismTracker.sessionData.contentScore += 10; // Interest indicator
            window.prismTracker.updateLeadQuality();
        }

        const hoverData = {
            type: 'phone_hover',
            phoneNumber: phoneNumber,
            duration: duration,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };

        localStorage.setItem(`prism_phone_hover_${Date.now()}`, JSON.stringify(hoverData));
        console.log('📞 Phone hover tracked:', hoverData);
    }

    trackPhoneCopy(phoneNumber) {
        if (window.prismTracker) {
            window.prismTracker.sessionData.contentScore += 25; // Copy indicates intent to call later
            window.prismTracker.updateLeadQuality();
        }

        const copyData = {
            type: 'phone_copy',
            phoneNumber: phoneNumber,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };

        localStorage.setItem(`prism_phone_copy_${Date.now()}`, JSON.stringify(copyData));
        console.log('📞 Phone copy tracked:', copyData);
    }

    determineCallUrgency(element) {
        if (element.classList.contains('emergency-cta') ||
            element.classList.contains('emergency-phone-cta') ||
            element.closest('.emergency-cta')) {
            return 'emergency';
        }

        if (element.textContent.toLowerCase().includes('emergency') ||
            element.textContent.toLowerCase().includes('urgent')) {
            return 'emergency';
        }

        return 'standard';
    }

    identifyRegionFromPhone(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Check against known regional numbers
        for (const [region, regionalPhone] of Object.entries(this.config.phoneNumbers)) {
            if (regionalPhone.replace(/\D/g, '') === cleaned) {
                return region;
            }
        }

        // Fallback to area code detection
        if (cleaned.startsWith('202')) return 'DC';
        if (cleaned.startsWith('703') || cleaned.startsWith('571')) return 'VA';
        if (cleaned.startsWith('301') || cleaned.startsWith('240')) return 'MD';

        return this.userRegion; // Default to user's detected region
    }

    triggerHotLeadSequence(phoneNumber, region) {
        const urgency = this.determineCallUrgency(event.target);

        // Immediate GHL automation trigger
        const hotLeadData = {
            type: 'hot_lead_phone_call',
            phoneNumber: phoneNumber,
            region: region,
            urgency: urgency,
            sessionData: this.getSessionSummary(),
            timestamp: Date.now(),
            // Ready for GHL Location ID integration
            locationId: this.config.locationId || 'YOUR_GHL_LOCATION_ID'
        };

        // Store for immediate GHL sync
        localStorage.setItem(`prism_hot_lead_${Date.now()}`, JSON.stringify(hotLeadData));

        // Console notification for immediate response
        console.log('🔥 HOT LEAD SEQUENCE TRIGGERED:', hotLeadData);

        // Show immediate response confirmation to user
        this.showCallConfirmation(phoneNumber, region, urgency);

        // In production, this would trigger immediate GHL workflow
        // this.sendToGHLWebhook(hotLeadData);
    }

    showCallConfirmation(phoneNumber, region, urgency) {
        const isEmergency = urgency === 'emergency';
        const responseTime = isEmergency ? '15 minutes' : '4 hours';
        const backgroundColor = isEmergency ? '#D32F2F' : '#1976D2';

        const confirmation = document.createElement('div');
        confirmation.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${backgroundColor}; color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); z-index: 10000; max-width: 350px; font-family: Arial, sans-serif;">
                <div style="font-size: 1.5em; margin-bottom: 0.5rem;">${isEmergency ? '🚨' : '📞'}</div>
                <div style="font-weight: bold; margin-bottom: 0.5rem;">
                    ${isEmergency ? 'Emergency Response Activated' : 'Call Tracked - Response Initiated'}
                </div>
                <div style="margin-bottom: 1rem; font-size: 0.9rem;">
                    We'll respond within ${responseTime} to coordinate your ${region} area service.
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 0.5rem; border-radius: 6px; font-size: 0.85rem;">
                    ${phoneNumber} (${region} Region)
                </div>
                <button onclick="this.closest('div').remove()" style="margin-top: 1rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">Got it</button>
            </div>
        `;

        document.body.appendChild(confirmation);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 8000);
    }

    getSessionId() {
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        return session.sessionId || 'no-session';
    }

    getSessionSummary() {
        if (window.prismTracker && window.prismTracker.getSessionStatus) {
            return window.prismTracker.getSessionStatus();
        }

        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        return {
            sessionId: session.sessionId,
            region: session.region || this.userRegion,
            contentScore: session.contentScore || 0,
            temperature: session.leadQuality || 'cold'
        };
    }

    // Production GHL webhook integration (ready for your Location ID)
    async sendToGHLWebhook(leadData) {
        if (!this.config.locationId || this.config.locationId === 'YOUR_GHL_LOCATION_ID') {
            console.log('⚠️ GHL Location ID not configured - storing locally');
            return;
        }

        try {
            const webhookData = {
                locationId: this.config.locationId,
                contactData: {
                    phone: leadData.phoneNumber,
                    source: 'Prism Blog Phone Call',
                    region: leadData.region,
                    urgency: leadData.urgency,
                    sessionScore: leadData.sessionData.contentScore || 0,
                    leadTemperature: leadData.sessionData.temperature || 'hot'
                },
                triggerWorkflow: leadData.urgency === 'emergency' ? 'emergency_response' : 'hot_lead_followup',
                customFields: {
                    blog_session_id: leadData.sessionData.sessionId,
                    call_timestamp: leadData.timestamp,
                    content_score: leadData.sessionData.contentScore
                }
            };

            // GHL webhook endpoint (uncomment for production)
            // const response = await fetch(`${this.config.apiBase}/webhook/phone-call`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${this.config.apiKey}`
            //     },
            //     body: JSON.stringify(webhookData)
            // });

            console.log('🚀 Ready for GHL webhook:', webhookData);

        } catch (error) {
            console.error('❌ GHL webhook error:', error);
            // Fallback to local storage
            localStorage.setItem(`prism_ghl_fallback_${Date.now()}`, JSON.stringify(leadData));
        }
    }

    // Update region (for dynamic region changes)
    updateRegion(newRegion) {
        this.userRegion = newRegion;
        this.updatePhoneNumbers();

        // Update session storage
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
        session.region = newRegion;
        sessionStorage.setItem('prismSession', JSON.stringify(session));

        console.log(`📞 Region updated to: ${newRegion}`);
    }

    // Get current regional phone for external use
    getCurrentPhone() {
        return this.config.phoneNumbers[this.userRegion];
    }

    // Get all tracked phone interactions
    getPhoneInteractions() {
        const interactions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('prism_phone_') || key.startsWith('prism_hot_lead_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    interactions.push({ key, ...data });
                } catch (e) {
                    console.warn('Invalid phone interaction data:', key);
                }
            }
        }
        return interactions.sort((a, b) => b.timestamp - a.timestamp);
    }
}

// Initialize phone tracking after main GHL tracker
document.addEventListener('DOMContentLoaded', function() {
    // Wait for main GHL tracker to initialize first
    setTimeout(() => {
        if (typeof GHL_CONFIG !== 'undefined') {
            window.phoneTracker = new RegionalPhoneDisplay();
            console.log('📞 Regional Phone Display System Active');

            // Expose for debugging
            window.getPhoneInteractions = () => window.phoneTracker.getPhoneInteractions();
        } else {
            console.warn('⚠️ GHL_CONFIG not found - phone tracking disabled');
        }
    }, 800); // Slightly delayed to ensure main tracker loads first
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegionalPhoneDisplay;
}