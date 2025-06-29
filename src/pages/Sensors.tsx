import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Air,
  WbSunny,
  Science,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { SensorChart } from '../components/SensorChart';
import { useSensorReading } from '../hooks/useSensorData';
import type { SensorType } from '../types';

const sensorConfig = {
  temperature: {
    icon: <Thermostat />,
    name: 'Temperature',
    color: '#e65100',
    unit: '°C',
  },
  humidity: {
    icon: <WaterDrop />,
    name: 'Humidity',
    color: '#0277bd',
    unit: '%',
  },
  soil_moisture: {
    icon: <WaterDrop />,
    name: 'Soil Moisture',
    color: '#2e7d32',
    unit: '%',
  },
  co2: {
    icon: <Air />,
    name: 'CO₂ Level',
    color: '#6a1b9a',
    unit: 'ppm',
  },
  light: {
    icon: <WbSunny />,
    name: 'Light Level',
    color: '#f9a825',
    unit: 'lux',
  },
  ph: {
    icon: <Science />,
    name: 'pH Level',
    color: '#c62828',
    unit: 'pH',
  },
} as const;

export const Sensors = () => {
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('temperature');
  const queryClient = useQueryClient();

  const { data: reading, isLoading, error } = useSensorReading(selectedSensor);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sensor', selectedSensor] });
    queryClient.invalidateQueries({ queryKey: ['sensorLogs', selectedSensor] });
  };

  const getStatusColor = (value: number, sensorType: SensorType) => {
    // Define normal ranges for each sensor type
    const ranges = {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 80 },
      soil_moisture: { min: 30, max: 80 },
      co2: { min: 300, max: 1000 },
      light: { min: 1000, max: 10000 },
      ph: { min: 5.5, max: 7.5 },
    };

    const range = ranges[sensorType];
    if (value < range.min || value > range.max) return 'error';
    if (value >= range.min && value <= range.max) return 'success';
    return 'warning';
  };

  const getStatusText = (value: number, sensorType: SensorType) => {
    const ranges = {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 80 },
      soil_moisture: { min: 30, max: 80 },
      co2: { min: 300, max: 1000 },
      light: { min: 1000, max: 10000 },
      ph: { min: 5.5, max: 7.5 },
    };

    const range = ranges[sensorType];
    if (value < range.min) return 'Low';
    if (value > range.max) return 'High';
    return 'Normal';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sensor Readings</h1>
        <Tooltip title="Refresh all sensor data">
          <IconButton onClick={handleRefresh} color="primary" size="large">
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>

      {/* Sensor Cards Grid */}
      <div className="space-y-6 mb-8">
        <Grid container spacing={3}>
          {Object.entries(sensorConfig).map(([type, config]) => {
            const sensorReading = useSensorReading(type as SensorType);
            const isSelected = selectedSensor === type;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Card 
                  elevation={isSelected ? 4 : 2} 
                  sx={{ 
                    cursor: 'pointer',
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => setSelectedSensor(type as SensorType)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    {/* Sensor Icon and Name */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {React.cloneElement(config.icon, { 
                        sx: { 
                          fontSize: 32, 
                          color: config.color,
                          opacity: isSelected ? 1 : 0.7
                        } 
                      })}
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {config.name}
                    </Typography>

                    {/* Current Reading */}
                    {sensorReading.isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : sensorReading.error ? (
                      <Alert severity="error" sx={{ fontSize: '0.75rem' }}>
                        Error
                      </Alert>
                    ) : sensorReading.data ? (
                      <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {sensorReading.data.value.toFixed(1)}
                          <Typography
                            component="span"
                            variant="h6"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {config.unit}
                          </Typography>
                        </Typography>
                        
                        <Chip 
                          label={getStatusText(sensorReading.data.value, type as SensorType)} 
                          color={getStatusColor(sensorReading.data.value, type as SensorType)} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(sensorReading.data.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No data
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>

      {/* Selected Sensor Details */}
      {selectedSensor && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box color={sensorConfig[selectedSensor].color} mr={2}>
              {sensorConfig[selectedSensor].icon}
            </Box>
            <Typography variant="h5" component="h2">
              {sensorConfig[selectedSensor].name} Details
            </Typography>
            <Chip 
              icon={<TrendingUp />} 
              label="Live Data" 
              color="primary" 
              variant="outlined" 
              sx={{ ml: 'auto' }}
            />
          </Box>

          <Grid container spacing={3}>
            {/* Current Reading Card */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Current Reading
                  </Typography>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Alert severity="error">
                      Failed to load sensor data:{' '}
                      {error instanceof Error ? error.message : 'Unknown error'}
                    </Alert>
                  ) : reading ? (
                    <Box>
                      <Typography variant="h3" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {reading.value.toFixed(1)}
                        <Typography
                          component="span"
                          variant="h5"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {sensorConfig[selectedSensor].unit}
                        </Typography>
                      </Typography>
                      
                      <Chip 
                        label={getStatusText(reading.value, selectedSensor)} 
                        color={getStatusColor(reading.value, selectedSensor)} 
                        sx={{ mt: 2 }}
                      />
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Last updated: {new Date(reading.timestamp).toLocaleString()}
                      </Typography>
                      
                      {reading.metadata && (
                        <Box mt={2} sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Raw Value: {reading.metadata.raw_value.toFixed(2)}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Calibration: {reading.metadata.calibration}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Alert severity="warning">No sensor data available</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Chart Card */}
            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Historical Data
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <SensorChart
                      sensorType={selectedSensor}
                      title={`${sensorConfig[selectedSensor].name} History`}
                      color={sensorConfig[selectedSensor].color}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}; 