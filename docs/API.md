# API Documentation

## Base URL
- Development: `http://localhost:3001`
- Production: `http://your-server:3001`

## Authentication
Currently, the API does not require authentication. For production use, consider implementing authentication.

## Endpoints

### Sensor Data

#### Get Current Sensor Readings
```http
GET /api/sensors
```

Response:
```json
{
  "temperature": {
    "sensor": "temperature",
    "value": 25.6,
    "unit": "°C",
    "timestamp": "2024-05-28T12:34:56Z",
    "status": "active",
    "metadata": {
      "raw_value": 25.6,
      "calibration_data": {
        "offset": 0,
        "slope": 1
      }
    }
  },
  "humidity": {
    "sensor": "humidity",
    "value": 65.4,
    "unit": "%",
    "status": "active",
    "timestamp": "2024-05-28T12:34:56Z",
    "metadata": {
      "raw_value": 65.4,
      "calibration_data": {
        "offset": 0,
        "slope": 1
      }
    }
  },
  "light": {
    "sensor": "light",
    "value": 5000,
    "unit": "lux",
    "status": "active",
    "timestamp": "2024-05-28T12:34:56Z",
    "metadata": {
      "raw_value": 5000,
      "calibration_data": {
        "multiplier": 1
      }
    }
  },
  "soil_moisture": {
    "sensor": "soil_moisture",
    "value": 75,
    "unit": "%",
    "status": "active",
    "timestamp": "2024-05-28T12:34:56Z",
    "metadata": {
      "raw_value": 75,
      "calibration_data": {
        "dryValue": 550,
        "wetValue": 250
      }
    }
  }
}
```

#### Get Historical Sensor Data
```http
GET /api/sensors/history
```

Query Parameters:
- `start`: Start timestamp (ISO 8601)
- `end`: End timestamp (ISO 8601)
- `sensor`: Sensor type (optional)

Example:
```http
GET /api/sensors/history?start=2024-05-27T00:00:00Z&end=2024-05-28T00:00:00Z&sensor=temperature
```

Response:
```json
{
  "data": [
    {
      "timestamp": "2024-05-27T00:00:00Z",
      "value": 25.6,
      "unit": "°C"
    },
    // ... more data points
  ]
}
```

### Sensor Calibration

#### Calibrate Sensor
```http
POST /api/sensors/calibrate
```

Request Body:
```json
{
  "sensor": "temperature",
  "currentValue": 25.5,
  "actualValue": 27.0
}
```

Response:
```json
{
  "success": true,
  "calibration": {
    "offset": 1.5,
    "slope": 1
  }
}
```

### System Control

#### Get System Status
```http
GET /api/system/status
```

Response:
```json
{
  "status": "running",
  "uptime": 86400,
  "actuators": {
    "fan": "on",
    "pump": "off",
    "lights": "on"
  },
  "lastBackup": "2024-05-28T00:00:00Z",
  "errors": []
}
```

#### Control Actuator
```http
POST /api/system/control
```

Request Body:
```json
{
  "actuator": "fan",
  "action": "on"
}
```

Response:
```json
{
  "success": true,
  "actuator": "fan",
  "status": "on"
}
```

### Plant Management

#### Get All Plants
```http
GET /api/plants
```

Response:
```json
{
  "plants": [
    {
      "id": "tomato-1",
      "name": "Cherry Tomato",
      "thresholds": {
        "temperature": {
          "min": 20,
          "max": 30
        },
        "humidity": {
          "min": 50,
          "max": 70
        },
        "light": {
          "min": 3000,
          "max": 10000
        },
        "soil_moisture": {
          "min": 60,
          "max": 80
        }
      }
    }
  ]
}
```

#### Add New Plant
```http
POST /api/plants
```

Request Body:
```json
{
  "name": "Basil",
  "thresholds": {
    "temperature": {
      "min": 18,
      "max": 28
    },
    "humidity": {
      "min": 40,
      "max": 60
    },
    "light": {
      "min": 2000,
      "max": 8000
    },
    "soil_moisture": {
      "min": 50,
      "max": 70
    }
  }
}
```

Response:
```json
{
  "success": true,
  "plant": {
    "id": "basil-1",
    "name": "Basil",
    "thresholds": {
      // ... thresholds data
    }
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid parameters"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
``` 