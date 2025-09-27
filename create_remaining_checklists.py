#!/usr/bin/env python3
"""
Generate the remaining professional PDF checklists for Prism Specialties DMV
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

def get_remaining_checklists():
    """Return the remaining checklist configurations"""

    return [
        {
            "filename": "insurance-claims-emergency-documentation",
            "title": "Insurance Claims - Emergency Documentation",
            "subtitle": "Critical documentation protocol for maximum insurance claim recovery",
            "icon": "📋",
            "color": "#2e7d32",
            "color_dark": "#1b5e20",
            "sections": [
                {
                    "title": "IMMEDIATE DOCUMENTATION (0-30 MINUTES)",
                    "items": [
                        {"title": "📞 Contact Insurance Immediately", "description": "Report claim within 24 hours. Get claim number and adjuster contact info.", "priority": "priority-high"},
                        {"title": "📸 Extensive Photo Documentation", "description": "Take photos from multiple angles before moving anything. Include wide shots and close-ups.", "priority": "priority-high"},
                        {"title": "🎥 Video Walkthrough", "description": "Record video narrative describing damage and your immediate observations.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DETAILED INVENTORY (30 MIN - 2 HOURS)",
                    "items": [
                        {"title": "📝 Damaged Items List", "description": "Create detailed inventory with descriptions, ages, purchase prices, and estimated replacement costs.", "priority": "priority-medium"},
                        {"title": "🔢 Serial Numbers", "description": "Document serial numbers, model numbers, and specifications for all electronics and appliances.", "priority": "priority-medium"},
                        {"title": "🧾 Receipt Collection", "description": "Gather receipts, warranties, and proof of purchase for damaged items.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "CLAIM OPTIMIZATION (2-24 HOURS)",
                    "items": [
                        {"title": "💰 Professional Appraisals", "description": "Get professional appraisals for valuable items: art, jewelry, antiques.", "priority": "priority-low"},
                        {"title": "📄 Additional Living Expenses", "description": "Document temporary housing, meals, and other expenses if displaced.", "priority": "priority-low"},
                        {"title": "⚖️ Public Adjuster Consideration", "description": "Consider hiring public adjuster for complex or high-value claims.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "mold-prevention-immediate-response",
            "title": "Mold Prevention - Immediate Response Protocol",
            "subtitle": "Critical 24-48 hour response to prevent mold growth and health hazards",
            "icon": "🦠",
            "color": "#795548",
            "color_dark": "#5d4037",
            "sections": [
                {
                    "title": "IMMEDIATE ACTION (0-4 HOURS)",
                    "items": [
                        {"title": "💧 Remove Standing Water", "description": "Extract all standing water immediately. Mold growth can begin within 24-48 hours.", "priority": "priority-high"},
                        {"title": "🌬️ Increase Air Circulation", "description": "Use fans, dehumidifiers, and open windows to increase airflow and reduce humidity.", "priority": "priority-high"},
                        {"title": "🧽 Remove Wet Materials", "description": "Remove wet carpet, padding, and porous materials that cannot dry within 48 hours.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "HUMIDITY CONTROL (4-24 HOURS)",
                    "items": [
                        {"title": "📊 Monitor Humidity Levels", "description": "Keep humidity below 50%. Use dehumidifiers and hygrometers to monitor.", "priority": "priority-medium"},
                        {"title": "🏠 HVAC System Check", "description": "Inspect HVAC system before use. Change filters and check for water damage.", "priority": "priority-medium"},
                        {"title": "🌡️ Temperature Control", "description": "Maintain consistent temperature. Avoid excessive heat which can accelerate mold growth.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PREVENTION MEASURES (24-48 HOURS)",
                    "items": [
                        {"title": "🔬 Professional Testing", "description": "Consider professional mold testing if musty odors or visible growth appear.", "priority": "priority-low"},
                        {"title": "🧴 Antimicrobial Treatment", "description": "Apply EPA-approved antimicrobial treatments to affected areas after drying.", "priority": "priority-low"},
                        {"title": "📋 Ongoing Monitoring", "description": "Continue monitoring for signs of mold growth for several weeks after incident.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "basement-flood-emergency-pump-dry",
            "title": "Basement Flood - Emergency Pump & Dry",
            "subtitle": "Rapid basement flood response and structural protection protocol",
            "icon": "🏠",
            "color": "#1565c0",
            "color_dark": "#0d47a1",
            "sections": [
                {
                    "title": "SAFETY & POWER (0-15 MINUTES)",
                    "items": [
                        {"title": "⚡ Electrical Safety Check", "description": "Turn off electricity to basement if water near electrical outlets or appliances.", "priority": "priority-high"},
                        {"title": "💧 Stop Water Source", "description": "Identify and stop water source if possible - broken pipes, foundation crack, etc.", "priority": "priority-high"},
                        {"title": "🚪 Safe Access Verification", "description": "Ensure stairs and access are structurally sound before entering flooded basement.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "WATER REMOVAL (15 MIN - 4 HOURS)",
                    "items": [
                        {"title": "⛽ Emergency Pumping", "description": "Use submersible pumps or wet vacuums to remove standing water quickly.", "priority": "priority-medium"},
                        {"title": "📸 Document Water Levels", "description": "Photograph water levels and damage patterns before pumping begins.", "priority": "priority-medium"},
                        {"title": "🧽 Remove Contaminated Items", "description": "Remove and dispose of contaminated materials: drywall, insulation, flooring.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "DRYING & RESTORATION (4-48 HOURS)",
                    "items": [
                        {"title": "🌬️ Industrial Drying Equipment", "description": "Deploy commercial fans, dehumidifiers, and air movers for rapid drying.", "priority": "priority-low"},
                        {"title": "🏗️ Structural Assessment", "description": "Inspect foundation, support beams, and structural elements for damage.", "priority": "priority-low"},
                        {"title": "🦠 Mold Prevention Protocol", "description": "Begin aggressive mold prevention measures within 24-48 hours.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "kitchen-emergency-appliance-damage",
            "title": "Kitchen Emergency - Appliance Damage Control",
            "subtitle": "Kitchen fire and water damage immediate response and safety protocol",
            "icon": "🍳",
            "color": "#ff5722",
            "color_dark": "#d84315",
            "sections": [
                {
                    "title": "IMMEDIATE SAFETY (0-15 MINUTES)",
                    "items": [
                        {"title": "🔥 Fire Suppression Check", "description": "Ensure fire is completely extinguished. Check for hot spots or smoldering.", "priority": "priority-high"},
                        {"title": "⚡ Disconnect Utilities", "description": "Turn off gas, electricity, and water to affected appliances and area.", "priority": "priority-high"},
                        {"title": "🌬️ Ventilation Safety", "description": "Ventilate area to remove smoke, gas, or chemical fumes. Check air quality.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE ASSESSMENT (15 MIN - 1 HOUR)",
                    "items": [
                        {"title": "🏠 Structural Damage Check", "description": "Inspect cabinets, countertops, and surrounding walls for heat or water damage.", "priority": "priority-medium"},
                        {"title": "📱 Appliance Evaluation", "description": "Document damage to all appliances. Do not attempt to operate damaged equipment.", "priority": "priority-medium"},
                        {"title": "🍽️ Food Safety Assessment", "description": "Dispose of food exposed to smoke, heat, chemicals, or contaminated water.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "RESTORATION PLANNING (1-24 HOURS)",
                    "items": [
                        {"title": "🧽 Professional Cleaning", "description": "Engage professional kitchen restoration for smoke and grease removal.", "priority": "priority-low"},
                        {"title": "🔧 Utility Restoration", "description": "Have utilities professionally inspected before restoration to service.", "priority": "priority-low"},
                        {"title": "📋 Insurance Documentation", "description": "Document all appliance damage with model numbers and replacement costs.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "hvac-emergency-system-damage",
            "title": "HVAC Emergency - System Damage Assessment",
            "subtitle": "Heating and cooling system emergency response and air quality protection",
            "icon": "🌀",
            "color": "#607d8b",
            "color_dark": "#455a64",
            "sections": [
                {
                    "title": "IMMEDIATE SHUTDOWN (0-15 MINUTES)",
                    "items": [
                        {"title": "🔌 System Power Off", "description": "Turn off HVAC system immediately to prevent spreading contamination.", "priority": "priority-high"},
                        {"title": "🌬️ Air Quality Check", "description": "Assess air quality. Evacuate if smoke, gas, or chemical odors detected.", "priority": "priority-high"},
                        {"title": "🔥 Fire Hazard Assessment", "description": "Check for burning smells, overheating, or electrical hazards from system.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "SYSTEM INSPECTION (15 MIN - 1 HOUR)",
                    "items": [
                        {"title": "🏠 Ductwork Examination", "description": "Inspect accessible ductwork for damage, contamination, or obstructions.", "priority": "priority-medium"},
                        {"title": "💧 Water Damage Check", "description": "Look for water damage to system components, especially electrical connections.", "priority": "priority-medium"},
                        {"title": "🔍 Filter Assessment", "description": "Examine air filters for contamination, damage, or excessive debris.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PROFESSIONAL EVALUATION (1-24 HOURS)",
                    "items": [
                        {"title": "🔧 HVAC Technician Call", "description": "Schedule professional HVAC inspection before attempting to restart system.", "priority": "priority-low"},
                        {"title": "🧽 Duct Cleaning Planning", "description": "Plan professional duct cleaning if contamination occurred.", "priority": "priority-low"},
                        {"title": "📋 System Documentation", "description": "Document all damage for insurance claims and repair planning.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "roof-emergency-immediate-leak-protection",
            "title": "Roof Emergency - Immediate Leak Protection",
            "subtitle": "Emergency roof damage response and water intrusion prevention protocol",
            "icon": "🏠",
            "color": "#5d4037",
            "color_dark": "#3e2723",
            "sections": [
                {
                    "title": "SAFETY ASSESSMENT (0-15 MINUTES)",
                    "items": [
                        {"title": "⚡ Electrical Hazards", "description": "Check for water near electrical fixtures, outlets, or equipment.", "priority": "priority-high"},
                        {"title": "🏗️ Structural Integrity", "description": "Assess ceiling stability. Evacuate if sagging or structural damage visible.", "priority": "priority-high"},
                        {"title": "🚪 Safe Access Routes", "description": "Ensure safe pathways through property. Watch for slippery surfaces.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "IMMEDIATE PROTECTION (15 MIN - 2 HOURS)",
                    "items": [
                        {"title": "🛡️ Emergency Tarping", "description": "Cover damaged roof areas with heavy-duty tarps to prevent further water intrusion.", "priority": "priority-medium"},
                        {"title": "🪣 Water Collection", "description": "Place buckets and containers to collect dripping water and protect interior.", "priority": "priority-medium"},
                        {"title": "📸 Damage Documentation", "description": "Photograph all damage before and during emergency protection measures.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "PROFESSIONAL RESPONSE (2-24 HOURS)",
                    "items": [
                        {"title": "🔧 Emergency Roofing Services", "description": "Contact emergency roofing contractors for professional temporary repairs.", "priority": "priority-low"},
                        {"title": "💧 Water Damage Mitigation", "description": "Begin interior water removal and drying to prevent secondary damage.", "priority": "priority-low"},
                        {"title": "📋 Insurance Claim Filing", "description": "Contact insurance company and document all emergency protection costs.", "priority": "priority-low"}
                    ]
                }
            ]
        },
        {
            "filename": "vehicle-storage-emergency-asset-protection",
            "title": "Vehicle Storage - Emergency Asset Protection",
            "subtitle": "Emergency vehicle and equipment protection during property disasters",
            "icon": "🚗",
            "color": "#424242",
            "color_dark": "#212121",
            "sections": [
                {
                    "title": "IMMEDIATE RELOCATION (0-30 MINUTES)",
                    "items": [
                        {"title": "🚗 Vehicle Evacuation", "description": "Move all vehicles to safe, elevated location away from flood zones.", "priority": "priority-high"},
                        {"title": "🔑 Essential Items Removal", "description": "Remove important documents, electronics, and valuables from vehicles.", "priority": "priority-high"},
                        {"title": "⛽ Fuel Considerations", "description": "Ensure adequate fuel for evacuation. Top off tanks if safe to do so.", "priority": "priority-high"}
                    ]
                },
                {
                    "title": "DAMAGE PREVENTION (30 MIN - 2 HOURS)",
                    "items": [
                        {"title": "🏠 Garage Protection", "description": "Secure garage doors and openings to prevent water intrusion or wind damage.", "priority": "priority-medium"},
                        {"title": "🔧 Equipment Elevation", "description": "Raise lawn equipment, tools, and machinery above potential flood levels.", "priority": "priority-medium"},
                        {"title": "📸 Pre-Loss Documentation", "description": "Photograph all vehicles and equipment for insurance purposes.", "priority": "priority-medium"}
                    ]
                },
                {
                    "title": "RECOVERY PLANNING (2-24 HOURS)",
                    "items": [
                        {"title": "🔍 Vehicle Inspection", "description": "Inspect vehicles for water, smoke, or impact damage before operation.", "priority": "priority-low"},
                        {"title": "📋 Insurance Notification", "description": "Contact auto and property insurance for coverage of damaged vehicles/equipment.", "priority": "priority-low"},
                        {"title": "🚛 Professional Towing", "description": "Arrange professional towing for damaged vehicles to prevent further harm.", "priority": "priority-low"}
                    ]
                }
            ]
        }
    ]

def main():
    """Generate remaining checklist HTML files"""

    # Create output directory
    output_dir = Path("public/checklists/assets/pdfs")
    output_dir.mkdir(parents=True, exist_ok=True)

    checklists = get_remaining_checklists()

    print(f"Generating {len(checklists)} remaining PDF checklists...")

    for checklist in checklists:
        html_content = create_checklist_html(checklist)

        # Save HTML file
        html_file = output_dir / f"{checklist['filename']}.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ Generated: {checklist['filename']}.html")

    print(f"\n🎯 Final HTML templates created in: {output_dir}")
    print("📄 Complete set of 16 professional checklists ready for PDF conversion")

if __name__ == "__main__":
    main()