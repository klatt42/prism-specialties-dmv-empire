const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function preserveBlogPages() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });

    const blogUrls = [
        'http://localhost:8001/blog/photo-restoration-dmv-family-legacy.html',
        'http://localhost:8001/blog/vintage-electronics-restoration-dmv-retro.html',
        'http://localhost:8001/blog/civil-war-restoration-virginia-historical.html',
        'http://localhost:8001/blog/government-document-preservation-dc-federal.html',
        'http://localhost:8001/blog/fire-damage-restoration-dmv-emergency.html',
        'http://localhost:8001/blog/water-damage-restoration-dmv-emergency.html',
        'http://localhost:8001/blog/example-blog-with-form.html',
        'http://localhost:8001/blog/contact-form-enhanced.html'
    ];

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const backupDir = `preserved-content/working-blog-pages/${timestamp}`;

    // Create backup directory
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log('🔄 PRESERVING BLOG PAGES');
    console.log('========================');
    console.log(`Backup directory: ${backupDir}`);

    const preservedPages = [];

    for (const url of blogUrls) {
        try {
            console.log(`📄 Preserving: ${url}`);

            await page.goto(url, { waitUntil: 'networkidle' });

            // Get page content with inline CSS
            const pageContent = await page.evaluate(() => {
                // Inline all stylesheets
                const styleSheets = Array.from(document.styleSheets);
                styleSheets.forEach(sheet => {
                    try {
                        if (sheet.href) {
                            const link = document.querySelector(`link[href="${sheet.href}"]`);
                            if (link) {
                                const style = document.createElement('style');
                                style.textContent = Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                                link.parentNode.replaceChild(style, link);
                            }
                        }
                    } catch (e) {
                        console.log('Could not inline stylesheet:', e.message);
                    }
                });

                return document.documentElement.outerHTML;
            });

            // Extract filename from URL
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const filepath = path.join(backupDir, filename);

            // Save preserved page
            fs.writeFileSync(filepath, pageContent);

            // Take screenshot
            const screenshotPath = filepath.replace('.html', '.png');
            await page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            preservedPages.push({
                url: url,
                filename: filename,
                size: fs.statSync(filepath).size,
                timestamp: new Date().toISOString()
            });

            console.log(`  ✅ Saved: ${filename} (${Math.round(fs.statSync(filepath).size / 1024)}KB)`);

        } catch (error) {
            console.log(`  ❌ Error preserving ${url}: ${error.message}`);
        }
    }

    // Create preservation manifest
    const manifest = {
        preservationDate: new Date().toISOString(),
        totalPages: preservedPages.length,
        backupDirectory: backupDir,
        pages: preservedPages
    };

    fs.writeFileSync(
        path.join(backupDir, 'preservation-manifest.json'),
        JSON.stringify(manifest, null, 2)
    );

    await browser.close();

    console.log(`\n📊 PRESERVATION COMPLETE`);
    console.log(`=============================`);
    console.log(`✅ ${preservedPages.length} pages preserved`);
    console.log(`📁 Location: ${backupDir}`);
    console.log(`📋 Manifest: preservation-manifest.json`);

    return manifest;
}

preserveBlogPages().catch(console.error);