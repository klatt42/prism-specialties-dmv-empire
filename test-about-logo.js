const { chromium } = require('playwright');

async function testAboutUsLogo() {
    console.log('🎭 Starting Playwright test for About Us logo...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Navigate to About Us page
        console.log('📄 Navigating to About Us page...');
        await page.goto('file:///home/klatt42/prism-specialties-dmv-empire/public/about-us.html');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Take screenshot of full page
        console.log('📸 Taking full page screenshot...');
        await page.screenshot({ 
            path: 'about-us-full.png', 
            fullPage: true 
        });
        
        // Take screenshot of just the header section
        console.log('📸 Taking header screenshot...');
        const header = await page.locator('header');
        await header.screenshot({ path: 'about-us-header.png' });
        
        // Take screenshot of just the logo
        console.log('📸 Taking logo screenshot...');
        const logo = await page.locator('.logo img');
        if (await logo.count() > 0) {
            await logo.screenshot({ path: 'about-us-logo.png' });
            
            // Get logo dimensions and styling info
            const logoInfo = await logo.evaluate(el => ({
                width: el.clientWidth,
                height: el.clientHeight,
                naturalWidth: el.naturalWidth,
                naturalHeight: el.naturalHeight,
                style: {
                    height: el.style.height,
                    width: el.style.width,
                    clipPath: el.style.clipPath
                },
                computedStyle: window.getComputedStyle(el).clipPath
            }));
            
            console.log('📏 Logo info:', JSON.stringify(logoInfo, null, 2));
        }
        
        console.log('✅ Screenshots saved successfully!');
        console.log('📁 Files created:');
        console.log('  - about-us-full.png (full page)');
        console.log('  - about-us-header.png (header only)');
        console.log('  - about-us-logo.png (logo only)');
        
    } catch (error) {
        console.error('❌ Error during screenshot:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
testAboutUsLogo().catch(console.error);