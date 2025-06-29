# Greenhouse Controller

Arduino-based greenhouse monitoring and control system.

## Features

- Temperature and humidity monitoring (DHT22)
- Soil moisture monitoring (Capacitive sensor)
- Light level monitoring (BH1750)
- Moving average calculations for stable readings
- JSON-based data reporting over serial
- Error handling and reporting

## Hardware Requirements

1. Arduino board (Uno, Nano, or similar)
2. DHT22 temperature/humidity sensor
3. Capacitive soil moisture sensor
4. BH1750 light sensor
5. Jumper wires
6. Breadboard

## Pin Connections

- DHT22 data pin: D2
- Soil moisture sensor: A0
- BH1750: I2C (SDA/SCL)

## Dependencies

See `libraries.txt` for required Arduino libraries and installation instructions.

## Installation

1. Install required libraries as specified in `libraries.txt`
2. Open `greenhouse_controller.ino` in Arduino IDE
3. Select your Arduino board and port
4. Upload the sketch

## Serial Output Format

The controller sends JSON data over serial (9600 baud):

```json
{
  "data": {
    "temperature": 25.4,
    "humidity": 65.2,
    "soil_moisture": 45,
    "light_level": 850.5
  }
}
```

Or in case of errors:

```json
{
  "error": "Error message here"
}
```

## Files

- `greenhouse_controller.ino`: Main Arduino sketch
- `config.h`: Configuration and pin definitions
- `SensorManager.h`: Sensor management class header
- `SensorManager.cpp`: Sensor management class implementation
- `libraries.txt`: Required libraries and installation instructions
- `README.md`: This file

## Calibration

The soil moisture sensor needs calibration:
1. Place sensor in dry soil: Note the value
2. Place sensor in wet soil: Note the value
3. Update `SOIL_DRY_VALUE` and `SOIL_WET_VALUE` in `config.h` 