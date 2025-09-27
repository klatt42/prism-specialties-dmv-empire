const { chromium } = require('playwright');

async function verifyLogoFix() {
    console.log('🔍 VERIFYING LOGO FIX IN PDF CHECKLISTS');
    console.log('=======================================');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Test multiple checklist files
    const testFiles = [
        'fire-damage-first-48-hours.html',
        'water-emergency-save-what-matters.html',
        'lightning-strike-power-surge.html'
    ];

    for (let fileName of testFiles) {
        console.log(`\n📄 Testing: ${fileName}`);
        console.log('─'.repeat(50));

        const testUrl = 'file://' + process.cwd() + '/public/checklists/assets/pdfs/' + fileName;

        try {
            await page.goto(testUrl);
            await page.waitForTimeout(2000);

            // Check if logo image exists and loads
            const logoImage = await page.locator('.logo-image').first();
            const logoExists = await logoImage.count() > 0;

            if (logoExists) {
                const naturalWidth = await logoImage.evaluate(img => img.naturalWidth);
                const naturalHeight = await logoImage.evaluate(img => img.naturalHeight);
                const src = await logoImage.getAttribute('src');

                console.log('📷 Image src:', src);
                console.log('📏 Natural dimensions:', `${naturalWidth}x${naturalHeight}`);

                if (naturalWidth > 0 && naturalHeight > 0) {
                    console.log('✅ LOGO LOADED SUCCESSFULLY!');

                    // Check styling
                    const computedStyle = await logoImage.evaluate(img => {
                        const style = window.getComputedStyle(img);
                        return {
                            height: style.height,
                            width: style.width,
                            clipPath: style.clipPath
                        };
                    });

                    console.log('🎨 Applied styles:', computedStyle);
                } else {
                    console.log('❌ LOGO FAILED TO LOAD - Image dimensions are 0x0');
                }
            } else {
                console.log('❌ LOGO ELEMENT NOT FOUND');
            }

        } catch (error) {
            console.log('❌ Error testing logo:', error.message);
        }
    }

    // Take screenshot of the fixed logo
    console.log('\n📸 Taking screenshot of fixed logo...');
    await page.goto('file://' + process.cwd() + '/public/checklists/assets/pdfs/fire-damage-first-48-hours.html');
    await page.waitForTimeout(2000);

    await page.screenshot({
        path: 'logo_fix_verification.png',
        clip: { x: 0, y: 0, width: 800, height: 300 }
    });
    console.log('📸 Screenshot saved as logo_fix_verification.png');

    await browser.close();

    console.log('\n🎯 VERIFICATION COMPLETE');
    console.log('========================');
}

verifyLogoFix();