import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setActuatorState, getActuatorLogs } from '../services/api';
import type { ActuatorType, TimeRange } from '../types';

export const useActuatorControl = (actuatorType: ActuatorType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: number) => setActuatorState(actuatorType, value),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
      queryClient.invalidateQueries({ queryKey: ['actuatorLogs', actuatorType] });
    },
  });
};

export const useActuatorLogs = (actuatorType?: ActuatorType, timeRange?: TimeRange) => {
  return useQuery({
    queryKey: ['actuatorLogs', actuatorType, timeRange],
    queryFn: () => getActuatorLogs(actuatorType, timeRange),
    enabled: !!actuatorType,
  });
}; 