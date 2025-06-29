#ifndef GREENHOUSE_CONTROLLER_H
#define GREENHOUSE_CONTROLLER_H

#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>
#include <ArduinoJson.h>

// Pin Definitions
#define DHTPIN 2           // DHT22 data pin
#define SOIL_MOISTURE_PIN A0   // Soil moisture analog pin
#define DHTTYPE DHT22      // DHT22 (AM2302) sensor type

// Function declarations
void setup();
void loop();
float getMovingAverage(float readings[], float newValue, float& sum);
int getMovingAverageInt(int readings[], int newValue, long& sum);

#endif // GREENHOUSE_CONTROLLER_H 