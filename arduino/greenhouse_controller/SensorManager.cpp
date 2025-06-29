#include "SensorManager.h"

SensorManager::SensorManager() : readIndex(0), error(false) {
  dht = new DHT(DHTPIN, DHTTYPE);
  lightMeter = new BH1750();
  initializeArrays();
}

bool SensorManager::begin() {
  dht->begin();
  Wire.begin();
  
  if (!lightMeter->begin()) {
    strcpy(errorMsg, "BH1750 init failed");
    error = true;
    return false;
  }
  
  lightMeter->configure(BH1750::CONTINUOUS_HIGH_RES_MODE);
  return true;
}

void SensorManager::initializeArrays() {
  tempSum = humSum = luxSum = 0;
  soilSum = 0;
  
  for (int i = 0; i < NUM_READINGS; i++) {
    tempReadings[i] = 0;
    humReadings[i] = 0;
    soilReadings[i] = 0;
    luxReadings[i] = 0;
  }
}

float SensorManager::updateMovingAverage(float readings[], float newValue, float* sum) {
  *sum = *sum - readings[readIndex] + newValue;
  readings[readIndex] = newValue;
  return *sum / NUM_READINGS;
}

int SensorManager::updateMovingAverageInt(int readings[], int newValue, long* sum) {
  *sum = *sum - readings[readIndex] + newValue;
  readings[readIndex] = newValue;
  return *sum / NUM_READINGS;
}

void SensorManager::update() {
  // Read raw sensor values
  float temp = dht->readTemperature();
  float hum = dht->readHumidity();
  int soilRaw = analogRead(SOIL_MOISTURE_PIN);
  float lux = lightMeter->readLightLevel();
  
  // Check for sensor errors
  if (isnan(temp) || isnan(hum)) {
    strcpy(errorMsg, "DHT read failed");
    error = true;
    return;
  }
  
  if (lux < 0) {
    strcpy(errorMsg, "Light sensor read failed");
    error = true;
    return;
  }
  
  // Calculate soil moisture percentage
  int soil = map(soilRaw, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
  soil = constrain(soil, 0, 100);
  
  // Update moving averages
  updateMovingAverage(tempReadings, temp, &tempSum);
  updateMovingAverage(humReadings, hum, &humSum);
  updateMovingAverageInt(soilReadings, soil, &soilSum);
  updateMovingAverage(luxReadings, lux, &luxSum);
  
  // Update index
  readIndex = (readIndex + 1) % NUM_READINGS;
  error = false;
}

float SensorManager::getTemperature() const {
  return tempSum / NUM_READINGS;
}

float SensorManager::getHumidity() const {
  return humSum / NUM_READINGS;
}

int SensorManager::getSoilMoisture() const {
  return soilSum / NUM_READINGS;
}

float SensorManager::getLightLevel() const {
  return luxSum / NUM_READINGS;
}

bool SensorManager::hasError() const {
  return error;
}
const char* SensorManager::getError() const {
  return errorMsg;
}