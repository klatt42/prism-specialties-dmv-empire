// Enhanced Contact Form Component for GHL Integration
// Usage: <div id="prism-contact-form"></div> then call PrismContactForm.render()

class PrismContactForm {
    constructor(containerId = 'prism-contact-form') {
        this.container = document.getElementById(containerId);
        this.formData = {};
        this.session = {};
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('Contact form container not found');
            return;
        }

        this.loadSession();
        this.render();
        this.setupEventListeners();
        this.injectStyles();

        console.log('📝 Prism Contact Form Component initialized');
    }

    loadSession() {
        this.session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');
    }

    render() {
        this.container.innerHTML = `
            <div class="prism-contact-form-enhanced">
                <h3>🎯 Get Your Free Restoration Consultation</h3>
                <p class="form-subtitle">Expert restoration services across the DMV region</p>

                <div class="form-progress">
                    <div class="form-progress-bar" id="formProgress"></div>
                </div>

                <form id="prismContactFormComponent" class="restoration-contact-form">
                    <!-- Hidden fields for GHL Integration -->
                    <input type="hidden" name="region" value="${this.session.region || this.detectRegion()}">
                    <input type="hidden" name="content_score" value="${this.session.contentScore || 0}">
                    <input type="hidden" name="session_id" value="${this.session.sessionId || this.generateSessionId()}">
                    <input type="hidden" name="lead_temperature" value="">
                    <input type="hidden" name="service_category" value="">
                    <input type="hidden" name="page_source" value="${window.location.pathname}">

                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name*</label>
                            <input type="text" id="firstName" name="first_name" required>
                            <div class="error-message">Please enter your first name</div>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name*</label>
                            <input type="text" id="lastName" name="last_name" required>
                            <div class="error-message">Please enter your last name</div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email Address*</label>
                            <input type="email" id="email" name="email" required>
                            <div class="error-message">Please enter a valid email address</div>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number*</label>
                            <input type="tel" id="phone" name="phone" required>
                            <div class="error-message">Please enter your phone number</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="serviceType">Type of Restoration Needed*</label>
                        <select id="serviceType" name="service_type" required>
                            <option value="">Select Service Type</option>
                            <option value="art_restoration">🎨 Art & Painting Restoration</option>
                            <option value="textile_restoration">🧵 Textile & Fabric Restoration</option>
                            <option value="wedding_dress_restoration">👰 Wedding Dress Restoration</option>
                            <option value="military_uniform_restoration">🪖 Military Uniform Restoration</option>
                            <option value="document_restoration">📄 Document & Paper Restoration</option>
                            <option value="electronics_restoration">🔌 Electronics & Audio Restoration</option>
                            <option value="emergency_restoration">🚨 Emergency Restoration Service</option>
                            <option value="consultation">💬 General Consultation</option>
                        </select>
                        <div class="error-message">Please select a service type</div>
                    </div>

                    <div class="form-group">
                        <label for="urgency">How urgent is your restoration need?</label>
                        <select id="urgency" name="urgency">
                            <option value="consultation">💭 Just exploring options</option>
                            <option value="planning">📅 Planning for future restoration</option>
                            <option value="soon">⏰ Needed within 2-4 weeks</option>
                            <option value="urgent">🔥 Needed within 1-2 weeks</option>
                            <option value="emergency">🚨 Emergency - Immediate attention needed</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="description">Brief Description of Item(s)*</label>
                        <textarea id="description" name="description" rows="3" required
                            placeholder="Describe your item: type, age, condition, damage, special significance..."></textarea>
                        <div class="error-message">Please provide a description</div>
                    </div>

                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="photoConsent" name="photo_consent">
                        <label for="photoConsent">📸 I can provide photos for assessment</label>
                    </div>

                    <button type="submit" class="submit-btn" id="submitBtn">
                        🎯 Get My Free Consultation
                        <span class="regional-phone">Call: <span data-phone-region="auto">202-335-4240</span></span>
                    </button>

                    <p class="form-footer">
                        <strong>🌍 DMV Coverage:</strong> Washington DC • Northern Virginia • Maryland<br>
                        <small>Response within 2 hours • Emergency service 24/7</small>
                    </p>
                </form>
            </div>
        `;
    }

    setupEventListeners() {
        const form = document.getElementById('prismContactFormComponent');
        if (!form) return;

        // Form submission
        form.addEventListener('submit', this.handleSubmit.bind(this));

        // Progress tracking
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('input', this.updateProgress.bind(this));
            input.addEventListener('change', this.updateProgress.bind(this));
            input.addEventListener('blur', this.validateField.bind(this));
        });

        // Service type changes
        document.getElementById('serviceType').addEventListener('change', this.handleServiceChange.bind(this));

        // Urgency changes
        document.getElementById('urgency').addEventListener('change', this.handleUrgencyChange.bind(this));

        // Auto-save
        setInterval(() => this.autoSave(), 15000);

        // Update regional phone
        setTimeout(() => this.updateRegionalPhone(), 1000);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const formData = new FormData(e.target);
            const additionalScore = this.calculateFormScore(formData);

            // Update session
            this.session.contentScore = (this.session.contentScore || 0) + additionalScore;
            this.session.leadQuality = this.calculateLeadTemperature(this.session.contentScore);

            // Update hidden fields
            formData.set('content_score', this.session.contentScore);
            formData.set('lead_temperature', this.session.leadQuality);

            sessionStorage.setItem('prismSession', JSON.stringify(this.session));

            // Submit to GHL
            await this.submitToGHL(formData);

            // Trigger automation
            await this.triggerAutomation(formData);

            // Show success
            this.showSuccess();

            // Track form submission
            if (window.prismTracker) {
                window.prismTracker.trackPageView('contactFormSubmission', window.location.href);
            }

            console.log('✅ Contact form submitted successfully');

        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.showError();
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    calculateFormScore(formData) {
        let score = 100; // Base form submission score

        const urgency = formData.get('urgency');
        const serviceType = formData.get('service_type');

        // Urgency scoring
        const urgencyScores = {
            'emergency': 100,
            'urgent': 75,
            'soon': 50,
            'planning': 25,
            'consultation': 10
        };
        score += urgencyScores[urgency] || 0;

        // Service type scoring
        const serviceScores = {
            'emergency_restoration': 75,
            'wedding_dress_restoration': 60,
            'military_uniform_restoration': 55,
            'art_restoration': 45,
            'document_restoration': 40,
            'textile_restoration': 40,
            'electronics_restoration': 35,
            'consultation': 20
        };
        score += serviceScores[serviceType] || 0;

        // Photo consent bonus
        if (formData.get('photo_consent')) score += 15;

        return score;
    }

    calculateLeadTemperature(totalScore) {
        if (totalScore >= 250) return 'emergency';
        if (totalScore >= 150) return 'hot';
        if (totalScore >= 75) return 'warm';
        return 'cold';
    }

    async submitToGHL(formData) {
        const contactData = {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            source: 'Prism Blog Contact Form Component',
            customFields: {
                region: formData.get('region'),
                service_type: formData.get('service_type'),
                urgency: formData.get('urgency'),
                description: formData.get('description'),
                content_score: formData.get('content_score'),
                lead_temperature: formData.get('lead_temperature'),
                session_id: formData.get('session_id'),
                page_source: formData.get('page_source'),
                photo_consent: formData.get('photo_consent') === 'on',
                submission_timestamp: new Date().toISOString()
            }
        };

        // Store locally for development
        localStorage.setItem(`prism_contact_component_${Date.now()}`, JSON.stringify(contactData));

        console.log('📞 Contact data prepared for GHL:', contactData);

        // GHL API submission (production)
        if (typeof GHL_CONFIG !== 'undefined' && GHL_CONFIG.locationId !== 'YOUR_GHL_LOCATION_ID') {
            try {
                const response = await fetch(`${GHL_CONFIG.apiBase}/contacts/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                        'Content-Type': 'application/json',
                        'Location-Id': GHL_CONFIG.locationId
                    },
                    body: JSON.stringify(contactData)
                });

                if (response.ok) {
                    console.log('✅ Contact submitted to GHL successfully');
                } else {
                    console.error('❌ GHL submission failed:', response.status);
                }
            } catch (error) {
                console.error('❌ GHL API error:', error);
            }
        }
    }

    async triggerAutomation(formData) {
        const urgency = formData.get('urgency');
        const serviceType = formData.get('service_type');

        if (!window.prismAutomation) return;

        // Trigger based on urgency
        if (urgency === 'emergency') {
            window.prismAutomation.triggerEmergencySequence(this.session);
        } else if (this.session.leadQuality === 'hot') {
            window.prismAutomation.triggerHotLeadSequence(this.session);
        } else if (this.session.leadQuality === 'warm') {
            window.prismAutomation.triggerWarmLeadSequence(this.session);
        } else {
            window.prismAutomation.triggerColdLeadSequence(this.session);
        }

        // Content-specific automation
        if (serviceType === 'wedding_dress_restoration') {
            window.prismAutomation.triggerWeddingContentSequence();
        } else if (serviceType === 'military_uniform_restoration') {
            window.prismAutomation.triggerMilitaryContentSequence();
        }

        console.log(`🤖 Triggered ${this.session.leadQuality} automation for ${serviceType}`);
    }

    validateForm() {
        const form = document.getElementById('prismContactFormComponent');
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        let isValid = true;
        requiredInputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(event) {
        const field = event.target;
        const formGroup = field.closest('.form-group');

        if (!field.checkValidity()) {
            formGroup.classList.add('error');
            return false;
        } else {
            formGroup.classList.remove('error');
            return true;
        }
    }

    updateProgress() {
        const form = document.getElementById('prismContactFormComponent');
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        let filledFields = 0;
        requiredInputs.forEach(input => {
            if (input.value.trim() !== '') {
                filledFields++;
            }
        });

        const progress = (filledFields / requiredInputs.length) * 100;
        const progressBar = document.getElementById('formProgress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        // Update submit button
        const submitBtn = document.getElementById('submitBtn');
        if (progress === 100) {
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        }
    }

    handleServiceChange(event) {
        const serviceType = event.target.value;
        document.querySelector('input[name="service_category"]').value = serviceType;

        // Auto-detect content from current page
        const path = window.location.pathname.toLowerCase();
        if (path.includes('wedding') && serviceType === 'textile_restoration') {
            document.getElementById('serviceType').value = 'wedding_dress_restoration';
        } else if (path.includes('military') && serviceType === 'textile_restoration') {
            document.getElementById('serviceType').value = 'military_uniform_restoration';
        }
    }

    handleUrgencyChange(event) {
        const urgency = event.target.value;

        // Visual urgency indicator
        const existingIndicator = document.querySelector('.urgency-indicator');
        if (existingIndicator) existingIndicator.remove();

        if (urgency === 'emergency' || urgency === 'urgent') {
            const label = document.querySelector('label[for="urgency"]');
            const indicator = document.createElement('span');
            indicator.className = `urgency-indicator urgency-${urgency}`;
            indicator.textContent = urgency === 'emergency' ? 'EMERGENCY' : 'URGENT';
            indicator.style.cssText = `
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-left: 0.5rem;
                background: ${urgency === 'emergency' ? '#ffebee' : '#fff3e0'};
                color: ${urgency === 'emergency' ? '#d32f2f' : '#f57c00'};
                ${urgency === 'emergency' ? 'animation: pulse 2s infinite;' : ''}
            `;
            label.appendChild(indicator);
        }
    }

    updateRegionalPhone() {
        if (window.phoneTracker) {
            const regionPhone = window.phoneTracker.getCurrentPhone();
            const phoneElement = document.querySelector('[data-phone-region="auto"]');
            if (phoneElement) {
                phoneElement.textContent = regionPhone;
            }
        }
    }

    showSuccess() {
        const regionPhone = window.phoneTracker ? window.phoneTracker.getCurrentPhone() : '202-335-4240';
        const urgency = document.getElementById('urgency').value;

        let responseTime = '2 hours';
        if (urgency === 'emergency') responseTime = '15 minutes';
        else if (urgency === 'urgent') responseTime = '1 hour';

        this.container.innerHTML = `
            <div class="prism-contact-form-enhanced">
                <div class="success-message">
                    <h3>✅ Thank You!</h3>
                    <p><strong>Your consultation request has been received.</strong></p>
                    <p>A restoration specialist will contact you within <strong>${responseTime}</strong> during business hours.</p>
                    <p><strong>Score:</strong> ${this.session.contentScore} points (${this.session.leadQuality} priority)</p>
                    <div class="phone-display">📞 Immediate help: ${regionPhone}</div>
                    <p><small>Reference: ${this.session.sessionId}</small></p>
                </div>
            </div>
        `;

        // Clear auto-save data
        localStorage.removeItem('prism_form_component_draft');
    }

    showError() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = '❌ Error - Please Try Again';
        submitBtn.style.background = '#f44336';

        setTimeout(() => {
            submitBtn.innerHTML = '🎯 Get My Free Consultation<span class="regional-phone">Call: <span data-phone-region="auto">202-335-4240</span></span>';
            submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
        }, 3000);
    }

    autoSave() {
        const form = document.getElementById('prismContactFormComponent');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        localStorage.setItem('prism_form_component_draft', JSON.stringify(data));
    }

    restoreData() {
        const saved = localStorage.getItem('prism_form_component_draft');
        if (!saved) return;

        const data = JSON.parse(saved);
        Object.entries(data).forEach(([key, value]) => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value === 'on';
                } else {
                    field.value = value;
                }
            }
        });
        this.updateProgress();
    }

    detectRegion() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('washington-dc') || path.includes('dc')) return 'DC';
        if (path.includes('virginia') || path.includes('va')) return 'VA';
        if (path.includes('maryland') || path.includes('md')) return 'MD';
        return 'DC';
    }

    generateSessionId() {
        return 'contact_component_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    injectStyles() {
        if (document.getElementById('prism-contact-form-styles')) return;

        const style = document.createElement('style');
        style.id = 'prism-contact-form-styles';
        style.textContent = `
            .prism-contact-form-enhanced {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                border: 1px solid #e3f2fd;
                margin: 2rem 0;
                position: relative;
                overflow: hidden;
            }

            .prism-contact-form-enhanced::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #1976D2, #2196F3);
            }

            .prism-contact-form-enhanced h3 {
                color: #1976D2;
                font-size: 1.5rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 0.5rem;
            }

            .form-subtitle {
                text-align: center;
                color: #666;
                margin-bottom: 1.5rem;
                font-size: 1rem;
            }

            .form-progress {
                width: 100%;
                height: 3px;
                background: #e0e0e0;
                border-radius: 2px;
                margin-bottom: 1.5rem;
                overflow: hidden;
            }

            .form-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #1976D2, #2196F3);
                width: 0%;
                transition: width 0.3s ease;
            }

            .restoration-contact-form {
                width: 100%;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
                font-size: 0.9rem;
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #1976D2;
                box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
            }

            .checkbox-group {
                display: flex;
                align-items: center;
                margin: 1rem 0;
            }

            .checkbox-group input[type="checkbox"] {
                width: auto;
                margin-right: 0.5rem;
            }

            .checkbox-group label {
                margin-bottom: 0;
                font-weight: 500;
                cursor: pointer;
            }

            .submit-btn {
                width: 100%;
                background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
                color: white;
                border: none;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .submit-btn:hover {
                background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
                transform: translateY(-1px);
            }

            .submit-btn.loading {
                background: #ccc;
                cursor: not-allowed;
            }

            .submit-btn.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                margin: -8px 0 0 -8px;
                border: 2px solid transparent;
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .regional-phone {
                display: block;
                font-size: 0.85rem;
                opacity: 0.9;
                margin-top: 0.25rem;
            }

            .form-footer {
                text-align: center;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 0.85rem;
            }

            .success-message {
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border-radius: 8px;
                animation: slideIn 0.5s ease;
            }

            .success-message h3 {
                color: white;
                margin-bottom: 1rem;
            }

            .success-message .phone-display {
                background: rgba(255,255,255,0.2);
                padding: 0.5rem 1rem;
                border-radius: 4px;
                margin: 1rem auto;
                display: inline-block;
                font-weight: bold;
            }

            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #f44336;
                box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
            }

            .error-message {
                color: #f44336;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: none;
            }

            .form-group.error .error-message {
                display: block;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            @media (max-width: 768px) {
                .prism-contact-form-enhanced {
                    padding: 1.5rem;
                }

                .form-row {
                    grid-template-columns: 1fr;
                    gap: 0;
                }

                .prism-contact-form-enhanced h3 {
                    font-size: 1.3rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Static method to create and render form
    static render(containerId = 'prism-contact-form') {
        return new PrismContactForm(containerId);
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('prism-contact-form');
    if (container) {
        PrismContactForm.render();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrismContactForm;
}

// Global access
window.PrismContactForm = PrismContactForm;