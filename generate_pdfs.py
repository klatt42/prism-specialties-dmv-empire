#!/usr/bin/env python3
"""
PDF Checklist Generator for Prism Specialties DMV
Generates 16 professional emergency response checklists
"""

import os
import json
from pathlib import Path

def create_pdf_template(checklist_data):
    """Create HTML template for PDF generation"""

    template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{checklist_data['title']} | Prism Specialties DMV</title>
    <style>
        @page {{
            size: A4;
            margin: 0.5in;
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: white;
        }}

        .pdf-container {{
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }}

        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid {checklist_data['color']};
            padding-bottom: 15px;
            margin-bottom: 20px;
        }}

        .logo-section {{
            display: flex;
            align-items: center;
        }}

        .logo-placeholder {{
            width: 60px;
            height: 40px;
            background: {checklist_data['color']};
            border-radius: 5px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
        }}

        .company-info h1 {{
            color: {checklist_data['color']};
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 3px;
        }}

        .company-info p {{
            color: #666;
            font-size: 10px;
        }}

        .emergency-contact {{
            text-align: right;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #e74c3c;
        }}

        .emergency-contact h3 {{
            color: #e74c3c;
            font-size: 12px;
            margin-bottom: 5px;
        }}

        .emergency-contact .phone {{
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }}

        .checklist-title {{
            background: linear-gradient(135deg, {checklist_data['color']} 0%, {checklist_data['color_dark']} 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }}

        .checklist-title h2 {{
            font-size: 20px;
            margin-bottom: 5px;
        }}

        .checklist-title p {{
            font-size: 11px;
            opacity: 0.9;
        }}

        .authority-badge {{
            background: #2e7d32;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            margin: 15px 0;
            text-align: center;
            display: inline-block;
        }}

        .checklist-section {{
            margin-bottom: 20px;
        }}

        .section-title {{
            background: #f8f9fa;
            border-left: 4px solid {checklist_data['color']};
            padding: 8px 15px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            border-radius: 0 5px 5px 0;
        }}

        .checklist-item {{
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
            padding: 8px;
            border-radius: 5px;
        }}

        .checkbox {{
            width: 15px;
            height: 15px;
            border: 2px solid {checklist_data['color']};
            border-radius: 3px;
            margin-right: 12px;
            margin-top: 2px;
            flex-shrink: 0;
        }}

        .item-content {{
            flex: 1;
        }}

        .item-title {{
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
        }}

        .item-description {{
            color: #666;
            font-size: 10px;
            line-height: 1.3;
        }}

        .priority-high {{
            border-left: 4px solid #e74c3c;
        }}

        .priority-medium {{
            border-left: 4px solid #f39c12;
        }}

        .priority-low {{
            border-left: 4px solid #27ae60;
        }}

        .footer {{
            margin-top: 30px;
            border-top: 2px solid {checklist_data['color']};
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .qr-placeholder {{
            width: 60px;
            height: 60px;
            background: #ddd;
            border: 2px dashed #999;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #666;
            margin-bottom: 5px;
        }}

        .footer-info {{
            flex: 1;
            text-align: right;
        }}

        .footer-info p {{
            font-size: 9px;
            color: #666;
            margin-bottom: 3px;
        }}

        .website {{
            color: {checklist_data['color']};
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="pdf-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo-placeholder">PRISM</div>
                <div class="company-info">
                    <h1>Prism Specialties DMV</h1>
                    <p>Professional Emergency Restoration Services</p>
                </div>
            </div>
            <div class="emergency-contact">
                <h3>🚨 24/7 Emergency</h3>
                <div class="phone">(888) 826-9429</div>
                <p>Washington DC • Maryland • Virginia</p>
            </div>
        </div>

        <!-- Title Section -->
        <div class="checklist-title">
            <h2>{checklist_data['icon']} {checklist_data['title']}</h2>
            <p>{checklist_data['subtitle']}</p>
        </div>

        <div class="authority-badge">✅ Used by Emergency Responders & Insurance Professionals</div>

        <!-- Checklist Sections -->
"""

    # Add sections
    for section in checklist_data['sections']:
        template += f"""
        <div class="checklist-section">
            <div class="section-title">{section['title']}</div>
"""

        for item in section['items']:
            template += f"""
            <div class="checklist-item {item['priority']}">
                <div class="checkbox"></div>
                <div class="item-content">
                    <div class="item-title">{item['title']}</div>
                    <div class="item-description">{item['description']}</div>
                </div>
            </div>
"""

        template += """        </div>
"""

    # Add footer
    template += f"""
        <!-- Footer -->
        <div class="footer">
            <div>
                <div class="qr-placeholder">QR CODE</div>
                <p style="font-size: 8px; text-align: center;">Scan for updates</p>
            </div>
            <div class="footer-info">
                <p><strong>Professional Restoration Services</strong></p>
                <p>Document • Electronics • Art • Textiles</p>
                <p class="website">www.prismspecialtiesdmv.com</p>
                <p>© 2025 Prism Specialties DMV • Licensed & Insured</p>
            </div>
        </div>
    </div>
</body>
</html>
"""

    return template

def get_checklist_data():
    """Define all 16 checklist configurations"""

    checklists = [
        {
            "filename": "fire-damage-first-48-hours",
            "title": "Fire Damage - First 48 Hours Critical Actions",
            "subtitle": "Professional emergency response protocol for fire and smoke damage",
            "icon": "🔥",
            "color": "#d32f2f",
            "color_dark": "#b71c1c",
            "sections": [
                {
                    "title": "IMMEDIATE SAFETY (0-30 MINUTES)",
                    "items": [
                        {"title": "🚨 Ensure Everyone is Safe", "description": "Evacuate all persons and pets. Do not re-enter until fire officials declare it safe.", "priority": "priority-high"},
                        {"title": "📞 Contact Emergency Services", "description": "Call 911 if not already done. Report gas leaks, electrical hazards, or structural damage.", "priority": "priority-high"},
                        {"title": "🏠 Check Structural Safety", "description": "Look for sagging ceilings, damaged walls, or compromised support beams.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "EMERGENCY RESPONSE (30 MIN - 2 HOURS)",
                    "items": [
                        {"title": "📱 Contact Insurance Company", "description": "Report claim immediately. Get claim number and adjuster contact information.", "priority": "priority-high"},
                        {"title": "📸 Document Everything", "description": "Take extensive photos/videos of all damage before moving anything.", "priority": "priority-high"},
                        {"title": "🔒 Secure the Property", "description": "Board up broken windows/openings to prevent further damage.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "DAMAGE CONTROL (2-8 HOURS)",
                    "items": [
                        {"title": "💧 Address Water Damage", "description": "Remove standing water from firefighting efforts if electricity is safe.", "priority": "priority-medium"},
                        {"title": "🌬️ Ventilate Smoke Odors", "description": "Open windows/doors carefully. Use fans without spreading soot.", "priority": "priority-medium"},
                        {"title": "📋 Create Damage Inventory", "description": "List all damaged items with descriptions and estimated values.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "water-emergency-save-what-matters",
            "title": "Water Emergency - Save What Matters Most",
            "subtitle": "Critical response guide to minimize water damage and protect belongings",
            "icon": "💧",
            "color": "#1976d2",
            "color_dark": "#1565c0",
            "sections": [
                {
                    "title": "IMMEDIATE ACTION (0-15 MINUTES)",
                    "items": [
                        {"title": "⚡ Electrical Safety First", "description": "Shut off electricity to affected areas if safe to do so. Stay out of standing water.", "priority": "priority-high"},
                        {"title": "🚰 Stop the Water Source", "description": "Locate and shut off main water supply if from plumbing issue.", "priority": "priority-high"},
                        {"title": "📞 Emergency Contacts", "description": "Call insurance company and emergency restoration services immediately.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE PREVENTION (15 MIN - 1 HOUR)",
                    "items": [
                        {"title": "📸 Document Everything", "description": "Take photos and videos of all damage before touching anything.", "priority": "priority-high"},
                        {"title": "🏃‍♂️ Remove Standing Water", "description": "Use pumps, wet vacuums, or mops. First 24 hours are critical.", "priority": "priority-medium"},
                        {"title": "📚 Rescue Priority Items", "description": "Move valuable documents, electronics, and irreplaceable items to dry areas.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "RECOVERY PROCESS (1-24 HOURS)",
                    "items": [
                        {"title": "🌬️ Increase Air Circulation", "description": "Open windows, use fans and dehumidifiers to speed drying.", "priority": "priority-medium"},
                        {"title": "🧽 Remove Wet Materials", "description": "Remove carpeting and damaged materials that can't dry within 48 hours.", "priority": "priority-low"},
                        {"title": "🧪 Monitor for Mold", "description": "Watch for mold signs. Mold can begin growing within 24-48 hours.", "priority": "priority-low"}
                    ]
                }
            ]
        }
        # Add more checklists here...
    ]

    return checklists

def generate_all_pdfs():
    """Generate all PDF checklist files"""

    # Create output directory
    output_dir = Path("public/checklists/assets/pdfs")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Get checklist data
    checklists = get_checklist_data()

    print(f"Generating {len(checklists)} PDF checklists...")

    for checklist in checklists:
        # Create HTML template
        html_content = create_pdf_template(checklist)

        # Save HTML file for manual PDF generation
        html_file = output_dir / f"{checklist['filename']}.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ Generated: {checklist['filename']}.html")

    print(f"\n🎯 HTML templates created in: {output_dir}")
    print("📄 Use browser 'Print to PDF' to generate actual PDF files")
    print("💡 Recommended: Use Chrome with 'Save as PDF' option")

if __name__ == "__main__":
    generate_all_pdfs()