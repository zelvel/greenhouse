import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlantProfile } from '@/types/plants';
import { useSensorReading } from '@/hooks/useSensorData';
import { CircularProgress, Alert, Card, CardContent, Grid, Chip, Box, Button } from '@mui/material';
import { Thermostat, WaterDrop, WbSunny, Edit, Delete, Add } from '@mui/icons-material';

const SensorStatus: React.FC<{ 
  value: number | undefined, 
  unit: string,
  min: number,
  optimal: number,
  max: number,
  icon: React.ReactElement
}> = React.memo(({ value, unit, min, optimal, max, icon }) => {
  if (value === undefined) return null;

  const getStatusColor = () => {
    if (value < min || value > max) return 'error';
    if (value === optimal) return 'success';
    const tolerance = (max - min) * 0.1;
    return Math.abs(value - optimal) <= tolerance ? 'success' : 'warning';
  };

  const getStatusText = () => {
    if (value < min) return 'Low';
    if (value > max) return 'High';
    if (value === optimal) return 'Optimal';
    const tolerance = (max - min) * 0.1;
    return Math.abs(value - optimal) <= tolerance ? 'Good' : 'Fair';
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          {React.cloneElement(icon, { 
            sx: { fontSize: 24, color: `${getStatusColor()}.main` } 
          })}
        </Box>
        <Box sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 0.5 }}>
          {value.toFixed(1)}{unit}
        </Box>
        <Chip 
          label={getStatusText()} 
          color={getStatusColor()} 
          size="small" 
          variant="outlined"
        />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
          {min}-{max}{unit}
        </Box>
      </CardContent>
    </Card>
  );
});

export const PlantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<PlantProfile[]>([]);
  
  // Move Hook calls to the top level
  const temperatureQuery = useSensorReading('temperature', 30000);
  const humidityQuery = useSensorReading('humidity', 30000);
  const lightQuery = useSensorReading('light', 30000);

  // Create a memoized object for the queries
  const sensorQueries = useMemo(() => ({
    temperature: temperatureQuery,
    humidity: humidityQuery,
    light: lightQuery
  }), [temperatureQuery, humidityQuery, lightQuery]);

  useEffect(() => {
    async function fetchPlants() {
      const res = await fetch('/api/plants');
      if (res.ok) {
        const data = await res.json();
        setPlants(Object.values(data));
      } else {
        setPlants([]);
      }
    }
    fetchPlants();
  }, []);

  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent event bubbling
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await fetch(`/api/plants/${encodeURIComponent(name)}`, {
          method: 'DELETE'
        });
        setPlants(plants.filter(plant => plant.name !== name));
      } catch (error) {
        console.error('Error deleting plant:', error);
        alert('Failed to delete plant. Please try again.');
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/plants/edit/${encodeURIComponent(name)}`);
  };

  const handleAddPlant = () => {
    navigate('/plants/add');
  };

  const isLoading = useMemo(() => (
    Object.values(sensorQueries).some(query => query.isLoading)
  ), [sensorQueries]);

  const isError = useMemo(() => (
    Object.values(sensorQueries).some(query => query.isError)
  ), [sensorQueries]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
        <h1 className="text-3xl font-bold">Plants</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddPlant}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
            }
          }}
        >
          Add New Plant
        </Button>
      </Box>

      {/* Plant Cards Grid */}
      <Grid container spacing={4}>
        {plants.map((plant) => (
          <Grid item xs={12} sm={6} md={8} lg={6} key={plant.name}>
            <Card elevation={2} sx={{ overflow: 'visible', height: '100%' }}>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Header with plant info and actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <h3 className="text-xl font-semibold mb-1">{plant.name}</h3>
                    <p className="text-gray-600 italic">{plant.scientificName}</p>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <button
                      onClick={(e) => handleEdit(e, plant.name)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit plant"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, plant.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete plant"
                    >
                      <Delete />
                    </button>
                  </Box>
                </Box>

                {/* Sensor readings grid */}
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : isError ? (
                  <Alert severity="error" sx={{ mb: 2 }}>Failed to load sensor data</Alert>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <SensorStatus
                        value={sensorQueries.temperature.data?.value}
                        unit="°C"
                        min={plant.thresholds.temperature.min}
                        optimal={plant.thresholds.temperature.optimal}
                        max={plant.thresholds.temperature.max}
                        icon={<Thermostat />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SensorStatus
                        value={sensorQueries.humidity.data?.value}
                        unit="%"
                        min={plant.thresholds.humidity.min}
                        optimal={plant.thresholds.humidity.optimal}
                        max={plant.thresholds.humidity.max}
                        icon={<WaterDrop />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SensorStatus
                        value={sensorQueries.light.data?.value}
                        unit="lux"
                        min={plant.thresholds.light.min}
                        optimal={plant.thresholds.light.optimal}
                        max={plant.thresholds.light.max}
                        icon={<WbSunny />}
                      />
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}; 