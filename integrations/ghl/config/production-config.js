const PRODUCTION_GHL_CONFIG = {
    apiBase: 'https://services.leadconnectorhq.com',
    locationId: 'YOUR_ACTUAL_GHL_LOCATION_ID',
    apiKey: 'YOUR_GHL_API_KEY',

    // Production phone numbers
    phoneNumbers: {
        DC: '+1-202-335-4240',
        VA: '+1-703-229-1321',
        MD: '+1-301-215-3191'
    },

    // Production domain
    domain: 'https://prismspecialtiesdmv.com',

    // Regional specialists with production phone numbers
    regionalSpecialists: {
        DC: {
            name: 'Sarah Johnson',
            title: 'Wedding Dress Specialist',
            phone: '202-335-4240',
            specialties: ['Art', 'Museum Quality', 'Government', 'Wedding Dress'],
            coverage: ['Washington DC', 'Northern VA']
        },
        VA: {
            name: 'Michael Chen',
            title: 'Bridal Restoration Expert',
            phone: '703-229-1321',
            specialties: ['Military', 'Textile', 'Wedding Dress', 'Emergency Response'],
            coverage: ['Northern Virginia', 'Fairfax', 'Loudoun', 'Prince William']
        },
        MD: {
            name: 'Emily Rodriguez',
            title: 'Textile Conservator',
            phone: '301-215-3191',
            specialties: ['Document', 'Electronics', 'Institutional', 'Historic Textiles'],
            coverage: ['Maryland', 'Montgomery County', 'Western Maryland']
        }
    },

    // Production automation sequences (replace with actual GHL automation IDs)
    automationSequences: {
        EMERGENCY_RESTORATION_RESPONSE: 'YOUR_EMERGENCY_AUTOMATION_ID',
        HOT_RESTORATION_LEAD: 'YOUR_HOT_LEAD_AUTOMATION_ID',
        WARM_RESTORATION_NURTURE: 'YOUR_WARM_LEAD_AUTOMATION_ID',
        COLD_RESTORATION_NURTURE: 'YOUR_COLD_LEAD_AUTOMATION_ID',
        WEDDING_DRESS_RESTORATION_SPECIALIST: 'YOUR_WEDDING_AUTOMATION_ID',
        MILITARY_UNIFORM_RESTORATION_SPECIALIST: 'YOUR_MILITARY_AUTOMATION_ID',
        INSTITUTIONAL_RESTORATION_SPECIALIST: 'YOUR_INSTITUTIONAL_AUTOMATION_ID',
        EXPERT_CONSULTATION_INVITATION: 'YOUR_EXPERT_CONSULTATION_ID',
        RETURN_VISITOR_CONVERSION: 'YOUR_RETURN_VISITOR_ID',
        DEEP_ENGAGEMENT_CONVERSION: 'YOUR_DEEP_ENGAGEMENT_ID'
    },

    // Production webhook endpoints
    webhookEndpoints: {
        automation: '/webhook/automation-trigger',
        emergency: '/webhook/emergency-response',
        hotLead: '/webhook/hot-lead',
        leadScoring: '/webhook/lead-scoring'
    },

    // CORS settings for production
    corsSettings: {
        allowedOrigins: [
            'https://prismspecialtiesdmv.com',
            'https://www.prismspecialtiesdmv.com'
        ],
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
};

// Export for production use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRODUCTION_GHL_CONFIG;
}