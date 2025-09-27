exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const leadData = JSON.parse(event.body);

        // Handle chatbot interactions
        if (leadData.event_type === 'chatbot_interaction') {
            return handleChatbotInteraction(leadData);
        }
        const region = getRegionFromZip(leadData.zip || '20001');
        const regionalPhone = getRegionalPhone(region);

        const ghlContactData = {
            firstName: leadData.first_name || leadData.email.split('@')[0],
            lastName: leadData.last_name || 'Emergency Contact',
            email: leadData.email,
            phone: leadData.phone || '',
            address1: leadData.zip ? `ZIP: ${leadData.zip}` : '',
            city: region,
            tags: [
                'pdf-checklist',
                `checklist-${leadData.checklist_type}`,
                `region-${region.toLowerCase()}`,
                'lead-source-website'
            ],
            customFields: {
                'checklist_type': leadData.checklist_type,
                'lead_source': 'pdf-checklist-download',
                'request_timestamp': leadData.timestamp || new Date().toISOString(),
                'page_source': leadData.page_url || 'unknown',
                'regional_phone': regionalPhone,
                'lead_quality': leadData.checklist_type === 'emergency' ? 'hot' : 'warm'
            }
        };

        // Send to GHL using your actual credentials
        const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer pit-7179ac52-bde7-44ac-9a55-79cee37f31a7`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...ghlContactData,
                locationId: 'BLEBkhJ9lBfryOyCfuOJ'
            })
        });

        const ghlResult = await ghlResponse.json();

        if (!ghlResponse.ok) {
            throw new Error(`GHL API Error: ${ghlResult.message}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                contactId: ghlResult.contact?.id,
                region: region,
                regionalPhone: regionalPhone,
                checklistType: leadData.checklist_type
            })
        };

    } catch (error) {
        console.error('Webhook error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};

// Helper functions with CORRECT Prism Specialties phone numbers
function getRegionFromZip(zip) {
    if (!zip) return 'DMV';
    const zipNum = parseInt(zip);

    if (zipNum >= 20001 && zipNum <= 20020) return 'DC';
    if (zipNum >= 20024 && zipNum <= 20078) return 'DC';
    if (zipNum >= 22001 && zipNum <= 22199) return 'Virginia';
    if (zipNum >= 22201 && zipNum <= 22314) return 'Virginia';
    if (zipNum >= 20601 && zipNum <= 20899) return 'Maryland';

    return 'DMV';
}

function getRegionalPhone(region) {
    // CORRECT Prism Specialties DMV phone numbers
    const phones = {
        'DC': '(202) 335-4240',
        'Virginia': '(703) 229-1321',
        'Maryland': '(301) 215-3191'
    };

    return phones[region] || '(301) 215-3191';  // MD number as default
}

// Handle chatbot interactions and track in GHL
async function handleChatbotInteraction(interactionData) {
    try {
        // Track chatbot engagement as lead scoring activity
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                event_tracked: interactionData.event,
                timestamp: interactionData.timestamp
            })
        };

        // For emergency interactions, trigger immediate response
        if (interactionData.event === 'emergency_selected') {
            // Could trigger emergency workflow here
            console.log('Emergency chatbot interaction detected:', interactionData);
        }

        // For lead scoring events, track engagement
        if (interactionData.lead_score > 0) {
            console.log('Chatbot lead scoring event:', {
                event: interactionData.event,
                score: interactionData.lead_score,
                page: interactionData.page_url
            });
        }

        return response;

    } catch (error) {
        console.error('Chatbot interaction tracking error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to track chatbot interaction' })
        };
    }
}

// Enhanced chatbot contact creation
async function createChatbotContact(contactData) {
    const region = getRegionFromZip(contactData.zip);
    const regionalPhone = getRegionalPhone(region);

    const ghlContactData = {
        firstName: contactData.first_name || contactData.name?.split(' ')[0] || 'Chatbot',
        lastName: contactData.last_name || contactData.name?.split(' ').slice(1).join(' ') || 'User',
        email: contactData.email,
        phone: contactData.phone || '',
        address1: contactData.zip ? `ZIP: ${contactData.zip}` : '',
        city: region,
        tags: [
            'chatbot-lead',
            contactData.interaction_type === 'emergency' ? 'chatbot-emergency' : 'chatbot-general',
            `region-${region.toLowerCase()}`,
            'lead-source-chatbot'
        ],
        customFields: [
            { key: 'lead_source', value: 'chatbot-interaction' },
            { key: 'chatbot_event', value: contactData.initial_event },
            { key: 'chatbot_score', value: contactData.lead_score },
            { key: 'regional_phone', value: regionalPhone },
            { key: 'interaction_timestamp', value: contactData.timestamp }
        ],
        locationId: 'BLEBkhJ9lBfryOyCfuOJ'
    };

    // Send to GHL
    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer pit-7179ac52-bde7-44ac-9a55-79cee37f31a7`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ghlContactData)
    });

    const ghlResult = await ghlResponse.json();
    return ghlResult;
}