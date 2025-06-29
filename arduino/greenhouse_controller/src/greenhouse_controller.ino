#include <Wire.h>
#include <DHT.h>
#include <BH1750.h>
#include <ArduinoJson.h>
#include <EEPROM.h>
#include <string.h>
#include "config.h"

// Sensor configuration
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

// Calibration constants
struct CalibrationData {
  // Temperature calibration
  float tempOffset = 0.0;
  float tempSlope = 1.0;
  
  // Humidity calibration
  float humOffset = 0.0;
  float humSlope = 1.0;
  
  // Soil moisture calibration
  int soilDryValue = 550;    // Reading in dry soil
  int soilWetValue = 250;    // Reading in wet soil
  
  // Light sensor calibration
  float luxMultiplier = 1.0; // Correction factor for light readings
};

CalibrationData calibration;

// EEPROM addresses for storing calibration
#define CALIBRATION_ADDR 0
#define CALIBRATION_CHECK 123 // Random value to check if EEPROM is initialized

// JSON document for sensor readings
StaticJsonDocument<JSON_DOC_SIZE> doc;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  
  // Initialize sensors
  dht.begin();
  lightMeter.begin();
  
  // Load calibration from EEPROM
  loadCalibration();
}

void loop() {
  // Check for commands from the server
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    
    if (command == "READ_SENSORS") {
      sendSensorReadings();
    }
    else if (command.startsWith("CALIBRATE")) {
      handleCalibration(command);
    }
  }
  
  // Small delay to prevent busy-waiting
  delay(100);
}

void loadCalibration() {
  // Check if EEPROM has valid calibration data
  if (EEPROM.read(0) == CALIBRATION_CHECK) {
    EEPROM.get(CALIBRATION_ADDR + 1, calibration);
  } else {
    // Initialize EEPROM with default values
    EEPROM.write(0, CALIBRATION_CHECK);
    EEPROM.put(CALIBRATION_ADDR + 1, calibration);
  }
}

void saveCalibration() {
  EEPROM.put(CALIBRATION_ADDR + 1, calibration);
}

float calibrateTemperature(float rawTemp) {
  return (rawTemp * calibration.tempSlope) + calibration.tempOffset;
}

float calibrateHumidity(float rawHumidity) {
  return (rawHumidity * calibration.humSlope) + calibration.humOffset;
}

float calibrateSoilMoisture(int rawValue) {
  float percentage = map(rawValue, 
                        calibration.soilDryValue, 
                        calibration.soilWetValue, 
                        0, 100);
  return constrain(percentage, 0, 100);
}

float calibrateLight(float rawLux) {
  return rawLux * calibration.luxMultiplier;
}

void handleCalibration(String command) {
  // Parse calibration command
  // Format: "CALIBRATE type value1 value2"
  // Example: "CALIBRATE TEMP 0.0 25.0" (current reading, actual temperature)
  
  String parts[3];
  int idx = 0;
  int lastIndex = 0;
  
  // Split command into parts
  for (size_t i = 9; i < command.length() && idx < 3; i++) {
    if (command.charAt(i) == ' ') {
      parts[idx++] = command.substring(lastIndex + 1, i);
      lastIndex = i;
    }
  }
  if (static_cast<size_t>(lastIndex) < command.length()) {
    parts[idx] = command.substring(lastIndex + 1);
  }
  
  // Handle different calibration types
  if (parts[0] == "TEMP") {
    float currentReading = parts[1].toFloat();
    float actualTemp = parts[2].toFloat();
    calibration.tempOffset = actualTemp - currentReading;
  }
  else if (parts[0] == "SOIL") {
    if (parts[1] == "DRY") {
      calibration.soilDryValue = analogRead(SOIL_MOISTURE_PIN);
    }
    else if (parts[1] == "WET") {
      calibration.soilWetValue = analogRead(SOIL_MOISTURE_PIN);
    }
  }
  else if (parts[0] == "LIGHT") {
    float currentReading = parts[1].toFloat();
    float actualLux = parts[2].toFloat();
    calibration.luxMultiplier = actualLux / currentReading;
  }
  
  // Save new calibration values
  saveCalibration();
  
  // Send confirmation
  doc.clear();
  doc["calibrated"] = parts[0];
  serializeJson(doc, Serial);
  Serial.println();
}

void sendSensorReadings() {
  // Read and calibrate temperature and humidity
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (!isnan(temperature)) {
    temperature = calibrateTemperature(temperature);
  }
  
  if (!isnan(humidity)) {
    humidity = calibrateHumidity(humidity);
  }
  
  // Read and calibrate light level
  float lux = lightMeter.readLightLevel();
  if (lux >= 0) {
    lux = calibrateLight(lux);
  }
  
  // Read and calibrate soil moisture
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  float moisturePercent = calibrateSoilMoisture(soilMoistureRaw);
  
  // Create JSON response
  doc.clear();
  
  if (!isnan(temperature)) {
    doc["temperature"] = temperature;
  }
  
  if (!isnan(humidity)) {
    doc["humidity"] = humidity;
  }
  
  if (lux >= 0) {
    doc["light"] = lux;
  }
  
  doc["soil_moisture"] = moisturePercent;
  
  // Send JSON response
  serializeJson(doc, Serial);
  Serial.println(); // End with newline
} 