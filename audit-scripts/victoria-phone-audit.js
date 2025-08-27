const fs = require('fs');
const path = require('path');

class PhoneNumberAudit {
    constructor() {
        this.expectedPhones = {
            maryland: '301-215-3191',
            dc: '202-335-4240', 
            virginia: '703-229-1321'
        };
        this.results = [];
    }

    auditPhoneNumbers() {
        console.log('📞 VICTORIA VALIDATOR - Geographic Phone Number Audit');
        console.log('=' .repeat(60));
        
        const htmlFiles = this.findHTMLFiles();
        
        htmlFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            const region = this.determineRegion(file);
            const expectedPhone = this.expectedPhones[region];
            
            const phoneMatches = content.match(/\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}/g) || [];
            
            phoneMatches.forEach(phone => {
                if (!expectedPhone) return; // Skip files with unknown region
                const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
                const expectedClean = expectedPhone.replace(/[\s\-\.\(\)]/g, '');
                const isCorrect = cleanPhone === expectedClean;
                
                this.results.push({
                    file: file,
                    region: region,
                    found: phone,
                    expected: expectedPhone,
                    status: isCorrect ? '✅ CORRECT' : '❌ INCORRECT'
                });
            });
        });
        
        this.generateReport();
    }

    determineRegion(filePath) {
        if (filePath.includes('western-maryland')) return 'maryland';
        if (filePath.includes('washington-dc')) return 'dc';
        if (filePath.includes('northern-virginia')) return 'virginia';
        if (filePath.includes('montgomery-county')) return 'maryland';
        if (filePath.includes('fairfax') || filePath.includes('loudoun') || filePath.includes('prince-william')) return 'virginia';
        return 'unknown';
    }

    findHTMLFiles() {
        const files = [];
        const scanDirectory = (dir) => {
            try {
                const items = fs.readdirSync(dir);
                items.forEach(item => {
                    if (item.startsWith('.') || item === 'node_modules') return;
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        scanDirectory(fullPath);
                    } else if (item.endsWith('.html')) {
                        files.push(fullPath);
                    }
                });
            } catch (error) {
                // Directory doesn't exist
            }
        };
        scanDirectory('.');
        return files;
    }

    generateReport() {
        console.log('\n📋 PHONE NUMBER AUDIT REPORT');
        console.log('=' .repeat(40));
        
        const byRegion = {
            maryland: this.results.filter(r => r.region === 'maryland'),
            dc: this.results.filter(r => r.region === 'dc'),
            virginia: this.results.filter(r => r.region === 'virginia')
        };
        
        Object.entries(byRegion).forEach(([region, results]) => {
            console.log(`\n📞 ${region.toUpperCase()} REGION:`);
            console.log(`   Expected: ${this.expectedPhones[region]}`);
            
            results.forEach(result => {
                console.log(`   ${result.status} ${result.file}: ${result.found}`);
            });
        });
        
        const totalErrors = this.results.filter(r => r.status.includes('❌')).length;
        console.log(`\n🎯 AUDIT SUMMARY:`);
        console.log(`   Total Phone Numbers: ${this.results.length}`);
        console.log(`   Errors Found: ${totalErrors}`);
        console.log(`   Status: ${totalErrors === 0 ? '✅ PERFECT' : '❌ NEEDS CORRECTION'}`);
    }
}

const audit = new PhoneNumberAudit();
audit.auditPhoneNumbers();