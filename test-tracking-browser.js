// Browser automation test for GHL tracking
// Run with: node test-tracking-browser.js

const puppeteer = require('puppeteer');

async function testGHLTracking() {
    console.log('🚀 Starting GHL tracking integration test...');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Enable console logging from the page
        page.on('console', msg => {
            console.log('PAGE LOG:', msg.text());
        });

        // Test 1: Load test page and check initialization
        console.log('\n📄 Test 1: Loading test page...');
        await page.goto('http://localhost:8080/blog/test-tracking.html');
        await page.waitForTimeout(2000);

        // Check if GHL status function exists
        const hasGHLStatus = await page.evaluate(() => {
            return typeof window.ghlBlogStatus === 'function';
        });

        console.log('✅ GHL Status Function Available:', hasGHLStatus);

        // Test 2: Get initial status
        console.log('\n📊 Test 2: Getting initial tracking status...');
        const initialStatus = await page.evaluate(() => {
            return window.ghlBlogStatus ? window.ghlBlogStatus() : null;
        });

        console.log('Initial Status:', JSON.stringify(initialStatus, null, 2));

        // Test 3: Test emergency CTA click
        console.log('\n🚨 Test 3: Testing emergency CTA click...');
        await page.click('a[href="tel:202-335-4240"]');
        await page.waitForTimeout(1000);

        const postClickStatus = await page.evaluate(() => {
            return window.ghlBlogStatus ? window.ghlBlogStatus() : null;
        });

        console.log('Post-Click Status:', JSON.stringify(postClickStatus, null, 2));

        // Test 4: Check localStorage data
        console.log('\n💾 Test 4: Checking localStorage data...');
        const localStorageData = await page.evaluate(() => {
            const ghlData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('ghl_')) {
                    ghlData[key] = JSON.parse(localStorage.getItem(key));
                }
            }
            return ghlData;
        });

        console.log('LocalStorage Data:', JSON.stringify(localStorageData, null, 2));

        // Test 5: Test scroll tracking
        console.log('\n📜 Test 5: Testing scroll tracking...');
        await page.evaluate(() => {
            window.scrollTo(0, document.documentElement.scrollHeight * 0.5);
        });
        await page.waitForTimeout(1000);

        await page.evaluate(() => {
            window.scrollTo(0, document.documentElement.scrollHeight * 0.8);
        });
        await page.waitForTimeout(1000);

        const postScrollStatus = await page.evaluate(() => {
            return window.ghlBlogStatus ? window.ghlBlogStatus() : null;
        });

        console.log('Post-Scroll Status:', JSON.stringify(postScrollStatus, null, 2));

        // Test 6: Test actual blog post
        console.log('\n📰 Test 6: Testing actual blog post...');
        await page.goto('http://localhost:8080/blog/art-restoration/dc-art-restoration-success-stories.html');
        await page.waitForTimeout(2000);

        const blogPostStatus = await page.evaluate(() => {
            return window.ghlBlogStatus ? window.ghlBlogStatus() : null;
        });

        console.log('Blog Post Status:', JSON.stringify(blogPostStatus, null, 2));

        // Test 7: Test emergency CTA on real blog post
        console.log('\n🚨 Test 7: Testing emergency CTA on real blog post...');

        // Find and click emergency CTA
        const ctaExists = await page.$('a[href*="tel:202-335-4240"]');
        if (ctaExists) {
            await page.click('a[href*="tel:202-335-4240"]');
            await page.waitForTimeout(2000);

            // Check if emergency overlay appears
            const overlayExists = await page.$eval('body', (body) => {
                return body.innerHTML.includes('Emergency Response Activated');
            });

            console.log('✅ Emergency Overlay Displayed:', overlayExists);

            const finalStatus = await page.evaluate(() => {
                return window.ghlBlogStatus ? window.ghlBlogStatus() : null;
            });

            console.log('Final Status:', JSON.stringify(finalStatus, null, 2));
        } else {
            console.log('❌ No emergency CTA found on blog post');
        }

        console.log('\n🎉 GHL tracking test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testGHLTracking().catch(console.error);