const { chromium } = require('playwright');

async function createPlaceholderPreviews() {
    console.log('🎨 CREATING PLACEHOLDER PREVIEW IMAGES');
    console.log('=====================================');

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 800, height: 1000 });

    const previews = [
        {
            filename: 'fire-damage-first-48-hours-preview.png',
            title: '🔥 Fire Damage',
            subtitle: 'First 48 Hours Critical Actions',
            color: '#e74c3c',
            icon: '🔥'
        },
        {
            filename: 'water-emergency-save-what-matters-preview.png',
            title: '💧 Water Emergency',
            subtitle: 'Save What Matters Most',
            color: '#3498db',
            icon: '💧'
        },
        {
            filename: 'lightning-strike-power-surge-preview.png',
            title: '⚡ Lightning Strike',
            subtitle: 'Power Surge Protection',
            color: '#f39c12',
            icon: '⚡'
        },
        {
            filename: 'smoke-damage-air-quality-preview.png',
            title: '💨 Smoke Damage',
            subtitle: 'Air Quality Emergency Response',
            color: '#95a5a6',
            icon: '💨'
        },
        {
            filename: 'storm-damage-structure-assessment-preview.png',
            title: '🌪️ Storm Damage',
            subtitle: 'Structure Assessment',
            color: '#2980b9',
            icon: '🌪️'
        }
    ];

    for (const preview of previews) {
        try {
            console.log(`🎨 Creating: ${preview.filename}`);

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            margin: 0;
                            padding: 40px;
                            font-family: 'Arial', sans-serif;
                            background: linear-gradient(135deg, ${preview.color} 0%, #ffffff 100%);
                            color: #2c3e50;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                        }
                        .header {
                            text-align: center;
                            padding: 30px 0;
                        }
                        .logo {
                            font-size: 6rem;
                            margin-bottom: 20px;
                        }
                        .title {
                            font-size: 2.5rem;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: ${preview.color};
                        }
                        .subtitle {
                            font-size: 1.5rem;
                            color: #7f8c8d;
                            margin-bottom: 30px;
                        }
                        .content {
                            flex: 1;
                            background: rgba(255,255,255,0.9);
                            border-radius: 15px;
                            padding: 30px;
                            margin: 20px 0;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        }
                        .checklist-item {
                            display: flex;
                            align-items: center;
                            margin: 15px 0;
                            padding: 10px;
                            border-left: 4px solid ${preview.color};
                            background: #f8f9fa;
                            border-radius: 5px;
                        }
                        .checkbox {
                            width: 20px;
                            height: 20px;
                            border: 2px solid ${preview.color};
                            border-radius: 4px;
                            margin-right: 15px;
                        }
                        .item-text {
                            font-size: 1.1rem;
                            color: #2c3e50;
                        }
                        .footer {
                            text-align: center;
                            color: #7f8c8d;
                            font-size: 1rem;
                        }
                        .brand {
                            color: #00a0df;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">${preview.icon}</div>
                        <h1 class="title">${preview.title}</h1>
                        <p class="subtitle">${preview.subtitle}</p>
                    </div>

                    <div class="content">
                        <div class="checklist-item">
                            <div class="checkbox"></div>
                            <div class="item-text">Professional Emergency Response Protocol</div>
                        </div>
                        <div class="checklist-item">
                            <div class="checkbox"></div>
                            <div class="item-text">Step-by-step safety procedures</div>
                        </div>
                        <div class="checklist-item">
                            <div class="checkbox"></div>
                            <div class="item-text">Critical timing guidelines</div>
                        </div>
                        <div class="checklist-item">
                            <div class="checkbox"></div>
                            <div class="item-text">Insurance documentation tips</div>
                        </div>
                        <div class="checklist-item">
                            <div class="checkbox"></div>
                            <div class="item-text">Professional contact information</div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Used by Emergency Responders & Insurance Professionals</p>
                        <p><span class="brand">Prism Specialties DMV</span> • Professional Emergency Restoration</p>
                    </div>
                </body>
                </html>
            `;

            await page.setContent(html);
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: `${preview.filename}`,
                type: 'png',
                fullPage: true
            });

            console.log(`✅ Created: ${preview.filename}`);

        } catch (error) {
            console.log(`❌ Error creating ${preview.filename}:`, error.message);
        }
    }

    await browser.close();
    console.log('\n🎯 Placeholder preview creation complete!');
}

createPlaceholderPreviews();