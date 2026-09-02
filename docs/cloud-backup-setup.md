# Cloud Backup Setup Guide (`rclone`)

This guide explains how to set up automated cloud backups for the **language-test** MySQL database using [`rclone`](https://rclone.org/).

---

## 1. Installing `rclone`

### Linux (Ubuntu / Debian / CentOS / etc.)
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

### macOS (via Homebrew)
```bash
brew install rclone
```

### Verification
Verify that `rclone` is correctly installed:
```bash
rclone version
```

---

## 2. Configuring Google Drive

Run the interactive configuration wizard:

```bash
rclone config
```

Follow these interactive prompts:
1. Enter `n` to create a **New remote**.
2. **Name**: `gdrive` (matches default in `backup.sh`).
3. **Storage Type**: Select Google Drive (enter `drive` or its listed number).
4. **Client ID / Secret**: Leave blank to use defaults (or provide your custom Google Cloud OAuth credentials for higher rate limits).
5. **Scope**: Enter `1` (Full access to all files).
6. **Service Account File**: Leave blank unless using a GCP service account JSON key.
7. **Edit advanced config?**: Enter `n`.
8. **Use web browser to authenticate?**: Enter `y` (if configuring on a local machine with a browser) or `n` (headless server: run `rclone authorize "drive"` on your local machine and paste the auth token).
9. **Configure as a Shared Drive (Team Drive)?**: Enter `n` (unless using Google Workspace Shared Drive).
10. Confirm with `y` and quit with `q`.

---

## 3. Testing the Connection

Verify that `rclone` can connect and list your drive:

```bash
# List top-level directories in Google Drive
rclone lsd gdrive:

# Test creating the backup folder and uploading a test file
echo "test" > /tmp/rclone-test.txt
rclone copy /tmp/rclone-test.txt gdrive:backups/language-test/
rclone ls gdrive:backups/language-test/

# Clean up test file
rclone deletefile gdrive:backups/language-test/rclone-test.txt
rm /tmp/rclone-test.txt
```

---

## 4. Enabling Cloud Backup & Setting Up Cron

### Enabling Cloud Backup
You can enable cloud backups in `backup.sh` by either:
1. Editing `backup.sh` directly:
   ```bash
   CLOUD_BACKUP_ENABLED=true
   CLOUD_REMOTE="gdrive:backups/language-test"
   ```
2. Or exporting environment variables prior to script execution:
   ```bash
   export CLOUD_BACKUP_ENABLED=true
   export CLOUD_REMOTE="gdrive:backups/language-test"
   ```

### Setting Up a Daily Cron Job

Open your crontab editor:
```bash
crontab -e
```

Add a scheduled task to run every day at 2:00 AM (adjust paths as needed):
```cron
0 2 * * * cd /Users/m/Projects/GitHub/language-test && CLOUD_BACKUP_ENABLED=true ./backup.sh >> /Users/m/Projects/GitHub/language-test/backups/backup.log 2>&1
```

> **Note**: If running on macOS or Linux with restrictive cron environments, ensure `/usr/local/bin` or the path where `rclone` and `mysqldump` reside is included in cron's `PATH` variable at the top of your crontab:
> ```cron
> PATH=/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin
> ```

---

## 5. Configuring Other Cloud Providers

`rclone` supports over 40 cloud storage providers. You can easily switch destinations by creating a new remote in `rclone config` and updating `CLOUD_REMOTE` in `backup.sh`.

### A. AWS S3 / Cloudflare R2 / MinIO

1. Run `rclone config` and create a remote (e.g., `s3remote`).
2. Select storage type `s3`.
3. Select your provider (`AWS`, `Cloudflare`, `Minio`, etc.).
4. Enter your `access_key_id` and `secret_access_key`.
5. Enter region (e.g., `ap-southeast-1` or `us-east-1`) and endpoint if using R2 / MinIO.
6. Set `CLOUD_REMOTE` in `backup.sh`:
   ```bash
   CLOUD_REMOTE="s3remote:my-backup-bucket/language-test"
   ```

### B. Dropbox

1. Run `rclone config` and create a remote (e.g., `dropbox`).
2. Select storage type `dropbox`.
3. Follow browser authentication to authorize Dropbox.
4. Set `CLOUD_REMOTE` in `backup.sh`:
   ```bash
   CLOUD_REMOTE="dropbox:backups/language-test"
   ```

### Testing any configured remote:
```bash
rclone lsd <remote_name>:
```
