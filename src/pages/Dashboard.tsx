import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Air,
  WbSunny,
  Science,
  Warning,
} from '@mui/icons-material';
import { useSystemStatus } from '../hooks/useSystemStatus';
import type { SensorType } from '../types';

const sensorIcons: Record<SensorType, React.ReactElement> = {
  temperature: <Thermostat />,
  humidity: <WaterDrop />,
  soil_moisture: <WaterDrop />,
  co2: <Air />,
  light: <WbSunny />,
  ph: <Science />,
};

const sensorNames: Record<SensorType, string> = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  soil_moisture: 'Soil Moisture',
  co2: 'CO₂ Level',
  light: 'Light Level',
  ph: 'pH Level',
};

export const Dashboard = () => {
  const { data: status, isLoading, error } = useSystemStatus();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load system status: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  if (!status) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No system status data available
      </Alert>
    );
  }

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center">
        <Typography variant="h4" component="h1">
          System Status
        </Typography>
        {status.status !== 'healthy' && (
          <Alert
            severity={status.status === 'error' ? 'error' : 'warning'}
            icon={<Warning />}
            sx={{ ml: 2 }}
          >
            {status.status === 'error'
              ? 'System Error'
              : 'System is running in degraded state'}
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {Object.entries(status.sensors).map(([type, data]) => {
          const sensorType = type as SensorType;
          return (
            <Card key={type}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box color="primary.main" mr={1}>
                    {sensorIcons[sensorType]}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {sensorNames[sensorType]}
                  </Typography>
                </Box>
                {data.status === 'error' ? (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Sensor error
                  </Alert>
                ) : (
                  <Typography variant="h4" component="div" color="text.primary">
                    {data.value.toFixed(1)}
                    <Typography
                      component="span"
                      variant="h6"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      {data.unit}
                    </Typography>
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Actuator States
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
        {Object.entries(status.actuators).map(([type, value]) => (
          <Card key={type}>
            <CardContent>
              <Typography
                variant="subtitle1"
                component="div"
                color="text.secondary"
                gutterBottom
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Typography>
              <Typography variant="h5" component="div">
                {value !== null ? `${value.toFixed(1)}%` : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 