#!/usr/bin/env python3
"""
Fix logo image paths in PDF checklists and remove alt text
The correct path from PDFs to logo is ../../../images/logos/prism-logo-1000.png
"""

import os
import re
from pathlib import Path

def fix_logo_path_in_file(file_path):
    """Fix logo path and remove alt text in a single file"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the image src path and remove alt text
    old_img_pattern = r'<img src="[^"]*prism-logo-1000\.png" alt="[^"]*" class="logo-image">'
    new_img = '<img src="../../../images/logos/prism-logo-1000.png" class="logo-image">'

    content = re.sub(old_img_pattern, new_img, content)

    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    """Fix logo paths in all checklist files"""

    # Path to PDF checklists
    pdf_dir = Path("public/checklists/assets/pdfs")

    if not pdf_dir.exists():
        print(f"❌ Directory not found: {pdf_dir}")
        return

    # Get all HTML files
    html_files = list(pdf_dir.glob("*.html"))

    print(f"🔧 Fixing logo paths in {len(html_files)} checklist files")
    print("=" * 60)

    updated_count = 0

    for file_path in html_files:
        try:
            fix_logo_path_in_file(file_path)
            print(f"✅ Fixed logo path: {file_path.name}")
            updated_count += 1

        except Exception as e:
            print(f"❌ Error fixing {file_path.name}: {e}")

    print("=" * 60)
    print(f"🎯 LOGO PATH FIX COMPLETE: {updated_count}/{len(html_files)} files updated")
    print("📁 Correct path: ../../../images/logos/prism-logo-1000.png")
    print("🚫 Alt text removed to prevent fallback text display")

if __name__ == "__main__":
    main()