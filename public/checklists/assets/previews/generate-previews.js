const { chromium } = require('playwright');
const fs = require('fs').promises;

async function generatePDFPreviews() {
    console.log('📸 GENERATING PDF PREVIEW IMAGES');
    console.log('=================================');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set up for high-quality screenshots
    await page.setViewportSize({ width: 800, height: 1000 });

    const pdfs = [
        'fire-damage-first-48-hours.html',
        'water-emergency-save-what-matters.html',
        'lightning-strike-power-surge.html',
        'smoke-damage-air-quality.html',
        'storm-damage-structure-assessment.html',
        'insurance-claims-emergency-documentation.html',
        'mold-prevention-immediate-response.html',
        'basement-flood-emergency-pump-dry.html',
        'electronics-restoration-data-recovery.html',
        'art-antiques-emergency-preservation.html',
        'textile-restoration-fabric-care.html',
        'hvac-emergency-system-damage.html',
        'kitchen-emergency-appliance-damage.html',
        'roof-emergency-immediate-leak-protection.html',
        'vehicle-storage-emergency-asset-protection.html'
    ];

    for (const pdf of pdfs) {
        try {
            console.log(`📄 Processing: ${pdf}`);

            const pdfPath = `file://${process.cwd()}/public/checklists/assets/pdfs/${pdf}`;
            await page.goto(pdfPath);
            await page.waitForTimeout(2000);

            // Generate preview filename
            const previewName = pdf.replace('.html', '-preview.webp');
            const previewPath = `public/checklists/assets/previews/${previewName}`;

            // Take optimized screenshot
            await page.screenshot({
                path: previewPath,
                type: 'webp',
                quality: 80,
                clip: { x: 0, y: 0, width: 800, height: 1000 }
            });

            console.log(`✅ Generated: ${previewName}`);

        } catch (error) {
            console.log(`❌ Error with ${pdf}:`, error.message);
        }
    }

    await browser.close();
    console.log('\n🎯 Preview generation complete!');
}

// Run if called directly
if (require.main === module) {
    generatePDFPreviews();
}

module.exports = generatePDFPreviews;