// ALEX ANALYTICS - Real-time Performance Alerts & Reporting System
// Advanced monitoring and alerting for Prism Specialties DMV Empire

class RealTimeAlerts {
    constructor() {
        this.alertThresholds = {
            performance: {
                load_time_critical: 1000, // >1s is critical
                load_time_warning: 542,   // >542ms is warning (Funeral Director Standard™)
                error_rate_critical: 5,   // >5% error rate
                error_rate_warning: 2     // >2% error rate
            },
            conversions: {
                phone_calls_per_hour_low: 1,      // <1 call/hour is concerning
                cta_clicks_per_hour_low: 5,       // <5 CTA clicks/hour is low
                authority_interactions_low: 10    // <10 authority interactions/hour
            },
            psychology: {
                funeral_mentions_missing: 0,           // No funeral director mentions
                authority_elements_missing: 0,         // No authority elements
                psychology_interaction_rate_low: 0.1   // <10% interaction rate
            },
            regional: {
                phone_mismatch_rate_high: 20,  // >20% incorrect phone numbers
                regional_bounce_rate_high: 70  // >70% bounce rate
            }
        };
        
        this.alertHistory = [];
        this.performanceData = {};
        this.conversionData = {};
        this.psychologyMetrics = {};
        this.regionalMetrics = {};
        
        this.initializeRealTimeMonitoring();
    }
    
    // Initialize real-time monitoring system
    initializeRealTimeMonitoring() {
        this.startPerformanceMonitoring();
        this.startConversionMonitoring();
        this.startPsychologyMonitoring();
        this.startRegionalMonitoring();
        this.setupAlertReporting();
        this.initializeDashboardUpdates();
        
        console.log('🚨 Real-time alerts system initialized');
    }
    
    // Start performance monitoring
    startPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.performanceData = {
                load_time: loadTime,
                dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                first_contentful_paint: this.getFCP(),
                timestamp: Date.now()
            };
            
            // Check performance thresholds
            this.checkPerformanceAlerts(loadTime);
        });
        
        // Monitor JavaScript errors
        window.addEventListener('error', (event) => {
            this.triggerAlert('performance_error', 'critical', {
                message: event.message,
                filename: event.filename,
                line_number: event.lineno,
                error_stack: event.error?.stack
            });
        });
        
        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.triggerAlert('promise_rejection', 'warning', {
                reason: event.reason?.toString(),
                promise: event.promise
            });
        });
    }
    
    // Check performance alerts
    checkPerformanceAlerts(loadTime) {
        if (loadTime > this.alertThresholds.performance.load_time_critical) {
            this.triggerAlert('load_time_critical', 'critical', {
                load_time: Math.round(loadTime),
                threshold: this.alertThresholds.performance.load_time_critical,
                meets_funeral_director_standard: false,
                performance_rating: 'poor'
            });
        } else if (loadTime > this.alertThresholds.performance.load_time_warning) {
            this.triggerAlert('load_time_warning', 'warning', {
                load_time: Math.round(loadTime),
                threshold: this.alertThresholds.performance.load_time_warning,
                meets_funeral_director_standard: false,
                performance_rating: 'needs_improvement'
            });
        }
    }
    
    // Start conversion monitoring
    startConversionMonitoring() {
        this.conversionData = {
            phone_calls: 0,
            cta_clicks: 0,
            authority_interactions: 0,
            form_submissions: 0,
            session_start: Date.now()
        };
        
        // Monitor phone call conversions
        document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
            phoneLink.addEventListener('click', () => {
                this.conversionData.phone_calls++;
                this.checkConversionAlerts();
                
                gtag('event', 'real_time_conversion', {
                    conversion_type: 'phone_call',
                    total_phone_calls: this.conversionData.phone_calls,
                    session_duration: Date.now() - this.conversionData.session_start
                });
            });
        });
        
        // Monitor CTA clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                this.conversionData.cta_clicks++;
                this.checkConversionAlerts();
                
                gtag('event', 'real_time_conversion', {
                    conversion_type: 'cta_click',
                    button_text: button.textContent.trim(),
                    total_cta_clicks: this.conversionData.cta_clicks
                });
            });
        });
        
        // Monitor authority reversal interactions
        document.querySelectorAll('.authority-reversal').forEach(element => {
            element.addEventListener('click', () => {
                this.conversionData.authority_interactions++;
                this.checkConversionAlerts();
                
                gtag('event', 'real_time_psychology', {
                    interaction_type: 'authority_reversal',
                    total_authority_interactions: this.conversionData.authority_interactions
                });
            });
        });
        
        // Set up hourly conversion checks
        setInterval(() => {
            this.checkHourlyConversionRates();
        }, 3600000); // Check every hour
    }
    
    // Check conversion alerts
    checkConversionAlerts() {
        const sessionDuration = Date.now() - this.conversionData.session_start;
        const hoursElapsed = sessionDuration / (1000 * 60 * 60);
        
        if (hoursElapsed >= 1) {
            const phoneCallRate = this.conversionData.phone_calls / hoursElapsed;
            const ctaClickRate = this.conversionData.cta_clicks / hoursElapsed;
            const authorityInteractionRate = this.conversionData.authority_interactions / hoursElapsed;
            
            // Check low conversion rates
            if (phoneCallRate < this.alertThresholds.conversions.phone_calls_per_hour_low) {
                this.triggerAlert('low_phone_conversion_rate', 'warning', {
                    current_rate: phoneCallRate.toFixed(2),
                    threshold: this.alertThresholds.conversions.phone_calls_per_hour_low,
                    hours_elapsed: hoursElapsed.toFixed(1)
                });
            }
            
            if (ctaClickRate < this.alertThresholds.conversions.cta_clicks_per_hour_low) {
                this.triggerAlert('low_cta_click_rate', 'warning', {
                    current_rate: ctaClickRate.toFixed(2),
                    threshold: this.alertThresholds.conversions.cta_clicks_per_hour_low,
                    hours_elapsed: hoursElapsed.toFixed(1)
                });
            }
            
            if (authorityInteractionRate < this.alertThresholds.conversions.authority_interactions_low) {
                this.triggerAlert('low_authority_interaction_rate', 'warning', {
                    current_rate: authorityInteractionRate.toFixed(2),
                    threshold: this.alertThresholds.conversions.authority_interactions_low,
                    psychology_effectiveness: 'low'
                });
            }
        }
    }
    
    // Check hourly conversion rates
    checkHourlyConversionRates() {
        const sessionDuration = Date.now() - this.conversionData.session_start;
        const hoursElapsed = sessionDuration / (1000 * 60 * 60);
        
        const hourlyMetrics = {
            phone_calls_per_hour: this.conversionData.phone_calls / hoursElapsed,
            cta_clicks_per_hour: this.conversionData.cta_clicks / hoursElapsed,
            authority_interactions_per_hour: this.conversionData.authority_interactions / hoursElapsed,
            total_conversions_per_hour: (this.conversionData.phone_calls + this.conversionData.form_submissions) / hoursElapsed
        };
        
        gtag('event', 'hourly_performance_report', hourlyMetrics);
        
        // Send to real-time dashboard
        this.updateDashboard('hourly_metrics', hourlyMetrics);
    }
    
    // Start psychology monitoring
    startPsychologyMonitoring() {
        // Check for psychology elements on page load
        const funeralMentions = this.countFuneralDirectorMentions();
        const authorityElements = document.querySelectorAll('.authority-reversal').length;
        const hookElements = document.querySelectorAll('.hook-point').length;
        
        this.psychologyMetrics = {
            funeral_mentions: funeralMentions,
            authority_elements: authorityElements,
            hook_elements: hookElements,
            psychology_interactions: 0,
            total_page_interactions: 0
        };
        
        // Alert if psychology elements are missing
        if (funeralMentions === 0) {
            this.triggerAlert('missing_funeral_director_mentions', 'critical', {
                page_url: window.location.href,
                psychology_implementation: 'incomplete',
                authority_reversal_framework: 'not_implemented'
            });
        }
        
        if (authorityElements === 0) {
            this.triggerAlert('missing_authority_elements', 'warning', {
                page_url: window.location.href,
                psychology_elements: 'incomplete'
            });
        }
        
        // Track psychology interaction rates
        document.addEventListener('click', () => {
            this.psychologyMetrics.total_page_interactions++;
        });
        
        document.querySelectorAll('.authority-reversal, .hook-point').forEach(element => {
            element.addEventListener('click', () => {
                this.psychologyMetrics.psychology_interactions++;
                this.checkPsychologyInteractionRate();
            });
        });
    }
    
    // Count funeral director mentions
    countFuneralDirectorMentions() {
        const content = document.body.textContent.toLowerCase();
        const matches = content.match(/funeral director/g);
        return matches ? matches.length : 0;
    }
    
    // Check psychology interaction rate
    checkPsychologyInteractionRate() {
        if (this.psychologyMetrics.total_page_interactions > 50) { // After sufficient interactions
            const interactionRate = this.psychologyMetrics.psychology_interactions / this.psychologyMetrics.total_page_interactions;
            
            if (interactionRate < this.alertThresholds.psychology.psychology_interaction_rate_low) {
                this.triggerAlert('low_psychology_interaction_rate', 'warning', {
                    interaction_rate: (interactionRate * 100).toFixed(1),
                    psychology_interactions: this.psychologyMetrics.psychology_interactions,
                    total_interactions: this.psychologyMetrics.total_page_interactions,
                    psychology_effectiveness: 'low'
                });
            }
        }
    }
    
    // Start regional monitoring
    startRegionalMonitoring() {
        const region = this.detectRegion();
        const expectedPhone = this.getExpectedPhone(region);
        
        this.regionalMetrics = {
            region: region,
            expected_phone: expectedPhone,
            phone_clicks: 0,
            correct_phone_clicks: 0,
            page_views: 1,
            bounces: 0
        };
        
        // Monitor phone number accuracy
        document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
            phoneLink.addEventListener('click', () => {
                const phoneNumber = phoneLink.href.replace('tel:', '').replace(/\D/g, '');
                const expectedPhoneClean = expectedPhone.replace(/\D/g, '');
                const isCorrect = phoneNumber === expectedPhoneClean;
                
                this.regionalMetrics.phone_clicks++;
                if (isCorrect) {
                    this.regionalMetrics.correct_phone_clicks++;
                }
                
                this.checkRegionalPhoneAccuracy();
            });
        });
        
        // Monitor bounce rate (simplified)
        let userEngaged = false;
        document.addEventListener('click', () => { userEngaged = true; });
        document.addEventListener('scroll', () => { userEngaged = true; });
        
        setTimeout(() => {
            if (!userEngaged) {
                this.regionalMetrics.bounces++;
                this.checkRegionalBounceRate();
            }
        }, 10000); // 10 seconds without engagement = bounce
    }
    
    // Detect region
    detectRegion() {
        const path = window.location.pathname;
        
        if (path.includes('northern-virginia') || path.includes('fairfax') || path.includes('loudoun') || path.includes('prince-william')) {
            return 'VA';
        } else if (path.includes('washington-dc')) {
            return 'DC';
        } else if (path.includes('western-maryland') || path.includes('montgomery-county')) {
            return 'MD';
        }
        return 'UNKNOWN';
    }
    
    // Get expected phone for region
    getExpectedPhone(region) {
        const phones = {
            'VA': '703-229-1321',
            'DC': '202-335-4240', 
            'MD': '301-215-3191'
        };
        return phones[region] || 'unknown';
    }
    
    // Check regional phone accuracy
    checkRegionalPhoneAccuracy() {
        if (this.regionalMetrics.phone_clicks >= 5) {
            const accuracyRate = (this.regionalMetrics.correct_phone_clicks / this.regionalMetrics.phone_clicks) * 100;
            
            if (accuracyRate < (100 - this.alertThresholds.regional.phone_mismatch_rate_high)) {
                this.triggerAlert('high_phone_mismatch_rate', 'critical', {
                    region: this.regionalMetrics.region,
                    accuracy_rate: accuracyRate.toFixed(1),
                    correct_clicks: this.regionalMetrics.correct_phone_clicks,
                    total_clicks: this.regionalMetrics.phone_clicks,
                    expected_phone: this.regionalMetrics.expected_phone
                });
            }
        }
    }
    
    // Check regional bounce rate
    checkRegionalBounceRate() {
        const bounceRate = (this.regionalMetrics.bounces / this.regionalMetrics.page_views) * 100;
        
        if (bounceRate > this.alertThresholds.regional.regional_bounce_rate_high) {
            this.triggerAlert('high_regional_bounce_rate', 'warning', {
                region: this.regionalMetrics.region,
                bounce_rate: bounceRate.toFixed(1),
                bounces: this.regionalMetrics.bounces,
                page_views: this.regionalMetrics.page_views
            });
        }
    }
    
    // Trigger alert
    triggerAlert(alertType, severity, data = {}) {
        const alert = {
            id: this.generateAlertId(),
            type: alertType,
            severity: severity, // 'critical', 'warning', 'info'
            timestamp: Date.now(),
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            session_id: this.getSessionId(),
            data: data
        };
        
        this.alertHistory.push(alert);
        
        // Send to Google Analytics
        gtag('event', 'real_time_alert', {
            alert_type: alertType,
            alert_severity: severity,
            alert_id: alert.id,
            ...data
        });
        
        // Send to dashboard
        this.updateDashboard('alert', alert);
        
        // Log to console for development
        const emoji = severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${emoji} ALERT: ${alertType}`, alert);
        
        // For critical alerts, you might want to send to external monitoring
        if (severity === 'critical') {
            this.sendCriticalAlert(alert);
        }
    }
    
    // Generate unique alert ID
    generateAlertId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Get session ID (would be shared across the application)
    getSessionId() {
        if (!window.sessionStorage.getItem('alex_analytics_session')) {
            window.sessionStorage.setItem('alex_analytics_session', 
                Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
        }
        return window.sessionStorage.getItem('alex_analytics_session');
    }
    
    // Send critical alert to external monitoring
    sendCriticalAlert(alert) {
        // In a real implementation, this would send to:
        // - Slack webhook
        // - Email notification service
        // - SMS alerts
        // - External monitoring service (DataDog, New Relic, etc.)
        
        console.log('🚨 CRITICAL ALERT - Would send to external monitoring:', alert);
        
        // Example: Send to webhook
        // fetch('/webhook/alerts', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(alert)
        // });
    }
    
    // Setup alert reporting
    setupAlertReporting() {
        // Send alert summary every 15 minutes
        setInterval(() => {
            this.sendAlertSummary();
        }, 900000); // 15 minutes
        
        // Send critical alert summary on page unload
        window.addEventListener('beforeunload', () => {
            this.sendAlertSummary();
        });
    }
    
    // Send alert summary
    sendAlertSummary() {
        const summary = {
            session_id: this.getSessionId(),
            total_alerts: this.alertHistory.length,
            critical_alerts: this.alertHistory.filter(a => a.severity === 'critical').length,
            warning_alerts: this.alertHistory.filter(a => a.severity === 'warning').length,
            alert_types: this.getAlertTypeCounts(),
            session_duration: Date.now() - this.conversionData.session_start,
            performance_data: this.performanceData,
            conversion_data: this.conversionData,
            psychology_metrics: this.psychologyMetrics,
            regional_metrics: this.regionalMetrics
        };
        
        gtag('event', 'alert_summary_report', summary);
        
        this.updateDashboard('summary', summary);
    }
    
    // Get alert type counts
    getAlertTypeCounts() {
        const counts = {};
        this.alertHistory.forEach(alert => {
            counts[alert.type] = (counts[alert.type] || 0) + 1;
        });
        return counts;
    }
    
    // Initialize dashboard updates
    initializeDashboardUpdates() {
        // Send initial status to dashboard
        this.updateDashboard('initialization', {
            page_url: window.location.href,
            timestamp: Date.now(),
            monitoring_active: true,
            thresholds: this.alertThresholds
        });
    }
    
    // Update dashboard (would integrate with real dashboard)
    updateDashboard(updateType, data) {
        // In a real implementation, this would send updates to:
        // - Real-time dashboard via WebSocket
        // - Analytics dashboard API
        // - Monitoring service
        
        console.log(`📊 Dashboard Update: ${updateType}`, data);
        
        // Example: Send to dashboard API
        // fetch('/api/dashboard/update', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ type: updateType, data: data })
        // });
    }
    
    // Get FCP (First Contentful Paint)
    getFCP() {
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
    }
    
    // Get alert system status
    getAlertStatus() {
        return {
            system_active: true,
            alerts_triggered: this.alertHistory.length,
            last_alert: this.alertHistory[this.alertHistory.length - 1],
            thresholds: this.alertThresholds,
            monitoring_duration: Date.now() - this.conversionData.session_start
        };
    }
    
    // Manual trigger for testing
    testAlert(alertType = 'test_alert', severity = 'info') {
        this.triggerAlert(alertType, severity, {
            test_mode: true,
            triggered_manually: true,
            timestamp: Date.now()
        });
    }
}

// Initialize Real-Time Alerts System
const realTimeAlerts = new RealTimeAlerts();

// Export for global access
window.RealTimeAlerts = realTimeAlerts;

// Add test function to global scope for development
window.testAlert = (type, severity) => {
    realTimeAlerts.testAlert(type, severity);
};

console.log('🚨 Real-time alerts and monitoring system active');