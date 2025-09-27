#!/usr/bin/env python3
"""
Fix PDF checklist logos to match the exact styling from page headers
Use height: 85px and width: auto for proper logo display
"""

import os
import re
from pathlib import Path

def fix_logo_styling_in_file(file_path):
    """Fix logo styling to match header implementation"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update CSS for logo-image to match header styling
    old_css_pattern = r'\.logo-image\s*\{[^}]*\}'
    new_css = '''        .logo-image {
            height: 85px;
            width: auto;
            margin-right: 15px;
            clip-path: inset(0 0 12% 0);
        }'''

    content = re.sub(old_css_pattern, new_css, content, flags=re.DOTALL)

    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    """Fix logo styling in all checklist files"""

    # Path to PDF checklists
    pdf_dir = Path("public/checklists/assets/pdfs")

    if not pdf_dir.exists():
        print(f"❌ Directory not found: {pdf_dir}")
        return

    # Get all HTML files
    html_files = list(pdf_dir.glob("*.html"))

    print(f"🔧 Fixing logo styling in {len(html_files)} checklist files")
    print("=" * 60)

    updated_count = 0

    for file_path in html_files:
        try:
            fix_logo_styling_in_file(file_path)
            print(f"✅ Fixed logo styling: {file_path.name}")
            updated_count += 1

        except Exception as e:
            print(f"❌ Error fixing {file_path.name}: {e}")

    print("=" * 60)
    print(f"🎯 LOGO STYLING FIX COMPLETE: {updated_count}/{len(html_files)} files updated")
    print("📏 Updated to match header styling: height: 85px, width: auto")
    print("✂️ Clean clipping maintained: clip-path: inset(0 0 12% 0)")

if __name__ == "__main__":
    main()