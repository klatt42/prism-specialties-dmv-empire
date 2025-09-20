const fs = require('fs');
const glob = require('glob');

// Define correct phone numbers
const phoneCorrections = {
    '202-215-3191': '202-335-4240',  // Fix wrong DC number
    'tel:202-215-3191': 'tel:202-335-4240'
};

// Find all HTML files
const htmlFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'backups/**', '.git/**']
});

let fixedCount = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        Object.entries(phoneCorrections).forEach(([wrong, correct]) => {
            if (content.includes(wrong)) {
                content = content.replace(new RegExp(wrong, 'g'), correct);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(file, content);
            fixedCount++;
            console.log(`✅ Fixed phones in: ${file}`);
        }
    } catch (error) {
        console.log(`⚠️  Error processing ${file}: ${error.message}`);
    }
});

console.log(`\n📊 Phone correction complete: ${fixedCount} files updated`);
console.log('✅ All DC phones now show: 202-335-4240');