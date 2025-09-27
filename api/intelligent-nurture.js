// Intelligent Nurture System - Engagement-Based Automation
// Analyzes user behavior and triggers appropriate follow-up sequences

const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';
const GHL_API_KEY = process.env.GHL_API_KEY;

// Main nurture handler - processes engagement data and triggers workflows
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const engagementData = req.body;

        // Calculate engagement score
        const engagementScore = calculateEngagementScore(engagementData);

        // Determine nurture sequence
        const nurtureSequence = assignNurtureSequence(
            engagementScore,
            engagementData.checklistType,
            engagementData.device,
            engagementData
        );

        // Execute appropriate automation
        await executeNurtureSequence(engagementData, nurtureSequence, engagementScore);

        res.status(200).json({
            success: true,
            engagementScore: engagementScore,
            nurtureSequence: nurtureSequence,
            message: 'Intelligent nurture sequence triggered'
        });

    } catch (error) {
        console.error('Nurture system error:', error);
        res.status(500).json({ error: 'Failed to process nurture automation' });
    }
}

// Calculate comprehensive engagement score
function calculateEngagementScore(data) {
    let score = 0;

    // Time-based scoring (most important factor)
    if (data.pdfViewTime >= 300000) score += 50; // 5+ minutes = high engagement
    else if (data.pdfViewTime >= 180000) score += 40; // 3+ minutes = very interested
    else if (data.pdfViewTime >= 60000) score += 30; // 1+ minute = interested
    else if (data.pdfViewTime >= 30000) score += 15; // 30+ seconds = some interest
    else score += 5; // Under 30 seconds = minimal

    // Action-based scoring
    if (data.downloadedPDF) score += 25;
    if (data.clickedEmergencyCall) score += 40; // Highest value action
    if (data.optedIntoSMS) score += 20;
    if (data.sharedContent) score += 15;
    if (data.scrolledDeep) score += 10; // Scrolled >75%
    if (data.returnVisitor) score += 30;
    if (data.multiplePageViews) score += 20;

    // Device and timing modifiers
    if (data.device === 'mobile' && data.quickActions) score += 10;
    if (data.device === 'desktop' && data.detailedEngagement) score += 10;
    if (data.accessedDuringEmergency) score += 25; // Night/weekend access
    if (data.immediateFormSubmission) score += 15; // Submitted <30 seconds

    // Geographic and demographic modifiers
    if (data.inServiceArea) score += 10; // DMV region
    if (data.highValueZipCode) score += 5; // Affluent areas

    // Connection speed (indicates urgency)
    if (data.connectionSpeed === 'fast' && data.immediateAccess) score += 10;
    if (data.connectionSpeed === 'slow' && data.waitedForDownload) score += 15;

    return Math.min(score, 100); // Cap at 100
}

// Assign appropriate nurture sequence based on engagement
function assignNurtureSequence(score, checklistType, device, data) {
    // High engagement - immediate priority
    if (score >= 70) {
        return {
            type: 'high_engagement_priority',
            urgency: 'immediate',
            callWindow: '2_hours',
            sequence: getHighEngagementSequence(checklistType, device)
        };
    }

    // Medium engagement - educational nurture
    if (score >= 35) {
        return {
            type: 'medium_engagement_education',
            urgency: 'warm',
            callWindow: '24_hours',
            sequence: getMediumEngagementSequence(checklistType, device)
        };
    }

    // Low engagement - re-engagement campaign
    if (score >= 15) {
        return {
            type: 'low_engagement_reactivation',
            urgency: 'cold',
            callWindow: '7_days',
            sequence: getLowEngagementSequence(checklistType, device)
        };
    }

    // Minimal engagement - awareness building
    return {
        type: 'minimal_engagement_awareness',
        urgency: 'nurture',
        callWindow: '30_days',
        sequence: getAwarenessSequence(checklistType, device)
    };
}

// Execute the determined nurture sequence
async function executeNurtureSequence(userData, nurtureConfig, score) {
    const contactId = await findOrCreateContact(userData);

    if (!contactId) {
        throw new Error('Failed to find or create contact');
    }

    // Add engagement tags
    await addEngagementTags(contactId, nurtureConfig, score, userData);

    // Trigger appropriate GHL workflow
    await triggerGHLWorkflow(contactId, nurtureConfig);

    // Send immediate communications if high engagement
    if (nurtureConfig.urgency === 'immediate') {
        await handleHighEngagementActions(contactId, userData, nurtureConfig);
    }

    // Set up device-specific follow-up
    await setupDeviceSpecificFollowup(contactId, userData, nurtureConfig);

    // Schedule checklist-specific content
    await scheduleChecklistSpecificContent(contactId, userData, nurtureConfig);
}

// High engagement sequence configurations
function getHighEngagementSequence(checklistType, device) {
    const baseSequence = {
        immediate: {
            action: 'priority_call_scheduling',
            delay: '15_minutes',
            backup: 'urgent_consultation_email'
        },
        hour_1: {
            action: 'staff_alert',
            channels: ['slack', 'sms', 'email']
        },
        hour_2: {
            action: 'backup_outreach',
            method: device === 'mobile' ? 'sms' : 'email'
        }
    };

    // Checklist-specific urgency modifications
    if (checklistType === 'fire_damage') {
        baseSequence.immediate.delay = '5_minutes'; // Most urgent
        baseSequence.hour_1.priority = 'emergency';
    } else if (checklistType === 'water_damage') {
        baseSequence.immediate.delay = '10_minutes'; // Time-sensitive
        baseSequence.hour_1.priority = 'urgent';
    }

    return baseSequence;
}

// Medium engagement sequence configurations
function getMediumEngagementSequence(checklistType, device) {
    const sequences = {
        fire_damage: [
            { day: 0, type: 'welcome_education', template: 'fire_recovery_guide' },
            { day: 1, type: 'prevention_tips', template: 'fire_prevention_tips' },
            { day: 3, type: 'insurance_guidance', template: 'fire_insurance_claims' },
            { day: 5, type: 'case_study', template: 'fire_success_story' },
            { day: 7, type: 'consultation_offer', template: 'fire_assessment_offer' }
        ],
        water_damage: [
            { day: 0, type: 'welcome_education', template: 'water_damage_guide' },
            { day: 1, type: 'prevention_focus', template: 'water_prevention_checklist' },
            { day: 3, type: 'seasonal_tips', template: 'seasonal_water_risks' },
            { day: 5, type: 'diy_vs_professional', template: 'when_to_call_pros' },
            { day: 7, type: 'consultation_offer', template: 'water_assessment_offer' }
        ],
        document_recovery: [
            { day: 0, type: 'welcome_education', template: 'document_recovery_guide' },
            { day: 2, type: 'preservation_tips', template: 'document_preservation' },
            { day: 4, type: 'digital_backup', template: 'digital_backup_strategies' },
            { day: 6, type: 'professional_services', template: 'professional_document_recovery' },
            { day: 8, type: 'consultation_offer', template: 'document_assessment_offer' }
        ],
        lightning_strike: [
            { day: 0, type: 'welcome_education', template: 'lightning_recovery_guide' },
            { day: 1, type: 'electrical_safety', template: 'electrical_safety_tips' },
            { day: 3, type: 'surge_protection', template: 'surge_protection_guide' },
            { day: 5, type: 'insurance_coverage', template: 'lightning_insurance_claims' },
            { day: 7, type: 'consultation_offer', template: 'electrical_assessment_offer' }
        ]
    };

    return sequences[checklistType] || sequences.fire_damage;
}

// Low engagement re-activation sequences
function getLowEngagementSequence(checklistType, device) {
    return [
        { day: 2, type: 'check_in', template: 'did_you_get_what_you_needed' },
        { day: 5, type: 'value_reminder', template: 'what_most_people_miss' },
        { day: 10, type: 'social_proof', template: 'real_case_study' },
        { day: 15, type: 'final_resource', template: 'complete_emergency_guide' },
        { day: 21, type: 'last_chance', template: 'final_consultation_offer' }
    ];
}

// Awareness building for minimal engagement
function getAwarenessSequence(checklistType, device) {
    return [
        { day: 7, type: 'educational_content', template: 'emergency_preparedness_101' },
        { day: 14, type: 'seasonal_reminder', template: 'seasonal_emergency_prep' },
        { day: 30, type: 'community_tips', template: 'neighborhood_preparedness' },
        { day: 60, type: 'annual_checkup', template: 'annual_emergency_review' }
    ];
}

// Add comprehensive engagement tags to GHL contact
async function addEngagementTags(contactId, nurtureConfig, score, userData) {
    const tags = [
        // Engagement level tags
        `engagement_score_${Math.floor(score / 10) * 10}`, // e.g., engagement_score_70
        `nurture_${nurtureConfig.type}`,
        `urgency_${nurtureConfig.urgency}`,

        // Behavior tags
        userData.device ? `device_${userData.device}` : null,
        userData.connectionSpeed ? `connection_${userData.connectionSpeed}` : null,
        userData.checklistType ? `checklist_${userData.checklistType}` : null,

        // Action tags
        userData.downloadedPDF ? 'action_downloaded' : null,
        userData.clickedEmergencyCall ? 'action_called' : null,
        userData.optedIntoSMS ? 'action_sms_opted' : null,
        userData.sharedContent ? 'action_shared' : null,
        userData.returnVisitor ? 'behavior_return_visitor' : null,

        // Timing tags
        userData.accessedDuringEmergency ? 'timing_emergency_hours' : 'timing_business_hours',
        userData.immediateFormSubmission ? 'timing_immediate_submission' : null,

        // Geographic tags
        userData.inServiceArea ? 'geo_service_area' : 'geo_outside_area',
        userData.state ? `state_${userData.state.toLowerCase()}` : null
    ].filter(tag => tag !== null);

    // Update contact with tags
    await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        },
        body: JSON.stringify({
            tags: tags,
            customFields: {
                engagement_score: score,
                last_engagement: userData.timestamp,
                nurture_sequence: nurtureConfig.type,
                pdf_view_time: userData.pdfViewTime,
                device_type: userData.device,
                checklist_accessed: userData.checklistType
            }
        })
    });
}

// Trigger appropriate GHL workflow
async function triggerGHLWorkflow(contactId, nurtureConfig) {
    const workflowIds = {
        high_engagement_priority: process.env.GHL_HIGH_ENGAGEMENT_WORKFLOW_ID,
        medium_engagement_education: process.env.GHL_MEDIUM_ENGAGEMENT_WORKFLOW_ID,
        low_engagement_reactivation: process.env.GHL_LOW_ENGAGEMENT_WORKFLOW_ID,
        minimal_engagement_awareness: process.env.GHL_MINIMAL_ENGAGEMENT_WORKFLOW_ID
    };

    const workflowId = workflowIds[nurtureConfig.type];

    if (workflowId) {
        await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
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

// Handle immediate actions for high engagement users
async function handleHighEngagementActions(contactId, userData, nurtureConfig) {
    // Schedule priority call
    await scheduleUrgentCall(contactId, userData);

    // Send staff alerts
    await sendStaffAlerts(contactId, userData);

    // Send immediate follow-up communication
    if (userData.device === 'mobile') {
        await sendUrgentSMS(contactId, userData);
    } else {
        await sendUrgentEmail(contactId, userData);
    }
}

// Schedule urgent call for high engagement leads
async function scheduleUrgentCall(contactId, userData) {
    // Integration with scheduling system (e.g., Calendly, Acuity)
    const schedulingData = {
        contactId: contactId,
        urgency: 'high',
        window: '2_hours',
        checklistType: userData.checklistType,
        preferredTime: userData.accessedDuringEmergency ? 'asap' : 'business_hours'
    };

    // This would integrate with your scheduling system
    console.log('Scheduling urgent call:', schedulingData);
}

// Send alerts to staff for high engagement leads
async function sendStaffAlerts(contactId, userData) {
    const alertData = {
        type: 'high_engagement_lead',
        contactId: contactId,
        urgency: 'immediate',
        checklistType: userData.checklistType,
        engagementIndicators: {
            viewTime: userData.pdfViewTime,
            downloadedPDF: userData.downloadedPDF,
            clickedCall: userData.clickedEmergencyCall
        }
    };

    // Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🚨 HIGH ENGAGEMENT LEAD: Contact ${contactId} spent ${Math.round(userData.pdfViewTime / 60000)} minutes on ${userData.checklistType} checklist. Immediate follow-up required!`,
                channel: '#urgent-leads'
            })
        });
    }

    // SMS to sales team
    if (process.env.SALES_TEAM_SMS_NUMBERS) {
        const salesNumbers = process.env.SALES_TEAM_SMS_NUMBERS.split(',');
        // Implementation would depend on SMS service (Twilio, etc.)
        console.log('Sending SMS alerts to:', salesNumbers);
    }
}

// Find existing contact or create new one
async function findOrCreateContact(userData) {
    if (!userData.email) return null;

    try {
        // Search for existing contact
        const searchResponse = await fetch(`${GHL_API_BASE}/contacts/search?email=${userData.email}`, {
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28'
            }
        });

        if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.contacts && searchData.contacts.length > 0) {
                return searchData.contacts[0].id;
            }
        }

        // Create new contact if not found
        const createResponse = await fetch(`${GHL_API_BASE}/contacts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                email: userData.email,
                phone: userData.phone || '',
                firstName: userData.firstName || extractFirstName(userData.email),
                source: 'intelligent_nurture_system'
            })
        });

        if (createResponse.ok) {
            const createData = await createResponse.json();
            return createData.id;
        }

    } catch (error) {
        console.error('Error finding/creating contact:', error);
    }

    return null;
}

// Extract first name from email
function extractFirstName(email) {
    const localPart = email.split('@')[0];
    return localPart.split('.')[0].charAt(0).toUpperCase() + localPart.split('.')[0].slice(1);
}

// Setup device-specific follow-up sequences
async function setupDeviceSpecificFollowup(contactId, userData, nurtureConfig) {
    if (userData.device === 'mobile') {
        // Mobile users get SMS-heavy sequences
        await fetch(`${GHL_API_BASE}/workflows/${process.env.GHL_MOBILE_SMS_WORKFLOW_ID}/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({ contactId })
        });
    } else {
        // Desktop users get email-heavy sequences
        await fetch(`${GHL_API_BASE}/workflows/${process.env.GHL_DESKTOP_EMAIL_WORKFLOW_ID}/subscribe`, {
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

// Schedule checklist-specific content sequences
async function scheduleChecklistSpecificContent(contactId, userData, nurtureConfig) {
    const checklistWorkflows = {
        fire_damage: process.env.GHL_FIRE_SEQUENCE_WORKFLOW_ID,
        water_damage: process.env.GHL_WATER_SEQUENCE_WORKFLOW_ID,
        document_recovery: process.env.GHL_DOCUMENT_SEQUENCE_WORKFLOW_ID,
        lightning_strike: process.env.GHL_LIGHTNING_SEQUENCE_WORKFLOW_ID
    };

    const workflowId = checklistWorkflows[userData.checklistType];

    if (workflowId) {
        await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
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

module.exports = {
    calculateEngagementScore,
    assignNurtureSequence,
    executeNurtureSequence
};