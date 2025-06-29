# Plant Configuration Files Guide

This guide explains how to create and use external JSON configuration files for plant profiles in the Greenhouse Control System.

## Overview

You can create external configuration files for plants you plan to grow in the future. This allows you to:
- Prepare configurations in advance
- Share configurations with other growers
- Maintain a library of plant profiles
- Import configurations without manually entering all data

## File Format

Plant configuration files must be in JSON format and contain the following structure:

```json
{
  "name": "Plant Name",
  "scientificName": "Scientific Name",
  "thresholds": {
    "temperature": { "min": 15, "max": 30, "optimal": 22, "unit": "°C" },
    "humidity": { "min": 40, "max": 80, "optimal": 60, "unit": "%" },
    "light": { "min": 2000, "max": 6000, "optimal": 4000, "unit": "lux" },
    "soilMoisture": { "min": 40, "max": 80, "optimal": 60, "unit": "%" }
  },
  "growthStages": {
    "seedling": { "duration": 21, "modifiers": { ... } },
    "vegetative": { "duration": 30, "modifiers": { ... } },
    "flowering": { "duration": 40, "modifiers": { ... } },
    "fruiting": { "duration": 50, "modifiers": { ... } }
  }
}
```

## Required Fields

### Basic Information
- **name**: Common name of the plant (e.g., "Cherry Tomato")
- **scientificName**: Scientific/Latin name (e.g., "Solanum lycopersicum")

### Environmental Thresholds
Each sensor must have:
- **min**: Minimum acceptable value
- **max**: Maximum acceptable value  
- **optimal**: Optimal value for growth
- **unit**: Unit of measurement

Required sensors:
- **temperature**: Temperature in °C
- **humidity**: Humidity percentage
- **light**: Light level in lux
- **soilMoisture**: Soil moisture percentage

### Growth Stages
Each growth stage must have:
- **duration**: Duration in days
- **modifiers**: Environmental preferences for this stage

Required stages:
- **seedling**: Early growth phase
- **vegetative**: Leaf and stem growth
- **flowering**: Flower development
- **fruiting**: Fruit/seed production

## How to Use

### Importing a Configuration

1. **Navigate to Add Plant Page**
   - Go to the Plants page
   - Click "Add New Plant"

2. **Click Import Config Button**
   - Look for the "Import Config" button in the top-right corner
   - Click to open the import dialog

3. **Select Your File**
   - Click "Choose JSON File"
   - Select your configuration file
   - The system will validate and load the configuration

4. **Review and Save**
   - Check that all data is loaded correctly
   - Make any adjustments if needed
   - Click "Create Plant Profile" to save

### Exporting a Configuration

1. **Fill Out the Form**
   - Complete the plant configuration form
   - Ensure all required fields are filled

2. **Click Export Config**
   - The "Export Config" button appears once basic info is complete
   - Click to download the configuration as JSON

3. **Save the File**
   - The file will be named `{plant_name}_config.json`
   - Save it for future use or sharing

## Sample Configurations

### Bell Pepper
```json
{
  "name": "Bell Pepper",
  "scientificName": "Capsicum annuum",
  "thresholds": {
    "temperature": { "min": 20, "max": 30, "optimal": 25, "unit": "°C" },
    "humidity": { "min": 50, "max": 70, "optimal": 60, "unit": "%" },
    "soilMoisture": { "min": 45, "max": 65, "optimal": 55, "unit": "%" },
    "light": { "min": 4000, "max": 8000, "optimal": 6000, "unit": "lux" }
  },
  "growthStages": {
    "seedling": { "duration": 14, "modifiers": { "temperature": { "optimal": 23 }, "humidity": { "optimal": 65 }, "soilMoisture": { "optimal": 60 }, "light": { "optimal": 5000 } } },
    "vegetative": { "duration": 35, "modifiers": { "temperature": { "optimal": 25 }, "humidity": { "optimal": 60 }, "soilMoisture": { "optimal": 55 }, "light": { "optimal": 6000 } } },
    "flowering": { "duration": 21, "modifiers": { "temperature": { "optimal": 24 }, "humidity": { "optimal": 55 }, "soilMoisture": { "optimal": 50 }, "light": { "optimal": 7000 } } },
    "fruiting": { "duration": 45, "modifiers": { "temperature": { "optimal": 26 }, "humidity": { "optimal": 60 }, "soilMoisture": { "optimal": 55 }, "light": { "optimal": 7500 } } }
  }
}
```

### Lettuce
```json
{
  "name": "Lettuce",
  "scientificName": "Lactuca sativa",
  "thresholds": {
    "temperature": { "min": 10, "max": 25, "optimal": 18, "unit": "°C" },
    "humidity": { "min": 60, "max": 80, "optimal": 70, "unit": "%" },
    "soilMoisture": { "min": 50, "max": 70, "optimal": 60, "unit": "%" },
    "light": { "min": 2000, "max": 5000, "optimal": 3500, "unit": "lux" }
  },
  "growthStages": {
    "seedling": { "duration": 7, "modifiers": { "temperature": { "optimal": 16 }, "humidity": { "optimal": 75 }, "soilMoisture": { "optimal": 65 }, "light": { "optimal": 3000 } } },
    "vegetative": { "duration": 21, "modifiers": { "temperature": { "optimal": 18 }, "humidity": { "optimal": 70 }, "soilMoisture": { "optimal": 60 }, "light": { "optimal": 3500 } } },
    "flowering": { "duration": 0, "modifiers": { "temperature": { "optimal": 18 }, "humidity": { "optimal": 70 }, "soilMoisture": { "optimal": 60 }, "light": { "optimal": 3500 } } },
    "fruiting": { "duration": 0, "modifiers": { "temperature": { "optimal": 18 }, "humidity": { "optimal": 70 }, "soilMoisture": { "optimal": 60 }, "light": { "optimal": 3500 } } }
  }
}
```

## Validation Rules

The system validates imported configurations and will show errors for:

- **Missing required fields**: All basic info, thresholds, and growth stages must be present
- **Invalid data types**: All numeric values must be numbers
- **Missing sensors**: All four sensor types must be defined
- **Missing growth stages**: All four growth stages must be defined
- **Invalid JSON**: File must be valid JSON format

## Tips for Creating Configurations

1. **Research First**: Look up optimal growing conditions for your plant
2. **Use the Export Feature**: Create a plant manually, then export to use as a template
3. **Test Import**: Always test your configuration file before sharing
4. **Document Sources**: Keep notes on where you got your growing data
5. **Start Conservative**: Use wider ranges initially, then narrow them based on experience

## Troubleshooting

### Common Errors

- **"Invalid plant configuration: missing name"**: Add the plant name field
- **"Invalid plant configuration: missing temperature threshold"**: Ensure all four sensors are defined
- **"Failed to parse configuration file"**: Check that your JSON is valid (use a JSON validator)

### Getting Help

- Use the sample configuration files as templates
- Check the JSON format in the import dialog
- Validate your JSON using online tools like JSONLint
- Start with a simple configuration and build up complexity

## Sharing Configurations

You can share your plant configurations by:
- Sending the JSON file directly
- Posting to gardening forums
- Creating a shared repository
- Including them in greenhouse setup guides

Remember to include information about your growing conditions and results when sharing! 