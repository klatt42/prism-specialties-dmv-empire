/* PRISM SPECIALTIES - FORM SUBMISSION & GHL INTEGRATION */
/* Extracted from working contact-form-enhanced.html */

// Enhanced form submission with GHL integration
document.getElementById('prismContactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Get session data and update scores
        const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

        // Calculate additional lead score based on form data
        const additionalScore = calculateFormScore();

        // Update session
        session.contentScore = (session.contentScore || 0) + additionalScore;
        session.leadQuality = calculateLeadTemperature(session.contentScore);

        // Update hidden fields
        document.getElementById('contentScore').value = session.contentScore;
        document.getElementById('leadTemperature').value = session.leadQuality;

        sessionStorage.setItem('prismSession', JSON.stringify(session));

        // Submit to GHL
        const formData = new FormData(this);
        await submitToGHL(formData, session);

        // Trigger automation sequences
        await triggerAutomationSequences(formData, session);

        // Show success message
        showFormSuccess(session);

        console.log('✅ Form submitted successfully with score:', session.contentScore);

    } catch (error) {
        console.error('❌ Form submission error:', error);
        showFormError();
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

async function submitToGHL(formData, session) {
    // Prepare GHL contact data
    const contactData = {
        firstName: formData.get('first_name'),
        lastName: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        source: 'Prism Blog Contact Form',

        // Custom fields for GHL
        customFields: {
            region: formData.get('region'),
            service_type: formData.get('service_type'),
            urgency: formData.get('urgency'),
            item_value: formData.get('item_value'),
            description: formData.get('description'),
            content_score: formData.get('content_score'),
            lead_temperature: formData.get('lead_temperature'),
            session_id: formData.get('session_id'),
            photo_consent: formData.get('photo_consent') === 'on',
            newsletter_consent: formData.get('newsletter_consent') === 'on',
            estimated_value: formData.get('estimated_value'),
            submission_timestamp: new Date().toISOString()
        }
    };

    // Store locally for development
    localStorage.setItem(`prism_contact_${Date.now()}`, JSON.stringify(contactData));

    console.log('📞 Contact data prepared for GHL:', contactData);

    // In production, this would submit to GHL API
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

async function triggerAutomationSequences(formData, session) {
    const urgency = formData.get('urgency');
    const serviceType = formData.get('service_type');
    const leadTemperature = session.leadQuality;

    // Trigger appropriate automation based on urgency and lead temperature
    if (window.prismAutomation) {
        if (urgency === 'emergency') {
            window.prismAutomation.triggerEmergencySequence(session);
        } else if (leadTemperature === 'hot') {
            window.prismAutomation.triggerHotLeadSequence(session);
        } else if (leadTemperature === 'warm') {
            window.prismAutomation.triggerWarmLeadSequence(session);
        } else {
            window.prismAutomation.triggerColdLeadSequence(session);
        }

        // Trigger content-specific automation
        if (serviceType === 'wedding_dress_restoration') {
            window.prismAutomation.triggerWeddingContentSequence();
        } else if (serviceType === 'military_uniform_restoration') {
            window.prismAutomation.triggerMilitaryContentSequence();
        }
    }

    console.log(`🤖 Triggered ${leadTemperature} lead automation for ${serviceType}`);
}