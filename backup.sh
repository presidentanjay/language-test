#!/bin/bash

# ==============================================================================
# MySQL Database Backup Script for language-test
# Usage: ./backup.sh
# Can be run via cron (e.g., every day at 2 AM): 0 2 * * * /path/to/backup.sh
# ==============================================================================

# Database credentials (should match your .env or docker-compose)
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="app"

# Backup directory
BACKUP_DIR="$(pwd)/backups"
mkdir -p "$BACKUP_DIR"

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

# Cleanup old backups (Keep only the last 7 days)
echo "[$(date)] Cleaning up backups older than 7 days..."
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

echo "[$(date)] Backup process finished."
