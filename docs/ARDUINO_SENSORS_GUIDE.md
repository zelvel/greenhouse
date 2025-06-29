# Arduino Sensor Integration Guide

## Supported Sensors

1. **Temperature & Humidity (DHT22/AM2302)**
   - Digital sensor
   - Temperature range: -40°C to 80°C
   - Humidity range: 0-100% RH
   - Accuracy: ±0.5°C, ±2-5% RH

2. **Soil Moisture (Capacitive)**
   - Analog sensor
   - Range: 0-100%
   - More durable than resistive sensors
   - Corrosion resistant

3. **Light Level (BH1750)**
   - Digital sensor (I2C)
   - Range: 1-65535 lux
   - High precision
   - Built-in ADC

## Hardware Setup

### Wiring Diagram

```
Arduino Uno/Nano    |    DHT22    |    Soil Moisture    |    BH1750
--------------------|-------------|--------------------|--------------
5V                  |    VCC      |    VCC            |    VCC
GND                 |    GND      |    GND            |    GND
D2                  |    DATA     |                   |
A0                  |             |    AOut           |
A4 (SDA)           |             |                   |    SDA
A5 (SCL)           |             |                   |    SCL
```

### Required Components

1. Arduino Uno/Nano
2. DHT22 temperature & humidity sensor
3. Capacitive soil moisture sensor
4. BH1750 light sensor
5. Breadboard
6. Jumper wires
7. 10kΩ resistor (for DHT22)
8. Optional: Project box for weather protection

## Software Setup

### 1. Required Libraries

Install the following libraries in Arduino IDE (Sketch -> Include Library -> Manage Libraries):

```cpp
// For DHT22
#include <DHT.h>
#include <DHT_U.h>

// For BH1750
#include <Wire.h>
#include <BH1750.h>
```

### 2. Basic Code Structure

```cpp
#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>

// Pin Definitions
#define DHTPIN 2          // DHT22 data pin
#define SOIL_MOISTURE_PIN A0  // Soil moisture analog pin
#define DHTTYPE DHT22     // DHT22 (AM2302) sensor type

// Initialize sensors
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

// Calibration values for soil moisture
const int DRY_VALUE = 520;    // Value when soil is dry
const int WET_VALUE = 260;    // Value when soil is wet

void setup() {
  Serial.begin(9600);
  
  // Initialize sensors
  dht.begin();
  Wire.begin();
  lightMeter.begin();
  
  // Optional: Set high accuracy mode for BH1750
  lightMeter.configure(BH1750::CONTINUOUS_HIGH_RES_MODE);
}

void loop() {
  // Read temperature & humidity
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  // Read soil moisture
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int soilMoisture = map(soilMoistureRaw, DRY_VALUE, WET_VALUE, 0, 100);
  soilMoisture = constrain(soilMoisture, 0, 100);
  
  // Read light level
  float lux = lightMeter.readLightLevel();
  
  // Format data as JSON
  Serial.print("{");
  Serial.print("\"temperature\":");
  Serial.print(temperature);
  Serial.print(",\"humidity\":");
  Serial.print(humidity);
  Serial.print(",\"soil_moisture\":");
  Serial.print(soilMoisture);
  Serial.print(",\"light_level\":");
  Serial.print(lux);
  Serial.println("}");
  
  // Wait before next reading
  delay(2000);
}
```

## Calibration

### Soil Moisture Sensor Calibration

1. Take readings with sensor in dry air (0% moisture)
2. Take readings with sensor in water (100% moisture)
3. Update `DRY_VALUE` and `WET_VALUE` constants in code
4. Test with different soil moisture levels

### Light Sensor Calibration

The BH1750 comes pre-calibrated, but you can adjust readings based on your needs:

```cpp
// Set to high accuracy mode (1 lux resolution)
lightMeter.configure(BH1750::CONTINUOUS_HIGH_RES_MODE);

// Or set to low accuracy mode (4 lux resolution, faster readings)
lightMeter.configure(BH1750::CONTINUOUS_LOW_RES_MODE);
```

## Troubleshooting

1. **No readings from DHT22**
   - Check power connections
   - Verify 10kΩ pullup resistor is installed
   - Try reducing cable length
   - Check for correct pin definition

2. **Erratic Soil Moisture Readings**
   - Clean sensor contacts
   - Check for proper insertion depth
   - Verify power supply stability
   - Consider taking average of multiple readings

3. **BH1750 Not Responding**
   - Verify I2C address (default 0x23)
   - Check SDA/SCL connections
   - Try different I2C speed
   - Verify pull-up resistors are present

## Best Practices

1. **Power Supply**
   - Use clean, stable 5V power
   - Consider separate power regulation for sensors
   - Add decoupling capacitors if needed

2. **Sensor Placement**
   - Keep DHT22 away from direct water/sunlight
   - Place soil moisture sensor at appropriate depth
   - Position light sensor for representative readings

3. **Maintenance**
   - Regular cleaning of sensors
   - Periodic calibration checks
   - Protection from water/dust
   - Check wiring connections monthly

4. **Code Optimization**
   - Use moving averages for stable readings
   - Implement error checking
   - Add data validation
   - Consider power-saving modes

## Integration with Main System

1. **Serial Communication**
   - Data is sent as JSON via Serial
   - Baud rate: 9600
   - Update interval: 2 seconds

2. **Data Format**
```json
{
  "temperature": 25.6,
  "humidity": 65.4,
  "soil_moisture": 45,
  "light_level": 1200
}
```

3. **Error Handling**
   - Check for sensor presence
   - Validate readings within expected ranges
   - Report errors via serial
   - Implement watchdog timer

## Next Steps

1. Add more sensors as needed:
   - CO2 sensor
   - pH sensor
   - Water level sensor
   - Wind speed/direction

2. Implement actuator control:
   - Relay modules for pumps
   - Fan control
   - LED grow lights
   - Ventilation systems 