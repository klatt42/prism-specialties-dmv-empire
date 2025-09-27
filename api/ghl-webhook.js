// GHL Webhook Integration for Prism Specialties DMV
// Handles immediate contact creation and nurture sequence triggers

const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Main webhook handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const leadData = req.body;

        // Handle different webhook actions
        if (leadData.action === 'track_engagement') {
            await trackFollowUpEngagement(leadData);
            return res.status(200).json({ success: true, message: 'Engagement tracked' });
        }

        if (leadData.action === 'sms_opt_in') {
            await handleSMSOptIn(leadData);
            return res.status(200).json({ success: true, message: 'SMS opt-in processed' });
        }

        // Validate required fields for contact creation
        if (!leadData.email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Create GHL contact immediately
        const contact = await createGHLContact(leadData);

        // Trigger appropriate nurture sequence
        await triggerNurtureSequence(contact.id, leadData.checklist_type);

        // Schedule follow-up email with PDF attachment
        await scheduleFollowUpEmail(contact.id, leadData.checklist_type);

        res.status(200).json({
            success: true,
            contactId: contact.id,
            message: 'Contact created and nurture sequence triggered'
        });

    } catch (error) {
        console.error('GHL webhook error:', error);
        res.status(500).json({
            error: 'Failed to process lead',
            details: error.message
        });
    }
}

// Create contact in GoHighLevel
async function createGHLContact(leadData) {
    const contactPayload = {
        email: leadData.email,
        phone: leadData.phone || '',
        firstName: extractFirstName(leadData.email),
        lastName: '',
        customFields: {
            zip_code: leadData.zip || '',
            lead_source: leadData.source || 'website',
            checklist_type: leadData.checklist_type || 'general',
            timestamp: leadData.timestamp || new Date().toISOString(),
            mobile_user: leadData.mobile_user ? 'true' : 'false'
        },
        tags: [
            'pdf_viewed',
            leadData.mobile_user ? 'mobile_user' : 'desktop_user',
            `checklist_${leadData.checklist_type}`,
            'instant_access',
            'lead_captured'
        ]
    };

    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify(contactPayload)
    });

    if (!response.ok) {
        throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Trigger nurture sequence based on checklist type
async function triggerNurtureSequence(contactId, checklistType) {
    const workflows = {
        fire_damage: process.env.GHL_FIRE_DAMAGE_WORKFLOW_ID,
        water_damage: process.env.GHL_WATER_DAMAGE_WORKFLOW_ID,
        document_recovery: process.env.GHL_DOCUMENT_WORKFLOW_ID,
        lightning_strike: process.env.GHL_LIGHTNING_WORKFLOW_ID,
        general: process.env.GHL_GENERAL_WORKFLOW_ID
    };

    const workflowId = workflows[checklistType] || workflows.general;

    if (!workflowId) {
        console.warn(`No workflow defined for checklist type: ${checklistType}`);
        return;
    }

    const response = await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify({
            contactId: contactId
        })
    });

    if (!response.ok) {
        throw new Error(`Workflow trigger failed: ${response.status}`);
    }

    console.log(`Triggered ${checklistType} workflow for contact ${contactId}`);
}

// Schedule immediate follow-up email with PDF attachment
async function scheduleFollowUpEmail(contactId, checklistType) {
    const emailTemplates = {
        fire_damage: {
            subject: '🔥 Your Fire Damage Recovery Checklist + Expert Tips',
            templateId: process.env.GHL_FIRE_EMAIL_TEMPLATE_ID,
            pdfUrl: '/checklists/assets/pdfs/fire-damage-first-48-hours.pdf'
        },
        water_damage: {
            subject: '💧 Your Water Emergency Checklist + 24/7 Support Info',
            templateId: process.env.GHL_WATER_EMAIL_TEMPLATE_ID,
            pdfUrl: '/checklists/assets/pdfs/water-emergency-save-what-matters.pdf'
        },
        document_recovery: {
            subject: '📄 Your Document Recovery Guide + Professional Services',
            templateId: process.env.GHL_DOCUMENT_EMAIL_TEMPLATE_ID,
            pdfUrl: '/checklists/assets/pdfs/document-recovery-checklist.pdf'
        },
        lightning_strike: {
            subject: '⚡ Your Lightning Strike Recovery Guide + Insurance Tips',
            templateId: process.env.GHL_LIGHTNING_EMAIL_TEMPLATE_ID,
            pdfUrl: '/checklists/assets/pdfs/lightning-strike-power-surge.pdf'
        }
    };

    const template = emailTemplates[checklistType];
    if (!template) {
        console.warn(`No email template for checklist type: ${checklistType}`);
        return;
    }

    // Schedule email to be sent in 5 minutes (allows time for immediate PDF access)
    const sendTime = new Date(Date.now() + 5 * 60 * 1000);

    const emailPayload = {
        contactId: contactId,
        templateId: template.templateId,
        subject: template.subject,
        scheduledTime: sendTime.toISOString(),
        attachments: [
            {
                name: `${checklistType}_checklist.pdf`,
                url: template.pdfUrl
            }
        ]
    };

    const response = await fetch(`${GHL_API_BASE}/conversations/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
        throw new Error(`Email scheduling failed: ${response.status}`);
    }

    console.log(`Scheduled follow-up email for contact ${contactId}`);
}

// Extract first name from email
function extractFirstName(email) {
    const localPart = email.split('@')[0];
    return localPart.split('.')[0].charAt(0).toUpperCase() + localPart.split('.')[0].slice(1);
}

// Track follow-up engagement in GHL
async function trackFollowUpEngagement(data) {
    if (!data.email) return;

    // Find contact by email
    const contacts = await fetch(`${GHL_API_BASE}/contacts/search?email=${data.email}`, {
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': '2021-07-28'
        }
    });

    if (!contacts.ok) return;

    const contactData = await contacts.json();
    if (!contactData.contacts || contactData.contacts.length === 0) return;

    const contactId = contactData.contacts[0].id;

    // Add engagement tags
    const engagementTags = [`engagement_${data.action}`, `checklist_${data.checklist}`];

    if (data.connection_speed) {
        engagementTags.push(`connection_${data.connection_speed}`);
    }

    // Update contact with engagement data
    await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify({
            tags: engagementTags,
            customFields: {
                last_engagement: data.timestamp,
                last_action: data.action,
                engagement_url: data.url
            }
        })
    });

    // Track high-value engagement actions
    if (['pdf_downloaded', 'emergency_call_clicked', 'time_3_minutes'].includes(data.action)) {
        // Add to high-engagement workflow
        await fetch(`${GHL_API_BASE}/workflows/${process.env.GHL_HIGH_ENGAGEMENT_WORKFLOW_ID}/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({ contactId })
        });
    }
}

// Handle SMS opt-in
async function handleSMSOptIn(data) {
    if (!data.phone || !data.email) return;

    // Find or create contact
    let contacts = await fetch(`${GHL_API_BASE}/contacts/search?email=${data.email}`, {
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': '2021-07-28'
        }
    });

    let contactId;

    if (contacts.ok) {
        const contactData = await contacts.json();
        if (contactData.contacts && contactData.contacts.length > 0) {
            contactId = contactData.contacts[0].id;

            // Update existing contact with phone
            await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GHL_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    phone: data.phone,
                    tags: ['sms_opted_in', 'emergency_alerts'],
                    customFields: {
                        sms_opt_in_date: data.timestamp,
                        sms_source: data.source
                    }
                })
            });
        }
    } else {
        // Create new contact for SMS opt-in
        const newContact = await createGHLContact({
            email: data.email,
            phone: data.phone,
            tags: ['sms_opted_in', 'emergency_alerts', 'sms_only_lead']
        });
        contactId = newContact.id;
    }

    // Add to SMS alert workflow
    if (contactId && process.env.GHL_SMS_ALERT_WORKFLOW_ID) {
        await fetch(`${GHL_API_BASE}/workflows/${process.env.GHL_SMS_ALERT_WORKFLOW_ID}/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({ contactId })
        });
    }
}

// Calculate follow-up engagement rates
async function getFollowUpEngagementRates() {
    // This would query GHL for engagement data
    // Implementation depends on GHL API capabilities for reporting

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
        // Get contacts created in last 30 days
        const contacts = await fetch(`${GHL_API_BASE}/contacts?startAfterDate=${thirtyDaysAgo.toISOString()}`, {
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28'
            }
        });

        if (!contacts.ok) return null;

        const contactData = await contacts.json();

        // Calculate engagement rates
        const totalContacts = contactData.contacts.length;
        const emailOpened = contactData.contacts.filter(c => c.tags?.includes('email_opened')).length;
        const linkClicked = contactData.contacts.filter(c => c.tags?.includes('link_clicked')).length;
        const calledEmergency = contactData.contacts.filter(c => c.tags?.includes('called_emergency')).length;
        const smsOptedIn = contactData.contacts.filter(c => c.tags?.includes('sms_opted_in')).length;

        return {
            totalContacts,
            emailOpenRate: totalContacts > 0 ? (emailOpened / totalContacts * 100).toFixed(2) : 0,
            linkClickRate: totalContacts > 0 ? (linkClicked / totalContacts * 100).toFixed(2) : 0,
            emergencyCallRate: totalContacts > 0 ? (calledEmergency / totalContacts * 100).toFixed(2) : 0,
            smsOptInRate: totalContacts > 0 ? (smsOptedIn / totalContacts * 100).toFixed(2) : 0
        };

    } catch (error) {
        console.error('Error calculating engagement rates:', error);
        return null;
    }
}

// Environment variables required:
// GHL_API_KEY - GoHighLevel API key
// GHL_LOCATION_ID - GHL location/sub-account ID
// GHL_FIRE_DAMAGE_WORKFLOW_ID - Fire damage nurture workflow
// GHL_WATER_DAMAGE_WORKFLOW_ID - Water damage nurture workflow
// GHL_DOCUMENT_WORKFLOW_ID - Document recovery workflow
// GHL_LIGHTNING_WORKFLOW_ID - Lightning strike workflow
// GHL_GENERAL_WORKFLOW_ID - General emergency workflow
// GHL_HIGH_ENGAGEMENT_WORKFLOW_ID - High engagement follow-up
// GHL_SMS_ALERT_WORKFLOW_ID - SMS emergency alerts
// GHL_FIRE_EMAIL_TEMPLATE_ID - Fire damage email template
// GHL_WATER_EMAIL_TEMPLATE_ID - Water damage email template
// GHL_DOCUMENT_EMAIL_TEMPLATE_ID - Document recovery email template
// GHL_LIGHTNING_EMAIL_TEMPLATE_ID - Lightning strike email template

// Export engagement tracking function
module.exports = { getFollowUpEngagementRates };