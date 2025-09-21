// Mobile-optimized lead capture functionality for Prism Specialties DMV

// Lead capture form handler
function handleLeadSubmit(event, redirectUrl) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const phone = formData.get('phone') || '';
    const zip = formData.get('zip') || '';

    // Basic email validation
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return false;
    }

    // Store lead data (would integrate with CRM/backend)
    console.log('Lead captured:', { email, phone, zip, source: redirectUrl });

    // Success message
    alert('Thank you! Your emergency checklist will be sent to ' + email);

    // Redirect to checklist page
    if (redirectUrl) {
        window.location.href = redirectUrl;
    }

    return false;
}

// Exit-intent popup for lead capture
function showExitIntentPopup() {
    const popup = document.createElement('div');
    popup.id = 'exit-intent-popup';
    popup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 15px; max-width: 500px; margin: 20px; text-align: center; position: relative;">
                <button onclick="closeExitPopup()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
                <h3 style="color: #d32f2f; margin-bottom: 20px;">🚨 Don't Leave Without Your Emergency Guide!</h3>
                <p style="margin-bottom: 20px; color: #555;">Get our professional emergency checklist that could save you thousands in damage costs.</p>
                <form onsubmit="handleLeadSubmit(event, '/checklists/water-damage-emergency-checklist.html')">
                    <input type="email" name="email" placeholder="Email for instant download" style="padding: 12px; border: 1px solid #ddd; border-radius: 5px; width: 80%; margin-bottom: 15px;" required>
                    <br>
                    <button type="submit" style="background: #ff6b35; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-weight: 600;">Get Free Checklist</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

// Close exit popup
function closeExitPopup() {
    const popup = document.getElementById('exit-intent-popup');
    if (popup) {
        popup.remove();
    }
}

// Mobile-responsive form generator
function createMobileLeadForm(title, description, buttonText, actionUrl) {
    return `
    <div class="mobile-lead-form" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 20px 0;">
        <h4 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">${title}</h4>
        <p style="text-align: center; margin-bottom: 20px; color: #555;">${description}</p>

        <form onsubmit="handleLeadSubmit(event, '${actionUrl}')">
            <div style="margin-bottom: 15px;">
                <input type="text" name="firstName" placeholder="First Name" style="width: 48%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; margin-right: 4%;">
                <input type="email" name="email" placeholder="Email Address" style="width: 48%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;" required>
            </div>
            <div style="margin-bottom: 20px;">
                <input type="text" name="phone" placeholder="Phone (for emergency alerts)" style="width: 48%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; margin-right: 4%;">
                <input type="text" name="zip" placeholder="Zip Code" style="width: 48%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <button type="submit" style="width: 100%; background: #27ae60; color: white; padding: 15px; border: none; border-radius: 25px; font-size: 16px; font-weight: 600;">${buttonText}</button>
        </form>

        <p style="font-size: 0.9rem; color: #777; text-align: center; margin-top: 15px;">We respect your privacy. No spam, just valuable emergency resources.</p>
    </div>
    `;
}

// Initialize exit-intent detection (desktop only)
document.addEventListener('DOMContentLoaded', function() {
    let exitIntentShown = false;

    // Only show on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;
                setTimeout(showExitIntentPopup, 500);
            }
        });
    }

    console.log('Lead capture system initialized');
});