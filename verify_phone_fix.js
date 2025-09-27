const { chromium } = require('playwright');

async function verifyPhoneFix() {
    console.log('🔍 VERIFYING PHONE NUMBER FIX IN PDF CHECKLISTS');
    console.log('================================================');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Test a sample checklist file
    const testFile = 'fire-damage-first-48-hours.html';
    console.log(`\n📄 Testing: ${testFile}`);
    console.log('─'.repeat(50));

    const testUrl = 'file://' + process.cwd() + '/public/checklists/assets/pdfs/' + testFile;

    try {
        await page.goto(testUrl);
        await page.waitForTimeout(2000);

        // Check for the correct phone number
        const phoneElement = await page.locator('.phone').first();
        const phoneText = await phoneElement.textContent();

        console.log('📞 Phone number displayed:', phoneText);

        if (phoneText === '(301) 215-3191') {
            console.log('✅ CORRECT PHONE NUMBER DISPLAYED!');
        } else {
            console.log('❌ INCORRECT PHONE NUMBER - Expected: (301) 215-3191');
        }

        // Check that old number is gone
        const oldNumber = await page.locator('text=(888) 826-9429').count();
        if (oldNumber === 0) {
            console.log('✅ Old number (888) 826-9429 successfully removed');
        } else {
            console.log('❌ Old number still present');
        }

    } catch (error) {
        console.log('❌ Error testing phone number:', error.message);
    }

    // Take screenshot of the updated phone number
    console.log('\n📸 Taking screenshot of updated phone number...');
    await page.goto('file://' + process.cwd() + '/public/checklists/assets/pdfs/fire-damage-first-48-hours.html');
    await page.waitForTimeout(2000);

    await page.screenshot({
        path: 'phone_fix_verification.png',
        clip: { x: 0, y: 0, width: 800, height: 300 }
    });
    console.log('📸 Screenshot saved as phone_fix_verification.png');

    await browser.close();

    console.log('\n🎯 PHONE NUMBER VERIFICATION COMPLETE');
    console.log('====================================');
}

verifyPhoneFix();