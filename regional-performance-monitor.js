// ALEX ANALYTICS - Regional Performance Monitor
// Advanced geographic and phone zone tracking across DMV Empire

class RegionalPerformanceMonitor {
    constructor() {
        this.regions = {
            MD: {
                name: 'Maryland Zone',
                phone: '301-215-3191',
                counties: ['Montgomery County', 'Western Maryland'],
                cities: ['Frederick', 'Hagerstown', 'Cumberland', 'Martinsburg'],
                specialties: ['heritage-art', 'civil-war-artifacts', 'german-american-textiles', 'genealogical-records'],
                pages: 22,
                targetAudience: 'rural_heritage_families',
                psychologyTriggers: ['traditional_craftsmanship', 'heritage_preservation', 'family_legacy']
            },
            DC: {
                name: 'Capital District',
                phone: '202-335-4240',
                areas: ['Capitol Hill', 'Georgetown', 'Dupont Circle', 'Adams Morgan', 'Foggy Bottom'],
                specialties: ['diplomatic-collections', 'government-artifacts', 'political-memorabilia', 'federal-documents'],
                pages: 6,
                targetAudience: 'government_professionals',
                psychologyTriggers: ['sophistication', 'federal_standards', 'diplomatic_protocol']
            },
            VA: {
                name: 'Northern Virginia',
                phone: '703-229-1321',
                counties: ['Fairfax County', 'Loudoun County', 'Prince William County'],
                cities: ['Arlington', 'Alexandria', 'Falls Church', 'McLean', 'Vienna', 'Tysons', 'Leesburg', 'Ashburn', 'Sterling'],
                specialties: ['suburban-collections', 'tech-professional-items', 'luxury-designer-pieces', 'metropolitan-art'],
                pages: 29,
                targetAudience: 'affluent_suburban_families',
                psychologyTriggers: ['metropolitan_expertise', 'suburban_sophistication', 'tech_corridor_standards']
            }
        };
        
        this.performanceMetrics = {};
        this.conversionFunnels = {};
        this.regionalStats = {};
    }
    
    // Initialize regional tracking
    initializeRegionalTracking() {
        const currentRegion = this.detectRegion();
        const regionData = this.regions[currentRegion];
        
        if (regionData) {
            this.trackRegionalEntry(currentRegion, regionData);
            this.setupRegionalConversionTracking(currentRegion, regionData);
            this.monitorRegionalPerformance(currentRegion, regionData);
            this.trackPsychologyEffectivenessByRegion(currentRegion, regionData);
        }
    }
    
    // Detect current region from URL and content
    detectRegion() {
        const path = window.location.pathname;
        const title = document.title;
        
        if (path.includes('northern-virginia') || path.includes('fairfax') || path.includes('loudoun') || path.includes('prince-william')) {
            return 'VA';
        } else if (path.includes('washington-dc')) {
            return 'DC';
        } else if (path.includes('western-maryland') || path.includes('montgomery-county')) {
            return 'MD';
        }
        
        // Fallback detection based on phone numbers in content
        const content = document.body.textContent;
        if (content.includes('703-229-1321')) return 'VA';
        if (content.includes('202-335-4240')) return 'DC';
        if (content.includes('301-215-3191')) return 'MD';
        
        return 'UNKNOWN';
    }
    
    // Track regional entry and page classification
    trackRegionalEntry(regionCode, regionData) {
        const pageClassification = this.classifyRegionalPage();
        
        gtag('event', 'regional_entry', {
            region_code: regionCode,
            region_name: regionData.name,
            region_phone: regionData.phone,
            total_region_pages: regionData.pages,
            target_audience: regionData.targetAudience,
            page_classification: pageClassification.type,
            specialty_focus: pageClassification.specialty,
            geography_level: pageClassification.geographyLevel, // state, county, city
            psychology_triggers: regionData.psychologyTriggers.join(','),
            value: 5
        });
        
        // Track regional page depth
        this.trackRegionalPageDepth(regionCode, pageClassification);
    }
    
    // Classify the current page within regional context
    classifyRegionalPage() {
        const path = window.location.pathname;
        const title = document.title;
        
        let type = 'unknown';
        let specialty = 'general';
        let geographyLevel = 'region';
        
        // Determine page type
        if (path.includes('/geographic/')) {
            if (path.includes('/art-collectibles') || path.includes('/textile-fabric') || 
                path.includes('/electronics-data') || path.includes('/document-photo')) {
                type = 'geographic_specialty';
                specialty = this.extractSpecialty(path);
            } else if (path.includes('/fire-damage') || path.includes('/water-damage') || 
                      path.includes('/storm-mold') || path.includes('/emergency')) {
                type = 'geographic_emergency';
                specialty = this.extractDamageType(path);
            } else {
                type = 'geographic_hub';
            }
        } else if (path.includes('/public/')) {
            type = 'public_service';
            specialty = this.extractSpecialty(path);
        }
        
        // Determine geography level
        if (path.includes('-county') || path.includes('fairfax') || path.includes('montgomery')) {
            geographyLevel = 'county';
        } else if (path.includes('washington-dc')) {
            geographyLevel = 'federal_district';
        } else if (path.includes('northern-virginia') || path.includes('western-maryland')) {
            geographyLevel = 'region';
        }
        
        return { type, specialty, geographyLevel };
    }
    
    // Extract specialty from path
    extractSpecialty(path) {
        const specialties = ['art-collectibles', 'textile-fabric', 'electronics-data', 'document-photo'];
        for (let specialty of specialties) {
            if (path.includes(specialty) || path.includes(specialty.replace('-', '_'))) {
                return specialty;
            }
        }
        return 'general';
    }
    
    // Extract damage type from path
    extractDamageType(path) {
        const damageTypes = ['fire-damage', 'water-damage', 'storm-mold', 'emergency'];
        for (let damage of damageTypes) {
            if (path.includes(damage)) {
                return damage;
            }
        }
        return 'none';
    }
    
    // Setup conversion tracking specific to regional characteristics
    setupRegionalConversionTracking(regionCode, regionData) {
        // Track phone calls with regional context
        document.querySelectorAll('a[href^="tel:"]').forEach((phoneLink, index) => {
            phoneLink.addEventListener('click', () => {
                const phoneNumber = phoneLink.href.replace('tel:', '');
                const isCorrectRegionalPhone = phoneNumber.replace(/\D/g, '') === regionData.phone.replace(/\D/g, '');
                
                gtag('event', 'regional_phone_conversion', {
                    region_code: regionCode,
                    region_name: regionData.name,
                    phone_clicked: phoneNumber,
                    expected_phone: regionData.phone,
                    phone_match: isCorrectRegionalPhone,
                    target_audience: regionData.targetAudience,
                    conversion_value: isCorrectRegionalPhone ? 75 : 35,
                    regional_optimization: 'active'
                });
                
                // Track regional conversion funnel
                this.trackRegionalConversionFunnel(regionCode, 'phone_click', {
                    phoneMatch: isCorrectRegionalPhone,
                    audience: regionData.targetAudience
                });
            });
        });
        
        // Track regional CTA effectiveness
        document.querySelectorAll('.btn').forEach((button, index) => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent.trim();
                const isEmergency = buttonText.toLowerCase().includes('emergency');
                const isPrimary = button.classList.contains('btn-primary');
                
                gtag('event', 'regional_cta_conversion', {
                    region_code: regionCode,
                    region_name: regionData.name,
                    button_text: buttonText,
                    is_emergency: isEmergency,
                    is_primary: isPrimary,
                    target_audience: regionData.targetAudience,
                    regional_specialty_focus: this.getRegionalSpecialtyFocus(regionCode),
                    value: this.calculateRegionalCTAValue(regionCode, isEmergency, isPrimary)
                });
            });
        });
    }
    
    // Get regional specialty focus
    getRegionalSpecialtyFocus(regionCode) {
        const regionData = this.regions[regionCode];
        return regionData ? regionData.specialties[0] : 'unknown';
    }
    
    // Calculate regional CTA value based on region and button type
    calculateRegionalCTAValue(regionCode, isEmergency, isPrimary) {
        const baseValue = isPrimary ? 15 : 8;
        const emergencyMultiplier = isEmergency ? 1.5 : 1;
        
        // Regional value modifiers
        const regionalMultipliers = {
            'VA': 1.2, // Higher value for affluent Northern Virginia
            'DC': 1.3, // Highest value for government professionals
            'MD': 1.0  // Base value for rural Maryland
        };
        
        const regionalMultiplier = regionalMultipliers[regionCode] || 1.0;
        return Math.round(baseValue * emergencyMultiplier * regionalMultiplier);
    }
    
    // Monitor regional performance metrics
    monitorRegionalPerformance(regionCode, regionData) {
        const startTime = performance.now();
        
        window.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            const meetsFuneralDirectorStandard = loadTime < 542;
            
            gtag('event', 'regional_performance_analysis', {
                region_code: regionCode,
                region_name: regionData.name,
                load_time: Math.round(loadTime),
                meets_funeral_director_standard: meetsFuneralDirectorStandard,
                target_audience: regionData.targetAudience,
                pages_in_region: regionData.pages,
                performance_rating: this.calculatePerformanceRating(loadTime, regionCode),
                regional_optimization_active: true
            });
            
            // Track regional user experience quality
            this.trackRegionalUXQuality(regionCode, regionData, {
                loadTime: loadTime,
                meetsFuneralDirectorStandard: meetsFuneralDirectorStandard
            });
        });
    }
    
    // Calculate performance rating based on region and load time
    calculatePerformanceRating(loadTime, regionCode) {
        // Different performance expectations by region
        const regionalStandards = {
            'VA': 500, // Tech corridor expects faster performance
            'DC': 520, // Government users expect reliability
            'MD': 542  // Rural users more tolerant of slower speeds
        };
        
        const standard = regionalStandards[regionCode] || 542;
        
        if (loadTime < standard * 0.8) return 'excellent';
        if (loadTime < standard) return 'good';
        if (loadTime < standard * 1.2) return 'acceptable';
        return 'needs_improvement';
    }
    
    // Track regional user experience quality
    trackRegionalUXQuality(regionCode, regionData, performanceData) {
        const funeralMentions = this.countFuneralDirectorMentions();
        const authorityElements = document.querySelectorAll('.authority-reversal').length;
        const psychologyDensity = funeralMentions / document.body.textContent.split(' ').length * 1000;
        
        gtag('event', 'regional_ux_quality', {
            region_code: regionCode,
            region_name: regionData.name,
            performance_rating: this.calculatePerformanceRating(performanceData.loadTime, regionCode),
            funeral_mentions: funeralMentions,
            authority_elements: authorityElements,
            psychology_density: psychologyDensity.toFixed(2),
            target_audience_alignment: this.assessTargetAudienceAlignment(regionCode),
            regional_specialties_present: this.checkRegionalSpecialties(regionCode),
            ux_optimization_score: this.calculateUXScore(performanceData, funeralMentions, authorityElements)
        });
    }
    
    // Count funeral director mentions
    countFuneralDirectorMentions() {
        const content = document.body.textContent.toLowerCase();
        const matches = content.match(/funeral director/g);
        return matches ? matches.length : 0;
    }
    
    // Assess how well page aligns with target audience
    assessTargetAudienceAlignment(regionCode) {
        const regionData = this.regions[regionCode];
        const content = document.body.textContent.toLowerCase();
        
        let alignmentScore = 0;
        const triggers = regionData.psychologyTriggers;
        
        triggers.forEach(trigger => {
            const triggerWords = trigger.replace('_', ' ').split(' ');
            triggerWords.forEach(word => {
                if (content.includes(word.toLowerCase())) {
                    alignmentScore++;
                }
            });
        });
        
        return alignmentScore > triggers.length ? 'high' : 
               alignmentScore > 0 ? 'medium' : 'low';
    }
    
    // Check if regional specialties are present
    checkRegionalSpecialties(regionCode) {
        const regionData = this.regions[regionCode];
        const content = document.body.textContent.toLowerCase();
        
        return regionData.specialties.some(specialty => 
            content.includes(specialty.replace('-', ' ').toLowerCase())
        );
    }
    
    // Calculate overall UX score
    calculateUXScore(performanceData, funeralMentions, authorityElements) {
        let score = 0;
        
        // Performance score (40 points max)
        if (performanceData.meetsFuneralDirectorStandard) score += 40;
        else score += Math.max(0, 40 - (performanceData.loadTime - 542) / 10);
        
        // Psychology implementation score (40 points max)
        score += Math.min(40, funeralMentions * 5 + authorityElements * 3);
        
        // Content quality score (20 points max)
        const contentScore = Math.min(20, document.body.textContent.split(' ').length / 50);
        score += contentScore;
        
        return Math.round(Math.min(100, score));
    }
    
    // Track psychology effectiveness by region
    trackPsychologyEffectivenessByRegion(regionCode, regionData) {
        // Track authority reversal interactions with regional context
        document.querySelectorAll('.authority-reversal').forEach((element, index) => {
            element.addEventListener('click', () => {
                const authorityText = element.textContent;
                const hasFuneralDirector = authorityText.toLowerCase().includes('funeral director');
                
                gtag('event', 'regional_psychology_effectiveness', {
                    region_code: regionCode,
                    region_name: regionData.name,
                    element_index: index,
                    has_funeral_director: hasFuneralDirector,
                    authority_text_length: authorityText.length,
                    target_audience: regionData.targetAudience,
                    psychology_trigger_type: this.identifyPsychologyTrigger(authorityText, regionData),
                    effectiveness_rating: this.ratePsychologyEffectiveness(authorityText, regionData),
                    value: 12
                });
            });
        });
    }
    
    // Identify psychology trigger type
    identifyPsychologyTrigger(text, regionData) {
        const lowerText = text.toLowerCase();
        
        for (let trigger of regionData.psychologyTriggers) {
            const triggerWords = trigger.replace('_', ' ').split(' ');
            if (triggerWords.some(word => lowerText.includes(word))) {
                return trigger;
            }
        }
        
        return 'general_authority';
    }
    
    // Rate psychology effectiveness
    ratePsychologyEffectiveness(text, regionData) {
        const lowerText = text.toLowerCase();
        let score = 0;
        
        // Check for funeral director mention (high impact)
        if (lowerText.includes('funeral director')) score += 3;
        
        // Check for regional psychology triggers
        regionData.psychologyTriggers.forEach(trigger => {
            const triggerWords = trigger.replace('_', ' ').split(' ');
            if (triggerWords.some(word => lowerText.includes(word))) {
                score += 2;
            }
        });
        
        // Check for question format (authority reversal)
        if (lowerText.includes('would you')) score += 2;
        if (lowerText.includes('?')) score += 1;
        
        if (score >= 6) return 'high';
        if (score >= 3) return 'medium';
        return 'low';
    }
    
    // Track regional conversion funnel
    trackRegionalConversionFunnel(regionCode, eventType, eventData) {
        if (!this.conversionFunnels[regionCode]) {
            this.conversionFunnels[regionCode] = [];
        }
        
        this.conversionFunnels[regionCode].push({
            timestamp: Date.now(),
            event: eventType,
            data: eventData
        });
        
        // Report funnel progression
        gtag('event', 'regional_conversion_funnel', {
            region_code: regionCode,
            funnel_step: eventType,
            steps_completed: this.conversionFunnels[regionCode].length,
            funnel_data: JSON.stringify(eventData),
            conversion_progress: this.calculateConversionProgress(regionCode)
        });
    }
    
    // Calculate conversion progress
    calculateConversionProgress(regionCode) {
        const steps = this.conversionFunnels[regionCode] || [];
        const uniqueSteps = [...new Set(steps.map(step => step.event))];
        
        const totalPossibleSteps = ['page_view', 'authority_click', 'phone_click', 'cta_click'];
        const completionRate = (uniqueSteps.length / totalPossibleSteps.length * 100).toFixed(1);
        
        return `${completionRate}%`;
    }
    
    // Track regional page depth and navigation
    trackRegionalPageDepth(regionCode, pageClassification) {
        const currentDepth = this.calculatePageDepth();
        
        gtag('event', 'regional_page_depth', {
            region_code: regionCode,
            page_depth: currentDepth,
            page_type: pageClassification.type,
            specialty: pageClassification.specialty,
            geography_level: pageClassification.geographyLevel,
            navigation_pattern: this.getNavigationPattern(),
            engagement_level: this.calculateEngagementLevel(currentDepth)
        });
    }
    
    // Calculate page depth based on URL structure
    calculatePageDepth() {
        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        return pathSegments.length;
    }
    
    // Get navigation pattern
    getNavigationPattern() {
        // This would track how user navigated to this page
        const referrer = document.referrer;
        if (referrer.includes(window.location.hostname)) {
            return 'internal_navigation';
        } else if (referrer) {
            return 'external_referral';
        } else {
            return 'direct_access';
        }
    }
    
    // Calculate engagement level based on page depth
    calculateEngagementLevel(depth) {
        if (depth >= 4) return 'high_engagement';
        if (depth >= 3) return 'medium_engagement';
        return 'low_engagement';
    }
}

// Initialize Regional Performance Monitor
const regionalMonitor = new RegionalPerformanceMonitor();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        regionalMonitor.initializeRegionalTracking();
    });
} else {
    regionalMonitor.initializeRegionalTracking();
}

// Export for global access
window.RegionalPerformanceMonitor = regionalMonitor;