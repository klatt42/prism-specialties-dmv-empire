// GHL Conversation AI Integration for Prism Specialties DMV
// This replaces the custom chatbot with native GHL Conversation AI

class GHLConversationAI {
    constructor(options = {}) {
        this.config = {
            locationId: 'BLEBkhJ9lBfryOyCfuOJ',
            widgetId: options.widgetId || null, // You'll need to provide this from GHL
            apiKey: 'pit-7179ac52-bde7-44ac-9a55-79cee37f31a7',
            ...options
        };

        this.init();
    }

    init() {
        this.loadGHLWidget();
        this.setupTracking();
    }

    loadGHLWidget() {
        // Method 1: Direct GHL Widget Integration
        if (this.config.widgetId) {
            this.loadDirectWidget();
        } else {
            // Method 2: Create temporary widget until you provide the ID
            this.createTemporaryWidget();
        }
    }

    loadDirectWidget() {
        // Load the actual GHL Conversation AI widget
        const script = document.createElement('script');
        script.src = `https://beta.leadconnectorhq.com/loader.js`;
        script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
        script.setAttribute('data-widget-id', this.config.widgetId);
        document.head.appendChild(script);

        // Track widget loading
        script.onload = () => {
            console.log('✅ GHL Conversation AI widget loaded');
            console.log('Widget ID:', this.config.widgetId);
            this.trackEvent('ghl_widget_loaded', {
                widget_id: this.config.widgetId,
                location_id: this.config.locationId
            });
        };

        script.onerror = () => {
            console.error('❌ Failed to load GHL widget');
            this.createTemporaryWidget(); // Fallback to contact info
        };
    }

    createTemporaryWidget() {
        // Create a placeholder that directs users to proper contact methods
        const widget = document.createElement('div');
        widget.id = 'ghl-temp-widget';
        widget.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #2e7d32;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                transition: all 0.3s ease;
            " onclick="showContactInfo()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </div>

            <div id="contact-modal" style="
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 320px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                z-index: 10001;
                display: none;
                overflow: hidden;
            ">
                <div style="background: #2e7d32; color: white; padding: 20px;">
                    <h3 style="margin: 0; font-size: 18px;">Contact Prism Specialties DMV</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Available 24/7 for Emergencies</p>
                </div>
                <div style="padding: 20px;">
                    <div style="margin-bottom: 15px;">
                        <strong>🏛️ Washington DC</strong><br>
                        <a href="tel:202-335-4240" style="color: #2e7d32; text-decoration: none; font-size: 16px;">(202) 335-4240</a><br>
                        <small style="color: #666;">Federal & Historic Properties</small>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>🏢 Northern Virginia</strong><br>
                        <a href="tel:703-229-1321" style="color: #2e7d32; text-decoration: none; font-size: 16px;">(703) 229-1321</a><br>
                        <small style="color: #666;">Commercial Properties</small>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <strong>🏠 Maryland</strong><br>
                        <a href="tel:301-215-3191" style="color: #2e7d32; text-decoration: none; font-size: 16px;">(301) 215-3191</a><br>
                        <small style="color: #666;">Residential Properties</small>
                    </div>
                    <div style="text-align: center;">
                        <button onclick="hideContactInfo()" style="
                            background: #2e7d32;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                        ">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Add global functions for modal
        window.showContactInfo = () => {
            document.getElementById('contact-modal').style.display = 'block';
            this.trackEvent('temp_widget_opened', { type: 'contact_info' });
        };

        window.hideContactInfo = () => {
            document.getElementById('contact-modal').style.display = 'none';
        };

        console.log('⚠️ Temporary contact widget loaded. Please configure GHL Conversation AI widget ID.');
    }

    setupTracking() {
        // Enhanced tracking for GHL integration
        this.trackEvent('page_loaded_with_ghl_ai', {
            page_url: window.location.href,
            page_type: this.getPageType(),
            timestamp: new Date().toISOString()
        });
    }

    getPageType() {
        const url = window.location.pathname;
        if (url.includes('fire-damage')) return 'fire_damage_checklist';
        if (url.includes('water-damage')) return 'water_damage_checklist';
        if (url.includes('document-recovery')) return 'document_recovery_checklist';
        if (url.includes('chatbot-test')) return 'test_page';
        return 'general_page';
    }

    trackEvent(event_name, data = {}) {
        const eventData = {
            event: event_name,
            ghl_location_id: this.config.locationId,
            page_url: window.location.href,
            timestamp: new Date().toISOString(),
            ...data
        };

        // Send to your webhook for GHL integration
        fetch('/.netlify/functions/ghl-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'ghl_conversation_ai',
                ...eventData
            })
        }).catch(err => console.log('Tracking error:', err));

        // Google Analytics if available
        if (window.gtag) {
            window.gtag('event', event_name, {
                event_category: 'ghl_conversation_ai',
                event_label: this.config.locationId,
                custom_parameters: data
            });
        }
    }

    // Method to update with real GHL widget ID when available
    updateWidgetId(widgetId) {
        this.config.widgetId = widgetId;
        // Remove temporary widget
        const tempWidget = document.getElementById('ghl-temp-widget');
        if (tempWidget) tempWidget.remove();
        // Load real widget
        this.loadDirectWidget();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with your actual GHL Conversation AI widget ID
    window.ghlConversationAI = new GHLConversationAI({
        widgetId: '68445a117322c207c75b3c4c' // Your Prism Specialties DMV widget ID
    });

    console.log('🤖 GHL Conversation AI integration loaded');
    console.log('Widget ID: 68445a117322c207c75b3c4c');
});