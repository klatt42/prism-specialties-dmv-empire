// Analytics API Endpoint for PDF Engagement Tracking
// Processes and stores engagement data, generates insights

const fs = require('fs').promises;
const path = require('path');

// Analytics data storage (in production, use database)
const ANALYTICS_DIR = path.join(process.cwd(), 'analytics-data');
const EVENTS_FILE = path.join(ANALYTICS_DIR, 'events.json');
const DAILY_STATS_FILE = path.join(ANALYTICS_DIR, 'daily-stats.json');

// Ensure analytics directory exists
async function ensureAnalyticsDir() {
    try {
        await fs.mkdir(ANALYTICS_DIR, { recursive: true });
    } catch (error) {
        // Directory exists
    }
}

// Main analytics handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await ensureAnalyticsDir();

        const event = req.body;

        // Validate event data
        if (!event.sessionId || !event.eventType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Enrich event with server data
        const enrichedEvent = {
            ...event,
            serverTimestamp: Date.now(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            acceptLanguage: req.headers['accept-language']
        };

        // Store event
        await storeEvent(enrichedEvent);

        // Update daily statistics
        await updateDailyStats(enrichedEvent);

        // Generate insights for key events
        if (isKeyEvent(event.eventType)) {
            await generateInsights(enrichedEvent);
        }

        res.status(200).json({ success: true, eventId: generateEventId() });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to process analytics event' });
    }
}

// Store individual event
async function storeEvent(event) {
    let events = [];

    try {
        const existingData = await fs.readFile(EVENTS_FILE, 'utf8');
        events = JSON.parse(existingData);
    } catch (error) {
        // File doesn't exist or is empty
    }

    events.push(event);

    // Keep only last 10,000 events (rolling window)
    if (events.length > 10000) {
        events = events.slice(-10000);
    }

    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
}

// Update daily statistics
async function updateDailyStats(event) {
    const today = new Date().toISOString().split('T')[0];
    let dailyStats = {};

    try {
        const existingData = await fs.readFile(DAILY_STATS_FILE, 'utf8');
        dailyStats = JSON.parse(existingData);
    } catch (error) {
        // File doesn't exist
    }

    if (!dailyStats[today]) {
        dailyStats[today] = {
            date: today,
            totalEvents: 0,
            uniqueSessions: new Set(),
            deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
            checklistBreakdown: {
                fire_damage: 0,
                water_damage: 0,
                document_recovery: 0,
                lightning_strike: 0,
                general: 0
            },
            funnelSteps: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
            averageTimeOnPage: [],
            conversionEvents: {
                page_views: 0,
                modal_opens: 0,
                form_submissions: 0,
                pdf_views: 0,
                pdf_downloads: 0,
                contact_conversions: 0
            },
            geographicData: {},
            trafficSources: {},
            engagementMilestones: {
                scroll_25: 0,
                scroll_50: 0,
                scroll_75: 0,
                time_30_seconds: 0,
                time_1_minute: 0,
                time_3_minutes: 0
            }
        };
    }

    const stats = dailyStats[today];

    // Update basic metrics
    stats.totalEvents++;
    stats.uniqueSessions.add(event.sessionId);

    // Device breakdown
    if (event.device) {
        stats.deviceBreakdown[event.device] = (stats.deviceBreakdown[event.device] || 0) + 1;
    }

    // Track funnel steps
    if (event.eventType === 'funnel_step') {
        stats.funnelSteps[event.step] = (stats.funnelSteps[event.step] || 0) + 1;
    }

    // Track conversion events
    const conversionMap = {
        'page_load': 'page_views',
        'modal_opened': 'modal_opens',
        'form_submitted': 'form_submissions',
        'pdf_loaded': 'pdf_views',
        'pdf_download_initiated': 'pdf_downloads',
        'contact_conversion': 'contact_conversions'
    };

    if (conversionMap[event.eventType]) {
        stats.conversionEvents[conversionMap[event.eventType]]++;
    }

    // Time on page tracking
    if (event.timeOnPage) {
        stats.averageTimeOnPage.push(event.timeOnPage);
    }

    // Geographic data
    if (event.zipCode) {
        stats.geographicData[event.zipCode] = (stats.geographicData[event.zipCode] || 0) + 1;
    }

    // Traffic sources
    if (event.source) {
        stats.trafficSources[event.source] = (stats.trafficSources[event.source] || 0) + 1;
    }

    // Engagement milestones
    if (event.eventType === 'scroll_depth') {
        stats.engagementMilestones[`scroll_${event.percentage}`]++;
    }
    if (event.eventType === 'pdf_engagement') {
        stats.engagementMilestones[`time_${event.milestone}`]++;
    }

    // Convert Set to number for storage
    const sessionCount = stats.uniqueSessions.size;
    stats.uniqueSessions = sessionCount;

    await fs.writeFile(DAILY_STATS_FILE, JSON.stringify(dailyStats, null, 2));
}

// Generate insights for key events
async function generateInsights(event) {
    const insights = [];

    // High engagement detection
    if (event.eventType === 'pdf_engagement' && event.milestone === '3_minutes') {
        insights.push({
            type: 'high_engagement',
            sessionId: event.sessionId,
            message: 'User spent 3+ minutes viewing PDF - high interest',
            timestamp: event.serverTimestamp
        });
    }

    // Quick conversion detection
    if (event.eventType === 'form_submitted' && event.timeOnPage < 30000) {
        insights.push({
            type: 'quick_conversion',
            sessionId: event.sessionId,
            message: 'Fast form submission - urgent need detected',
            timestamp: event.serverTimestamp
        });
    }

    // Emergency call tracking
    if (event.eventType === 'emergency_call_clicked') {
        insights.push({
            type: 'emergency_action',
            sessionId: event.sessionId,
            message: 'Emergency call initiated - active lead',
            timestamp: event.serverTimestamp
        });
    }

    // Exit intent with high engagement
    if (event.eventType === 'exit_intent' && event.maxScrollDepth > 75) {
        insights.push({
            type: 'exit_intent_engaged',
            sessionId: event.sessionId,
            message: 'High-engaged user showing exit intent',
            timestamp: event.serverTimestamp
        });
    }

    // Store insights
    if (insights.length > 0) {
        await storeInsights(insights);
    }
}

// Store insights
async function storeInsights(insights) {
    const insightsFile = path.join(ANALYTICS_DIR, 'insights.json');
    let existingInsights = [];

    try {
        const data = await fs.readFile(insightsFile, 'utf8');
        existingInsights = JSON.parse(data);
    } catch (error) {
        // File doesn't exist
    }

    existingInsights.push(...insights);

    // Keep only last 1000 insights
    if (existingInsights.length > 1000) {
        existingInsights = existingInsights.slice(-1000);
    }

    await fs.writeFile(insightsFile, JSON.stringify(existingInsights, null, 2));
}

// Check if event is considered "key"
function isKeyEvent(eventType) {
    const keyEvents = [
        'form_submitted',
        'pdf_engagement',
        'emergency_call_clicked',
        'exit_intent',
        'contact_conversion',
        'pdf_download_initiated'
    ];
    return keyEvents.includes(eventType);
}

// Generate unique event ID
function generateEventId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Analytics dashboard data endpoint
export async function getAnalyticsDashboard(req, res) {
    if (req.url === '/api/analytics/dashboard' && req.method === 'GET') {
        return handleDashboardRequest(req, res);
    }
    return res.status(404).json({ error: 'Not found' });
}

async function handleDashboardRequest(req, res) {
    try {
        await ensureAnalyticsDir();

        // Get daily stats
        let dailyStats = {};
        try {
            const data = await fs.readFile(DAILY_STATS_FILE, 'utf8');
            dailyStats = JSON.parse(data);
        } catch (error) {
            // No data yet
        }

        // Get recent insights
        let insights = [];
        try {
            const data = await fs.readFile(path.join(ANALYTICS_DIR, 'insights.json'), 'utf8');
            insights = JSON.parse(data).slice(-50); // Last 50 insights
        } catch (error) {
            // No insights yet
        }

        // Calculate conversion rates
        const today = new Date().toISOString().split('T')[0];
        const todayStats = dailyStats[today] || { conversionEvents: {} };

        const conversionRates = calculateConversionRates(todayStats.conversionEvents);
        const popularChecklists = getPopularChecklists(dailyStats);
        const geographicDistribution = getGeographicDistribution(dailyStats);
        const deviceBreakdown = getDeviceBreakdown(dailyStats);

        res.json({
            dailyStats: dailyStats,
            insights: insights,
            conversionRates: conversionRates,
            popularChecklists: popularChecklists,
            geographicDistribution: geographicDistribution,
            deviceBreakdown: deviceBreakdown,
            lastUpdated: Date.now()
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to get analytics dashboard' });
    }
}

// Calculate conversion rates
function calculateConversionRates(events) {
    const rates = {};

    if (events.page_views > 0) {
        rates.pageToModal = ((events.modal_opens / events.page_views) * 100).toFixed(2);
        rates.pageToForm = ((events.form_submissions / events.page_views) * 100).toFixed(2);
        rates.pageToPDF = ((events.pdf_views / events.page_views) * 100).toFixed(2);
        rates.pageToDownload = ((events.pdf_downloads / events.page_views) * 100).toFixed(2);
        rates.pageToContact = ((events.contact_conversions / events.page_views) * 100).toFixed(2);
    }

    if (events.modal_opens > 0) {
        rates.modalToForm = ((events.form_submissions / events.modal_opens) * 100).toFixed(2);
    }

    if (events.form_submissions > 0) {
        rates.formToPDF = ((events.pdf_views / events.form_submissions) * 100).toFixed(2);
    }

    if (events.pdf_views > 0) {
        rates.pdfToDownload = ((events.pdf_downloads / events.pdf_views) * 100).toFixed(2);
    }

    return rates;
}

// Get popular checklists
function getPopularChecklists(dailyStats) {
    const checklistTotals = {
        fire_damage: 0,
        water_damage: 0,
        document_recovery: 0,
        lightning_strike: 0,
        general: 0
    };

    Object.values(dailyStats).forEach(day => {
        if (day.checklistBreakdown) {
            Object.keys(checklistTotals).forEach(type => {
                checklistTotals[type] += day.checklistBreakdown[type] || 0;
            });
        }
    });

    return Object.entries(checklistTotals)
        .sort(([,a], [,b]) => b - a)
        .map(([type, count]) => ({ type, count }));
}

// Get geographic distribution
function getGeographicDistribution(dailyStats) {
    const zipTotals = {};

    Object.values(dailyStats).forEach(day => {
        if (day.geographicData) {
            Object.entries(day.geographicData).forEach(([zip, count]) => {
                zipTotals[zip] = (zipTotals[zip] || 0) + count;
            });
        }
    });

    return Object.entries(zipTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20) // Top 20 zip codes
        .map(([zip, count]) => ({ zip, count }));
}

// Get device breakdown
function getDeviceBreakdown(dailyStats) {
    const deviceTotals = { mobile: 0, desktop: 0, tablet: 0 };

    Object.values(dailyStats).forEach(day => {
        if (day.deviceBreakdown) {
            Object.keys(deviceTotals).forEach(device => {
                deviceTotals[device] += day.deviceBreakdown[device] || 0;
            });
        }
    });

    return deviceTotals;
}