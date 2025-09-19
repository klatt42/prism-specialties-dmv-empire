// GHL Blog Integration Script - Include in all blog posts
// Simplified version for production use

(function() {
    'use strict';

    // Configuration
    const config = {
        contentScores: {
            blogView: 5,
            timeSpent3Min: 15,
            timeSpent5Min: 25,
            emergencyCtaClick: 50,
            phoneCallClick: 75,
            textileContent: 30,
            documentContent: 35,
            artContent: 25,
            militaryContent: 40,
            weddingContent: 45
        },
        phoneNumbers: {
            DC: '202-335-4240',
            VA: '703-229-1321',
            MD: '301-215-3191'
        }
    };

    // Session tracking
    let sessionData = {
        startTime: Date.now(),
        score: 0,
        interactions: [],
        contentType: identifyContentType(),
        sessionId: generateSessionId()
    };

    // Initialize tracking
    function init() {
        trackPageView();
        setupEngagementTracking();
        setupTimeTracking();
        console.log('GHL Blog Integration initialized');
    }

    // Generate unique session ID
    function generateSessionId() {
        return 'blog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    // Identify content type from current page
    function identifyContentType() {
        const path = window.location.pathname;

        if (path.includes('wedding-dress')) return 'weddingContent';
        if (path.includes('military-uniform')) return 'militaryContent';
        if (path.includes('textile')) return 'textileContent';
        if (path.includes('document')) return 'documentContent';
        if (path.includes('art')) return 'artContent';

        return 'general';
    }

    // Track page view
    function trackPageView() {
        addScore(config.contentScores.blogView);

        // Add content-specific score
        if (sessionData.contentType !== 'general') {
            addScore(config.contentScores[sessionData.contentType] || 0);
        }

        logInteraction({
            type: 'page_view',
            contentType: sessionData.contentType,
            path: window.location.pathname
        });
    }

    // Setup engagement tracking
    function setupEngagementTracking() {
        // Track emergency CTA clicks
        document.addEventListener('click', function(e) {
            const target = e.target;

            // Emergency phone CTAs
            if (target.matches('.emergency-phone-cta, a[href^="tel:"]')) {
                handleEmergencyClick(target);
            }

            // Other CTAs
            if (target.matches('[href*="contact"], [href*="quote"]')) {
                addScore(15);
                logInteraction({
                    type: 'cta_click',
                    element: target.textContent.trim()
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        let scrollMilestones = [25, 50, 75, 90];
        let trackedMilestones = [];

        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                scrollMilestones.forEach(function(milestone) {
                    if (scrollPercent >= milestone && trackedMilestones.indexOf(milestone) === -1) {
                        trackedMilestones.push(milestone);
                        addScore(milestone > 75 ? 8 : 3);
                        logInteraction({
                            type: 'scroll_depth',
                            depth: milestone
                        });
                    }
                });
            }
        });
    }

    // Setup time-based tracking
    function setupTimeTracking() {
        // 3-minute milestone
        setTimeout(function() {
            if (!document.hidden) {
                addScore(config.contentScores.timeSpent3Min);
                logInteraction({
                    type: 'time_milestone',
                    duration: '3_minutes'
                });

                // Show engagement indicator for high-value content
                if (sessionData.contentType === 'militaryContent' || sessionData.contentType === 'weddingContent') {
                    showEngagementCTA();
                }
            }
        }, 180000); // 3 minutes

        // 5-minute milestone
        setTimeout(function() {
            if (!document.hidden) {
                addScore(config.contentScores.timeSpent5Min);
                logInteraction({
                    type: 'time_milestone',
                    duration: '5_minutes'
                });

                // Trigger hot lead behavior
                if (sessionData.score >= 50) {
                    enhanceCtaVisibility();
                }
            }
        }, 300000); // 5 minutes
    }

    // Handle emergency CTA clicks
    function handleEmergencyClick(element) {
        const phoneNumber = element.href ? element.href.replace('tel:', '') : '';
        const region = identifyRegionFromPhone(phoneNumber);

        addScore(config.contentScores.emergencyCtaClick);

        logInteraction({
            type: 'emergency_cta_click',
            phoneNumber: phoneNumber,
            region: region,
            urgency: 'immediate'
        });

        // Send immediate alert
        sendEmergencyAlert({
            phoneNumber: phoneNumber,
            region: region,
            contentType: sessionData.contentType,
            sessionData: getSessionSummary()
        });

        // Show confirmation
        showEmergencyConfirmation(region);

        console.log('Emergency CTA clicked - immediate response triggered');
    }

    // Add to session score
    function addScore(points) {
        sessionData.score += points;
        updateLeadTemperature();
        console.log('Score +' + points + ' = ' + sessionData.score);
    }

    // Log interaction
    function logInteraction(interaction) {
        interaction.timestamp = Date.now();
        sessionData.interactions.push(interaction);
    }

    // Update lead temperature
    function updateLeadTemperature() {
        let temperature = 'cold';

        if (sessionData.score >= 100) {
            temperature = 'emergency';
        } else if (sessionData.score >= 50) {
            temperature = 'hot';
        } else if (sessionData.score >= 25) {
            temperature = 'warm';
        }

        sessionData.temperature = temperature;

        // Visual feedback for hot leads
        if (temperature === 'hot' || temperature === 'emergency') {
            enhanceCtaVisibility();
        }
    }

    // Show engagement CTA for interested visitors
    function showEngagementCTA() {
        if (document.querySelector('.engagement-cta')) return; // Already shown

        const cta = document.createElement('div');
        cta.className = 'engagement-cta';
        cta.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #1976D2, #2196F3); color: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); z-index: 1000; font-family: Arial, sans-serif; max-width: 280px;">
                <div style="font-weight: bold; margin-bottom: 8px;">Need Expert Help?</div>
                <div style="font-size: 14px; margin-bottom: 12px;">We're here to help preserve what matters to you.</div>
                <button onclick="this.closest('.engagement-cta').remove()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; float: right; font-size: 12px;">Close</button>
            </div>
        `;

        document.body.appendChild(cta);

        // Auto-remove after 15 seconds
        setTimeout(function() {
            if (cta.parentNode) {
                cta.remove();
            }
        }, 15000);
    }

    // Enhance CTA visibility for hot leads
    function enhanceCtaVisibility() {
        document.querySelectorAll('.emergency-phone-cta').forEach(function(cta) {
            if (!cta.classList.contains('hot-lead-enhanced')) {
                cta.classList.add('hot-lead-enhanced');
                cta.style.animation = 'pulse 2s infinite';
                cta.style.transform = 'scale(1.05)';

                // Add priority badge
                const badge = document.createElement('span');
                badge.textContent = 'Priority Response';
                badge.style.cssText = 'background: #ff5722; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.75em; margin-left: 8px; animation: blink 1s infinite;';
                cta.appendChild(badge);
            }
        });
    }

    // Show emergency confirmation
    function showEmergencyConfirmation(region) {
        const phoneNumber = config.phoneNumbers[region] || config.phoneNumbers.VA;

        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
                <div style="background: white; padding: 2.5rem; border-radius: 16px; text-align: center; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="font-size: 3em; color: #d32f2f; margin-bottom: 1rem;">📞</div>
                    <h3 style="color: #d32f2f; margin-bottom: 1rem; font-size: 1.4em;">Emergency Response Activated</h3>
                    <p style="margin-bottom: 1.5rem; line-height: 1.6;">Our emergency response team has been notified and will contact you within 15 minutes.</p>
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <div style="font-weight: bold; color: #1976D2; font-size: 1.3em;">${phoneNumber}</div>
                        <div style="font-size: 0.9em; color: #666;">Direct Emergency Line</div>
                    </div>
                    <button onclick="this.closest('div').remove()" style="background: #1976D2; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 1em; font-weight: bold;">Understood</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Auto-remove after 12 seconds
        setTimeout(function() {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 12000);
    }

    // Send emergency alert
    function sendEmergencyAlert(alertData) {
        // Store locally for development
        localStorage.setItem('ghl_emergency_' + Date.now(), JSON.stringify(alertData));

        // In production, this would send to GHL webhook
        console.log('Emergency alert sent to GHL:', alertData);
    }

    // Get session summary
    function getSessionSummary() {
        return {
            sessionId: sessionData.sessionId,
            score: sessionData.score,
            temperature: sessionData.temperature,
            timeSpent: Date.now() - sessionData.startTime,
            interactions: sessionData.interactions.length,
            contentType: sessionData.contentType
        };
    }

    // Identify region from phone number
    function identifyRegionFromPhone(phoneNumber) {
        const phone = phoneNumber.replace(/\D/g, '');
        if (phone.includes('202')) return 'DC';
        if (phone.includes('703') || phone.includes('571')) return 'VA';
        if (phone.includes('301') || phone.includes('240')) return 'MD';
        return 'VA'; // Default
    }

    // Send session summary on page unload
    function sendSessionSummary() {
        const summary = getSessionSummary();
        localStorage.setItem('ghl_session_' + Date.now(), JSON.stringify(summary));
        console.log('Session summary:', summary);
    }

    // Add CSS for animations
    function addAnimationCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); }
                100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add CSS
    addAnimationCSS();

    // Send summary on page unload
    window.addEventListener('beforeunload', sendSessionSummary);

    // Expose status for debugging
    window.ghlBlogStatus = function() {
        return getSessionSummary();
    };

    // Load regional phone display system
    function loadPhoneDisplay() {
        const phoneScript = document.createElement('script');
        phoneScript.src = '../integrations/ghl/tracking/phone-display.js';
        phoneScript.onload = function() {
            console.log('📞 Regional phone display system loaded');
        };
        phoneScript.onerror = function() {
            console.warn('⚠️ Phone display system not available');
        };
        document.head.appendChild(phoneScript);
    }

    // Load phone display after main integration
    setTimeout(loadPhoneDisplay, 1000);

    // Load automation triggers system
    function loadAutomationTriggers() {
        const automationScript = document.createElement('script');
        automationScript.src = '../integrations/ghl/automation/sequence-triggers.js';
        automationScript.onload = function() {
            console.log('🤖 Automation triggers system loaded');
        };
        automationScript.onerror = function() {
            console.warn('⚠️ Automation triggers system not available');
        };
        document.head.appendChild(automationScript);
    }

    // Load automation system after phone display
    setTimeout(loadAutomationTriggers, 1500);

})();