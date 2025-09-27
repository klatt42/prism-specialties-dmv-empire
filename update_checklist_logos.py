#!/usr/bin/env python3
"""
Update all PDF checklist files to use actual Prism Specialties logo
instead of placeholder logos
"""

import os
import re
from pathlib import Path

def update_logo_in_file(file_path):
    """Update logo placeholder with actual logo in a single file"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update CSS for logo placeholder to logo-image
    css_pattern = r'\.logo-placeholder\s*\{[^}]*\}'
    css_replacement = '''        .logo-image {
            width: 60px;
            height: 40px;
            margin-right: 15px;
            clip-path: inset(0 0 12% 0);
        }'''

    content = re.sub(css_pattern, css_replacement, content, flags=re.DOTALL)

    # Update HTML placeholder with actual image
    html_pattern = r'<div class="logo-placeholder">[^<]*</div>'
    html_replacement = '<img src="../../images/logos/prism-logo-1000.png" alt="Prism Specialties DMV" class="logo-image">'

    content = re.sub(html_pattern, html_replacement, content)

    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    """Update all checklist files"""

    # Path to PDF checklists
    pdf_dir = Path("public/checklists/assets/pdfs")

    if not pdf_dir.exists():
        print(f"❌ Directory not found: {pdf_dir}")
        return

    # Get all HTML files
    html_files = list(pdf_dir.glob("*.html"))

    print(f"🔍 Found {len(html_files)} HTML checklist files to update")
    print("=" * 60)

    updated_count = 0

    for file_path in html_files:
        try:
            # Skip the fire damage file since we already updated it manually
            if "fire-damage-first-48-hours.html" in str(file_path):
                print(f"⏭️  Skipping {file_path.name} (already updated manually)")
                updated_count += 1
                continue

            update_logo_in_file(file_path)
            print(f"✅ Updated: {file_path.name}")
            updated_count += 1

        except Exception as e:
            print(f"❌ Error updating {file_path.name}: {e}")

    print("=" * 60)
    print(f"🎯 LOGO UPDATE COMPLETE: {updated_count}/{len(html_files)} files updated")
    print("📄 All PDF checklists now use actual Prism Specialties logo")
    print("🔧 Logo includes clean clipping to match page headers")

if __name__ == "__main__":
    main()