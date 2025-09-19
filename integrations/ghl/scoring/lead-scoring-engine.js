// Lead Scoring Engine for Prism Specialties GHL Integration
// Calculates lead temperature based on blog engagement and content interaction

class LeadScoringEngine {
    constructor(config) {
        this.config = config;
        this.scoringRules = this.initializeScoringRules();
    }

    initializeScoringRules() {
        return {
            // Content-based scoring
            contentInteraction: {
                // High-value content types
                militaryUniform: 40,    // High emotional attachment
                weddingDress: 45,       // High emotional attachment + timeline pressure
                governmentRecords: 35,  // High authority/credibility needs
                emergencyResponse: 60,  // Immediate need indicator

                // Service category engagement
                textileRestoration: 30,
                documentRestoration: 35,
                artRestoration: 25,
                electronicsRestoration: 25
            },

            // Behavioral scoring
            engagement: {
                pageView: 5,
                timeSpent_30s: 5,
                timeSpent_2min: 10,
                timeSpent_3min: 15,
                timeSpent_5min: 25,
                scrollDepth_25: 3,
                scrollDepth_50: 5,
                scrollDepth_75: 8,
                scrollDepth_100: 12,
                returnVisitor: 15,
                multiplePageViews: 10
            },

            // Intent signals
            intentSignals: {
                emergencyCtaClick: 50,
                phoneCallClick: 75,
                contactFormView: 25,
                contactFormSubmit: 100,
                directPhoneCall: 100,
                afterHoursAccess: 30,    // Accessing content outside business hours
                weekendAccess: 25,       // Weekend access suggests urgency
                mobileAccess: 15         // Mobile suggests immediate need
            },

            // Geographic relevance
            geographic: {
                localSearch: 10,         // Found via local search
                regionalContent: 15,     // Viewing region-specific content
                serviceAreaMatch: 20     // IP matches service area
            },

            // Urgency indicators
            urgencySignals: {
                emergencyKeywords: 40,   // "emergency", "urgent", "ASAP" in forms
                sameDay: 50,            // Multiple visits same day
                rapidNavigation: 30,    // Quick movement between relevant pages
                directTraffic: 15,      // Direct site access (saved/remembered)
                referralFromAuthority: 25 // Referral from museum, gov site, etc.
            }
        };
    }

    // Calculate lead score based on session data
    calculateLeadScore(sessionData) {
        let totalScore = 0;
        const scoreBreakdown = {
            content: 0,
            engagement: 0,
            intent: 0,
            geographic: 0,
            urgency: 0
        };

        // Content-based scoring
        scoreBreakdown.content = this.scoreContentInteraction(sessionData);

        // Engagement scoring
        scoreBreakdown.engagement = this.scoreEngagementBehavior(sessionData);

        // Intent signal scoring
        scoreBreakdown.intent = this.scoreIntentSignals(sessionData);

        // Geographic relevance scoring
        scoreBreakdown.geographic = this.scoreGeographicRelevance(sessionData);

        // Urgency signal scoring
        scoreBreakdown.urgency = this.scoreUrgencySignals(sessionData);

        totalScore = Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0);

        return {
            totalScore,
            scoreBreakdown,
            temperature: this.calculateTemperature(totalScore),
            recommendation: this.getFollowUpRecommendation(totalScore, scoreBreakdown)
        };
    }

    // Score content interaction
    scoreContentInteraction(sessionData) {
        let contentScore = 0;
        const viewedContent = new Set();

        sessionData.pageViews.forEach(pageView => {
            if (pageView.contentType && !viewedContent.has(pageView.contentType)) {
                viewedContent.add(pageView.contentType);
                contentScore += this.scoringRules.contentInteraction[pageView.contentType] || 0;
            }
        });

        // Bonus for viewing multiple content types (shows broader interest)
        if (viewedContent.size > 1) {
            contentScore += 10;
        }

        // Bonus for viewing high-value content combinations
        if (viewedContent.has('militaryUniform') && viewedContent.has('textileRestoration')) {
            contentScore += 15; // Clear service need match
        }

        return Math.min(contentScore, 100); // Cap content scoring
    }

    // Score engagement behavior
    scoreEngagementBehavior(sessionData) {
        let engagementScore = 0;
        const timeSpent = Date.now() - sessionData.startTime;

        // Time-based scoring
        if (timeSpent >= 300000) { // 5+ minutes
            engagementScore += this.scoringRules.engagement.timeSpent_5min;
        } else if (timeSpent >= 180000) { // 3+ minutes
            engagementScore += this.scoringRules.engagement.timeSpent_3min;
        } else if (timeSpent >= 120000) { // 2+ minutes
            engagementScore += this.scoringRules.engagement.timeSpent_2min;
        } else if (timeSpent >= 30000) { // 30+ seconds
            engagementScore += this.scoringRules.engagement.timeSpent_30s;
        }

        // Page view scoring
        engagementScore += sessionData.pageViews.length * this.scoringRules.engagement.pageView;

        // Multiple page bonus
        if (sessionData.pageViews.length > 2) {
            engagementScore += this.scoringRules.engagement.multiplePageViews;
        }

        // Interaction-based scoring
        sessionData.interactions.forEach(interaction => {
            if (interaction.type === 'scroll_depth') {
                const depthKey = `scrollDepth_${interaction.depth}`;
                engagementScore += this.scoringRules.engagement[depthKey] || 0;
            }
        });

        return engagementScore;
    }

    // Score intent signals
    scoreIntentSignals(sessionData) {
        let intentScore = 0;

        sessionData.interactions.forEach(interaction => {
            switch (interaction.type) {
                case 'emergency_cta_click':
                    intentScore += this.scoringRules.intentSignals.emergencyCtaClick;
                    break;
                case 'phone_call_click':
                    intentScore += this.scoringRules.intentSignals.phoneCallClick;
                    break;
                case 'contact_form_view':
                    intentScore += this.scoringRules.intentSignals.contactFormView;
                    break;
                case 'contact_form_submit':
                    intentScore += this.scoringRules.intentSignals.contactFormSubmit;
                    break;
            }
        });

        // Device-based intent signals
        if (this.isMobileDevice(sessionData.userAgent)) {
            intentScore += this.scoringRules.intentSignals.mobileAccess;
        }

        // Time-based intent signals
        const accessTime = new Date(sessionData.startTime);
        const hour = accessTime.getHours();
        const dayOfWeek = accessTime.getDay();

        // After hours access (before 8 AM or after 6 PM)
        if (hour < 8 || hour > 18) {
            intentScore += this.scoringRules.intentSignals.afterHoursAccess;
        }

        // Weekend access
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            intentScore += this.scoringRules.intentSignals.weekendAccess;
        }

        return intentScore;
    }

    // Score geographic relevance
    scoreGeographicRelevance(sessionData) {
        let geoScore = 0;
        const regions = sessionData.pageViews.map(pv => pv.region).filter(r => r && r !== 'general');

        if (regions.length > 0) {
            geoScore += this.scoringRules.geographic.regionalContent;
        }

        // Bonus for consistent regional focus
        const uniqueRegions = new Set(regions);
        if (uniqueRegions.size === 1 && regions.length > 1) {
            geoScore += 10; // Focused on one region = local customer
        }

        return geoScore;
    }

    // Score urgency signals
    scoreUrgencySignals(sessionData) {
        let urgencyScore = 0;

        // Same-day multiple visits (would need session storage to track)
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('prism_last_visit');
        if (lastVisit && new Date(lastVisit).toDateString() === today) {
            urgencyScore += this.scoringRules.urgencySignals.sameDay;
        }

        // Direct traffic (no referrer)
        if (!sessionData.referrer || sessionData.referrer === '') {
            urgencyScore += this.scoringRules.urgencySignals.directTraffic;
        }

        // Rapid navigation between relevant pages
        if (sessionData.pageViews.length >= 3) {
            const avgTimePerPage = (Date.now() - sessionData.startTime) / sessionData.pageViews.length;
            if (avgTimePerPage < 60000) { // Less than 1 minute per page
                urgencyScore += this.scoringRules.urgencySignals.rapidNavigation;
            }
        }

        return urgencyScore;
    }

    // Calculate lead temperature
    calculateTemperature(score) {
        if (score >= 100) return 'emergency';
        if (score >= 60) return 'hot';
        if (score >= 30) return 'warm';
        return 'cold';
    }

    // Get follow-up recommendation
    getFollowUpRecommendation(totalScore, scoreBreakdown) {
        const recommendations = {
            emergency: {
                priority: 'IMMEDIATE',
                timeframe: '< 15 minutes',
                method: 'Phone call',
                message: 'Emergency CTA clicked or extremely high engagement. Immediate response required.'
            },
            hot: {
                priority: 'HIGH',
                timeframe: '< 2 hours',
                method: 'Phone call or personal email',
                message: 'High intent signals. Strong candidate for immediate follow-up.'
            },
            warm: {
                priority: 'MEDIUM',
                timeframe: '< 24 hours',
                method: 'Email or phone call',
                message: 'Good engagement level. Follow up with relevant content and service information.'
            },
            cold: {
                priority: 'LOW',
                timeframe: '< 7 days',
                method: 'Email nurture sequence',
                message: 'Basic engagement. Add to nurture sequence for education and relationship building.'
            }
        };

        const temperature = this.calculateTemperature(totalScore);
        const recommendation = recommendations[temperature];

        // Add specific insights based on score breakdown
        const insights = [];

        if (scoreBreakdown.content > 30) {
            insights.push('High content engagement - clear service interest');
        }
        if (scoreBreakdown.intent > 40) {
            insights.push('Strong intent signals - ready to act');
        }
        if (scoreBreakdown.urgency > 25) {
            insights.push('Urgency indicators present - time-sensitive need');
        }
        if (scoreBreakdown.geographic > 15) {
            insights.push('Local customer - regional service match');
        }

        return {
            ...recommendation,
            insights,
            specificAction: this.getSpecificAction(scoreBreakdown)
        };
    }

    // Get specific action recommendation
    getSpecificAction(scoreBreakdown) {
        if (scoreBreakdown.content > 40) {
            return 'Lead with content-specific expertise (mention specific services viewed)';
        }
        if (scoreBreakdown.intent > 50) {
            return 'Direct service offer - lead is ready for consultation';
        }
        if (scoreBreakdown.urgency > 30) {
            return 'Emphasize emergency response capability and availability';
        }
        return 'Educational approach - build trust through expertise demonstration';
    }

    // Utility: Check if mobile device
    isMobileDevice(userAgent) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    // Utility: Update last visit timestamp
    updateLastVisit() {
        localStorage.setItem('prism_last_visit', new Date().toISOString());
    }
}

// Export for use in tracking system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeadScoringEngine;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.LeadScoringEngine = LeadScoringEngine;
}