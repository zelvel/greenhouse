# Installation Guide

## Prerequisites

### Hardware Requirements
- Raspberry Pi (3B+ or newer recommended)
- Arduino Uno/Nano
- Sensors:
  - DHT22 (Temperature & Humidity)
  - BH1750 (Light Level)
  - Capacitive Soil Moisture Sensor
- Actuators:
  - Relay Module (for fans/pumps)
  - LED Grow Lights
  - Water Pump
  - Ventilation Fans

### Software Requirements
- Raspberry Pi OS (64-bit recommended)
- Node.js 18+ and npm
- Python 3.8+
- Arduino IDE or CLI
- Git

## Installation Methods

### 1. Automated Installation (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/greenhouse.git
cd greenhouse

# Make the installation script executable
chmod +x install.sh

# Run the installation script
./install.sh
```

The installation script will automatically:
- Set up the Raspberry Pi environment
- Install all dependencies
- Configure the Arduino development environment
- Set up PM2 for process management
- Configure automatic backups
- Set proper permissions

### 2. Manual Installation

#### System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install system dependencies
sudo apt install -y build-essential git python3 python3-pip nodejs npm

# Install PM2 globally
sudo npm install -g pm2
```

#### Arduino Setup
1. Install Arduino CLI
```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
export PATH=$PATH:$HOME/bin
```

2. Install Required Libraries
```bash
arduino-cli core install arduino:avr
arduino-cli lib install "DHT sensor library"
arduino-cli lib install "Adafruit Unified Sensor"
arduino-cli lib install "BH1750"
arduino-cli lib install "ArduinoJson"
```

3. Upload Arduino Code
```bash
# Navigate to Arduino code directory
cd arduino/greenhouse_controller

# Compile and upload (replace with your board and port)
arduino-cli compile --fqbn arduino:avr:uno
arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:uno
```

#### Application Setup
```bash
# Install Node.js dependencies (including dev dependencies)
npm install

# Build the application (TypeScript compilation + Vite build)
npm run build

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
```

## Configuration

### Serial Port
By default, the application looks for the Arduino on `/dev/ttyUSB0`. To change this:

1. Edit `src/server/hardware/sensors.ts`:
```typescript
const portPath = '/dev/ttyUSB0'; // Change to your port
```

### Network Settings
The application runs on:
- Frontend: http://localhost:5173 (development) or http://localhost:5175 (production)
- Backend: http://localhost:3001

To change these ports:
1. Frontend: Edit `vite.config.ts` for development, `ecosystem.config.js` for production
2. Backend: Edit `src/server/index.ts`

### Sensor Calibration
See [ARDUINO_SENSORS_GUIDE.md](./ARDUINO_SENSORS_GUIDE.md) for sensor calibration instructions.

## Development

For development work:
```bash
# Start development server (both frontend and backend)
npm run dev

# Access the application at http://localhost:5173
```

## Production Deployment

For production deployment:
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Enable PM2 startup script
pm2 startup
```

## Troubleshooting

### Serial Port Permission Issues
```bash
# Add your user to the dialout group
sudo usermod -a -G dialout $USER

# Give permission to the serial port
sudo chmod a+rw /dev/ttyUSB0

# Logout and login again for group changes to take effect
```

### PM2 Issues
```bash
# Check application status
pm2 status

# View logs
pm2 logs greenhouse-frontend

# Restart application
pm2 restart greenhouse-frontend

# Check PM2 configuration
pm2 show greenhouse-frontend
```

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf dist
npm run build
```

### Database Issues
The application uses a local file-based database. If you encounter issues:
```bash
# Backup existing data
cp -r data data_backup

# Clear database (if corrupted)
rm -rf data/*
```

## Automatic Updates

The system is configured to automatically check for updates daily. To manually update:
```bash
./update.sh
```

## Backup System

Backups are automatically created daily in the `backups` directory. To manually create a backup:
```bash
./backup.sh
```

## Logging

The application uses PM2 for process management and logging. Logs are stored in the following locations:

### Application Logs
- Error logs: `logs/error.log`
- Output logs: `logs/out.log`

To view logs in real-time:
```bash
# View all logs
pm2 logs greenhouse-frontend

# View only error logs
pm2 logs greenhouse-frontend --err

# View only output logs
pm2 logs greenhouse-frontend --out
```

To rotate logs:
```bash
pm2 install pm2-logrotate
```

## Security Considerations

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 5175  # Production frontend
sudo ufw allow 3001  # Backend API
sudo ufw enable
```

### User Permissions
```bash
# Create dedicated user for the application
sudo adduser greenhouse
sudo usermod -a -G dialout greenhouse

# Set proper ownership
sudo chown -R greenhouse:greenhouse /path/to/greenhouse
```

## Additional Resources
- [Adding Plants Guide](./ADDING_PLANTS.md)
- [Arduino Sensors Guide](./ARDUINO_SENSORS_GUIDE.md)
- [API Documentation](./API.md) 