#!/bin/bash
echo "🎯 PRISM SPECIALTIES DMV - BMAD TEAM AUDIT SYSTEM"
echo "Oscar Operations VP coordinating Victoria Validator + Elena Execution"
echo "================================================================="

cd ~/prism-specialties-dmv-empire

echo "📁 Current directory: $(pwd)"
echo "📊 Files in repository:"
ls -la

echo ""
echo "🚀 RUNNING MASTER AUDIT..."
node audit-scripts/oscar-master-coordinator.js