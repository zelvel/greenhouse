import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlantProfile } from '@/types/plants';
import { AddPlantForm } from '@/components/AddPlantForm';
import { PlantConfigPreview } from '@/components/PlantConfigPreview';
import { plantConfigService } from '@/services/plantConfig';

export const AddPlantPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PlantProfile | null>(null);

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
      await plantConfigService.addPlant(formData);
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