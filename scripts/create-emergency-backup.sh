#!/bin/bash

# Emergency Backup Script
# Creates complete backup before any reversion operations

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="pre-reversion-$TIMESTAMP"
BACKUP_DIR="../emergency-backups-complete/$BACKUP_NAME"
SOURCE_DIR="."

echo "🚨 CREATING EMERGENCY BACKUP"
echo "============================"
echo "Backup name: $BACKUP_NAME"
echo "Source: $SOURCE_DIR"
echo "Destination: $BACKUP_DIR"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📁 Creating directory structure backup..."
# Copy all files except excluded patterns
rsync -av \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='backups' \
  --exclude='emergency-backups' \
  --exclude='emergency-backups-complete' \
  --progress \
  "$SOURCE_DIR/" "$BACKUP_DIR/"

echo ""
echo "📊 Generating backup manifest..."

# Create detailed manifest
cat > "$BACKUP_DIR/backup-manifest.json" << EOF
{
  "backupDate": "$(date -Iseconds)",
  "backupName": "$BACKUP_NAME",
  "sourceDirectory": "$SOURCE_DIR",
  "backupDirectory": "$BACKUP_DIR",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "totalFiles": $(find "$BACKUP_DIR" -type f | wc -l),
  "totalSize": "$(du -sh "$BACKUP_DIR" | cut -f1)",
  "excludedPatterns": [".git", "node_modules", "backups", "emergency-backups"],
  "purpose": "Pre-reversion emergency backup"
}
EOF

# Create file inventory
echo "📋 Creating file inventory..."
find "$BACKUP_DIR" -type f -exec ls -la {} \; > "$BACKUP_DIR/file-inventory.txt"

# Get git status for reference
echo "🔍 Capturing git status..."
git status > "$BACKUP_DIR/git-status.txt" 2>/dev/null || echo "Git not available" > "$BACKUP_DIR/git-status.txt"
git log --oneline -10 > "$BACKUP_DIR/git-recent-commits.txt" 2>/dev/null || echo "Git not available" > "$BACKUP_DIR/git-recent-commits.txt"

# Compress backup
echo "🗜️  Compressing backup..."
cd "$(dirname "$BACKUP_DIR")"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME/"
COMPRESSED_SIZE=$(du -sh "$BACKUP_NAME.tar.gz" | cut -f1)

echo ""
echo "✅ EMERGENCY BACKUP COMPLETE"
echo "============================"
echo "📁 Directory backup: $BACKUP_DIR"
echo "🗜️  Compressed backup: $(dirname "$BACKUP_DIR")/$BACKUP_NAME.tar.gz"
echo "📊 Backup size: $COMPRESSED_SIZE"
echo "📋 Files backed up: $(find "$BACKUP_DIR" -type f | wc -l)"
echo "🕒 Timestamp: $TIMESTAMP"
echo ""
echo "🔍 VERIFICATION:"
echo "• Manifest: $BACKUP_DIR/backup-manifest.json"
echo "• Inventory: $BACKUP_DIR/file-inventory.txt"
echo "• Git status: $BACKUP_DIR/git-status.txt"
echo ""
echo "⚠️  READY FOR REVERSION OPERATIONS"