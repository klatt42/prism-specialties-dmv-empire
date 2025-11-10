// Dual GHL Chatbot Integration - Test Configuration
// Voice Chatbot (upper right) + Text Chatbot (lower right)

(function() {
    'use strict';

    // Configuration for both chatbots
    const CHATBOT_CONFIG = {
        voiceBot: {
            widgetId: '69111346d1e01cc82b9a42d8',
            position: 'upper-right',
            label: 'Voice Chat'
        },
        textBot: {
            widgetId: '6911ee5033e9925262fe8ae5',
            position: 'lower-right',
            label: 'Text Chat'
        },
        locationId: 'BLEBkhJ9lBfryOyCfuOJ',
        loaderUrl: 'https://beta.leadconnectorhq.com/loader.js',
        resourcesUrl: 'https://beta.leadconnectorhq.com/chat-widget/loader.js'
    };

    // Load a single GHL widget
    function loadWidget(config, widgetType) {
        const script = document.createElement('script');
        script.src = CHATBOT_CONFIG.loaderUrl;
        script.setAttribute('data-resources-url', CHATBOT_CONFIG.resourcesUrl);
        script.setAttribute('data-widget-id', config.widgetId);
        script.id = `ghl-widget-${widgetType}`;

        script.onload = function() {
            console.log(`✅ ${config.label} loaded (${config.widgetId})`);

            // Apply custom positioning after a short delay to let GHL render
            setTimeout(() => applyCustomPositioning(config), 1000);

            trackWidgetEvent('widget_loaded', {
                widget_type: widgetType,
                widget_id: config.widgetId,
                position: config.position
            });
        };

        script.onerror = function() {
            console.error(`❌ Failed to load ${config.label}`);
        };

        document.head.appendChild(script);
    }

    // Apply custom CSS positioning for widgets
    function applyCustomPositioning(config) {
        // GHL widgets typically get injected into iframes or shadowDOM
        // We'll add CSS to try to position them

        const style = document.createElement('style');
        style.id = `widget-positioning-${config.widgetId}`;

        if (config.position === 'upper-right') {
            // Move voice chatbot to upper right with proper spacing
            style.textContent = `
                /* Voice chatbot - upper right with higher z-index */
                iframe[src*="${config.widgetId}"],
                div[data-widget-id="${config.widgetId}"] {
                    top: 20px !important;
                    bottom: auto !important;
                    right: 20px !important;
                    z-index: 9999 !important;
                    max-height: 45vh !important;
                }

                /* Additional selectors for GHL widget containers */
                [id*="chat-widget-container"][id*="${config.widgetId.substring(0, 8)}"] {
                    top: 20px !important;
                    bottom: auto !important;
                    z-index: 9999 !important;
                }
            `;
        } else {
            // Text chatbot in lower right with spacing from bottom and voice bot
            style.textContent = `
                /* Text chatbot - lower right with proper spacing */
                iframe[src*="${config.widgetId}"],
                div[data-widget-id="${config.widgetId}"] {
                    bottom: 20px !important;
                    top: auto !important;
                    right: 20px !important;
                    z-index: 9998 !important;
                    max-height: 45vh !important;
                }

                /* Ensure text chatbot container has proper spacing */
                [id*="chat-widget-container"][id*="${config.widgetId.substring(0, 8)}"] {
                    bottom: 20px !important;
                    top: auto !important;
                    z-index: 9998 !important;
                }
            `;
        }

        document.head.appendChild(style);
        console.log(`📍 Applied positioning for ${config.label}: ${config.position}`);
    }

    // Track widget events
    function trackWidgetEvent(event_name, data = {}) {
        const eventData = {
            event_type: 'ghl_dual_widget_interaction',
            event: event_name,
            ghl_location_id: CHATBOT_CONFIG.locationId,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Send to webhook
        fetch('/.netlify/functions/ghl-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(err => console.log('Widget tracking error:', err));

        // Google Analytics if available
        if (window.gtag) {
            window.gtag('event', event_name, {
                event_category: 'ghl_dual_widget',
                event_label: data.widget_type,
                value: 1
            });
        }
    }

    // Initialize both widgets
    function initDualChatbots() {
        console.log('🤖 Loading Dual GHL Chatbots...');
        console.log('📱 Voice Chat (upper-right):', CHATBOT_CONFIG.voiceBot.widgetId);
        console.log('💬 Text Chat (lower-right):', CHATBOT_CONFIG.textBot.widgetId);

        // Load voice chatbot first
        loadWidget(CHATBOT_CONFIG.voiceBot, 'voice');

        // Load text chatbot after a short delay to avoid conflicts
        setTimeout(() => {
            loadWidget(CHATBOT_CONFIG.textBot, 'text');
        }, 500);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDualChatbots);
    } else {
        initDualChatbots();
    }

    // Track page load
    window.addEventListener('load', function() {
        trackWidgetEvent('page_loaded_with_dual_widgets', {
            page_url: window.location.href,
            user_agent: navigator.userAgent.substring(0, 100)
        });
    });

    console.log('✅ Dual GHL Chatbot Integration Ready');

})();
