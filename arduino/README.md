# Arduino Code for Greenhouse Controller

This directory contains the Arduino code and libraries for the greenhouse control system.

## Directory Structure

```
arduino/
├── libraries/           # Required libraries
│   ├── DHT/            # Temperature & humidity sensor library
│   └── BH1750/         # Light sensor library
└── greenhouse/          # Main Arduino sketch
    └── greenhouse.ino  # Main program file
```

## Hardware Setup

1. Connect the sensors to the following pins:
   - DHT22 (Temperature/Humidity): Pin 2
   - BH1750 (Light): I2C (SDA/SCL)
   - Soil Moisture: Analog Pin A0

2. Connect the actuators:
   - Relay Module: Pins 7, 8, 9 (for fans, pump, lights)

## Serial Communication

The Arduino communicates with the Raspberry Pi over USB serial:
- Baud Rate: 9600
- Data Format: JSON
- Update Interval: 5 seconds

### Commands

The Arduino accepts the following commands:
```
CALIBRATE TEMP offset value
CALIBRATE HUMID offset value
CALIBRATE LIGHT multiplier value
CALIBRATE SOIL dry_value wet_value
GET_SENSORS
SET_RELAY pin state
```

## Building and Uploading

1. Open the `greenhouse.ino` sketch in Arduino IDE
2. Select your board type and port
3. Install required libraries
4. Click Upload

## Troubleshooting

1. If sensors read incorrect values:
   - Check wiring connections
   - Verify power supply
   - Use calibration commands

2. If serial communication fails:
   - Check USB connection
   - Verify baud rate settings
   - Reset Arduino board 