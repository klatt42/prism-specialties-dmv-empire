/**
 * Victoria Hook Point Validator
 * Comprehensive testing suite for Hook Point A/B testing implementation
 * Tests CSS/JS linking, variant rotation, analytics, and phone CTAs
 */

class VictoriaValidator {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.expectedPhone = '703-229-1321';
        this.updatedPages = [
            '/public/index.html',
            '/public/montgomery-county/electronics-restoration/index.html',
            '/public/montgomery-county/art-restoration/index.html',
            '/public/montgomery-county/textile-restoration/index.html',
            '/public/loudoun-county/electronics-restoration/index.html',
            '/public/loudoun-county/art-restoration/index.html',
            '/public/prince-william-county/electronics-restoration/index.html',
            '/public/prince-william-county/art-restoration/index.html',
            '/public/washington-dc/index.html',
            '/public/western-maryland/electronics-restoration/index.html',
            '/public/northern-virginia/electronics-restoration/index.html'
        ];
        
        this.startTime = Date.now();
        this.mockAnalytics = this.setupMockAnalytics();
    }

    // Setup mock Google Analytics for testing
    setupMockAnalytics() {
        const mockGtag = {
            events: [],
            track: function(event, eventName, parameters) {
                this.events.push({ event, eventName, parameters, timestamp: Date.now() });
            }
        };
        
        // Mock gtag function
        if (typeof window !== 'undefined') {
            window.gtag = (event, eventName, parameters) => {
                mockGtag.track(event, eventName, parameters);
            };
        }
        
        return mockGtag;
    }

    // Main validation runner
    async runAllValidations() {
        console.log('🔍 VICTORIA HOOK POINT VALIDATOR STARTING...');
        console.log('================================================');
        
        await this.validateCSSJSLinks();
        await this.validateABVariantRotation();
        await this.validateAnalyticsTracking();
        await this.validatePhoneCTAs();
        await this.validateHookPointContainers();
        await this.validateFileStructure();
        
        this.generateFinalReport();
        return this.getTestSummary();
    }

    // Test 1: Validate CSS and JS file links in updated pages
    async validateCSSJSLinks() {
        this.logTestStart('CSS/JS Link Validation');
        
        for (const pagePath of this.updatedPages) {
            const fullPath = `/home/klatt42/prism-specialties-dmv-empire${pagePath}`;
            
            try {
                // Check if file exists
                const fileExists = await this.checkFileExists(fullPath);
                if (!fileExists) {
                    this.recordTest(`File exists: ${pagePath}`, false, `File not found: ${fullPath}`);
                    continue;
                }
                
                // Read file content
                const content = await this.readFileContent(fullPath);
                
                // Check CSS link
                const hasCSSLink = this.checkCSSLink(content, pagePath);
                this.recordTest(`CSS Link: ${pagePath}`, hasCSSLink, 
                    hasCSSLink ? 'emergency-alerts.css properly linked' : 'emergency-alerts.css link missing');
                
                // Check JS script
                const hasJSScript = this.checkJSScript(content, pagePath);
                this.recordTest(`JS Script: ${pagePath}`, hasJSScript, 
                    hasJSScript ? 'hook-point-testing.js properly linked' : 'hook-point-testing.js script missing');
                
            } catch (error) {
                this.recordTest(`File validation: ${pagePath}`, false, `Error: ${error.message}`);
            }
        }
    }

    // Test 2: Validate A/B variant rotation
    async validateABVariantRotation() {
        this.logTestStart('A/B Variant Rotation Testing');
        
        // Test variant selection logic
        const variants = ['A', 'B', 'C'];
        const variantCounts = { A: 0, B: 0, C: 0 };
        const testRuns = 300; // Run multiple times to test distribution
        
        // Clear session storage for clean test
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('hookpoint_variant');
        }
        
        // Simulate variant selection multiple times
        for (let i = 0; i < testRuns; i++) {
            const random = Math.random();
            let selectedVariant;
            
            if (random < 0.333) {
                selectedVariant = 'A';
            } else if (random < 0.666) {
                selectedVariant = 'B';
            } else {
                selectedVariant = 'C';
            }
            
            variantCounts[selectedVariant]++;
        }
        
        // Test distribution (should be roughly 33.3% each)
        const tolerance = 0.1; // 10% tolerance
        for (const variant of variants) {
            const percentage = variantCounts[variant] / testRuns;
            const isWithinTolerance = Math.abs(percentage - 0.333) < tolerance;
            
            this.recordTest(`Variant ${variant} Distribution`, isWithinTolerance, 
                `${variant}: ${(percentage * 100).toFixed(1)}% (expected ~33.3%)`);
        }
        
        // Test session storage persistence
        const testVariant = 'A';
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('hookpoint_variant', testVariant);
            const storedVariant = sessionStorage.getItem('hookpoint_variant');
            this.recordTest('Session Storage Persistence', storedVariant === testVariant,
                storedVariant === testVariant ? 'Variant properly stored and retrieved' : 'Session storage failed');
        }
    }

    // Test 3: Validate Google Analytics tracking events
    async validateAnalyticsTracking() {
        this.logTestStart('Google Analytics Tracking Validation');
        
        // Clear previous events
        this.mockAnalytics.events = [];
        
        // Test hook_point_view event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'hook_point_view', {
                variant: 'A',
                page_category: 'homepage'
            });
            
            const viewEvent = this.mockAnalytics.events.find(e => e.eventName === 'hook_point_view');
            this.recordTest('hook_point_view Event', !!viewEvent,
                viewEvent ? 'Event fired successfully' : 'Event not fired');
        }
        
        // Test hook_point_conversion event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'hook_point_conversion', {
                variant: 'B',
                conversion_type: 'phone_click',
                page_category: 'service_page'
            });
            
            const conversionEvent = this.mockAnalytics.events.find(e => e.eventName === 'hook_point_conversion');
            this.recordTest('hook_point_conversion Event', !!conversionEvent,
                conversionEvent ? 'Event fired successfully' : 'Event not fired');
        }
        
        // Test phone_click event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'phone_click', {
                phone_number: this.expectedPhone,
                variant: 'C'
            });
            
            const phoneEvent = this.mockAnalytics.events.find(e => e.eventName === 'phone_click');
            this.recordTest('phone_click Event', !!phoneEvent,
                phoneEvent ? 'Event fired successfully' : 'Event not fired');
        }
        
        // Test scroll_depth event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_depth', {
                scroll_depth: 50,
                variant: 'A'
            });
            
            const scrollEvent = this.mockAnalytics.events.find(e => e.eventName === 'scroll_depth');
            this.recordTest('scroll_depth Event', !!scrollEvent,
                scrollEvent ? 'Event fired successfully' : 'Event not fired');
        }
        
        // Test total events tracked
        const totalEvents = this.mockAnalytics.events.length;
        this.recordTest('Total Analytics Events', totalEvents >= 4,
            `${totalEvents} events tracked (expected >= 4)`);
    }

    // Test 4: Validate phone CTAs
    async validatePhoneCTAs() {
        this.logTestStart('Phone CTA Validation');
        
        for (const pagePath of this.updatedPages) {
            const fullPath = `/home/klatt42/prism-specialties-dmv-empire${pagePath}`;
            
            try {
                const content = await this.readFileContent(fullPath);
                
                // Check for phone links with correct number
                const phoneLinks = this.extractPhoneLinks(content);
                const correctPhoneLinks = phoneLinks.filter(link => 
                    link.includes(this.expectedPhone.replace(/\D/g, ''))
                );
                
                this.recordTest(`Phone Links: ${pagePath}`, phoneLinks.length > 0,
                    `Found ${phoneLinks.length} phone link(s)`);
                
                this.recordTest(`Correct Phone Number: ${pagePath}`, correctPhoneLinks.length > 0,
                    correctPhoneLinks.length > 0 ? 
                    `${correctPhoneLinks.length} link(s) with ${this.expectedPhone}` : 
                    'No links with correct phone number');
                
                // Check for clickable phone buttons/CTAs
                const phoneButtons = this.extractPhoneButtons(content);
                this.recordTest(`Phone CTAs: ${pagePath}`, phoneButtons.length > 0,
                    `Found ${phoneButtons.length} phone CTA(s)`);
                
            } catch (error) {
                this.recordTest(`Phone CTA validation: ${pagePath}`, false, `Error: ${error.message}`);
            }
        }
    }

    // Test 5: Validate Hook Point containers
    async validateHookPointContainers() {
        this.logTestStart('Hook Point Container Validation');
        
        for (const pagePath of this.updatedPages) {
            const fullPath = `/home/klatt42/prism-specialties-dmv-empire${pagePath}`;
            
            try {
                const content = await this.readFileContent(fullPath);
                
                // Check for hook-point-container div
                const hasContainer = content.includes('hook-point-container') || 
                                   content.includes('id="hook-point-container"');
                
                // Check for hook-point classes
                const hasHookPointClass = content.includes('hook-point') || 
                                         content.includes('class="hook-point"');
                
                // Check for data-variant attributes
                const hasVariantData = content.includes('data-variant') ||
                                      content.includes('data-hook-type');
                
                this.recordTest(`Hook Point Container: ${pagePath}`, hasContainer || hasHookPointClass,
                    hasContainer ? 'Hook point container found' : 
                    hasHookPointClass ? 'Hook point class found' : 'No hook point elements');
                
                this.recordTest(`Hook Point Data Attributes: ${pagePath}`, hasVariantData,
                    hasVariantData ? 'Data attributes present' : 'No data attributes found');
                
            } catch (error) {
                this.recordTest(`Hook Point container validation: ${pagePath}`, false, `Error: ${error.message}`);
            }
        }
    }

    // Test 6: Validate file structure
    async validateFileStructure() {
        this.logTestStart('File Structure Validation');
        
        const requiredFiles = [
            '/home/klatt42/prism-specialties-dmv-empire/css/emergency-alerts.css',
            '/home/klatt42/prism-specialties-dmv-empire/js/hook-point-testing.js',
            '/home/klatt42/prism-specialties-dmv-empire/js/blog-navigation.js',
            '/home/klatt42/prism-specialties-dmv-empire/analytics-enhanced.js',
            '/home/klatt42/prism-specialties-dmv-empire/llms.txt'
        ];
        
        for (const filePath of requiredFiles) {
            const exists = await this.checkFileExists(filePath);
            const fileName = filePath.split('/').pop();
            
            this.recordTest(`File Exists: ${fileName}`, exists,
                exists ? 'File found' : 'File missing');
        }
    }

    // Helper Methods
    async checkFileExists(filePath) {
        try {
            // In Node.js environment
            if (typeof require !== 'undefined') {
                const fs = require('fs').promises;
                await fs.access(filePath);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    async readFileContent(filePath) {
        try {
            // In Node.js environment
            if (typeof require !== 'undefined') {
                const fs = require('fs').promises;
                return await fs.readFile(filePath, 'utf8');
            }
            return '';
        } catch (error) {
            throw new Error(`Cannot read file: ${error.message}`);
        }
    }

    checkCSSLink(content, pagePath) {
        const expectedPath = pagePath === '/public/index.html' ? 
            'css/emergency-alerts.css' : 
            '../css/emergency-alerts.css';
        
        return content.includes(expectedPath) || content.includes('emergency-alerts.css');
    }

    checkJSScript(content, pagePath) {
        const expectedPath = pagePath === '/public/index.html' ? 
            'js/hook-point-testing.js' : 
            '../js/hook-point-testing.js';
        
        return content.includes(expectedPath) || content.includes('hook-point-testing.js');
    }

    extractPhoneLinks(content) {
        const phoneRegex = /href="tel:([^"]+)"/g;
        const matches = [];
        let match;
        
        while ((match = phoneRegex.exec(content)) !== null) {
            matches.push(match[1]);
        }
        
        return matches;
    }

    extractPhoneButtons(content) {
        const buttonRegex = /<a[^>]*href="tel:[^"]*"[^>]*>.*?<\/a>|<button[^>]*onclick=".*tel:.*"[^>]*>/gi;
        return content.match(buttonRegex) || [];
    }

    // Recording and Reporting Methods
    recordTest(testName, passed, details) {
        this.totalTests++;
        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }
        
        this.testResults.push({
            name: testName,
            passed,
            details,
            timestamp: Date.now()
        });
    }

    logTestStart(category) {
        console.log(`\n🧪 Testing: ${category}`);
        console.log('─'.repeat(50));
    }

    generateFinalReport() {
        const duration = Date.now() - this.startTime;
        const passRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
        
        console.log('\n' + '='.repeat(60));
        console.log('📋 VICTORIA VALIDATOR FINAL REPORT');
        console.log('='.repeat(60));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📊 Total Tests: ${this.totalTests}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        
        console.log('\n📝 DETAILED RESULTS:');
        console.log('─'.repeat(60));
        
        // Group results by category
        const categories = {};
        this.testResults.forEach(result => {
            const category = result.name.split(':')[0].split(' ')[0];
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(result);
        });
        
        Object.entries(categories).forEach(([category, tests]) => {
            console.log(`\n🏷️  ${category.toUpperCase()}`);
            tests.forEach(test => {
                const status = test.passed ? '✅ PASS' : '❌ FAIL';
                console.log(`   ${status} ${test.name}`);
                if (test.details) {
                    console.log(`      └─ ${test.details}`);
                }
            });
        });
        
        // Overall status
        console.log('\n' + '='.repeat(60));
        if (this.failedTests === 0) {
            console.log('🎉 ALL TESTS PASSED! Hook Point implementation is valid.');
        } else if (passRate >= 80) {
            console.log('⚠️  MOSTLY PASSING - Some issues need attention.');
        } else {
            console.log('🚨 CRITICAL ISSUES - Hook Point implementation needs fixes.');
        }
        console.log('='.repeat(60));
    }

    getTestSummary() {
        return {
            totalTests: this.totalTests,
            passedTests: this.passedTests,
            failedTests: this.failedTests,
            passRate: ((this.passedTests / this.totalTests) * 100).toFixed(1),
            duration: Date.now() - this.startTime,
            results: this.testResults
        };
    }
}

// Auto-run validation if in browser environment
if (typeof window !== 'undefined') {
    window.VictoriaValidator = VictoriaValidator;
    
    // Run validation on page load
    document.addEventListener('DOMContentLoaded', async () => {
        const validator = new VictoriaValidator();
        await validator.runAllValidations();
    });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VictoriaValidator;
}

// CLI usage
if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const validator = new VictoriaValidator();
        const summary = await validator.runAllValidations();
        process.exit(summary.failedTests > 0 ? 1 : 0);
    })();
}