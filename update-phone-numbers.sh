#!/bin/bash
echo "📞 UPDATING PHONE NUMBERS BY GEOGRAPHIC REGION"

# Update Maryland pages to MD phone: 301-215-3191  
echo "🏛️ Updating Maryland pages..."
find geographic/western-maryland -name "*.html" -exec sed -i 's/301-215-3305/301-215-3191/g' {} \;
find geographic/western-maryland -name "*.html" -exec sed -i 's/3012153305/3012153191/g' {} \;
find geographic/western-maryland -name "*.html" -exec sed -i 's/tel:3012153305/tel:3012153191/g' {} \;

# Update Virginia pages to VA phone: 703-229-1321
echo "🏞️ Updating Virginia pages..."
find geographic/northern-virginia -name "*.html" -exec sed -i 's/301-215-3305/703-229-1321/g' {} \;
find geographic/northern-virginia -name "*.html" -exec sed -i 's/3012153305/7032291321/g' {} \;
find geographic/northern-virginia -name "*.html" -exec sed -i 's/tel:3012153305/tel:7032291321/g' {} \;

# Update DC pages to DC phone: 202-335-4240
echo "🏛️ Updating DC pages..."
find geographic/washington-dc -name "*.html" -exec sed -i 's/301-215-3305/202-335-4240/g' {} \;
find geographic/washington-dc -name "*.html" -exec sed -i 's/3012153305/2023354240/g' {} \;
find geographic/washington-dc -name "*.html" -exec sed -i 's/tel:3012153305/tel:2023354240/g' {} \;

echo "✅ Phone number update complete!"