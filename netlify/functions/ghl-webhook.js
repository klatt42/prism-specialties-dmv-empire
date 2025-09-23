exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const leadData = JSON.parse(event.body);
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