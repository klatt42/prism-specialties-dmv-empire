// Direct GHL Conversation AI Widget Integration
// Simple, clean integration of your GHL widget

(function() {
    'use strict';

    // Your GHL Voice Chatbot Widget Configuration
    const GHL_CONFIG = {
        widgetId: '69111346d1e01cc82b9a42d8',
        locationId: 'BLEBkhJ9lBfryOyCfuOJ',
        loaderUrl: 'https://beta.leadconnectorhq.com/loader.js',
        resourcesUrl: 'https://beta.leadconnectorhq.com/chat-widget/loader.js'
    };

    // Load the GHL widget
    function loadGHLWidget() {
        const script = document.createElement('script');
        script.src = GHL_CONFIG.loaderUrl;
        script.setAttribute('data-resources-url', GHL_CONFIG.resourcesUrl);
        script.setAttribute('data-widget-id', GHL_CONFIG.widgetId);

        script.onload = function() {
            console.log('✅ Prism Specialties DMV chat widget loaded');

            // Track widget load event
            trackWidgetEvent('widget_loaded', {
                widget_id: GHL_CONFIG.widgetId,
                page_url: window.location.href,
                page_type: getPageType()
            });
        };

        script.onerror = function() {
            console.error('❌ Failed to load GHL chat widget');
        };

        document.head.appendChild(script);
    }

    // Get page type for analytics
    function getPageType() {
        const path = window.location.pathname;
        if (path.includes('fire-damage')) return 'fire_damage_checklist';
        if (path.includes('water-damage')) return 'water_damage_checklist';
        if (path.includes('document-recovery')) return 'document_recovery_checklist';
        if (path.includes('chatbot-test')) return 'test_page';
        if (path.includes('checklist')) return 'general_checklist';
        return 'general_page';
    }

    // Track events to GHL webhook
    function trackWidgetEvent(event_name, data = {}) {
        const eventData = {
            event_type: 'ghl_widget_interaction',
            event: event_name,
            ghl_location_id: GHL_CONFIG.locationId,
            ghl_widget_id: GHL_CONFIG.widgetId,
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
                event_category: 'ghl_widget',
                event_label: GHL_CONFIG.widgetId,
                value: 1
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGHLWidget);
    } else {
        loadGHLWidget();
    }

    // Track page interactions
    window.addEventListener('load', function() {
        trackWidgetEvent('page_loaded_with_widget', {
            page_type: getPageType(),
            user_agent: navigator.userAgent.substring(0, 100)
        });
    });

    console.log('🤖 Prism Specialties DMV GHL Widget Integration Ready');

})();