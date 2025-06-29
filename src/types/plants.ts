// Sensor threshold types
export interface SensorThreshold {
  min: number;
  max: number;
  optimal: number;
  unit: string;
}

export interface SensorThresholds {
  temperature: SensorThreshold;
  humidity: SensorThreshold;
  soilMoisture: SensorThreshold;
  light: SensorThreshold;
}

// Growth stage types
export interface GrowthStageModifiers {
  temperature?: Partial<SensorThreshold>;
  humidity?: Partial<SensorThreshold>;
  soilMoisture?: Partial<SensorThreshold>;
  light?: Partial<SensorThreshold>;
}

export interface GrowthStage {
  duration: number; // in days
  modifiers: GrowthStageModifiers;
}

export interface GrowthStages {
  seedling: GrowthStage;
  vegetative: GrowthStage;
  flowering: GrowthStage;
  fruiting?: GrowthStage; // Optional, not all plants have fruiting stage
}

// Main plant profile type
export interface PlantProfile {
  name: string;
  scientificName: string;
  thresholds: SensorThresholds;
  growthStages: GrowthStages;
}

// Default units for each sensor type
export const DEFAULT_UNITS = {
  temperature: '°C',
  humidity: '%',
  soilMoisture: '%',
  light: 'lux',
} as const;

// Helper function to create a new plant profile
export function createPlantProfile(profile: Omit<PlantProfile, 'thresholds'> & {
  thresholds: {
    temperature: Omit<SensorThreshold, 'unit'>;
    humidity: Omit<SensorThreshold, 'unit'>;
    soilMoisture: Omit<SensorThreshold, 'unit'>;
    light: Omit<SensorThreshold, 'unit'>;
  };
}): PlantProfile {
  return {
    ...profile,
    thresholds: {
      temperature: { ...profile.thresholds.temperature, unit: DEFAULT_UNITS.temperature },
      humidity: { ...profile.thresholds.humidity, unit: DEFAULT_UNITS.humidity },
      soilMoisture: { ...profile.thresholds.soilMoisture, unit: DEFAULT_UNITS.soilMoisture },
      light: { ...profile.thresholds.light, unit: DEFAULT_UNITS.light },
    },
  };
} 