# Adding New Plants to the Greenhouse System

This guide explains how to add new plants and their sensor thresholds to the greenhouse control system.

## Plant Configuration Location

Plant profiles are stored in `src/config/plants/index.ts`. Each plant profile contains:
- Basic information (name, scientific name)
- Sensor thresholds
- Growth stage information

## Adding a New Plant

1. Open `src/config/plants/index.ts`
2. Add your new plant profile following this template:

```typescript
export const plantProfiles = {
  // ... existing plants ...
  
  yourPlant: {
    name: 'Your Plant Name',
    scientificName: 'Scientific Name',
    thresholds: {
      temperature: {
        min: 18,    // Minimum safe temperature
        max: 29,    // Maximum safe temperature
        optimal: 24, // Optimal temperature
        unit: '°C'  // Unit (automatically added)
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
      fruiting: { // Optional, not all plants have this stage
        duration: 50,
        modifiers: {
          temperature: { optimal: 25 },
          humidity: { optimal: 65 },
          soilMoisture: { optimal: 60 },
          light: { optimal: 7000 }
        }
      }
    }
  }
};
```

## Understanding Thresholds

1. **Temperature**
   - `min`: Minimum safe temperature
   - `max`: Maximum safe temperature
   - `optimal`: Best temperature for growth
   - Unit is always in Celsius (°C)

2. **Humidity**
   - `min`: Minimum relative humidity
   - `max`: Maximum relative humidity
   - `optimal`: Best humidity level
   - Unit is always percentage (%)

3. **Soil Moisture**
   - `min`: Minimum moisture level
   - `max`: Maximum moisture level
   - `optimal`: Best moisture level
   - Unit is always percentage (%)

4. **Light**
   - `min`: Minimum light level
   - `max`: Maximum light level
   - `optimal`: Best light level
   - Unit is always in lux

## Growth Stages

Each plant can have different requirements during different growth stages:

1. **Seedling**: Early growth from seed
2. **Vegetative**: Main growth phase
3. **Flowering**: Flower development
4. **Fruiting**: Fruit development (if applicable)

For each stage, you can specify:
- `duration`: Length of stage in days
- `modifiers`: How the optimal conditions change during this stage

## Example: Adding Lettuce

```typescript
lettuce: {
  name: 'Lettuce',
  scientificName: 'Lactuca sativa',
  thresholds: {
    temperature: {
      min: 15,
      max: 25,
      optimal: 20
    },
    humidity: {
      min: 50,
      max: 70,
      optimal: 60
    },
    soilMoisture: {
      min: 50,
      max: 65,
      optimal: 60
    },
    light: {
      min: 2000,
      max: 4000,
      optimal: 3000
    }
  },
  growthStages: {
    seedling: {
      duration: 7,
      modifiers: {
        temperature: { optimal: 18 },
        humidity: { optimal: 65 },
        soilMoisture: { optimal: 65 },
        light: { optimal: 2500 }
      }
    },
    vegetative: {
      duration: 45,
      modifiers: {
        temperature: { optimal: 20 },
        humidity: { optimal: 60 },
        soilMoisture: { optimal: 60 },
        light: { optimal: 3000 }
      }
    },
    flowering: {
      duration: 10,
      modifiers: {
        temperature: { optimal: 20 },
        humidity: { optimal: 55 },
        soilMoisture: { optimal: 55 },
        light: { optimal: 3500 }
      }
    }
  }
}
```

## Validation

The TypeScript type system will validate your plant profile. Common issues to check:
1. All required fields are present
2. Values are within reasonable ranges
3. Units are correct
4. Growth stages are properly defined

## Best Practices

1. **Research**
   - Use reliable sources for plant requirements
   - Consider local climate conditions
   - Verify values with experienced growers

2. **Testing**
   - Start with conservative thresholds
   - Monitor plant response
   - Adjust values based on results

3. **Documentation**
   - Add comments for unusual values
   - Document sources of information
   - Note any special considerations

4. **Maintenance**
   - Review and update values periodically
   - Track plant performance
   - Adjust based on seasonal changes

## Troubleshooting

1. **TypeScript Errors**
   - Ensure all required fields are present
   - Check value types are correct
   - Verify object structure matches interface

2. **Runtime Issues**
   - Verify sensor readings match expectations
   - Check automation responses
   - Monitor plant health

3. **Common Problems**
   - Values out of normal range
   - Missing growth stages
   - Incorrect unit specifications 