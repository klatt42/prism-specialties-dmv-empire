const { chromium } = require('playwright');

async function testLocalhostAccess() {
    console.log('🌐 TESTING LOCALHOST ACCESS TO MOBILE VIEWER');
    console.log('============================================');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Test if we can access the test page
        console.log('\n📄 Testing access to mobile-test.html...');
        await page.goto('http://localhost:8002/mobile-test.html');
        await page.waitForTimeout(2000);

        const pageTitle = await page.title();
        console.log('✅ Test page loaded:', pageTitle);

        // Test direct mobile viewer access
        console.log('\n📱 Testing direct mobile viewer access...');
        await page.goto('http://localhost:8002/checklists/pdf-viewer/mobile.html?checklist=fire-damage&email=test@example.com');
        await page.waitForTimeout(3000);

        const mobileTitle = await page.title();
        console.log('📱 Mobile viewer title:', mobileTitle);

        // Check if main elements load
        const headerExists = await page.locator('.mobile-header').count() > 0;
        const controlsExists = await page.locator('.mobile-controls').count() > 0;
        const pdfFrameExists = await page.locator('#pdfFrame').count() > 0;

        console.log('📱 Mobile header:', headerExists ? '✅ Loaded' : '❌ Missing');
        console.log('🎮 Mobile controls:', controlsExists ? '✅ Loaded' : '❌ Missing');
        console.log('📄 PDF frame:', pdfFrameExists ? '✅ Loaded' : '❌ Missing');

        if (headerExists && controlsExists && pdfFrameExists) {
            console.log('\n🎉 SUCCESS: Mobile viewer is accessible!');
        } else {
            console.log('\n❌ ISSUE: Some elements are missing');
        }

        // Take a screenshot for verification
        await page.screenshot({
            path: 'localhost_mobile_test.png',
            fullPage: true
        });
        console.log('📸 Screenshot saved as localhost_mobile_test.png');

    } catch (error) {
        console.log('❌ Error accessing localhost:', error.message);
        console.log('\n🔧 TROUBLESHOOTING:');
        console.log('1. Make sure your server is running on localhost:8002');
        console.log('2. Try accessing: http://localhost:8002/mobile-test.html');
        console.log('3. Check if the public folder is being served correctly');
    }

    await browser.close();

    console.log('\n📋 DIRECT URLs TO TRY:');
    console.log('=====================');
    console.log('🧪 Test Page: http://localhost:8002/mobile-test.html');
    console.log('📱 Mobile Viewer: http://localhost:8002/checklists/pdf-viewer/mobile.html?checklist=fire-damage&email=test@example.com');
    console.log('📝 FAQ Form: http://localhost:8002/faq.html');
    console.log('🔥 Fire Checklist Form: http://localhost:8002/checklists/fire-damage-emergency-checklist.html');
}

testLocalhostAccess();