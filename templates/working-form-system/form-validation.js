/* PRISM SPECIALTIES - FORM VALIDATION & FUNCTIONALITY */
/* Extracted from working contact-form-enhanced.html */

// Form state management
let formProgress = 0;
const totalFields = 6; // Required fields count

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupFormValidation();
    setupProgressTracking();
});

function initializeForm() {
    // Get session data and populate hidden fields
    const session = JSON.parse(sessionStorage.getItem('prismSession') || '{}');

    document.getElementById('detectedRegion').value = session.region || detectRegionFromURL();
    document.getElementById('contentScore').value = session.contentScore || session.score || 0;
    document.getElementById('sessionId').value = session.sessionId || generateSessionId();

    // Update regional phone display
    setTimeout(() => {
        if (window.phoneTracker) {
            const regionPhone = window.phoneTracker.getCurrentPhone();
            document.querySelector('[data-phone-region="auto"]').textContent = regionPhone;
        }
    }, 1000);

    console.log('📝 Contact form initialized with session data:', {
        region: session.region,
        score: session.contentScore,
        sessionId: session.sessionId
    });
}

function setupFormValidation() {
    const form = document.getElementById('prismContactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    // Real-time urgency indicator
    document.getElementById('urgency').addEventListener('change', function() {
        updateUrgencyIndicator(this.value);
    });

    // Service type change handler
    document.getElementById('serviceType').addEventListener('change', function() {
        updateServiceCategory(this.value);
    });
}

function setupProgressTracking() {
    const form = document.getElementById('prismContactForm');
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    requiredInputs.forEach(input => {
        input.addEventListener('input', updateFormProgress);
        input.addEventListener('change', updateFormProgress);
    });
}

function updateFormProgress() {
    const form = document.getElementById('prismContactForm');
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    let filledFields = 0;
    requiredInputs.forEach(input => {
        if (input.value.trim() !== '') {
            filledFields++;
        }
    });

    const progress = (filledFields / requiredInputs.length) * 100;
    document.getElementById('formProgress').style.width = progress + '%';

    // Update submit button based on progress
    const submitBtn = document.getElementById('submitBtn');
    if (progress === 100) {
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        submitBtn.innerHTML = '🚀 Submit My Request<span class="regional-phone">Response within 2 hours</span>';
    }
}

function validateField(event) {
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

function clearError(event) {
    const field = event.target;
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
}

function updateUrgencyIndicator(urgency) {
    // Remove existing urgency indicators
    const existingIndicator = document.querySelector('.urgency-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    if (urgency === 'emergency' || urgency === 'urgent') {
        const label = document.querySelector('label[for="urgency"]');
        const indicator = document.createElement('span');
        indicator.className = `urgency-indicator urgency-${urgency}`;
        indicator.textContent = urgency === 'emergency' ? 'EMERGENCY' : 'URGENT';
        label.appendChild(indicator);
    }
}

function updateServiceCategory(serviceType) {
    document.getElementById('serviceCategory').value = serviceType;

    // Update estimated value based on service type
    const estimatedValues = {
        'wedding_dress_restoration': 1500,
        'military_uniform_restoration': 800,
        'art_restoration': 2000,
        'emergency_restoration': 2500,
        'document_restoration': 400,
        'electronics_restoration': 600,
        'textile_restoration': 700,
        'consultation': 250
    };

    document.getElementById('estimatedValue').value = estimatedValues[serviceType] || 500;
}

function validateForm() {
    const form = document.getElementById('prismContactForm');
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;
    requiredInputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    return isValid;
}

function calculateFormScore() {
    let score = 100; // Base form submission score

    const urgency = document.getElementById('urgency').value;
    const serviceType = document.getElementById('serviceType').value;
    const itemValue = document.getElementById('itemValue').value;
    const hasPhotos = document.getElementById('photoConsent').checked;

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
        'electronics_restoration': 35,
        'document_restoration': 40,
        'textile_restoration': 40,
        'consultation': 20
    };
    score += serviceScores[serviceType] || 0;

    // Item value scoring
    const valueScores = {
        'over_10000': 50,
        'heirloom': 60,
        '5000_10000': 30,
        '1000_5000': 20,
        '500_1000': 10,
        'under_500': 5
    };
    score += valueScores[itemValue] || 0;

    // Photo consent adds engagement
    if (hasPhotos) score += 15;

    return score;
}

function calculateLeadTemperature(totalScore) {
    if (totalScore >= 250) return 'emergency';
    if (totalScore >= 150) return 'hot';
    if (totalScore >= 75) return 'warm';
    return 'cold';
}

function showFormSuccess(session) {
    const form = document.querySelector('.prism-contact-form-enhanced');
    const regionPhone = window.phoneTracker ? window.phoneTracker.getCurrentPhone() : '202-335-4240';
    const urgency = document.getElementById('urgency').value;

    let responseTime = '2 hours';
    if (urgency === 'emergency') responseTime = '15 minutes';
    else if (urgency === 'urgent') responseTime = '1 hour';

    form.innerHTML = `
        <div class="success-message">
            <h3>✅ Thank You for Your Request!</h3>
            <p><strong>Your consultation request has been received and processed.</strong></p>
            <p>A restoration specialist will contact you within <strong>${responseTime}</strong> during business hours.</p>
            <p><strong>Lead Score:</strong> ${session.contentScore} points (${session.leadQuality} priority)</p>

            <div class="phone-display">
                📞 For immediate assistance: ${regionPhone}
            </div>

            <p><small>Reference ID: ${session.sessionId}</small></p>
        </div>
    `;

    // Track form submission event
    if (window.prismTracker) {
        window.prismTracker.trackPageView('formSubmission', window.location.href);
    }
}

function showFormError() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '❌ Submission Error - Please Try Again';
    submitBtn.style.background = '#f44336';

    setTimeout(() => {
        submitBtn.innerHTML = '🎯 Get My Free Consultation<span class="regional-phone">Call: <span data-phone-region="auto">202-335-4240</span></span>';
        submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
    }, 3000);
}

// Utility functions
function detectRegionFromURL() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('washington-dc') || path.includes('dc')) return 'DC';
    if (path.includes('virginia') || path.includes('va')) return 'VA';
    if (path.includes('maryland') || path.includes('md')) return 'MD';
    return 'DC'; // Default
}

function generateSessionId() {
    return 'contact_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Auto-save form data (in case of page refresh)
function autoSaveForm() {
    const formData = new FormData(document.getElementById('prismContactForm'));
    const data = Object.fromEntries(formData);
    localStorage.setItem('prism_form_draft', JSON.stringify(data));
}

function restoreFormData() {
    const saved = localStorage.getItem('prism_form_draft');
    if (saved) {
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
        updateFormProgress();
    }
}

function clearFormDraft() {
    localStorage.removeItem('prism_form_draft');
}

// Auto-save every 10 seconds
setInterval(autoSaveForm, 10000);

// Restore data on load
document.addEventListener('DOMContentLoaded', restoreFormData);