#!/bin/bash

# Load configuration
PI_HOST=$(node -p "require('./deploy.config.js').pi.host")
PI_USER=$(node -p "require('./deploy.config.js').pi.username")
PI_PATH=$(node -p "require('./deploy.config.js').pi.deployPath")

# Install optimization dependencies
echo "Installing optimization dependencies..."
npm install --save-dev vite-plugin-compression2 terser

# Build the application
echo "Building the application..."
npm run build

# Create deployment directory on Raspberry Pi
echo "Creating deployment directory on Raspberry Pi..."
ssh $PI_USER@$PI_HOST "mkdir -p $PI_PATH/logs"

# Copy the built files to Raspberry Pi
echo "Copying files to Raspberry Pi..."
scp -r dist/* $PI_USER@$PI_HOST:$PI_PATH/
scp package.json $PI_USER@$PI_HOST:$PI_PATH/
scp deploy.config.js $PI_USER@$PI_HOST:$PI_PATH/
scp ecosystem.config.js $PI_USER@$PI_HOST:$PI_PATH/

# Install dependencies and set up the application on Raspberry Pi
echo "Setting up the application on Raspberry Pi..."
ssh $PI_USER@$PI_HOST "cd $PI_PATH && \
  sudo apt-get update && \
  sudo apt-get install -y nodejs npm && \
  npm install --production && \
  sudo npm install -g pm2 && \
  pm2 delete greenhouse-frontend 2>/dev/null || true && \
  pm2 start ecosystem.config.js && \
  pm2 save && \
  pm2 startup"

# Set up log rotation
ssh $PI_USER@$PI_HOST "sudo tee /etc/logrotate.d/greenhouse-frontend > /dev/null << EOL
$PI_PATH/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 $PI_USER $PI_USER
}
EOL"

echo "Deployment complete! The application should be running on http://$PI_HOST:$(node -p "require('./deploy.config.js').frontend.port")"
echo "Monitor the application using: pm2 monit"
echo "View logs using: pm2 logs greenhouse-frontend" 