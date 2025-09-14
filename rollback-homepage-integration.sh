#!/bin/bash

# HOMEPAGE BLOG INTEGRATION ROLLBACK SCRIPT
# Usage: ./rollback-homepage-integration.sh

set -e

echo "🔄 Rolling back homepage blog integration..."

# Check if backup exists
if [ ! -f "public/index.html.backup" ]; then
    echo "❌ ERROR: Backup file 'public/index.html.backup' not found!"
    echo "Cannot rollback - no backup available."
    exit 1
fi

# Restore original homepage
echo "📁 Restoring original homepage from backup..."
cp public/index.html.backup public/index.html

# Verify rollback
if [ -f "public/index.html" ]; then
    echo "✅ Homepage successfully restored from backup"
    echo ""
    echo "🔍 Verification:"
    echo "   - Blog section removed from homepage"
    echo "   - Blog CSS link removed"
    echo "   - Original homepage layout restored"
    echo ""
    echo "📋 Manual cleanup options:"
    echo "   - Keep backup: rm public/index.html.backup"
    echo "   - Keep blog files: rm -rf blog/ css/blog-preview-styles.css"
    echo ""
    echo "✨ Rollback completed successfully!"
else
    echo "❌ ERROR: Rollback failed - homepage file missing"
    exit 1
fi