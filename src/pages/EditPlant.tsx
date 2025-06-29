import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PlantProfile } from '@/types/plants';
import { AddPlantForm } from '@/components/AddPlantForm';
import { plantConfigService } from '@/services/plantConfig';
import { Alert, CircularProgress, Box } from '@mui/material';

export const EditPlantPage: React.FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [plant, setPlant] = useState<PlantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlant = async () => {
      if (name) {
        try {
          // Decode the plant name from URL
          const decodedName = decodeURIComponent(name);
          const existingPlant = plantConfigService.getPlant(decodedName);
          if (existingPlant) {
            setPlant(existingPlant);
          } else {
            setError(`Plant "${decodedName}" not found`);
          }
        } catch (err) {
          setError('Failed to load plant data');
          console.error('Error loading plant:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPlant();
  }, [name]);

  const handleSubmit = async (updatedPlant: PlantProfile) => {
    if (!name) return;

    try {
      await plantConfigService.updatePlant(name, updatedPlant);
      navigate('/plants');
    } catch (error) {
      console.error('Error saving plant:', error);
      alert('Failed to save plant. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/plants');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Plant not found'}
        </Alert>
        <button
          onClick={() => navigate('/plants')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Plants
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AddPlantForm
        initialData={plant}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}; 