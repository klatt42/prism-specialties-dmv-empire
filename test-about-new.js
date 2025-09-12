const { chromium } = require('playwright');

async function testNewAboutUsPage() {
    console.log('🎭 Testing new About Us page...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('file:///home/klatt42/prism-specialties-dmv-empire/public/about-us-new.html');
        await page.waitForLoadState('networkidle');
        
        // Take screenshot
        await page.screenshot({ 
            path: 'about-us-new-full.png', 
            fullPage: true 
        });
        
        // Check logo
        const logo = await page.locator('.logo img');
        if (await logo.count() > 0) {
            await logo.screenshot({ path: 'about-us-new-logo.png' });
            
            const logoInfo = await logo.evaluate(el => ({
                width: el.clientWidth,
                height: el.clientHeight,
                naturalWidth: el.naturalWidth,
                naturalHeight: el.naturalHeight,
                src: el.src
            }));
            
            console.log('📏 New page logo info:', JSON.stringify(logoInfo, null, 2));
        }
        
        console.log('✅ New About Us page screenshots saved!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

testNewAboutUsPage().catch(console.error);