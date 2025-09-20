const fs = require('fs');

try {
    const analysis = JSON.parse(fs.readFileSync('visual-audit/analysis/page-analysis.json', 'utf8'));

    console.log('\n🧭 NAVIGATION ANALYSIS REPORT');
    console.log('=============================\n');

    // Group by navigation patterns
    const navPatterns = {};

    analysis.forEach(page => {
        if (page.analysis && page.analysis.navLinks) {
            const navKey = page.analysis.navLinks.sort().join('|');
            if (!navPatterns[navKey]) {
                navPatterns[navKey] = [];
            }
            navPatterns[navKey].push(page);
        }
    });

    console.log(`Found ${Object.keys(navPatterns).length} different navigation patterns:\n`);

    let patternNum = 1;
    Object.entries(navPatterns).forEach(([pattern, pages]) => {
        console.log(`Pattern ${patternNum}:`);
        console.log(`  Links: [${pattern.replace(/\|/g, ', ')}]`);
        console.log(`  Pages: ${pages.map(p => p.name).join(', ')}`);
        console.log('');
        patternNum++;
    });

    // Analyze logo consistency
    console.log('\n🎨 LOGO CONSISTENCY ANALYSIS');
    console.log('============================\n');

    analysis.forEach(page => {
        if (page.analysis) {
            const status = page.analysis.hasLogo ? '✅' : '❌';
            console.log(`${status} ${page.description}: ${page.analysis.hasLogo ? 'Logo present' : 'No logo'}`);
            if (page.analysis.logoSrc && page.analysis.logoSrc !== 'No logo found') {
                console.log(`    Source: ${page.analysis.logoSrc}`);
            }
        }
    });

    // Analyze phone number consistency
    console.log('\n📞 PHONE NUMBER CONSISTENCY');
    console.log('===========================\n');

    analysis.forEach(page => {
        if (page.analysis && page.analysis.phoneNumbers) {
            console.log(`${page.description}:`);
            if (page.analysis.phoneNumbers.length > 0) {
                page.analysis.phoneNumbers.forEach(phone => {
                    console.log(`  ✅ ${phone}`);
                });
            } else {
                console.log(`  ❌ No phone numbers found`);
            }
        }
    });

    // Generate recommendations
    console.log('\n🎯 RECOMMENDATIONS');
    console.log('==================\n');

    const uniqueNavs = Object.keys(navPatterns).length;
    if (uniqueNavs > 1) {
        console.log(`❌ CRITICAL: ${uniqueNavs} different navigation patterns found`);
        console.log('   → Standardize navigation across all pages\n');
    }

    const pagesWithoutLogo = analysis.filter(p => p.analysis && !p.analysis.hasLogo);
    if (pagesWithoutLogo.length > 0) {
        console.log(`❌ LOGO MISSING: ${pagesWithoutLogo.length} pages without logo`);
        console.log(`   → Pages: ${pagesWithoutLogo.map(p => p.name).join(', ')}\n`);
    }

    const pagesWithoutPhone = analysis.filter(p => p.analysis && p.analysis.phoneNumbers.length === 0);
    if (pagesWithoutPhone.length > 0) {
        console.log(`⚠️  PHONE MISSING: ${pagesWithoutPhone.length} pages without phone numbers`);
        console.log(`   → Pages: ${pagesWithoutPhone.map(p => p.name).join(', ')}\n`);
    }

} catch (error) {
    console.error('Error analyzing navigation:', error.message);
}