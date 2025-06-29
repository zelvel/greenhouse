#!/bin/bash

# Create Arduino libraries directory if it doesn't exist
ARDUINO_LIB_DIR="$HOME/Documents/Arduino/libraries"
mkdir -p "$ARDUINO_LIB_DIR"

# Install required libraries using arduino-cli
echo "Installing Arduino libraries..."
arduino-cli lib install "DHT sensor library"
arduino-cli lib install "Adafruit Unified Sensor"
arduino-cli lib install "BH1750"
arduino-cli lib install "ArduinoJson"

# Copy our local library files as fallback
echo "Copying local library files..."
cp -r arduino/libraries/* "$ARDUINO_LIB_DIR/"

echo "Libraries installation complete!"
echo "Please restart the Arduino IDE if it's running." 