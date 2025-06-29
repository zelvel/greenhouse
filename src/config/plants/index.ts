import type { PlantProfile } from '@/types/plants';

// Default plant profiles
export const plantProfiles: Record<string, PlantProfile> = {
  tomato: {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    thresholds: {
      temperature: {
        min: 18,
        max: 29,
        optimal: 24,
        unit: '°C'
      },
      humidity: {
        min: 60,
        max: 80,
        optimal: 70,
        unit: '%'
      },
      soilMoisture: {
        min: 50,
        max: 70,
        optimal: 60,
        unit: '%'
      },
      light: {
        min: 3000,
        max: 7500,
        optimal: 5000,
        unit: 'lux'
      }
    },
    growthStages: {
      seedling: {
        duration: 21, // days
        modifiers: {
          temperature: { optimal: 22 },
          humidity: { optimal: 75 },
          soilMoisture: { optimal: 65 },
          light: { optimal: 4000 }
        }
      },
      vegetative: {
        duration: 30,
        modifiers: {
          temperature: { optimal: 24 },
          humidity: { optimal: 70 },
          soilMoisture: { optimal: 60 },
          light: { optimal: 5000 }
        }
      },
      flowering: {
        duration: 40,
        modifiers: {
          temperature: { optimal: 23 },
          humidity: { optimal: 65 },
          soilMoisture: { optimal: 55 },
          light: { optimal: 6000 }
        }
      },
      fruiting: {
        duration: 50,
        modifiers: {
          temperature: { optimal: 25 },
          humidity: { optimal: 65 },
          soilMoisture: { optimal: 60 },
          light: { optimal: 7000 }
        }
      }
    }
  },
  basil: {
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    thresholds: {
      temperature: {
        min: 15,
        max: 30,
        optimal: 22,
        unit: '°C'
      },
      humidity: {
        min: 40,
        max: 60,
        optimal: 50,
        unit: '%'
      },
      soilMoisture: {
        min: 40,
        max: 60,
        optimal: 50,
        unit: '%'
      },
      light: {
        min: 2500,
        max: 5000,
        optimal: 3500,
        unit: 'lux'
      }
    },
    growthStages: {
      seedling: {
        duration: 10,
        modifiers: {
          temperature: { optimal: 20 },
          humidity: { optimal: 55 },
          soilMoisture: { optimal: 55 },
          light: { optimal: 3000 }
        }
      },
      vegetative: {
        duration: 28,
        modifiers: {
          temperature: { optimal: 22 },
          humidity: { optimal: 50 },
          soilMoisture: { optimal: 50 },
          light: { optimal: 3500 }
        }
      },
      flowering: {
        duration: 14,
        modifiers: {
          temperature: { optimal: 22 },
          humidity: { optimal: 45 },
          soilMoisture: { optimal: 45 },
          light: { optimal: 4000 }
        }
      }
    }
  }
}; 