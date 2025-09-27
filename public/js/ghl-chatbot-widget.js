// GHL Conversation AI Chatbot Widget for Prism Specialties DMV
// Integrates with GoHighLevel for lead tracking and automation

class PrismChatbot {
    constructor(options = {}) {
        this.config = {
            ghl_location_id: 'BLEBkhJ9lBfryOyCfuOJ',
            widget_id: options.widget_id || 'prism-dmv-chatbot',
            position: options.position || 'bottom-right',
            theme_color: options.theme_color || '#2e7d32',
            emergency_color: '#d32f2f',
            ...options
        };

        this.isOpen = false;
        this.currentFlow = 'greeting';
        this.userInfo = {};
        this.leadScore = 0;

        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.loadGHLTracking();
    }

    createWidget() {
        // Create chatbot container
        const widget = document.createElement('div');
        widget.id = this.config.widget_id;
        widget.className = 'prism-chatbot-widget';

        widget.innerHTML = `
            <div class="chatbot-toggle" id="chatbot-toggle">
                <div class="toggle-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                    <span class="pulse-dot"></span>
                </div>
                <div class="emergency-badge" style="display: none;">🚨</div>
            </div>

            <div class="chatbot-container" id="chatbot-container" style="display: none;">
                <div class="chatbot-header">
                    <div class="header-info">
                        <div class="company-logo">
                            <strong>Prism Specialties DMV</strong>
                        </div>
                        <div class="availability-status">
                            <span class="status-dot"></span>
                            Available 24/7 for Emergencies
                        </div>
                    </div>
                    <button class="close-btn" id="close-chatbot">×</button>
                </div>

                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="bot-message">
                        <div class="message-content">
                            👋 Hi! I'm here to help with your restoration needs. Are you dealing with an emergency situation right now?
                        </div>
                        <div class="quick-replies">
                            <button class="quick-reply emergency" data-action="emergency">🚨 YES - Emergency Help</button>
                            <button class="quick-reply general" data-action="general">📋 No - General Questions</button>
                        </div>
                    </div>
                </div>

                <div class="chatbot-input" style="display: none;">
                    <input type="text" placeholder="Type your message..." id="chat-input">
                    <button id="send-btn">Send</button>
                </div>
            </div>
        `;

        // Add CSS styles
        const styles = `
            <style>
            .prism-chatbot-widget {
                position: fixed;
                ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                background: ${this.config.theme_color};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                position: relative;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.2);
            }

            .pulse-dot {
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background: #ff4444;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(0.95); opacity: 1; }
                70% { transform: scale(1); opacity: 0.7; }
                100% { transform: scale(1.05); opacity: 0; }
            }

            .emergency-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: ${this.config.emergency_color};
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                animation: emergency-pulse 1s infinite;
            }

            @keyframes emergency-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .chatbot-container {
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
                overflow: hidden;
            }

            .chatbot-header {
                background: ${this.config.theme_color};
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-info .company-logo {
                font-size: 16px;
                font-weight: 600;
            }

            .availability-status {
                font-size: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                background: #4caf50;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
            }

            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
            }

            .bot-message {
                margin-bottom: 15px;
            }

            .message-content {
                background: white;
                padding: 12px 16px;
                border-radius: 18px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                margin-bottom: 10px;
                line-height: 1.4;
            }

            .quick-replies {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .quick-reply {
                background: white;
                border: 2px solid ${this.config.theme_color};
                color: ${this.config.theme_color};
                padding: 10px 15px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
                text-align: left;
            }

            .quick-reply:hover {
                background: ${this.config.theme_color};
                color: white;
            }

            .quick-reply.emergency {
                border-color: ${this.config.emergency_color};
                color: ${this.config.emergency_color};
            }

            .quick-reply.emergency:hover {
                background: ${this.config.emergency_color};
                color: white;
            }

            .chatbot-input {
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }

            #chat-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
            }

            #send-btn {
                background: ${this.config.theme_color};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
            }

            @media (max-width: 480px) {
                .chatbot-container {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(widget);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('close-chatbot');
        const container = document.getElementById('chatbot-container');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());

        // Quick reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.dataset.action, e.target.textContent);
            }
        });

        // Track when widget is visible
        this.trackEvent('widget_loaded', { page: window.location.pathname });
    }

    toggleChat() {
        const container = document.getElementById('chatbot-container');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            container.style.display = 'flex';
            this.trackEvent('widget_opened', { page: window.location.pathname });
        } else {
            container.style.display = 'none';
        }
    }

    closeChat() {
        const container = document.getElementById('chatbot-container');
        container.style.display = 'none';
        this.isOpen = false;
        this.trackEvent('widget_closed', { conversation_length: this.getConversationLength() });
    }

    handleQuickReply(action, text) {
        this.addUserMessage(text);

        switch(action) {
            case 'emergency':
                this.handleEmergencyFlow();
                break;
            case 'general':
                this.handleGeneralFlow();
                break;
            default:
                this.handleCustomFlow(action);
        }
    }

    handleEmergencyFlow() {
        this.leadScore += 75;
        this.trackEvent('emergency_selected', { lead_score: this.leadScore });

        setTimeout(() => {
            this.addBotMessage(
                "I'm connecting you with our emergency team immediately. What type of damage are you experiencing?",
                [
                    { text: "🔥 Fire/Smoke Damage", action: "emergency_fire" },
                    { text: "💧 Water/Flood Damage", action: "emergency_water" },
                    { text: "🌪️ Storm/Wind Damage", action: "emergency_storm" },
                    { text: "📄 Document Recovery", action: "emergency_docs" }
                ]
            );
        }, 1000);
    }

    handleGeneralFlow() {
        this.leadScore += 25;
        this.trackEvent('general_inquiry_selected', { lead_score: this.leadScore });

        setTimeout(() => {
            this.addBotMessage(
                "I'd be happy to help! What brings you to Prism Specialties today?",
                [
                    { text: "💡 Learn About Our Services", action: "services_info" },
                    { text: "📅 Schedule a Consultation", action: "schedule_consultation" },
                    { text: "📞 Get Contact Information", action: "contact_info" },
                    { text: "📋 Download Emergency Checklists", action: "download_checklists" }
                ]
            );
        }, 1000);
    }

    addUserMessage(text) {
        const messages = document.getElementById('chatbot-messages');
        const userMsg = document.createElement('div');
        userMsg.className = 'user-message';
        userMsg.innerHTML = `
            <div class="message-content" style="background: ${this.config.theme_color}; color: white; margin-left: 50px;">
                ${text}
            </div>
        `;
        messages.appendChild(userMsg);
        messages.scrollTop = messages.scrollHeight;
    }

    addBotMessage(text, quickReplies = []) {
        const messages = document.getElementById('chatbot-messages');
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message';

        let quickReplyHTML = '';
        if (quickReplies.length > 0) {
            quickReplyHTML = '<div class="quick-replies">';
            quickReplies.forEach(reply => {
                const buttonClass = reply.action.includes('emergency') ? 'quick-reply emergency' : 'quick-reply';
                quickReplyHTML += `<button class="${buttonClass}" data-action="${reply.action}">${reply.text}</button>`;
            });
            quickReplyHTML += '</div>';
        }

        botMsg.innerHTML = `
            <div class="message-content">${text}</div>
            ${quickReplyHTML}
        `;

        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }

    loadGHLTracking() {
        // Load GHL tracking script
        if (!window.GHL_LOADED) {
            const script = document.createElement('script');
            script.src = '/js/lead-capture.js'; // Your existing GHL integration
            script.onload = () => {
                window.GHL_LOADED = true;
                console.log('GHL tracking loaded for chatbot');
            };
            document.head.appendChild(script);
        }
    }

    trackEvent(event_name, data = {}) {
        // Track to GHL and analytics
        const eventData = {
            event: event_name,
            chatbot_id: this.config.widget_id,
            page_url: window.location.href,
            timestamp: new Date().toISOString(),
            lead_score: this.leadScore,
            ...data
        };

        // Send to GHL webhook
        fetch('/.netlify/functions/ghl-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'chatbot_interaction',
                ...eventData
            })
        }).catch(err => console.log('GHL tracking error:', err));

        // Also track in Google Analytics if available
        if (window.gtag) {
            window.gtag('event', event_name, {
                event_category: 'chatbot',
                event_label: this.config.widget_id,
                value: this.leadScore
            });
        }
    }

    getConversationLength() {
        return document.getElementById('chatbot-messages').children.length;
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.prismChatbot = new PrismChatbot({
        widget_id: 'prism-dmv-main-chatbot',
        position: 'bottom-right',
        theme_color: '#2e7d32'
    });
});