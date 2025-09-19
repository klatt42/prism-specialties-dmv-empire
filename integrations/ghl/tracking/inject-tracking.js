// Inject tracking into existing blog posts
function injectPrismTracking() {
    // Art restoration posts tracking
    if (window.location.href.includes('art-restoration')) {
        window.prismTracker.trackPageView('artRestoration', window.location.href);
    }

    // Textile restoration posts tracking
    else if (window.location.href.includes('textile-restoration')) {
        window.prismTracker.trackPageView('textileRestoration', window.location.href);
    }

    // Document restoration posts tracking
    else if (window.location.href.includes('document-restoration')) {
        window.prismTracker.trackPageView('documentRestoration', window.location.href);
    }

    // Emergency service indicators
    if (document.querySelector('.emergency-cta')) {
        // Higher scoring for emergency CTA engagement
        document.querySelectorAll('.emergency-cta').forEach(cta => {
            cta.addEventListener('click', function() {
                window.prismTracker.trackPageView('emergencyService', window.location.href);
            });
        });
    }
}

// Run after tracker initialization
setTimeout(injectPrismTracking, 500);