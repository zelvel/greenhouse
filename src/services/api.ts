import axios from 'axios';
import type {
  SensorType,
  ActuatorType,
  SensorReading,
  ActuatorState,
  SystemStatus,
  SensorLog,
  ActuatorLog,
  TimeRange,
  VisualizationResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSensorReading = async (sensorType: SensorType): Promise<SensorReading> => {
  const { data } = await api.get(`/sensor/${sensorType}`);
  return data;
};

export const setActuatorState = async (
  actuatorType: ActuatorType,
  value: number
): Promise<ActuatorState> => {
  const { data } = await api.post(`/actuator/${actuatorType}`, { value });
  return data;
};

export const getSystemStatus = async (): Promise<SystemStatus> => {
  const { data } = await api.get('/status');
  return data;
};

export const getSensorLogs = async (
  sensorType?: SensorType,
  timeRange?: TimeRange
): Promise<SensorLog[]> => {
  const params = {
    type: sensorType,
    ...timeRange,
  };
  const { data } = await api.get('/logs/sensors', { params });
  return data;
};

export const getActuatorLogs = async (
  actuatorType?: ActuatorType,
  timeRange?: TimeRange
): Promise<ActuatorLog[]> => {
  const params = {
    type: actuatorType,
    ...timeRange,
  };
  const { data } = await api.get('/logs/actuators', { params });
  return data;
};

export const getSensorVisualization = async (
  sensorType: SensorType,
  timeRange?: TimeRange
): Promise<VisualizationResponse> => {
  const { data } = await api.get(`/visualize/sensor/${sensorType}`, {
    params: timeRange,
  });
  return data;
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.error || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Error in request configuration
      console.error('Request Error:', error.message);
      throw new Error('Request configuration error');
    }
  }
); 