#!/bin/bash

echo "Installing Arduino libraries for Greenhouse Controller..."

# Check if arduino-cli is installed
if ! command -v arduino-cli &> /dev/null; then
    echo "arduino-cli is not installed. Please install it first:"
    echo "https://arduino.github.io/arduino-cli/latest/installation/"
    exit 1
fi

# Update library index
echo "Updating library index..."
arduino-cli lib update-index

# Install required libraries
echo "Installing DHT sensor library..."
arduino-cli lib install "DHT sensor library"

echo "Installing Adafruit Unified Sensor..."
arduino-cli lib install "Adafruit Unified Sensor"

echo "Installing BH1750..."
arduino-cli lib install "BH1750"

echo "Installing ArduinoJson..."
arduino-cli lib install "ArduinoJson"

echo "Installation complete!"
echo "Please verify that the following libraries are installed:"
echo "- DHT sensor library (v1.4.4 or later)"
echo "- Adafruit Unified Sensor (v1.1.9 or later)"
echo "- BH1750 (v1.3.0 or later)"
echo "- ArduinoJson (v6.21.3 or later)"

# List installed libraries
echo -e "\nInstalled libraries:"
arduino-cli lib list 