import React from 'react';
import type { PlantProfile } from '@/types/plants';
import { useSensorReading } from '@/hooks/useSensorData';
import { 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid, 
  Paper,
  Button,
  Divider
} from '@mui/material';
import { 
  Thermostat, 
  WaterDrop, 
  WbSunny, 
  Info, 
  Timeline, 
  Settings, 
  CheckCircle,
  Cancel,
  LocalFlorist
} from '@mui/icons-material';

interface PlantConfigPreviewProps {
  plant: PlantProfile;
  onSave?: () => void;
  onCancel?: () => void;
}

const SensorStatusCard: React.FC<{ 
  type: string, 
  value: number, 
  unit: string,
  min: number,
  optimal: number,
  max: number,
  icon: React.ReactElement,
  color: string
}> = ({ type, value, unit, min, optimal, max, icon, color }) => {
  const getStatusColor = () => {
    if (value < min || value > max) return 'error';
    if (value === optimal) return 'success';
    const tolerance = (max - min) * 0.1; // 10% tolerance
    return Math.abs(value - optimal) <= tolerance ? 'success' : 'warning';
  };

  const getStatusText = () => {
    if (value < min || value > max) return 'Critical';
    if (value === optimal) return 'Optimal';
    const tolerance = (max - min) * 0.1;
    return Math.abs(value - optimal) <= tolerance ? 'Good' : 'Warning';
  };

  return (
    <Card elevation={2} sx={{ height: '100%', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { elevation: 4, transform: 'translateY(-2px)' } }}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        {/* Sensor Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: 32, 
              color: color,
            } 
          })}
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Typography>

        {/* Current Reading */}
        <Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value.toFixed(1)}
            <Typography
              component="span"
              variant="h6"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {unit}
            </Typography>
          </Typography>
          
          <Chip 
            label={getStatusText()} 
            color={getStatusColor()} 
            size="small" 
            variant="outlined"
            sx={{ mb: 1 }}
          />
          
          <Typography variant="caption" color="text.secondary" display="block">
            Optimal: {optimal}{unit}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <Typography variant="caption" color="text.secondary">
            Min: {min}{unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Max: {max}{unit}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactElement; color?: string }> = ({ 
  title, 
  children, 
  icon = <Info />,
  color = '#1976d2'
}) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box color={color} mr={2}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const ThresholdCard: React.FC<{ sensor: string; values: any; color: string }> = ({ sensor, values, color }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box color={color} mr={2}>
          <Settings />
        </Box>
        <Typography variant="h6" component="h3" sx={{ textTransform: 'capitalize' }}>
          {sensor}
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Min
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {values.min}{values.unit}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant="caption" color="success.main" display="block">
              Optimal
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
              {values.optimal}{values.unit}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Max
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {values.max}{values.unit}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const GrowthStageCard: React.FC<{ stage: string; data: any; color: string }> = ({ stage, data, color }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box color={color} mr={2}>
          <Timeline />
        </Box>
        <Typography variant="h6" component="h3" sx={{ textTransform: 'capitalize' }}>
          {stage}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
            Duration
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            {data.duration} days
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Requirements:
      </Typography>
      
      <Box sx={{ space: 1 }}>
        {Object.entries(data.modifiers).map(([sensor, values]: [string, any]) => (
          <Box key={sensor} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {sensor}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {values.optimal}{values.unit}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export const PlantConfigPreview: React.FC<PlantConfigPreviewProps> = ({ plant, onSave, onCancel }) => {
  const tempQuery = useSensorReading('temperature');
  const humidityQuery = useSensorReading('humidity');
  const lightQuery = useSensorReading('light');

  const isLoading = tempQuery.isLoading || humidityQuery.isLoading || lightQuery.isLoading;
  const isError = tempQuery.isError || humidityQuery.isError || lightQuery.isError;

  const sensorColors = {
    temperature: '#e65100',
    humidity: '#0277bd',
    light: '#f9a825'
  };

  const thresholdColors = {
    temperature: '#e65100',
    humidity: '#0277bd',
    light: '#f9a825'
  };

  const growthStageColors = ['#2e7d32', '#1976d2', '#ed6c02', '#9c27b0'];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box color="white" mr={2}>
            <CheckCircle sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
            Configuration Summary
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', opacity: 0.9 }}>
          Review your plant settings before saving
        </Typography>
      </Paper>

      {/* Basic Information */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <InfoCard title="Basic Information" icon={<LocalFlorist />} color="#2e7d32">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Plant Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {plant.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Scientific Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                    {plant.scientificName}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Current Sensor Readings */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        Current Sensor Readings
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Failed to load sensor data</Alert>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <SensorStatusCard
              type="temperature"
              value={tempQuery.data?.value || 0}
              unit="°C"
              min={plant.thresholds.temperature.min}
              optimal={plant.thresholds.temperature.optimal}
              max={plant.thresholds.temperature.max}
              icon={<Thermostat />}
              color={sensorColors.temperature}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SensorStatusCard
              type="humidity"
              value={humidityQuery.data?.value || 0}
              unit="%"
              min={plant.thresholds.humidity.min}
              optimal={plant.thresholds.humidity.optimal}
              max={plant.thresholds.humidity.max}
              icon={<WaterDrop />}
              color={sensorColors.humidity}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SensorStatusCard
              type="light"
              value={lightQuery.data?.value || 0}
              unit="lux"
              min={plant.thresholds.light.min}
              optimal={plant.thresholds.light.optimal}
              max={plant.thresholds.light.max}
              icon={<WbSunny />}
              color={sensorColors.light}
            />
          </Grid>
        </Grid>
      )}

      {/* Sensor Thresholds */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        Sensor Thresholds
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(plant.thresholds).map(([sensor, values], index) => {
          const color = thresholdColors[sensor as keyof typeof thresholdColors];
          return (
            <Grid item xs={12} sm={6} md={4} key={sensor}>
              <ThresholdCard 
                sensor={sensor} 
                values={values} 
                color={color || '#666'}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Growth Stages */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        Growth Stages
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(plant.growthStages).map(([stage, data], index) => (
          <Grid item xs={12} sm={6} md={4} key={stage}>
            <GrowthStageCard 
              stage={stage} 
              data={data} 
              color={growthStageColors[index % growthStageColors.length]}
            />
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      {(onSave || onCancel) && (
        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {onCancel && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Cancel />}
                onClick={onCancel}
                sx={{ minWidth: 150 }}
              >
                Cancel
              </Button>
            )}
            {onSave && (
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircle />}
                onClick={onSave}
                sx={{ 
                  minWidth: 200,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
                  }
                }}
              >
                Save Configuration
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </div>
  );
}; 