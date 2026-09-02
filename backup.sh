#!/bin/bash

# ==============================================================================
# MySQL Database Backup Script for language-test (with Cloud Backup support)
# Usage: ./backup.sh
# Can be run via cron (e.g., every day at 2 AM): 0 2 * * * /path/to/backup.sh
#
# Rclone Setup for Google Drive:
# 1. Install rclone:
#    - Linux: curl https://rclone.org/install.sh | sudo bash
#    - macOS: brew install rclone
# 2. Configure Google Drive remote:
#    - Run 'rclone config'
#    - Choose 'n' (New remote), name it 'gdrive'
#    - Choose storage type 'drive' (Google Drive)
#    - Leave client_id & client_secret blank (or provide your own)
#    - Choose scope '1' (Full access)
#    - Complete the OAuth browser authorization
# 3. Test the connection:
#    - Run: rclone lsd gdrive:
# 4. Enable cloud backup:
#    - Set CLOUD_BACKUP_ENABLED=true in this script or environment
# ==============================================================================

# Database credentials (should match your .env or docker-compose)
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="app"

# Backup directory
BACKUP_DIR="$(pwd)/backups"
mkdir -p "$BACKUP_DIR"

# Cloud Backup Settings (rclone)
CLOUD_BACKUP_ENABLED=${CLOUD_BACKUP_ENABLED:-false}
CLOUD_REMOTE=${CLOUD_REMOTE:-"gdrive:backups/language-test"}

# Current date string (e.g., 2026-08-24_02-00-00)
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/db_backup_$DATE.sql.gz"

echo "[$(date)] Starting database backup for $DB_NAME..."

# If using Docker (replace language_test_mysql with your container name if different):
# docker exec language_test_mysql /usr/bin/mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME | gzip > "$FILENAME"

# If using local MySQL installation:
mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME | gzip > "$FILENAME"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup successfully saved to $FILENAME"
else
  echo "[$(date)] Error occurred during backup!"
  exit 1
fi

# Cloud Backup Upload via rclone
if [ "$CLOUD_BACKUP_ENABLED" = "true" ]; then
  echo "[$(date)] Cloud backup is enabled. Uploading to $CLOUD_REMOTE..."
  
  if ! command -v rclone &> /dev/null; then
    echo "[$(date)] Error: 'rclone' command not found. Please install rclone to use cloud backups."
  else
    rclone copy "$FILENAME" "$CLOUD_REMOTE"
    if [ $? -eq 0 ]; then
      echo "[$(date)] Cloud backup successfully uploaded to $CLOUD_REMOTE"
    else
      echo "[$(date)] Error: Failed to upload backup to cloud remote ($CLOUD_REMOTE)."
    fi
  fi
fi

# Cleanup old backups (Keep only the last 7 days)
echo "[$(date)] Cleaning up backups older than 7 days..."
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

echo "[$(date)] Backup process finished."
