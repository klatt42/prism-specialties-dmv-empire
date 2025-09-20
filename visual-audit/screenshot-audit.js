const { chromium } = require('playwright');

async function auditSite() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });

    const pages = [
        {
            url: 'http://localhost:8001/public/',
            name: 'homepage',
            description: 'Homepage with navigation'
        },
        {
            url: 'http://localhost:8001/blog/',
            name: 'blog-index',
            description: 'Blog index page'
        },
        {
            url: 'http://localhost:8001/public/checklists/',
            name: 'checklists',
            description: 'Checklist library'
        },
        {
            url: 'http://localhost:8001/public/washington-dc/',
            name: 'dc-version-1',
            description: 'DC page version 1'
        },
        {
            url: 'http://localhost:8001/public/washington-dc.html',
            name: 'dc-version-2',
            description: 'DC page version 2 (if exists)'
        },
        {
            url: 'http://localhost:8001/public/northern-virginia/',
            name: 'northern-va',
            description: 'Northern Virginia page'
        },
        {
            url: 'http://localhost:8001/public/fairfax-county/',
            name: 'fairfax',
            description: 'Fairfax County page'
        },
        {
            url: 'http://localhost:8001/public/services.html',
            name: 'services',
            description: 'Services page'
        }
    ];

    const auditResults = [];

    for (const pageInfo of pages) {
        try {
            console.log(`📸 Capturing: ${pageInfo.description}`);

            await page.goto(pageInfo.url, { waitUntil: 'networkidle' });

            // Take full page screenshot
            await page.screenshot({
                path: `visual-audit/screenshots/${pageInfo.name}-full.png`,
                fullPage: true
            });

            // Take navigation area screenshot
            const navElement = await page.$('nav, .nav, .navigation, header');
            if (navElement) {
                await navElement.screenshot({
                    path: `visual-audit/screenshots/${pageInfo.name}-nav.png`
                });
            }

            // Analyze page content
            const analysis = await page.evaluate(() => {
                const nav = document.querySelector('nav, .nav, .navigation');
                const navLinks = nav ? Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim()) : [];

                const title = document.title;
                const h1 = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : 'No H1';

                const phoneNumbers = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => a.href);

                const logoImg = document.querySelector('img[alt*="Prism"], img[src*="logo"]');
                const hasLogo = !!logoImg;
                const logoSrc = logoImg ? logoImg.src : 'No logo found';

                return {
                    title,
                    h1,
                    navLinks,
                    phoneNumbers,
                    hasLogo,
                    logoSrc,
                    url: window.location.href
                };
            });

            auditResults.push({
                ...pageInfo,
                analysis,
                status: 'success'
            });

        } catch (error) {
            console.log(`❌ Failed to capture ${pageInfo.description}: ${error.message}`);
            auditResults.push({
                ...pageInfo,
                status: 'error',
                error: error.message
            });
        }
    }

    // Save analysis results
    require('fs').writeFileSync(
        'visual-audit/analysis/page-analysis.json',
        JSON.stringify(auditResults, null, 2)
    );

    await browser.close();
    return auditResults;
}

auditSite().then(results => {
    console.log('✅ Visual audit complete');
    console.log(`📊 Analyzed ${results.length} pages`);
    console.log('📁 Screenshots saved in visual-audit/screenshots/');
    console.log('📋 Analysis saved in visual-audit/analysis/page-analysis.json');
}).catch(console.error);