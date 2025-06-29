import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlantProfile } from '@/types/plants';
import { AddPlantForm } from '@/components/AddPlantForm';
import { PlantConfigPreview } from '@/components/PlantConfigPreview';
import { MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

export const AddPlantPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PlantProfile | null>(null);
  const [presets, setPresets] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    // Fetch available preset files
    fetch('/api/presets')
      .then(res => res.json())
      .then(setPresets)
      .catch(() => setPresets([]));
  }, []);

  const handlePresetChange = async (event: SelectChangeEvent<string>) => {
    const filename = event.target.value as string;
    setSelectedPreset(filename);
    if (filename) {
      const res = await fetch(`/api/presets/${filename}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    }
  };

  const handleSubmit = async (plant: PlantProfile) => {
    try {
      setFormData(plant);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const res = await fetch('/api/plants/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save plant');
      navigate('/plants');
    } catch (error) {
      console.error('Error saving plant:', error);
      alert('Failed to save plant. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/plants');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {!formData ? (
        // Show form when no data is available
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Plant</h1>
            <p className="text-gray-600">Configure your plant's requirements and growth stages</p>
          </div>
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="preset-select-label">Load Preset</InputLabel>
              <Select
                labelId="preset-select-label"
                value={selectedPreset}
                label="Load Preset"
                onChange={handlePresetChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {presets.map((preset) => (
                  <MenuItem key={preset} value={preset}>{preset.replace('.json', '')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <AddPlantForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      ) : (
        // Show preview when form data is available
        <PlantConfigPreview 
          plant={formData} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}; 