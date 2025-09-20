const { chromium } = require('playwright');

async function emergencyVerify() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });

    const testPages = [
        'http://localhost:8001/public/',
        'http://localhost:8001/public/washington-dc/',
        'http://localhost:8001/blog/'
    ];

    console.log('🔍 EMERGENCY VERIFICATION RESULTS:');
    console.log('================================');

    for (const url of testPages) {
        try {
            await page.goto(url, { waitUntil: 'networkidle' });

            // Check navigation styling
            const navStyling = await page.evaluate(() => {
                const nav = document.querySelector('nav.main-navigation');
                if (!nav) return { exists: false };

                const style = window.getComputedStyle(nav);
                return {
                    exists: true,
                    hasBackground: style.background !== 'rgba(0, 0, 0, 0)',
                    hasBoxShadow: style.boxShadow !== 'none',
                    hasPadding: style.padding !== '0px'
                };
            });

            // Check for duplicates
            const navCount = await page.$eval('nav', navs => navs.length);

            // Take screenshot
            const urlName = url.replace(/[^a-zA-Z0-9]/g, '_');
            await page.screenshot({
                path: `emergency-verification/fixed-${urlName}.png`,
                fullPage: false,
                clip: { x: 0, y: 0, width: 1200, height: 400 }
            });

            console.log(`\n${url}:`);
            console.log(`  Navigation exists: ${navStyling.exists ? '✅' : '❌'}`);
            console.log(`  Properly styled: ${navStyling.hasBackground && navStyling.hasBoxShadow ? '✅' : '❌'}`);
            console.log(`  Navigation count: ${navCount} ${navCount === 1 ? '✅' : '❌'}`);

        } catch (error) {
            console.log(`❌ Error verifying ${url}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\n📸 Screenshots saved to emergency-verification/');
}

emergencyVerify().catch(console.error);