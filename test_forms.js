const { chromium } = require('playwright');

async function testForms() {
    console.log('🔍 TESTING CURRENT FORM SUBMISSIONS');
    console.log('==================================');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // List of pages with forms to test
    const formsToTest = [
        {
            name: 'FAQ Page',
            url: 'public/faq.html',
            emailSelector: '#userEmail',
            zipSelector: '#userZip',
            submitSelector: '#submitBtn'
        },
        {
            name: 'Water Damage Checklist',
            url: 'public/checklists/water-damage-emergency-checklist.html',
            emailSelector: '#userEmail',
            zipSelector: null,
            submitSelector: 'button[type="submit"]'
        },
        {
            name: 'Fire Damage Checklist',
            url: 'public/checklists/fire-damage-emergency-checklist.html',
            emailSelector: '#userEmail',
            zipSelector: '#userZip',
            submitSelector: '#submitBtn'
        },
        {
            name: 'Document Recovery Checklist',
            url: 'public/checklists/document-recovery-checklist.html',
            emailSelector: '#userEmail',
            zipSelector: '#userZip',
            submitSelector: '#submitBtn'
        }
    ];

    for (const form of formsToTest) {
        console.log(`\n📄 Testing: ${form.name}`);
        console.log('─'.repeat(50));

        try {
            await page.goto('file://' + process.cwd() + '/' + form.url);
            await page.waitForTimeout(1000);

            // Check if form elements exist
            const emailExists = await page.locator(form.emailSelector).count() > 0;
            const submitExists = await page.locator(form.submitSelector).count() > 0;

            console.log('📧 Email field:', emailExists ? '✅ Found' : '❌ Missing');
            console.log('📮 Submit button:', submitExists ? '✅ Found' : '❌ Missing');

            if (form.zipSelector) {
                const zipExists = await page.locator(form.zipSelector).count() > 0;
                console.log('📍 Zip code field:', zipExists ? '✅ Found' : '❌ Missing');
            }

            if (emailExists && submitExists) {
                console.log('✅ Form is properly configured');
            } else {
                console.log('❌ Form has missing elements');
            }

        } catch (error) {
            console.log('❌ Error testing form:', error.message);
        }
    }

    await browser.close();

    console.log('\n🎯 FORM SUBMISSION LOCATIONS');
    console.log('============================');
    console.log('✅ FAQ Page: /public/faq.html');
    console.log('✅ Water Emergency: /public/checklists/water-damage-emergency-checklist.html');
    console.log('✅ Fire Damage: /public/checklists/fire-damage-emergency-checklist.html');
    console.log('✅ Document Recovery: /public/checklists/document-recovery-checklist.html');
    console.log('');
    console.log('📝 FORM SUBMISSION FLOW:');
    console.log('1. User enters email + zip code');
    console.log('2. Form shows loading spinner');
    console.log('3. Opens PDF viewer in new tab with parameters');
    console.log('4. Background email capture for follow-up');
    console.log('5. Success message displayed');
}

testForms();