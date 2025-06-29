# Greenhouse Application - Raspberry Pi Setup Guide

## Prerequisites

1. Raspberry Pi with Raspberry Pi OS installed
2. Node.js 18+ installed on Raspberry Pi
3. SSH access to your Raspberry Pi
4. Git installed on Raspberry Pi
5. PM2 installed globally on Raspberry Pi

## Step 1: Initial Raspberry Pi Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create application directory
mkdir -p /home/pi/greenhouse
```

## Step 2: Install Required Dependencies

```bash
# Install development tools
sudo apt install -y build-essential git

# Install Node.js dependencies globally
sudo npm install -g typescript @vitejs/plugin-react vite
```

## Step 3: Application Deployment

1. **Transfer Files to Raspberry Pi**
   ```bash
   # From your development machine
   rsync -avz --exclude 'node_modules' --exclude '.git' \
   /path/to/your/greenhouse/ pi@raspberrypi.local:/home/pi/greenhouse/
   ```

2. **Install Dependencies on Raspberry Pi**
   ```bash
   cd /home/pi/greenhouse
   npm install --production
   ```

3. **Build the Application**
   ```bash
   npm run build
   ```

## Step 4: PM2 Configuration

1. **Start the Application with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

2. **Enable Startup Script**
   ```bash
   pm2 startup
   # Run the command that PM2 outputs
   pm2 save
   ```

## Step 5: Port Configuration

1. **Verify Port Availability**
   ```bash
   sudo lsof -i :5175
   ```

2. **Configure Firewall (if enabled)**
   ```bash
   sudo ufw allow 5175
   ```

## Step 6: Environment Setup

1. **Create logs directory**
   ```bash
   mkdir -p /home/pi/greenhouse/logs
   ```

2. **Set permissions**
   ```bash
   chmod 755 /home/pi/greenhouse
   chmod 644 /home/pi/greenhouse/ecosystem.config.js
   ```

## Verification Steps

1. **Check Application Status**
   ```bash
   pm2 status
   pm2 logs greenhouse-frontend
   ```

2. **Test Application Access**
   - Local: http://localhost:5175
   - Network: http://[raspberry-pi-ip]:5175

## Troubleshooting

1. **If the application shows a blank screen:**
   - Check PM2 logs: `pm2 logs greenhouse-frontend`
   - Verify build files: `ls -la /home/pi/greenhouse/dist`
   - Check Node.js version: `node --version`

2. **If port 5175 is unavailable:**
   - Check running processes: `sudo netstat -tulpn | grep 5175`
   - Kill process if needed: `sudo kill -9 [PID]`

3. **If PM2 fails to start:**
   - Check PM2 error logs: `pm2 logs`
   - Verify ecosystem.config.js permissions
   - Restart PM2 daemon: `pm2 kill && pm2 start ecosystem.config.js`

## Maintenance

1. **Regular Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y

   # Update npm packages
   npm update

   # Rebuild application
   npm run build

   # Restart PM2 process
   pm2 restart greenhouse-frontend
   ```

2. **Log Rotation**
   PM2 automatically handles log rotation with these settings in ecosystem.config.js:
   - Error logs: `/home/pi/greenhouse/logs/error.log`
   - Output logs: `/home/pi/greenhouse/logs/out.log`

## Security Recommendations

1. **File Permissions**
   ```bash
   # Set proper ownership
   sudo chown -R pi:pi /home/pi/greenhouse
   
   # Set proper file permissions
   find /home/pi/greenhouse -type d -exec chmod 755 {} \;
   find /home/pi/greenhouse -type f -exec chmod 644 {} \;
   ```

2. **Network Security**
   - Use HTTPS if exposing to the internet
   - Consider setting up Nginx as a reverse proxy
   - Implement rate limiting
   - Keep system and packages updated

## Backup Procedure

1. **Create Backup Script**
   ```bash
   #!/bin/bash
   BACKUP_DIR="/home/pi/backups"
   mkdir -p $BACKUP_DIR
   tar -czf $BACKUP_DIR/greenhouse-$(date +%Y%m%d).tar.gz /home/pi/greenhouse
   find $BACKUP_DIR -mtime +7 -delete
   ```

2. **Schedule Regular Backups**
   ```bash
   # Add to crontab
   0 0 * * * /home/pi/backup-greenhouse.sh
   ```

## Support

For additional support or troubleshooting:
1. Check PM2 logs: `pm2 logs greenhouse-frontend`
2. Check system logs: `journalctl -u pm2-pi`
3. Monitor resource usage: `pm2 monit` 