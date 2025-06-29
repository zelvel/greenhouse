import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Air,
  WaterDrop,
  WbSunny,
  Thermostat,
  Opacity,
  CompareArrows,
  Refresh,
  PowerSettingsNew,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { ActuatorControl } from '../components/ActuatorControl';
import { useSystemStatus } from '../hooks/useSystemStatus';

const actuatorConfig = {
  fan: {
    icon: <Air />,
    name: 'Fan',
    color: '#0277bd',
    description: 'Ventilation fan for air circulation',
  },
  pump: {
    icon: <WaterDrop />,
    name: 'Water Pump',
    color: '#2e7d32',
    description: 'Automated watering system',
  },
  light: {
    icon: <WbSunny />,
    name: 'Grow Light',
    color: '#f9a825',
    description: 'LED grow lights for plant growth',
  },
  heater: {
    icon: <Thermostat />,
    name: 'Heater',
    color: '#e65100',
    description: 'Temperature control system',
  },
  humidifier: {
    icon: <Opacity />,
    name: 'Humidifier',
    color: '#0097a7',
    description: 'Humidity control system',
  },
  dehumidifier: {
    icon: <Opacity />,
    name: 'Dehumidifier',
    color: '#6a1b9a',
    description: 'Humidity reduction system',
  },
  vent: {
    icon: <CompareArrows />,
    name: 'Ventilation',
    color: '#455a64',
    description: 'Air exchange system',
  },
} as const;

export const Actuators = () => {
  const queryClient = useQueryClient();
  const { data: status, isLoading, error } = useSystemStatus();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['systemStatus'] });
  };

  const getStatusColor = (value: number) => {
    if (value === 0) return 'default';
    if (value < 50) return 'warning';
    return 'success';
  };

  const getStatusText = (value: number) => {
    if (value === 0) return 'Off';
    if (value < 50) return 'Low';
    return 'High';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load system status: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert severity="warning" sx={{ mt: 2 }}>
          No system status data available
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Actuator Controls</h1>
        <Tooltip title="Refresh system status">
          <IconButton onClick={handleRefresh} color="primary" size="large">
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>

      {/* System Status Overview */}
      <Card elevation={2} sx={{ mb: 6 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PowerSettingsNew sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              System Overview
            </Typography>
            <Chip 
              label={`${Object.values(status.actuators).filter(v => v > 0).length} Active`} 
              color="primary" 
              variant="outlined" 
              sx={{ ml: 'auto' }}
            />
          </Box>
          
          <Grid container spacing={2}>
            {Object.entries(status.actuators).map(([type, value]) => (
              <Grid item xs={6} sm={3} key={type}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {actuatorConfig[type as keyof typeof actuatorConfig]?.name || type}
                  </Typography>
                  <Chip 
                    label={`${value}%`} 
                    color={getStatusColor(value)} 
                    size="small"
                    variant={value > 0 ? "filled" : "outlined"}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Actuator Control Cards */}
      <Grid container spacing={0.5}>
        {Object.entries(actuatorConfig).map(([type, config]) => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={type}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 0.25, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                  <Box color={config.color} mr={0.25}>
                    {React.cloneElement(config.icon, { sx: { fontSize: 13 } })}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" component="h3" sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0 }}>
                      {config.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                      {config.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Status Indicator */}
                <Box sx={{ mb: 0.25, textAlign: 'center' }}>
                  <Chip 
                    label={getStatusText(status.actuators[type as keyof typeof actuatorConfig] ?? 0)} 
                    color={getStatusColor(status.actuators[type as keyof typeof actuatorConfig] ?? 0)} 
                    variant="outlined"
                    size="small"
                    sx={{ mb: 0.1, fontSize: '0.65rem', height: 18 }}
                  />
                  <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1 }}>
                    {status.actuators[type as keyof typeof actuatorConfig] ?? 0}%
                  </Typography>
                </Box>

                {/* Control Component */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <ActuatorControl
                    type={type as keyof typeof actuatorConfig}
                    name={config.name}
                    icon={config.icon}
                    color={config.color}
                    currentValue={status.actuators[type as keyof typeof actuatorConfig] ?? 0}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}; 