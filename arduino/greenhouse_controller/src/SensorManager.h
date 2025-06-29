#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>
#include <ArduinoJson.h>
#include <string.h>
#include "config.h"

class SensorManager {
  private:
    DHT dht;
    BH1750 lightMeter;
    
    // Moving average arrays
    float tempReadings[NUM_READINGS];
    float humReadings[NUM_READINGS];
    int soilReadings[NUM_READINGS];
    float luxReadings[NUM_READINGS];
    int readIndex;
    
    // Moving average sums
    float tempSum;
    float humSum;
    long soilSum;
    float luxSum;

    // Helper functions
    float updateMovingAverage(float readings[], float newValue, float* sum);
    int updateMovingAverageInt(int readings[], int newValue, long* sum);
    void initializeArrays();

  public:
    SensorManager() : dht(DHTPIN, DHTTYPE), readIndex(0), error(false) {
        memset(errorMsg, 0, sizeof(errorMsg));
    }
    bool begin();
    void update();
    
    // Getter methods
    float getTemperature() const;
    float getHumidity() const;
    int getSoilMoisture() const;
    float getLightLevel() const;
    bool hasError() const;
    const char* getError() const;

  private:
    bool error;
    char errorMsg[32];
};

#endif // SENSOR_MANAGER_H 