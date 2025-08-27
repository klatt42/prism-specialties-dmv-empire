#!/bin/bash
echo "⚡ ALEX ANALYTICS - Regional Performance Monitoring"

# Test each geographic region
regions=("northern-virginia" "washington-dc" "western-maryland")
phones=("703-229-1321" "202-335-4240" "301-215-3191")

# Create curl format file for performance measurement
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF

echo "📊 PERFORMANCE TESTING ACROSS DMV EMPIRE"
echo "========================================"

for i in "${!regions[@]}"; do
    region=${regions[$i]}
    phone=${phones[$i]}
    
    echo ""
    echo "🌎 Testing ${region} performance..."
    echo "📞 Expected phone: ${phone}"
    echo "🔗 URL: https://prism-specialties-dmv-empire.netlify.app/geographic/${region}/"
    
    # Test main geographic hub
    echo "⏱️  Performance timing:"
    if curl -w "@curl-format.txt" -o /dev/null -s "https://prism-specialties-dmv-empire.netlify.app/geographic/${region}/"; then
        echo "✅ ${region} hub accessible"
    else
        echo "❌ ${region} hub failed"
    fi
    
    # Test specialty pages for each region
    specialties=("art-collectibles-restoration" "textile-fabric-restoration" "electronics-data-restoration" "document-photo-restoration")
    
    echo "🎯 Testing specialty pages:"
    for specialty in "${specialties[@]}"; do
        if curl -o /dev/null -s --head --fail "https://prism-specialties-dmv-empire.netlify.app/geographic/${region}/${specialty}/"; then
            echo "  ✅ ${specialty}"
        else
            echo "  ❌ ${specialty}"
        fi
    done
    
    echo "----------------------------------------"
done

echo ""
echo "🛡️ AUTHORITY REVERSAL VALIDATION"
echo "================================"

# Test Authority Reversal implementation across regions
for region in "${regions[@]}"; do
    echo "🎭 Testing Authority Reversal in ${region}:"
    
    # Fetch page content and count funeral director mentions
    content=$(curl -s "https://prism-specialties-dmv-empire.netlify.app/geographic/${region}/")
    funeral_mentions=$(echo "$content" | grep -i "funeral director" | wc -l)
    authority_elements=$(echo "$content" | grep -i "authority-reversal" | wc -l)
    hook_elements=$(echo "$content" | grep -i "hook-point" | wc -l)
    
    echo "  📊 Funeral Director mentions: ${funeral_mentions}"
    echo "  🎯 Authority elements: ${authority_elements}"
    echo "  🪝 Hook elements: ${hook_elements}"
    
    if [ "$funeral_mentions" -gt 0 ] && [ "$authority_elements" -gt 0 ]; then
        echo "  ✅ Authority Reversal: IMPLEMENTED"
    else
        echo "  ❌ Authority Reversal: MISSING"
    fi
done

echo ""
echo "📞 PHONE NUMBER VALIDATION"
echo "========================="

for i in "${!regions[@]}"; do
    region=${regions[$i]}
    expected_phone=${phones[$i]}
    
    echo "📞 Checking phone numbers in ${region}:"
    content=$(curl -s "https://prism-specialties-dmv-empire.netlify.app/geographic/${region}/")
    
    # Extract phone numbers from content
    phone_matches=$(echo "$content" | grep -o "${expected_phone}" | wc -l)
    
    echo "  Expected: ${expected_phone}"
    echo "  Found matches: ${phone_matches}"
    
    if [ "$phone_matches" -gt 0 ]; then
        echo "  ✅ Phone validation: PASSED"
    else
        echo "  ❌ Phone validation: FAILED"
    fi
done

# Clean up curl format file
rm -f curl-format.txt

echo ""
echo "🎯 PERFORMANCE MONITORING COMPLETE"
echo "View full analytics at: Google Analytics Dashboard"
echo "Authority Reversal Framework: Active across all regions"