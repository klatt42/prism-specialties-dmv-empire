const GHL_CONFIG = {
    apiBase: 'https://services.leadconnectorhq.com',
    locationId: 'BLEBkhJ9lBfryOyCfuOJ',
    apiKey: 'pit-7179ac52-bde7-44ac-9a55-79cee37f31a7',
    version: '2021-07-28',

    // CORRECT Prism Specialties DMV phone numbers
    phoneNumbers: {
        DC: '(202) 335-4240',
        VA: '(703) 229-1321',
        MD: '(301) 215-3191',
        default: '(301) 215-3191'  // MD number as fallback
    },

    webhookUrl: 'https://prism-specialties-dmv.netlify.app/.netlify/functions/ghl-webhook',

    scoring: {
        emergency: 100,
        urgent: 75,
        warm: 50,
        cold: 25
    }
};

window.GHL_CONFIG = GHL_CONFIG;