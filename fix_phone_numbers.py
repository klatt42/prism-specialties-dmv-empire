#!/usr/bin/env python3
import os
import re

def fix_phone_numbers():
    print("🔍 FIXING PHONE NUMBERS IN PDF CHECKLISTS")
    print("==========================================")
    print("Replacing (888) 826-9429 with (301) 215-3191 (MD default)")
    print()

    # Files that need phone number updates
    files_to_update = [
        'public/checklists/assets/pdfs/art-antiques-emergency-preservation.html',
        'public/checklists/assets/pdfs/basement-flood-emergency-pump-dry.html',
        'public/checklists/assets/pdfs/electronics-restoration-data-recovery.html',
        'public/checklists/assets/pdfs/fire-damage-first-48-hours.html',
        'public/checklists/assets/pdfs/hvac-emergency-system-damage.html',
        'public/checklists/assets/pdfs/insurance-claims-emergency-documentation.html',
        'public/checklists/assets/pdfs/kitchen-emergency-appliance-damage.html',
        'public/checklists/assets/pdfs/lightning-strike-power-surge.html',
        'public/checklists/assets/pdfs/mold-prevention-immediate-response.html',
        'public/checklists/assets/pdfs/roof-emergency-immediate-leak-protection.html',
        'public/checklists/assets/pdfs/smoke-damage-air-quality.html',
        'public/checklists/assets/pdfs/storm-damage-structure-assessment.html',
        'public/checklists/assets/pdfs/textile-restoration-fabric-care.html',
        'public/checklists/assets/pdfs/vehicle-storage-emergency-asset-protection.html',
        'public/checklists/assets/pdfs/water-emergency-save-what-matters.html',
        'public/checklists/pdf-viewer/viewer.html',
        'public/checklists/pdf-viewer/index.html',
        'public/checklists/pdf-generator.html'
    ]

    updated_count = 0
    total_replacements = 0

    for file_path in files_to_update:
        if os.path.exists(file_path):
            print(f"📄 Processing: {file_path}")

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Count matches before replacement
                matches = len(re.findall(r'\(888\) 826-9429', content))

                if matches > 0:
                    # Replace the phone number
                    updated_content = re.sub(
                        r'\(888\) 826-9429',
                        '(301) 215-3191',
                        content
                    )

                    # Write back to file
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)

                    print(f"   ✅ Updated {matches} instance(s)")
                    updated_count += 1
                    total_replacements += matches
                else:
                    print(f"   ℹ️  No instances found")

            except Exception as e:
                print(f"   ❌ Error processing file: {e}")
        else:
            print(f"❌ File not found: {file_path}")

    print()
    print("🎯 PHONE NUMBER UPDATE SUMMARY")
    print("==============================")
    print(f"Files updated: {updated_count}")
    print(f"Total replacements: {total_replacements}")
    print(f"Changed: (888) 826-9429 → (301) 215-3191")
    print("MD number used as default for multi-region checklists")

if __name__ == "__main__":
    fix_phone_numbers()