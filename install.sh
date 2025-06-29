#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored status messages
print_status() {
    echo -e "${GREEN}[✓] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
    echo -e "${RED}[✗] $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running on Raspberry Pi
if [ -f /etc/rpi-issue ]; then
    IS_RASPBERRY_PI=true
else
    IS_RASPBERRY_PI=false
fi

echo "=== Greenhouse Control System Installation ==="
echo "This script will install all necessary components for the greenhouse system."

# 1. System Updates
print_status "Updating system packages..."
if [ "$IS_RASPBERRY_PI" = true ]; then
    sudo apt update && sudo apt upgrade -y
    
    # Install required system packages
    print_status "Installing system dependencies..."
    sudo apt install -y build-essential git python3 python3-pip nodejs npm
else
    print_warning "Not running on Raspberry Pi - skipping system updates"
fi

# 2. Node.js Setup
if ! command_exists node; then
    print_status "Installing Node.js..."
    if [ "$IS_RASPBERRY_PI" = true ]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    else
        print_error "Please install Node.js manually on non-Raspberry Pi systems"
        exit 1
    fi
fi

# 3. PM2 Installation
if ! command_exists pm2; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# 4. Project Directory Setup
print_status "Setting up project directory..."
PROJECT_DIR="/home/pi/greenhouse"
if [ "$IS_RASPBERRY_PI" = true ]; then
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown -R pi:pi "$PROJECT_DIR"
else
    mkdir -p "$PROJECT_DIR"
fi

# 5. Arduino CLI Installation (if not already installed)
if ! command_exists arduino-cli; then
    print_status "Installing Arduino CLI..."
    curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
    export PATH=$PATH:$HOME/bin
fi

# 6. Arduino Libraries Installation
print_status "Installing Arduino libraries..."
arduino-cli core install arduino:avr
arduino-cli lib install "DHT sensor library"
arduino-cli lib install "Adafruit Unified Sensor"
arduino-cli lib install "BH1750"
arduino-cli lib install "ArduinoJson"

# 7. Application Dependencies
print_status "Installing application dependencies..."
cd "$PROJECT_DIR" || exit
npm install

# 8. Build Application
print_status "Building application..."
npm run build

# 9. Setup PM2 Configuration
print_status "Configuring PM2..."
mkdir -p "$PROJECT_DIR/logs"
pm2 start ecosystem.config.js
pm2 save

# 10. Setup Startup Script
if [ "$IS_RASPBERRY_PI" = true ]; then
    print_status "Setting up startup script..."
    pm2 startup
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
fi

# 11. Configure Permissions
if [ "$IS_RASPBERRY_PI" = true ]; then
    print_status "Setting up permissions..."
    sudo chown -R pi:pi "$PROJECT_DIR"
    find "$PROJECT_DIR" -type d -exec chmod 755 {} \;
    find "$PROJECT_DIR" -type f -exec chmod 644 {} \;
    chmod +x "$PROJECT_DIR/install.sh"
fi

# 12. Create Backup Script
print_status "Creating backup script..."
cat > "$PROJECT_DIR/backup-greenhouse.sh" << 'EOL'
#!/bin/bash
BACKUP_DIR="/home/pi/backups"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/greenhouse-$(date +%Y%m%d).tar.gz /home/pi/greenhouse
find $BACKUP_DIR -mtime +7 -delete
EOL
chmod +x "$PROJECT_DIR/backup-greenhouse.sh"

# 13. Setup Cron Job for Backups
if [ "$IS_RASPBERRY_PI" = true ]; then
    print_status "Setting up automatic backups..."
    (crontab -l 2>/dev/null; echo "0 0 * * * $PROJECT_DIR/backup-greenhouse.sh") | crontab -
fi

# 14. Final Configuration
if [ "$IS_RASPBERRY_PI" = true ]; then
    print_status "Configuring firewall..."
    sudo ufw allow 5175
    sudo ufw allow 3001
fi

print_status "Installation complete!"
echo ""
echo "=== Next Steps ==="
echo "1. Upload the Arduino code to your board:"
echo "   - Open Arduino IDE"
echo "   - Load greenhouse_controller/greenhouse_controller.ino"
echo "   - Select your board and port"
echo "   - Click Upload"
echo ""
echo "2. Verify the installation:"
echo "   - Check PM2 status: pm2 status"
echo "   - View logs: pm2 logs greenhouse-frontend"
echo "   - Access the web interface: http://localhost:5175"
echo ""
echo "3. For development:"
echo "   - Run: npm run dev"
echo "   - Access: http://localhost:5173"
echo ""
echo "4. Calibrate your sensors:"
echo "   - Follow the calibration steps in docs/ARDUINO_SENSORS_GUIDE.md"
echo ""
if [ "$IS_RASPBERRY_PI" = false ]; then
    print_warning "Note: Some features may need manual configuration on non-Raspberry Pi systems"
fi 