const fs = require('fs');
const path = require('path');

const standardNav = fs.readFileSync('fix-templates/standard-navigation.html', 'utf8');

const pagesToUpdate = [
    'public/index.html',
    'public/services.html',
    'public/about.html',
    'public/contact.html',
    'public/washington-dc/index.html',
    'public/fairfax-county/index.html',
    'public/montgomery-county/index.html',
    'blog/index.html'
];

let updateCount = 0;

pagesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace existing navigation (multiple patterns)
        const navPatterns = [
            /<nav[\s\S]*?<\/nav>/gi,
            /<div class="nav[\s\S]*?<\/div>/gi,
            /<header[\s\S]*?<\/header>/gi
        ];

        navPatterns.forEach(pattern => {
            content = content.replace(pattern, standardNav);
        });

        // Ensure navigation is properly placed after <body>
        if (!content.includes('nav class="main-navigation"')) {
            content = content.replace(/<body[^>]*>/i, match => match + '\n' + standardNav);
        }

        fs.writeFileSync(filePath, content);
        updateCount++;
        console.log(`✅ Updated: ${filePath}`);
    } else {
        console.log(`⚠️  Not found: ${filePath}`);
    }
});

console.log(`\n📊 Navigation update complete: ${updateCount} files processed`);