import { useQuery } from '@tanstack/react-query';
import { getSensorReading, getSensorLogs, getSensorVisualization } from '../services/api';
import type { SensorType, TimeRange } from '../types';

export const useSensorReading = (sensorType: SensorType, pollingInterval = 5000) => {
  return useQuery({
    queryKey: ['sensor', sensorType],
    queryFn: () => getSensorReading(sensorType),
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
  });
};

export const useSensorLogs = (sensorType?: SensorType, timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['sensorLogs', sensorType, timeRange],
    queryFn: () => getSensorLogs(sensorType, timeRange),
    enabled: !!sensorType,
  });
};

export const useSensorVisualization = (sensorType: SensorType, timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['sensorVisualization', sensorType, timeRange],
    queryFn: () => getSensorVisualization(sensorType, timeRange),
    enabled: !!sensorType,
  });
}; 