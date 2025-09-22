/**
 * GoHighLevel Integration for Prism Specialties DMV
 * Connects PDF delivery system with GHL CRM, automation, and communications
 */

class GHLIntegration {
    constructor() {
        // GHL Configuration - These should be set via environment variables in production
        this.config = {
            apiUrl: 'https://services.leadconnectorhq.com',
            privateToken: '', // Set this with your actual token
            locationId: '',   // Set this with your actual location ID
            version: 'v1'
        };

        this.endpoints = {
            contacts: `/locations/${this.config.locationId}/contacts`,
            opportunities: `/locations/${this.config.locationId}/opportunities`,
            workflows: `/locations/${this.config.locationId}/workflows`,
            campaigns: `/locations/${this.config.locationId}/campaigns`,
            notes: `/locations/${this.config.locationId}/contacts/{contactId}/notes`,
            tasks: `/locations/${this.config.locationId}/contacts/{contactId}/tasks`,
            tags: `/locations/${this.config.locationId}/tags`,
            customFields: `/locations/${this.config.locationId}/customFields`,
            conversations: `/locations/${this.config.locationId}/conversations`
        };
    }

    /**
     * Initialize GHL integration with credentials
     */
    init(privateToken, locationId) {
        this.config.privateToken = privateToken;
        this.config.locationId = locationId;
        this.updateEndpoints();
        return this;
    }

    updateEndpoints() {
        Object.keys(this.endpoints).forEach(key => {
            this.endpoints[key] = this.endpoints[key].replace('{locationId}', this.config.locationId);
        });
    }

    /**
     * Make authenticated API request to GHL
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.config.apiUrl}${endpoint}`;

        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.config.privateToken}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('GHL API Request Failed:', error);
            throw error;
        }
    }

    /**
     * Create or update contact in GHL
     */
    async createOrUpdateContact(contactData) {
        const { email, phone, firstName, lastName, source, checklistType } = contactData;

        // Check if contact exists
        let existingContact = null;
        if (email) {
            try {
                const searchResult = await this.makeRequest(`${this.endpoints.contacts}?email=${encodeURIComponent(email)}`);
                if (searchResult.contacts && searchResult.contacts.length > 0) {
                    existingContact = searchResult.contacts[0];
                }
            } catch (error) {
                console.log('Contact search failed, creating new contact');
            }
        }

        const contactPayload = {
            firstName: firstName || 'Emergency',
            lastName: lastName || 'Contact',
            email: email,
            phone: phone,
            source: source || 'PDF Emergency Checklist',
            tags: [
                'Emergency Checklist',
                `Checklist: ${checklistType}`,
                'PDF Download',
                'Prism Specialties Lead'
            ],
            customFields: {
                'emergency_checklist_type': checklistType,
                'pdf_access_date': new Date().toISOString(),
                'lead_source': 'Emergency PDF Checklist',
                'emergency_contact_method': phone ? 'Phone' : 'Email'
            }
        };

        if (existingContact) {
            // Update existing contact
            const updatedContact = await this.makeRequest(
                `${this.endpoints.contacts}/${existingContact.id}`,
                'PUT',
                contactPayload
            );
            await this.addContactNote(existingContact.id, `Accessed ${checklistType} emergency checklist on ${new Date().toLocaleDateString()}`);
            return { contact: updatedContact, isNew: false };
        } else {
            // Create new contact
            const newContact = await this.makeRequest(this.endpoints.contacts, 'POST', contactPayload);
            await this.addContactNote(newContact.contact.id, `New lead from ${checklistType} emergency checklist download`);
            return { contact: newContact.contact, isNew: true };
        }
    }

    /**
     * Add note to contact
     */
    async addContactNote(contactId, noteBody) {
        const noteData = {
            body: noteBody,
            userId: contactId // This should be the user ID of the person adding the note
        };

        return await this.makeRequest(
            this.endpoints.notes.replace('{contactId}', contactId),
            'POST',
            noteData
        );
    }

    /**
     * Create opportunity for emergency services
     */
    async createOpportunity(contactId, checklistType, estimatedValue = 5000) {
        const opportunityData = {
            contactId: contactId,
            title: `${checklistType} Emergency Response`,
            status: 'open',
            stage: 'new',
            source: 'Emergency PDF Checklist',
            monetaryValue: estimatedValue,
            assignedTo: null, // Assign to default user or leave null
            notes: `Lead generated from ${checklistType} emergency checklist download. Immediate follow-up recommended for emergency response services.`
        };

        return await this.makeRequest(this.endpoints.opportunities, 'POST', opportunityData);
    }

    /**
     * Trigger GHL workflow/automation
     */
    async triggerWorkflow(contactId, workflowId, eventData = {}) {
        // Note: Workflow triggering might need to be done via webhooks depending on your GHL setup
        const triggerData = {
            contactId: contactId,
            eventData: {
                checklistType: eventData.checklistType,
                accessMethod: eventData.accessMethod,
                timestamp: new Date().toISOString(),
                ...eventData
            }
        };

        try {
            // This endpoint might vary based on your GHL workflow setup
            return await this.makeRequest(`/workflows/${workflowId}/trigger`, 'POST', triggerData);
        } catch (error) {
            console.log('Workflow trigger failed, will try webhook method');
            return this.triggerWorkflowViaWebhook(contactId, workflowId, eventData);
        }
    }

    /**
     * Send SMS through GHL
     */
    async sendSMS(contactId, message, mediaUrl = null) {
        const smsData = {
            contactId: contactId,
            message: message,
            type: 'SMS'
        };

        if (mediaUrl) {
            smsData.mediaUrl = mediaUrl;
        }

        return await this.makeRequest(`${this.endpoints.conversations}/messages`, 'POST', smsData);
    }

    /**
     * Send email through GHL
     */
    async sendEmail(contactId, subject, htmlBody, fromEmail = null) {
        const emailData = {
            contactId: contactId,
            subject: subject,
            html: htmlBody,
            type: 'Email'
        };

        if (fromEmail) {
            emailData.from = fromEmail;
        }

        return await this.makeRequest(`${this.endpoints.conversations}/messages`, 'POST', emailData);
    }

    /**
     * Track PDF access activity
     */
    async trackActivity(contactId, activityType, details = {}) {
        const activityData = {
            contactId: contactId,
            title: `PDF Checklist Activity: ${activityType}`,
            description: JSON.stringify(details),
            type: 'note',
            dateTime: new Date().toISOString()
        };

        return await this.addContactNote(contactId, `${activityType}: ${JSON.stringify(details)}`);
    }

    /**
     * Get contact by email or phone
     */
    async getContact(email = null, phone = null) {
        let searchQuery = '';
        if (email) {
            searchQuery = `email=${encodeURIComponent(email)}`;
        } else if (phone) {
            searchQuery = `phone=${encodeURIComponent(phone)}`;
        }

        if (searchQuery) {
            const result = await this.makeRequest(`${this.endpoints.contacts}?${searchQuery}`);
            return result.contacts && result.contacts.length > 0 ? result.contacts[0] : null;
        }
        return null;
    }

    /**
     * Process PDF checklist access
     */
    async processPDFAccess(userData, checklistType, accessMethod) {
        try {
            // 1. Create or update contact
            const contactResult = await this.createOrUpdateContact({
                email: userData.email,
                phone: userData.phone,
                firstName: userData.firstName,
                lastName: userData.lastName,
                source: 'Emergency PDF Checklist',
                checklistType: checklistType
            });

            const contact = contactResult.contact;

            // 2. Track the activity
            await this.trackActivity(contact.id, 'PDF Access', {
                checklistType: checklistType,
                accessMethod: accessMethod,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });

            // 3. Create opportunity if it's a new contact
            if (contactResult.isNew) {
                await this.createOpportunity(contact.id, checklistType);
            }

            // 4. Trigger appropriate workflow
            // You'll need to set up workflow IDs in GHL for different scenarios
            const workflowId = this.getWorkflowIdForChecklist(checklistType);
            if (workflowId) {
                await this.triggerWorkflow(contact.id, workflowId, {
                    checklistType: checklistType,
                    accessMethod: accessMethod,
                    isNewContact: contactResult.isNew
                });
            }

            return {
                success: true,
                contact: contact,
                isNewContact: contactResult.isNew
            };

        } catch (error) {
            console.error('GHL PDF Access Processing Failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get workflow ID based on checklist type
     */
    getWorkflowIdForChecklist(checklistType) {
        const workflowMap = {
            'fire-damage': 'FIRE_DAMAGE_WORKFLOW_ID',
            'water-emergency': 'WATER_EMERGENCY_WORKFLOW_ID',
            'lightning-strike': 'LIGHTNING_STRIKE_WORKFLOW_ID'
        };

        return workflowMap[checklistType] || 'DEFAULT_EMERGENCY_WORKFLOW_ID';
    }

    /**
     * Enhanced sharing through GHL
     */
    async shareViaGHL(contactId, shareMethod, checklistType, customMessage = null) {
        const checklist = {
            'fire-damage': {
                title: 'Fire Damage - First 48 Hours Critical Actions',
                url: window.location.href
            },
            'water-emergency': {
                title: 'Water Emergency - Save What Matters Most',
                url: window.location.href
            },
            'lightning-strike': {
                title: 'Lightning Strike - Power Surge Protection',
                url: window.location.href
            }
        }[checklistType];

        const baseMessage = customMessage || `🚨 Emergency Checklist: ${checklist.title}

Professional emergency response protocol used by first responders.

Access here: ${checklist.url}

📞 24/7 Emergency: (301) 215-3191`;

        switch (shareMethod) {
            case 'sms':
                return await this.sendSMS(contactId, baseMessage);

            case 'email':
                const htmlMessage = `
                    <h2>Emergency Checklist: ${checklist.title}</h2>
                    <p>We're sharing this professional emergency response checklist with you.</p>
                    <p><strong>Access the checklist:</strong> <a href="${checklist.url}">${checklist.url}</a></p>
                    <p>This checklist is used by emergency responders and insurance professionals throughout the DMV region.</p>
                    <hr>
                    <p><strong>For immediate emergency assistance:</strong><br>
                    📞 24/7 Emergency Line: (301) 215-3191</p>
                    <p><em>Prism Specialties DMV - Professional Emergency Response & Restoration</em></p>
                `;

                return await this.sendEmail(
                    contactId,
                    `Emergency Checklist: ${checklist.title}`,
                    htmlMessage
                );

            default:
                throw new Error(`Unsupported share method: ${shareMethod}`);
        }
    }
}

// Global GHL instance
window.GHL = new GHLIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GHLIntegration;
}