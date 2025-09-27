const { chromium } = require('playwright');

async function testLogoDisplay() {
    console.log('🔍 TESTING LOGO DISPLAY IN PDF CHECKLISTS');
    console.log('==========================================');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Test a sample checklist
    const testUrl = 'file://' + process.cwd() + '/public/checklists/assets/pdfs/fire-damage-first-48-hours.html';

    try {
        await page.goto(testUrl);

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Check if logo image exists and is loaded
        const logoImage = await page.locator('.logo-image').first();
        const logoExists = await logoImage.count() > 0;

        console.log('✅ Logo element exists:', logoExists);

        if (logoExists) {
            // Check if image actually loaded
            const naturalWidth = await logoImage.evaluate(img => img.naturalWidth);
            const naturalHeight = await logoImage.evaluate(img => img.naturalHeight);
            const src = await logoImage.getAttribute('src');

            console.log('📷 Image src:', src);
            console.log('📏 Natural dimensions:', `${naturalWidth}x${naturalHeight}`);
            console.log('🖼️ Image loaded successfully:', naturalWidth > 0 && naturalHeight > 0);

            if (naturalWidth === 0 || naturalHeight === 0) {
                console.log('❌ IMAGE FAILED TO LOAD - checking path issues');

                // Test different paths
                const testPaths = [
                    '../../images/logos/prism-logo-1000.png',
                    '../../../images/logos/prism-logo-1000.png',
                    '../../../../images/logos/prism-logo-1000.png',
                    '/public/images/logos/prism-logo-1000.png'
                ];

                console.log('🔍 Testing different paths:');
                for (let path of testPaths) {
                    try {
                        await page.goto('about:blank');
                        await page.setContent(`
                            <html>
                                <body>
                                    <img src="${path}" style="height: 85px; width: auto;" onload="console.log('LOADED: ${path}')" onerror="console.log('ERROR: ${path}')">
                                </body>
                            </html>
                        `);
                        await page.waitForTimeout(1000);

                        const testImg = await page.locator('img').first();
                        const testWidth = await testImg.evaluate(img => img.naturalWidth);
                        console.log(`   ${path}: ${testWidth > 0 ? '✅ WORKS' : '❌ FAILS'}`);
                    } catch (e) {
                        console.log(`   ${path}: ❌ ERROR`);
                    }
                }
            }
        }

        // Take a screenshot for visual confirmation
        await page.goto(testUrl);
        await page.waitForTimeout(2000);
        await page.screenshot({
            path: 'logo_test_screenshot.png',
            clip: { x: 0, y: 0, width: 800, height: 300 }
        });
        console.log('📸 Screenshot saved as logo_test_screenshot.png');

    } catch (error) {
        console.error('❌ Error testing logo:', error.message);
    }

    await browser.close();
}

testLogoDisplay();