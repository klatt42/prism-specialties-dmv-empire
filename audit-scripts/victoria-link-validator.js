// PRISM SPECIALTIES DMV - LINK VALIDATION SCRIPT
// Victoria Validator - Quality Assurance Lead
// Comprehensive Link and Navigation Validation

const fs = require('fs');
const path = require('path');

class PrismLinkValidator {
    constructor() {
        this.expectedContacts = {
            phone: '(301) 215-3305',
            phoneClean: '3012153305',
            email: 'documents@prismspecialtiesdmv.com'
        };
        this.validationResults = {
            phoneNumbers: [],
            internalLinks: [],
            authorityReversal: []
        };
    }

    findHTMLFiles(dir = '.') {
        const htmlFiles = [];
        const scanDirectory = (currentDir) => {
            try {
                const items = fs.readdirSync(currentDir);
                items.forEach(item => {
                    if (item.startsWith('.') || item === 'node_modules') return;
                    const fullPath = path.join(currentDir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        scanDirectory(fullPath);
                    } else if (item.endsWith('.html')) {
                        htmlFiles.push(fullPath);
                    }
                });
            } catch (error) {
                console.log(`Cannot scan ${currentDir}: ${error.message}`);
            }
        };
        scanDirectory(dir);
        return htmlFiles;
    }

    validatePhoneNumbers(filePath, content) {
        const phoneRegex = /(\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/g;
        let match;
        while ((match = phoneRegex.exec(content)) !== null) {
            const phoneNumber = match[1];
            const cleanPhone = phoneNumber.replace(/[\s\-\.\(\)]/g, '');
            const isCorrect = cleanPhone === this.expectedContacts.phoneClean;
            
            this.validationResults.phoneNumbers.push({
                file: filePath,
                found: phoneNumber,
                status: isCorrect ? '✅ CORRECT' : '❌ INCORRECT'
            });
        }
    }

    checkAuthorityReversal(filePath, content) {
        const funeralDirectorMentions = (content.toLowerCase().match(/funeral director/g) || []).length;
        const authorityElements = (content.match(/authority-reversal/g) || []).length;
        const hookElements = (content.match(/hook-point/g) || []).length;
        
        this.validationResults.authorityReversal.push({
            file: filePath,
            funeralDirectorMentions,
            authorityElements,
            hookElements,
            hasImplementation: funeralDirectorMentions > 0 || authorityElements > 0 || hookElements > 0
        });
    }

    runValidation() {
        console.log('🛡️  VICTORIA VALIDATOR - STARTING LINK VALIDATION');
        console.log('=' .repeat(60));
        
        const htmlFiles = this.findHTMLFiles();
        console.log(`Found ${htmlFiles.length} HTML files to validate`);
        
        htmlFiles.forEach(file => {
            console.log(`📄 Validating: ${file}`);
            try {
                const content = fs.readFileSync(file, 'utf8');
                this.validatePhoneNumbers(file, content);
                this.checkAuthorityReversal(file, content);
            } catch (error) {
                console.error(`❌ Error reading ${file}: ${error.message}`);
            }
        });

        this.generateReport();
    }

    generateReport() {
        console.log('\n📋 VICTORIA VALIDATOR REPORT');
        console.log('=' .repeat(40));
        
        console.log('\n📞 PHONE NUMBER VALIDATION:');
        this.validationResults.phoneNumbers.forEach(result => {
            console.log(`${result.status} ${result.file}: ${result.found}`);
        });
        
        console.log('\n🎭 AUTHORITY REVERSAL VALIDATION:');
        this.validationResults.authorityReversal.forEach(result => {
            const status = result.hasImplementation ? '✅ IMPLEMENTED' : '⚠️  MISSING';
            console.log(`${status} ${result.file}`);
            console.log(`   Funeral Director mentions: ${result.funeralDirectorMentions}`);
            console.log(`   Authority elements: ${result.authorityElements}`);
            console.log(`   Hook elements: ${result.hookElements}`);
        });

        const phoneIssues = this.validationResults.phoneNumbers.filter(p => p.status.includes('❌')).length;
        const missingAuthority = this.validationResults.authorityReversal.filter(a => !a.hasImplementation).length;
        
        console.log('\n🎯 SUMMARY:');
        console.log(`Phone Number Issues: ${phoneIssues}`);
        console.log(`Missing Authority Reversal: ${missingAuthority}`);
        console.log(`Validation Status: ${phoneIssues === 0 && missingAuthority === 0 ? '✅ PASSED' : '❌ NEEDS WORK'}`);
    }
}

const validator = new PrismLinkValidator();
validator.runValidation();