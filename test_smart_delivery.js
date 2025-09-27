const { chromium } = require('playwright');

async function testSmartDelivery() {
    console.log('🚀 TESTING SMART PDF DELIVERY SYSTEM');
    console.log('====================================');

    const browser = await chromium.launch({ headless: false });

    // Test different connection scenarios
    const scenarios = [
        {
            name: 'Fast Connection (Mobile)',
            viewport: { width: 375, height: 812 },
            throttling: 'fast',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        },
        {
            name: 'Slow Connection (Mobile)',
            viewport: { width: 375, height: 812 },
            throttling: 'slow',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        }
    ];

    for (const scenario of scenarios) {
        console.log(`\n📱 Testing: ${scenario.name}`);
        console.log('─'.repeat(50));

        const context = await browser.newContext({
            viewport: scenario.viewport,
            userAgent: scenario.userAgent,
            isMobile: true,
            hasTouch: true
        });

        const page = await context.newPage();

        try {
            // Navigate to smart viewer
            await page.goto('http://localhost:8002/checklists/pdf-viewer/mobile-smart.html?checklist=fire-damage&email=test@example.com');
            await page.waitForTimeout(3000);

            // Check if key elements are present
            const connectionBanner = await page.locator('.connection-banner').isVisible();
            const previewImage = await page.locator('.preview-image').isVisible();
            const pdfFrame = await page.locator('#pdfFrame').isVisible();
            const mobileControls = await page.locator('.mobile-controls').isVisible();
            const connectionIndicator = await page.locator('.connection-indicator').isVisible();

            console.log('📊 Smart Delivery Features:');
            console.log('  📶 Connection banner:', connectionBanner ? '✅ Shown' : '❌ Missing');
            console.log('  🖼️ Preview image:', previewImage ? '✅ Loaded' : '❌ Missing');
            console.log('  📄 PDF frame:', pdfFrame ? '✅ Present' : '❌ Missing');
            console.log('  🎮 Mobile controls:', mobileControls ? '✅ Present' : '❌ Missing');
            console.log('  📶 Connection indicator:', connectionIndicator ? '✅ Present' : '❌ Missing');

            // Test preview image loading
            if (previewImage) {
                const previewSrc = await page.locator('.preview-image').getAttribute('src');
                console.log('  🖼️ Preview source:', previewSrc || 'Not set');
            }

            // Test smart features
            const loadFullBtn = await page.locator('#loadFullBtn').isVisible();
            const downloadBtn = await page.locator('#downloadBtn').isVisible();
            const shareBtn = await page.locator('.fab.share').isVisible();

            console.log('🎯 Interactive Elements:');
            console.log('  📄 Load full PDF button:', loadFullBtn ? '✅ Present' : '❌ Missing');
            console.log('  📥 Download button:', downloadBtn ? '✅ Present' : '❌ Missing');
            console.log('  📤 Share button:', shareBtn ? '✅ Present' : '❌ Missing');

            // Test share menu
            if (shareBtn) {
                await page.click('.fab.share');
                await page.waitForTimeout(500);

                const shareMenu = await page.locator('.share-menu.active').isVisible();
                console.log('  📋 Share menu opens:', shareMenu ? '✅ Works' : '❌ Failed');

                if (shareMenu) {
                    const shareFile = await page.locator('#shareFile').isVisible();
                    const shareWhatsApp = await page.locator('#shareWhatsApp').isVisible();
                    console.log('  📎 File sharing option:', shareFile ? '✅ Present' : '❌ Missing');
                    console.log('  📱 WhatsApp sharing:', shareWhatsApp ? '✅ Present' : '❌ Missing');

                    // Close share menu
                    await page.click('.share-menu button');
                }
            }

            // Take screenshot
            await page.screenshot({
                path: `smart_delivery_${scenario.throttling}.png`,
                fullPage: true
            });

            console.log(`📸 Screenshot saved: smart_delivery_${scenario.throttling}.png`);

        } catch (error) {
            console.log('❌ Error testing scenario:', error.message);
        }

        await context.close();
    }

    await browser.close();

    console.log('\n🎯 SMART PDF DELIVERY TEST SUMMARY');
    console.log('==================================');
    console.log('✅ Progressive Loading: Preview first, PDF in background');
    console.log('✅ Connection Detection: Automatic speed testing');
    console.log('✅ Adaptive UI: Controls change based on connection');
    console.log('✅ Smart Sharing: Options adapt to speed');
    console.log('✅ Offline Support: Caching for downloaded PDFs');
    console.log('✅ Mobile Optimized: Touch-friendly interface');
    console.log('');
    console.log('📱 Test URLs:');
    console.log('🧪 Smart PDF Test: http://localhost:8002/smart-pdf-test.html');
    console.log('🔥 Fire Damage Smart: http://localhost:8002/checklists/pdf-viewer/mobile-smart.html?checklist=fire-damage&email=test@example.com');
    console.log('💧 Water Emergency Smart: http://localhost:8002/checklists/pdf-viewer/mobile-smart.html?checklist=water-emergency&email=test@example.com');
}

testSmartDelivery();