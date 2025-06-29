import { SerialPort } from 'serialport';
import fs from 'fs';
import path from 'path';

// Define our supported sensor types
type SupportedSensorType = 'temperature' | 'humidity' | 'light' | 'soil_moisture';

// Define the sensor reading interface
interface SensorReading {
  sensor: SupportedSensorType;
  value: number;
  unit: string;
  timestamp: string;
  status: 'active' | 'error' | 'calibrating';
  metadata: {
    raw_value: number;
    calibration_data: {
      offset?: number;
      slope?: number;
      multiplier?: number;
      dryValue?: number;
      wetValue?: number;
    };
  };
}

interface CalibrationData {
  temperature: {
    offset: number;
    slope: number;
  };
  humidity: {
    offset: number;
    slope: number;
  };
  light: {
    multiplier: number;
  };
  soil_moisture: {
    dryValue: number;
    wetValue: number;
  };
}

// Default calibration values
const DEFAULT_CALIBRATION: CalibrationData = {
  temperature: { offset: 0, slope: 1 },
  humidity: { offset: 0, slope: 1 },
  light: { multiplier: 1 },
  soil_moisture: { dryValue: 550, wetValue: 250 }
};

// Configuration for different sensor types
const SENSOR_CONFIG: Record<SupportedSensorType, { pin?: string; i2cAddress?: number; unit: string }> = {
  temperature: {
    pin: 'A0',
    unit: '°C',
  },
  humidity: {
    pin: 'A1',
    unit: '%',
  },
  light: {
    i2cAddress: 0x23, // BH1750 default address
    unit: 'lux',
  },
  soil_moisture: {
    pin: 'A2',
    unit: '%',
  },
};

class SensorController {
  private serialPort: SerialPort;
  private readings: Map<SupportedSensorType, SensorReading>;
  private updateInterval: NodeJS.Timeout | null;
  private calibrationData: CalibrationData = DEFAULT_CALIBRATION;
  private readonly CALIBRATION_FILE = path.join(__dirname, '../../../data/calibration.json');

  constructor() {
    // Initialize connection to Arduino/microcontroller
    const portPath = '/dev/ttyUSB0'; // Or COM3 on Windows
    this.serialPort = new SerialPort({
      path: portPath,
      baudRate: 9600,
    });

    this.readings = new Map();
    this.updateInterval = null;
    this.loadCalibration();
    this.setupSerialConnection();
  }

  private loadCalibration() {
    try {
      if (fs.existsSync(this.CALIBRATION_FILE)) {
        const data = fs.readFileSync(this.CALIBRATION_FILE, 'utf8');
        this.calibrationData = JSON.parse(data);
      } else {
        this.calibrationData = DEFAULT_CALIBRATION;
        this.saveCalibration();
      }
    } catch (error) {
      console.error('Error loading calibration data:', error);
      this.calibrationData = DEFAULT_CALIBRATION;
    }
  }

  private saveCalibration() {
    try {
      const dir = path.dirname(this.CALIBRATION_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.CALIBRATION_FILE, JSON.stringify(this.calibrationData, null, 2));
    } catch (error) {
      console.error('Error saving calibration data:', error);
    }
  }

  public async calibrateSensor(type: SupportedSensorType, ...args: number[]) {
    if (args.length < 2 && type !== 'soil_moisture') {
      throw new Error('Insufficient calibration parameters');
    }

    switch (type) {
      case 'temperature': {
        const [currentTemp, actualTemp] = args;
        if (currentTemp !== undefined && actualTemp !== undefined) {
          this.calibrationData.temperature.offset = actualTemp - currentTemp;
        }
        break;
      }
      case 'humidity': {
        const [currentHum, actualHum] = args;
        if (currentHum !== undefined && actualHum !== undefined) {
          this.calibrationData.humidity.offset = actualHum - currentHum;
        }
        break;
      }
      case 'light': {
        const [currentLux, actualLux] = args;
        if (currentLux !== undefined && actualLux !== undefined && currentLux !== 0) {
          this.calibrationData.light.multiplier = actualLux / currentLux;
        }
        break;
      }
      case 'soil_moisture': {
        const [isDry] = args;
        if (isDry !== undefined) {
          // Send calibration command for dry/wet soil
          this.serialPort.write(`CALIBRATE SOIL ${isDry ? 'DRY' : 'WET'}\n`);
        }
        break;
      }
    }

    // Save calibration data
    this.saveCalibration();

    // Send calibration to Arduino
    if (type !== 'soil_moisture') {
      const command = `CALIBRATE ${type.toUpperCase()} ${args.join(' ')}\n`;
      this.serialPort.write(command);
    }
  }

  private setupSerialConnection() {
    this.serialPort.on('open', () => {
      // Serial port connection established
      this.startSensorPolling();
    });

    this.serialPort.on('data', (data: Buffer) => {
      this.handleSensorData(data);
    });

    this.serialPort.on('error', (err: Error) => {
      console.error('Serial port error:', err);
    });
  }

  private startSensorPolling() {
    // Poll sensors every 5 seconds
    this.updateInterval = setInterval(() => {
      this.requestSensorUpdates();
    }, 5000);
  }

  private requestSensorUpdates() {
    // Send command to Arduino to read sensors
    this.serialPort.write('READ_SENSORS\n');
  }

  private handleSensorData(data: Buffer) {
    try {
      // Parse incoming sensor data
      const readings = JSON.parse(data.toString()) as Partial<Record<SupportedSensorType, number>>;
      
      // Update stored readings
      Object.entries(readings).forEach(([type, value]) => {
        const sensorType = type as SupportedSensorType;
        if (sensorType in SENSOR_CONFIG) {
          const config = SENSOR_CONFIG[sensorType];
          
          this.readings.set(sensorType, {
            sensor: sensorType,
            value: Number(value),
            unit: config.unit,
            timestamp: new Date().toISOString(),
            status: 'active',
            metadata: {
              raw_value: Number(value),
              calibration_data: this.calibrationData[sensorType]
            },
          });
        }
      });
    } catch (error) {
      console.error('Error parsing sensor data:', error);
    }
  }

  public getSensorReading(type: SupportedSensorType): SensorReading | null {
    return this.readings.get(type) || null;
  }

  public getAllReadings(): Record<SupportedSensorType, SensorReading | null> {
    const result = {} as Record<SupportedSensorType, SensorReading | null>;
    Object.keys(SENSOR_CONFIG).forEach((type) => {
      result[type as SupportedSensorType] = this.getSensorReading(type as SupportedSensorType);
    });
    return result;
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.serialPort.close();
  }
}

// Export singleton instance
export const sensorController = new SensorController(); 