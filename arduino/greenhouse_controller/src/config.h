#ifndef GREENHOUSE_CONFIG_H
#define GREENHOUSE_CONFIG_H

// Pin Definitions
#define DHTPIN 2           // DHT22 data pin
#define SOIL_MOISTURE_PIN A0   // Soil moisture analog pin
#define DHTTYPE DHT22      // DHT22 (AM2302) sensor type

// Sensor Configuration
#define SERIAL_BAUD 9600   // Serial communication speed
#define READ_INTERVAL 2000 // Sensor reading interval in milliseconds

// Moving Average Configuration
#define NUM_READINGS 10    // Number of readings to average

// Soil Moisture Calibration
#define SOIL_DRY_VALUE 520  // Value when soil is dry (calibrate this)
#define SOIL_WET_VALUE 260  // Value when soil is wet (calibrate this)

// JSON Configuration
#define JSON_DOC_SIZE 256   // Size of JSON document

#endif // GREENHOUSE_CONFIG_H 