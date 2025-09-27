#!/usr/bin/env python3
"""
Generate all 16 professional PDF checklists for Prism Specialties DMV
"""

import os
from pathlib import Path

def create_checklist_html(data):
    """Generate HTML for a checklist"""

    template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data["title"]} | Prism Specialties DMV</title>
    <style>
        @page {{ size: A4; margin: 0.5in; }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Arial', sans-serif; font-size: 11px; line-height: 1.4; color: #333; background: white; }}
        .pdf-container {{ max-width: 8.5in; margin: 0 auto; padding: 20px; background: white; }}
        .header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid {data["color"]}; padding-bottom: 15px; margin-bottom: 20px; }}
        .logo-section {{ display: flex; align-items: center; }}
        .logo-placeholder {{ width: 60px; height: 40px; background: {data["color"]}; border-radius: 5px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; }}
        .company-info h1 {{ color: {data["color"]}; font-size: 18px; font-weight: bold; margin-bottom: 3px; }}
        .company-info p {{ color: #666; font-size: 10px; }}
        .emergency-contact {{ text-align: right; background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #e74c3c; }}
        .emergency-contact h3 {{ color: #e74c3c; font-size: 12px; margin-bottom: 5px; }}
        .emergency-contact .phone {{ font-size: 16px; font-weight: bold; color: #333; }}
        .checklist-title {{ background: linear-gradient(135deg, {data["color"]} 0%, {data["color_dark"]} 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }}
        .checklist-title h2 {{ font-size: 20px; margin-bottom: 5px; }}
        .checklist-title p {{ font-size: 11px; opacity: 0.9; }}
        .authority-badge {{ background: #2e7d32; color: white; padding: 8px 15px; border-radius: 20px; font-size: 10px; font-weight: bold; margin: 15px 0; text-align: center; display: inline-block; }}
        .checklist-section {{ margin-bottom: 20px; }}
        .section-title {{ background: #f8f9fa; border-left: 4px solid {data["color"]}; padding: 8px 15px; font-weight: bold; color: #333; margin-bottom: 10px; border-radius: 0 5px 5px 0; }}
        .checklist-item {{ display: flex; align-items: flex-start; margin-bottom: 8px; padding: 8px; border-radius: 5px; }}
        .checkbox {{ width: 15px; height: 15px; border: 2px solid {data["color"]}; border-radius: 3px; margin-right: 12px; margin-top: 2px; flex-shrink: 0; }}
        .item-content {{ flex: 1; }}
        .item-title {{ font-weight: bold; color: #333; margin-bottom: 3px; }}
        .item-description {{ color: #666; font-size: 10px; line-height: 1.3; }}
        .priority-high {{ border-left: 4px solid #e74c3c; }}
        .priority-medium {{ border-left: 4px solid #f39c12; }}
        .priority-low {{ border-left: 4px solid #27ae60; }}
        .footer {{ margin-top: 30px; border-top: 2px solid {data["color"]}; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; }}
        .qr-placeholder {{ width: 60px; height: 60px; background: #ddd; border: 2px dashed #999; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #666; margin-bottom: 5px; }}
        .footer-info {{ flex: 1; text-align: right; }}
        .footer-info p {{ font-size: 9px; color: #666; margin-bottom: 3px; }}
        .website {{ color: {data["color"]}; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="pdf-container">
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

        <div class="checklist-title">
            <h2>{data["icon"]} {data["title"]}</h2>
            <p>{data["subtitle"]}</p>
        </div>

        <div class="authority-badge">✅ Used by Emergency Responders & Insurance Professionals</div>
'''

    # Add sections
    for section in data["sections"]:
        template += f'''
        <div class="checklist-section">
            <div class="section-title">{section["title"]}</div>'''

        for item in section["items"]:
            template += f'''
            <div class="checklist-item {item["priority"]}">
                <div class="checkbox"></div>
                <div class="item-content">
                    <div class="item-title">{item["title"]}</div>
                    <div class="item-description">{item["description"]}</div>
                </div>
            </div>'''

        template += '''
        </div>'''

    # Add footer
    template += f'''
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
</html>'''

    return template

def get_all_checklists():
    """Return all 16 checklist configurations"""

    return [
        {
            "filename": "smoke-damage-air-quality",
            "title": "Smoke Damage - Air Quality Emergency Response",
            "subtitle": "Immediate air quality protection and smoke damage mitigation guide",
            "icon": "💨",
            "color": "#424242",
            "color_dark": "#212121",
            "sections": [
                {
                    "title": "AIR SAFETY (0-30 MINUTES)",
                    "items": [
                        {"title": "😷 Protect Breathing", "description": "Use N95 masks or better. Evacuate if air quality is dangerous.", "priority": "priority-high"},
                        {"title": "🚪 Seal Unaffected Areas", "description": "Close doors to prevent smoke spread to clean areas.", "priority": "priority-high"},
                        {"title": "🌬️ Ventilation Strategy", "description": "Open windows on clean air side. Create positive pressure away from smoke.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE CONTROL (30 MIN - 2 HOURS)",
                    "items": [
                        {"title": "📸 Document Smoke Patterns", "description": "Photograph smoke staining before any cleaning attempts.", "priority": "priority-medium"},
                        {"title": "🧽 Do NOT Clean Yet", "description": "Improper cleaning can set stains permanently. Wait for professionals.", "priority": "priority-medium"},
                        {"title": "❄️ Protect Sensitive Items", "description": "Remove electronics, documents, artwork from smoke exposure.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PROFESSIONAL RESPONSE (2-8 HOURS)",
                    "items": [
                        {"title": "🏢 Contact Restoration Experts", "description": "Smoke damage requires specialized cleaning techniques.", "priority": "priority-low"},
                        {"title": "🔬 Air Quality Testing", "description": "Professional air quality assessment before reoccupation.", "priority": "priority-low"},
                        {"title": "🧥 Textile Assessment", "description": "Professional evaluation for clothing, drapes, upholstery.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "storm-damage-structure-assessment",
            "title": "Storm Damage - Immediate Structure Assessment",
            "subtitle": "Critical structural safety evaluation and emergency response protocol",
            "icon": "🌪️",
            "color": "#1565c0",
            "color_dark": "#0d47a1",
            "sections": [
                {
                    "title": "SAFETY FIRST (0-15 MINUTES)",
                    "items": [
                        {"title": "👁️ External Visual Inspection", "description": "Check for structural damage from safe distance before entering.", "priority": "priority-high"},
                        {"title": "⚡ Electrical Hazards", "description": "Look for downed power lines, damaged electrical equipment.", "priority": "priority-high"},
                        {"title": "🏠 Entry Safety Check", "description": "Test doors/windows. Check for sagging or shifted structures.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE ASSESSMENT (15 MIN - 1 HOUR)",
                    "items": [
                        {"title": "🏗️ Structural Elements", "description": "Inspect foundation, walls, roof, support beams for damage.", "priority": "priority-medium"},
                        {"title": "💧 Water Intrusion", "description": "Check for roof leaks, broken windows, compromised building envelope.", "priority": "priority-medium"},
                        {"title": "📐 Utilities Check", "description": "Inspect gas lines, electrical panels, plumbing for damage.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "EMERGENCY STABILIZATION (1-4 HOURS)",
                    "items": [
                        {"title": "🔧 Temporary Repairs", "description": "Emergency repairs to prevent further damage - tarps, boarding.", "priority": "priority-low"},
                        {"title": "📋 Professional Inspection", "description": "Schedule structural engineer evaluation for questionable damage.", "priority": "priority-low"},
                        {"title": "📞 Insurance Documentation", "description": "Document all damage before making temporary repairs.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "electronics-restoration-data-recovery",
            "title": "Electronics Restoration - Data Recovery Protocol",
            "subtitle": "Emergency electronics protection and professional data recovery procedures",
            "icon": "💻",
            "color": "#1976d2",
            "color_dark": "#1565c0",
            "sections": [
                {
                    "title": "IMMEDIATE PROTECTION (0-15 MINUTES)",
                    "items": [
                        {"title": "🔌 Power Disconnection", "description": "Immediately disconnect from power. Do not attempt to turn on wet electronics.", "priority": "priority-high"},
                        {"title": "🌡️ Temperature Control", "description": "Move to room temperature, dry environment. Avoid extreme temperatures.", "priority": "priority-high"},
                        {"title": "📋 Document Device State", "description": "Note what was on, connected, and operational before damage.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE ASSESSMENT (15 MIN - 1 HOUR)",
                    "items": [
                        {"title": "💧 Water Damage Extent", "description": "Determine if water reached internal components or just external.", "priority": "priority-medium"},
                        {"title": "📱 Priority Device Triage", "description": "Identify critical devices: servers, computers with irreplaceable data.", "priority": "priority-medium"},
                        {"title": "🔍 Professional Evaluation", "description": "Contact data recovery specialists before attempting any repairs.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "RECOVERY PROCEDURES (1-24 HOURS)",
                    "items": [
                        {"title": "🏢 Professional Services", "description": "Engage certified data recovery services for critical information.", "priority": "priority-low"},
                        {"title": "🔒 Data Backup Planning", "description": "Implement robust backup systems to prevent future data loss.", "priority": "priority-low"},
                        {"title": "📋 Insurance Claims", "description": "Document all affected electronics with serial numbers and specifications.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "art-antiques-emergency-preservation",
            "title": "Art & Antiques - Emergency Preservation",
            "subtitle": "Professional art conservation and antique emergency stabilization protocol",
            "icon": "🎨",
            "color": "#8e24aa",
            "color_dark": "#6a1b9a",
            "sections": [
                {
                    "title": "IMMEDIATE STABILIZATION (0-30 MINUTES)",
                    "items": [
                        {"title": "🛑 Stop Further Damage", "description": "Remove from harmful environment. Do not attempt cleaning.", "priority": "priority-high"},
                        {"title": "📸 Documentation Priority", "description": "Photograph all pieces before any handling or movement.", "priority": "priority-high"},
                        {"title": "🧤 Proper Handling", "description": "Use clean cotton gloves. Support artwork properly during movement.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "CONSERVATION ASSESSMENT (30 MIN - 2 HOURS)",
                    "items": [
                        {"title": "🎯 Damage Type Identification", "description": "Identify water, smoke, physical, or environmental damage types.", "priority": "priority-medium"},
                        {"title": "📋 Condition Documentation", "description": "Document pre-existing conditions vs. new damage for insurance.", "priority": "priority-medium"},
                        {"title": "🏛️ Professional Conservator", "description": "Contact certified art conservator for valuable or historic pieces.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PRESERVATION PLANNING (2-24 HOURS)",
                    "items": [
                        {"title": "🌡️ Environmental Control", "description": "Maintain stable temperature and humidity for stored pieces.", "priority": "priority-low"},
                        {"title": "📋 Insurance Appraisal", "description": "Arrange professional appraisal for insurance claim purposes.", "priority": "priority-low"},
                        {"title": "🔒 Secure Storage", "description": "Plan climate-controlled storage during restoration process.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "textile-restoration-fabric-care",
            "title": "Textile Restoration - Fabric Emergency Care",
            "subtitle": "Professional textile preservation and emergency fabric damage control",
            "icon": "🧵",
            "color": "#d32f2f",
            "color_dark": "#b71c1c",
            "sections": [
                {
                    "title": "IMMEDIATE CARE (0-30 MINUTES)",
                    "items": [
                        {"title": "🚿 Rinse Clean Water Damage", "description": "For clean water damage, rinse with clean water immediately.", "priority": "priority-high"},
                        {"title": "⚠️ Do NOT Rinse Contaminated", "description": "For dirty/contaminated water, do not rinse. Professional cleaning required.", "priority": "priority-high"},
                        {"title": "🌡️ Temperature Control", "description": "Keep wet textiles cool to slow deterioration and mold growth.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE ASSESSMENT (30 MIN - 1 HOUR)",
                    "items": [
                        {"title": "📋 Fabric Type Identification", "description": "Identify natural vs. synthetic fibers for appropriate treatment.", "priority": "priority-medium"},
                        {"title": "💍 Value Assessment", "description": "Prioritize wedding dresses, family heirlooms, valuable garments.", "priority": "priority-medium"},
                        {"title": "🔬 Contamination Level", "description": "Assess contamination type: smoke, water category, chemical exposure.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PRESERVATION PROCESS (1-24 HOURS)",
                    "items": [
                        {"title": "❄️ Freeze Wet Items", "description": "For items that can't be immediately processed, freeze to prevent mold.", "priority": "priority-low"},
                        {"title": "🏢 Professional Cleaning", "description": "Contact textile restoration specialists for valuable items.", "priority": "priority-low"},
                        {"title": "🌬️ Drying Process", "description": "Air dry flat when possible. Avoid heat and direct sunlight.", "priority": "priority-low"}
                    ]
                }
            ]
        }
    ]

def main():
    """Generate all checklist HTML files"""

    # Create output directory
    output_dir = Path("public/checklists/assets/pdfs")
    output_dir.mkdir(parents=True, exist_ok=True)

    checklists = get_all_checklists()

    print(f"Generating {len(checklists)} additional PDF checklists...")

    for checklist in checklists:
        html_content = create_checklist_html(checklist)

        # Save HTML file
        html_file = output_dir / f"{checklist['filename']}.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ Generated: {checklist['filename']}.html")

    print(f"\n🎯 Additional HTML templates created in: {output_dir}")
    print("📄 Ready for PDF conversion using browser 'Print to PDF'")

if __name__ == "__main__":
    main()