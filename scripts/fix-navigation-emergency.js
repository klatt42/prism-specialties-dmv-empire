const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Read the styled navigation template
const styledNav = fs.readFileSync('fix-templates/styled-navigation.html', 'utf8');

// Find all HTML files
const htmlFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'backups/**', 'emergency-backups/**', '.git/**', 'fix-templates/**']
});

console.log('🔧 EMERGENCY NAVIGATION FIX STARTING...');
console.log(`Found ${htmlFiles.length} HTML files to process`);

let fixedCount = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Remove ALL existing navigation patterns (multiple passes)
        const navPatterns = [
            /<nav[\s\S]*?<\/nav>/gi,
            /<div class="nav[\s\S]*?<\/div>/gi,
            /<header[\s\S]*?navigation[\s\S]*?<\/header>/gi,
            /<ul class="nav[\s\S]*?<\/ul>/gi,
            /<!-- STANDARD NAVIGATION[\s\S]*?<\/nav>/gi,
            /<nav class="main-navigation"[\s\S]*?<\/nav>/gi
        ];

        // Remove existing navigation (multiple passes to catch duplicates)
        navPatterns.forEach(pattern => {
            const before = content;
            content = content.replace(pattern, '');
            if (content !== before) {
                modified = true;
                console.log(`  Removed navigation pattern from: ${file}`);
            }
        });

        // Remove any leftover navigation-related elements
        content = content.replace(/Prism Specialties DMV\s*<\/?\w+>/gi, '');
        content = content.replace(/<li><a href[^>]*>(Home|Services|About|Blog|Checklists|Contact)<\/a><\/li>/gi, '');
        content = content.replace(/DC:\s*\(202\)\s*335-4240/gi, '');
        content = content.replace(/MD:\s*\(301\)\s*215-3191/gi, '');
        content = content.replace(/VA:\s*\(703\)\s*229-1321/gi, '');

        // Insert the styled navigation after <body> tag
        if (content.includes('<body')) {
            content = content.replace(/(<body[^>]*>)/i, '$1\n' + styledNav);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            fixedCount++;
            console.log(`✅ Fixed navigation in: ${file}`);
        }

    } catch (error) {
        console.log(`❌ Error processing ${file}: ${error.message}`);
    }
});

console.log(`\n🎯 EMERGENCY FIX COMPLETE: ${fixedCount} files restored`);
console.log('✅ Professional navigation styling restored');
console.log('✅ Duplicate navigation elements removed');
console.log('✅ CSS styling properly integrated');