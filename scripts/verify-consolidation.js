const { chromium } = require('playwright');

async function verifyConsolidation() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });

    const testPages = [
        'http://localhost:8001/public/',
        'http://localhost:8001/public/washington-dc/',
        'http://localhost:8001/public/services.html',
        'http://localhost:8001/blog/',
        'http://localhost:8001/public/checklists/'
    ];

    for (const url of testPages) {
        try {
            await page.goto(url, { waitUntil: 'networkidle' });

            // Take verification screenshot
            const urlName = url.replace(/[^a-zA-Z0-9]/g, '_');
            await page.screenshot({
                path: `visual-audit/verification/post-fix-${urlName}.png`,
                fullPage: true
            });

            // Analyze navigation and phones
            const analysis = await page.evaluate(() => {
                const nav = document.querySelector('nav.main-navigation, nav, .nav');
                const navLinks = nav ? Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim()) : [];

                const dcPhones = Array.from(document.querySelectorAll('a[href*="202-335-4240"]'));
                const wrongPhones = Array.from(document.querySelectorAll('a[href*="202-215-3191"]'));

                const logo = document.querySelector('img[alt*="Prism"], img[src*="logo"]');

                return {
                    url: window.location.href,
                    hasStandardNav: nav?.classList.contains('main-navigation') || false,
                    navLinksCount: navLinks.length,
                    hasCorrectDCPhone: dcPhones.length > 0,
                    hasWrongDCPhone: wrongPhones.length > 0,
                    hasLogo: !!logo
                };
            });

            console.log(`\n📊 ${url}:`);
            console.log(`  Navigation: ${analysis.hasStandardNav ? '✅ Standard' : '❌ Non-standard'}`);
            console.log(`  DC Phone: ${analysis.hasCorrectDCPhone ? '✅ Correct' : '❌ Missing'}`);
            console.log(`  Wrong Phone: ${analysis.hasWrongDCPhone ? '❌ Still present' : '✅ Removed'}`);
            console.log(`  Logo: ${analysis.hasLogo ? '✅ Present' : '❌ Missing'}`);

        } catch (error) {
            console.log(`❌ Error verifying ${url}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\n📸 Verification screenshots saved to visual-audit/verification/');
}

verifyConsolidation().catch(console.error);