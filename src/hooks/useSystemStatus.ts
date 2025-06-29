import { useQuery } from '@tanstack/react-query';
import { getSystemStatus } from '../services/api';

export const useSystemStatus = (pollingInterval = 5000) => {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: getSystemStatus,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
  });
}; 