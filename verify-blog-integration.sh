#!/bin/bash

# AUTOMATED BLOG INTEGRATION VERIFICATION SCRIPT
# Verifies that all blog integration components are properly in place

set -e

echo "🔍 VERIFYING AUTOMATED BLOG INTEGRATION"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Success/failure counters
success_count=0
total_checks=0

# Check function
check_item() {
    local description="$1"
    local test_command="$2"
    local success_msg="$3"
    local failure_msg="$4"

    total_checks=$((total_checks + 1))
    printf "%-50s" "$description"

    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        [ -n "$success_msg" ] && echo "   $success_msg"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        [ -n "$failure_msg" ] && echo "   $failure_msg"
    fi
}

echo -e "${BLUE}1. BLOG FILES VERIFICATION${NC}"
echo "-------------------------"

check_item "Blog index page exists" \
           "[ -f 'blog/index.html' ]" \
           "Blog main page found" \
           "Blog index.html missing"

check_item "Blog CSS file exists" \
           "[ -f 'css/blog-preview-styles.css' ]" \
           "Blog preview styles found" \
           "Blog preview CSS missing"

check_item "Homepage blog section file exists" \
           "[ -f 'homepage-blog-section.html' ]" \
           "Blog section template found" \
           "Blog section template missing"

echo ""
echo -e "${BLUE}2. BLOG POSTS VERIFICATION${NC}"
echo "-------------------------"

check_item "DC Art Restoration post exists" \
           "[ -f 'blog/art-restoration/dc-art-restoration-success-stories.html' ]" \
           "DC museum pieces blog post found" \
           "DC art restoration post missing"

check_item "Northern VA post exists" \
           "[ -f 'blog/art-restoration/northern-va-fine-art-recovery.html' ]" \
           "Northern VA estate recovery post found" \
           "Northern VA post missing"

check_item "Emergency Annapolis post exists" \
           "[ -f 'blog/art-restoration/emergency-art-restoration-annapolis.html' ]" \
           "Emergency response post found" \
           "Emergency Annapolis post missing"

check_item "Church electronics post exists" \
           "[ -f 'blog/electronics-restoration/church-musical-electronics-dmv.html' ]" \
           "Church fire recovery post found" \
           "Church electronics post missing"

echo ""
echo -e "${BLUE}3. AUTOMATED HOMEPAGE INTEGRATION VERIFICATION${NC}"
echo "---------------------------------------------"

check_item "Blog CSS linked in homepage" \
           "grep -q 'blog-preview-styles.css' public/index.html" \
           "Blog CSS automatically linked" \
           "Blog CSS not linked in homepage"

check_item "Blog section integrated in homepage" \
           "grep -q 'featured-blog-section' public/index.html" \
           "Blog preview section automatically integrated" \
           "Blog section not integrated in homepage"

check_item "Blog navigation link in homepage" \
           "grep -q 'blog/index.html' public/index.html" \
           "Blog navigation link found" \
           "Blog nav link missing in homepage"

echo ""
echo -e "${BLUE}4. NAVIGATION INTEGRATION VERIFICATION${NC}"
echo "-------------------------------------"

check_item "Blog nav in about-us.html" \
           "grep -q 'blog/index.html' public/about-us.html" \
           "Blog link found in about page" \
           "Blog link missing in about page"

check_item "Blog nav in contact.html" \
           "grep -q 'blog/index.html' public/contact.html" \
           "Blog link found in contact page" \
           "Blog link missing in contact page"

check_item "Blog nav in FAQ page" \
           "grep -q 'blog/index.html' faq.html" \
           "Blog link found in FAQ page" \
           "Blog link missing in FAQ page"

echo ""
echo -e "${BLUE}5. AUTOMATED BACKUP AND ROLLBACK VERIFICATION${NC}"
echo "--------------------------------------------"

check_item "Homepage backup automatically created" \
           "[ -f 'public/index.html.backup' ]" \
           "Original homepage automatically backed up" \
           "No backup found - rollback unavailable"

check_item "Rollback script automatically created" \
           "[ -f 'rollback-homepage-integration.sh' ]" \
           "Rollback script automatically generated" \
           "Rollback script missing"

check_item "Rollback script is executable" \
           "[ -x 'rollback-homepage-integration.sh' ]" \
           "Rollback script ready to use" \
           "Rollback script not executable"

echo ""
echo "========================================"
echo -e "${BLUE}AUTOMATED INTEGRATION VERIFICATION SUMMARY${NC}"
echo "========================================"

if [ $success_count -eq $total_checks ]; then
    echo -e "${GREEN}🎉 ALL AUTOMATED CHECKS PASSED! ($success_count/$total_checks)${NC}"
    echo ""
    echo -e "${GREEN}✅ AUTOMATED BLOG INTEGRATION COMPLETED SUCCESSFULLY${NC}"
    echo ""
    echo "🔗 What was automatically completed:"
    echo "   • Homepage backup created"
    echo "   • Blog preview section inserted into homepage"
    echo "   • CSS link automatically added to homepage"
    echo "   • Rollback script generated and made executable"
    echo ""
    echo "🔧 Available automated commands:"
    echo "   • Rollback: ./rollback-homepage-integration.sh"
    echo "   • Re-verify: ./verify-blog-integration.sh"
    echo ""
    echo "🌐 Ready for browser testing:"
    echo "   • Test all blog links"
    echo "   • Verify mobile responsiveness"
    echo "   • Check page load speeds"
else
    echo -e "${YELLOW}⚠️  AUTOMATED INTEGRATION INCOMPLETE ($success_count/$total_checks checks passed)${NC}"
    echo ""
    echo "🔧 Please resolve failed checks above before launch"
    echo ""
    echo "📧 Regional Phone Numbers Used:"
    echo "   Washington DC: 202-335-4240"
    echo "   Maryland: 301-215-3191"
    echo "   Northern Virginia: 703-229-1321"
fi

echo ""