// GHL Workflow Triggers for Prism Specialties Blog Integration
// Automates follow-up based on lead scoring and content interaction

class WorkflowTriggers {
    constructor(config, scoringEngine) {
        this.config = config;
        this.scoringEngine = scoringEngine;
        this.workflows = this.initializeWorkflows();
    }

    initializeWorkflows() {
        return {
            // Emergency response workflow
            emergency: {
                trigger: 'emergency_cta_click',
                delay: 0, // Immediate
                actions: [
                    'send_emergency_notification',
                    'create_hot_lead_task',
                    'trigger_immediate_callback'
                ]
            },

            // Hot lead workflow
            hotLead: {
                trigger: 'high_engagement_score',
                scoreThreshold: 60,
                delay: 15 * 60 * 1000, // 15 minutes
                actions: [
                    'send_personal_email',
                    'create_follow_up_task',
                    'schedule_callback'
                ]
            },

            // Content-specific workflows
            textileRestoration: {
                trigger: 'textile_content_engagement',
                scoreThreshold: 25,
                delay: 2 * 60 * 60 * 1000, // 2 hours
                actions: [
                    'send_textile_expertise_email',
                    'offer_consultation',
                    'add_to_textile_nurture'
                ]
            },

            documentRestoration: {
                trigger: 'document_content_engagement',
                scoreThreshold: 25,
                delay: 2 * 60 * 60 * 1000, // 2 hours
                actions: [
                    'send_document_expertise_email',
                    'offer_emergency_response',
                    'add_to_document_nurture'
                ]
            },

            artRestoration: {
                trigger: 'art_content_engagement',
                scoreThreshold: 25,
                delay: 4 * 60 * 60 * 1000, // 4 hours
                actions: [
                    'send_art_expertise_email',
                    'showcase_museum_credentials',
                    'add_to_art_nurture'
                ]
            },

            // Regional workflows
            dcRegional: {
                trigger: 'dc_regional_interest',
                scoreThreshold: 20,
                delay: 24 * 60 * 60 * 1000, // 24 hours
                actions: [
                    'send_dc_specific_email',
                    'highlight_government_work',
                    'add_to_dc_nurture'
                ]
            },

            vaRegional: {
                trigger: 'va_regional_interest',
                scoreThreshold: 20,
                delay: 24 * 60 * 60 * 1000, // 24 hours
                actions: [
                    'send_va_specific_email',
                    'highlight_local_cases',
                    'add_to_va_nurture'
                ]
            },

            mdRegional: {
                trigger: 'md_regional_interest',
                scoreThreshold: 20,
                delay: 24 * 60 * 60 * 1000, // 24 hours
                actions: [
                    'send_md_specific_email',
                    'highlight_county_work',
                    'add_to_md_nurture'
                ]
            },

            // Retargeting workflows
            warmRetargeting: {
                trigger: 'warm_lead_no_conversion',
                scoreThreshold: 30,
                delay: 7 * 24 * 60 * 60 * 1000, // 7 days
                actions: [
                    'send_case_study_email',
                    'offer_free_assessment',
                    'social_proof_campaign'
                ]
            },

            abandonedHighValue: {
                trigger: 'high_engagement_no_contact',
                scoreThreshold: 50,
                delay: 30 * 60 * 1000, // 30 minutes
                actions: [
                    'send_urgent_follow_up',
                    'offer_immediate_consultation',
                    'create_sales_task'
                ]
            }
        };
    }

    // Process session data and trigger appropriate workflows
    processSession(sessionData) {
        const leadScore = this.scoringEngine.calculateLeadScore(sessionData);
        const triggers = this.identifyTriggers(sessionData, leadScore);

        triggers.forEach(trigger => {
            this.executeWorkflow(trigger, sessionData, leadScore);
        });

        return {
            triggeredWorkflows: triggers,
            leadScore: leadScore
        };
    }

    // Identify which workflows should be triggered
    identifyTriggers(sessionData, leadScore) {
        const triggers = [];

        // Emergency workflow
        const hasEmergencyClick = sessionData.interactions.some(
            interaction => interaction.type === 'emergency_cta_click'
        );
        if (hasEmergencyClick) {
            triggers.push('emergency');
        }

        // High engagement workflow
        if (leadScore.totalScore >= 60 && !hasEmergencyClick) {
            triggers.push('hotLead');
        }

        // Content-specific workflows
        const contentTypes = sessionData.pageViews.map(pv => pv.contentType);
        if (contentTypes.includes('textileRestoration') ||
            contentTypes.includes('weddingDressContent') ||
            contentTypes.includes('militaryUniformContent')) {
            triggers.push('textileRestoration');
        }

        if (contentTypes.includes('documentRestoration') ||
            contentTypes.includes('governmentRecordsContent')) {
            triggers.push('documentRestoration');
        }

        if (contentTypes.includes('artRestoration')) {
            triggers.push('artRestoration');
        }

        // Regional workflows
        const regions = sessionData.pageViews.map(pv => pv.region);
        if (regions.includes('DC') && leadScore.totalScore >= 20) {
            triggers.push('dcRegional');
        }
        if (regions.includes('VA') && leadScore.totalScore >= 20) {
            triggers.push('vaRegional');
        }
        if (regions.includes('MD') && leadScore.totalScore >= 20) {
            triggers.push('mdRegional');
        }

        // Abandonment workflows
        if (leadScore.totalScore >= 50 && !this.hasContactAction(sessionData)) {
            triggers.push('abandonedHighValue');
        }

        return triggers;
    }

    // Execute a specific workflow
    executeWorkflow(workflowName, sessionData, leadScore) {
        const workflow = this.workflows[workflowName];
        if (!workflow) return;

        console.log(`Executing workflow: ${workflowName}`, {
            sessionId: sessionData.sessionId,
            score: leadScore.totalScore,
            delay: workflow.delay
        });

        // Schedule workflow execution
        setTimeout(() => {
            this.performWorkflowActions(workflowName, workflow.actions, sessionData, leadScore);
        }, workflow.delay);

        // Log workflow trigger for GHL
        this.logWorkflowTrigger(workflowName, sessionData, leadScore);
    }

    // Perform the actual workflow actions
    performWorkflowActions(workflowName, actions, sessionData, leadScore) {
        actions.forEach(action => {
            switch (action) {
                case 'send_emergency_notification':
                    this.sendEmergencyNotification(sessionData);
                    break;
                case 'create_hot_lead_task':
                    this.createSalesTask('hot_lead', sessionData, leadScore);
                    break;
                case 'trigger_immediate_callback':
                    this.scheduleCallback(0, sessionData); // Immediate
                    break;
                case 'send_personal_email':
                    this.sendPersonalizedEmail('hot_lead', sessionData, leadScore);
                    break;
                case 'create_follow_up_task':
                    this.createSalesTask('follow_up', sessionData, leadScore);
                    break;
                case 'schedule_callback':
                    this.scheduleCallback(2 * 60 * 60 * 1000, sessionData); // 2 hours
                    break;
                case 'send_textile_expertise_email':
                    this.sendExpertiseEmail('textile', sessionData, leadScore);
                    break;
                case 'send_document_expertise_email':
                    this.sendExpertiseEmail('document', sessionData, leadScore);
                    break;
                case 'send_art_expertise_email':
                    this.sendExpertiseEmail('art', sessionData, leadScore);
                    break;
                case 'offer_consultation':
                    this.offerConsultation(sessionData, leadScore);
                    break;
                case 'add_to_textile_nurture':
                    this.addToNurtureSequence('textile', sessionData);
                    break;
                case 'add_to_document_nurture':
                    this.addToNurtureSequence('document', sessionData);
                    break;
                case 'add_to_art_nurture':
                    this.addToNurtureSequence('art', sessionData);
                    break;
                default:
                    console.log(`Unknown workflow action: ${action}`);
            }
        });
    }

    // Send emergency notification
    sendEmergencyNotification(sessionData) {
        const notification = {
            type: 'emergency_notification',
            priority: 'IMMEDIATE',
            message: 'Emergency CTA clicked - requires immediate response',
            sessionData: sessionData,
            timestamp: Date.now(),
            notificationChannels: ['sms', 'email', 'slack'],
            responseRequired: true,
            sla: '15 minutes'
        };

        this.sendToGHL('emergency-notification', notification);
        console.log('Emergency notification sent', notification);
    }

    // Create sales task
    createSalesTask(taskType, sessionData, leadScore) {
        const task = {
            type: 'sales_task',
            taskType: taskType,
            priority: leadScore.temperature === 'emergency' ? 'URGENT' : 'HIGH',
            sessionData: sessionData,
            leadScore: leadScore,
            createdAt: Date.now(),
            dueDate: Date.now() + (taskType === 'hot_lead' ? 2 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
            assignee: 'sales_team',
            context: this.buildTaskContext(sessionData, leadScore)
        };

        this.sendToGHL('create-task', task);
        console.log('Sales task created', task);
    }

    // Schedule callback
    scheduleCallback(delay, sessionData) {
        const callback = {
            type: 'callback_schedule',
            delay: delay,
            sessionData: sessionData,
            scheduledFor: Date.now() + delay,
            priority: delay === 0 ? 'IMMEDIATE' : 'HIGH',
            phone: this.extractPhonePreference(sessionData),
            context: this.buildCallContext(sessionData)
        };

        this.sendToGHL('schedule-callback', callback);
        console.log('Callback scheduled', callback);
    }

    // Send personalized email
    sendPersonalizedEmail(emailType, sessionData, leadScore) {
        const email = {
            type: 'personalized_email',
            emailType: emailType,
            sessionData: sessionData,
            leadScore: leadScore,
            personalization: this.buildEmailPersonalization(sessionData, leadScore),
            template: this.selectEmailTemplate(emailType, sessionData),
            priority: leadScore.temperature === 'hot' ? 'HIGH' : 'NORMAL'
        };

        this.sendToGHL('send-email', email);
        console.log('Personalized email queued', email);
    }

    // Send expertise-focused email
    sendExpertiseEmail(expertiseType, sessionData, leadScore) {
        const email = {
            type: 'expertise_email',
            expertiseType: expertiseType,
            sessionData: sessionData,
            leadScore: leadScore,
            contentViewed: sessionData.pageViews.map(pv => pv.path),
            template: `${expertiseType}_expertise_template`,
            credentials: this.getRelevantCredentials(expertiseType)
        };

        this.sendToGHL('send-expertise-email', email);
        console.log('Expertise email queued', email);
    }

    // Offer consultation
    offerConsultation(sessionData, leadScore) {
        const consultation = {
            type: 'consultation_offer',
            sessionData: sessionData,
            leadScore: leadScore,
            consultationType: this.determineConsultationType(sessionData),
            urgency: leadScore.temperature === 'hot' ? 'urgent' : 'standard',
            availableSlots: this.getAvailableSlots()
        };

        this.sendToGHL('offer-consultation', consultation);
        console.log('Consultation offered', consultation);
    }

    // Add to nurture sequence
    addToNurtureSequence(sequenceType, sessionData) {
        const nurture = {
            type: 'nurture_sequence',
            sequenceType: sequenceType,
            sessionData: sessionData,
            startDate: Date.now(),
            cadence: 'weekly',
            duration: '12_weeks',
            content: this.getNurtureContent(sequenceType)
        };

        this.sendToGHL('add-to-nurture', nurture);
        console.log('Added to nurture sequence', nurture);
    }

    // Helper methods
    hasContactAction(sessionData) {
        return sessionData.interactions.some(interaction =>
            ['emergency_cta_click', 'phone_call_click', 'contact_form_submit'].includes(interaction.type)
        );
    }

    buildTaskContext(sessionData, leadScore) {
        return {
            pagesViewed: sessionData.pageViews.length,
            contentTypes: [...new Set(sessionData.pageViews.map(pv => pv.contentType))],
            timeSpent: Date.now() - sessionData.startTime,
            temperature: leadScore.temperature,
            keyInsights: leadScore.recommendation.insights
        };
    }

    buildCallContext(sessionData) {
        const contentViewed = sessionData.pageViews.map(pv => ({
            page: pv.path.split('/').pop(),
            type: pv.contentType
        }));

        return {
            leadSource: 'blog_engagement',
            contentViewed: contentViewed,
            interestLevel: this.calculateInterestLevel(sessionData),
            urgencyIndicators: this.getUrgencyIndicators(sessionData)
        };
    }

    calculateInterestLevel(sessionData) {
        const timeSpent = Date.now() - sessionData.startTime;
        const pageViews = sessionData.pageViews.length;

        if (timeSpent > 300000 && pageViews > 3) return 'high';
        if (timeSpent > 120000 && pageViews > 2) return 'medium';
        return 'low';
    }

    getUrgencyIndicators(sessionData) {
        const indicators = [];

        if (sessionData.interactions.some(i => i.type === 'emergency_cta_click')) {
            indicators.push('emergency_cta_clicked');
        }

        const accessTime = new Date(sessionData.startTime);
        if (accessTime.getHours() < 8 || accessTime.getHours() > 18) {
            indicators.push('after_hours_access');
        }

        if (accessTime.getDay() === 0 || accessTime.getDay() === 6) {
            indicators.push('weekend_access');
        }

        return indicators;
    }

    // Send data to GHL
    sendToGHL(endpoint, data) {
        // Store locally for development/testing
        const storageKey = `ghl_workflow_${endpoint}_${Date.now()}`;
        localStorage.setItem(storageKey, JSON.stringify(data));

        // In production, this would make actual API calls
        console.log(`GHL Workflow: ${endpoint}`, data);

        // Future implementation:
        // return fetch(`${this.config.apiBase}/workflows/${endpoint}`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${this.config.apiKey}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });
    }

    // Log workflow trigger for analytics
    logWorkflowTrigger(workflowName, sessionData, leadScore) {
        const log = {
            workflow: workflowName,
            sessionId: sessionData.sessionId,
            leadScore: leadScore.totalScore,
            temperature: leadScore.temperature,
            timestamp: Date.now(),
            context: {
                pageViews: sessionData.pageViews.length,
                interactions: sessionData.interactions.length,
                timeSpent: Date.now() - sessionData.startTime
            }
        };

        this.sendToGHL('workflow-log', log);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkflowTriggers;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.WorkflowTriggers = WorkflowTriggers;
}