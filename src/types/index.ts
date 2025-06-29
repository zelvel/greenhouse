export type SensorType = 'temperature' | 'humidity' | 'soil_moisture' | 'co2' | 'light' | 'ph';
export type ActuatorType = 'fan' | 'pump' | 'light' | 'heater' | 'humidifier' | 'dehumidifier' | 'vent';

export interface SensorReading {
  sensor: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  status: string;
  metadata: {
    raw_value: number;
    calibration: number;
  };
}

export interface ActuatorState {
  actuator: ActuatorType;
  value: number;
  status: string;
  timestamp: string;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  sensors: {
    [key in SensorType]?: {
      value: number;
      unit: string;
      status: string;
    };
  };
  actuators: {
    [key in ActuatorType]?: number;
  };
  error?: string;
}

export interface SensorLog {
  id: number;
  type: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  metadata: {
    raw_value: number;
    calibration: number;
  };
}

export interface ActuatorLog {
  id: number;
  type: ActuatorType;
  value: number;
  timestamp: string;
}

export interface TimeRange {
  start_time?: string;
  end_time?: string;
}

export interface VisualizationResponse {
  message: string;
  image_path: string;
  data_points: number;
  time_range: {
    start: string;
    end: string;
  };
} 