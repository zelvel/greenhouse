import type { PlantProfile } from '@/types/plants';
import { plantProfiles } from '@/config/plants';

class PlantConfigService {
  private profiles: Record<string, PlantProfile>;

  constructor() {
    this.profiles = this.loadFromDisk();
  }

  private loadFromDisk(): Record<string, PlantProfile> {
    return plantProfiles;
  }

  getAllPlants(): PlantProfile[] {
    return Object.values(this.profiles);
  }

  getPlant(name: string): PlantProfile | undefined {
    // First try to find by exact key match
    if (this.profiles[name]) {
      return this.profiles[name];
    }
    
    // If not found, try to find by display name (case-insensitive)
    const normalizedName = name.toLowerCase();
    for (const [key, plant] of Object.entries(this.profiles)) {
      if (plant.name.toLowerCase() === normalizedName) {
        return plant;
      }
    }
    
    // If still not found, try to find by generated key
    const generatedKey = this.generateKey(name);
    if (this.profiles[generatedKey]) {
      return this.profiles[generatedKey];
    }
    
    return undefined;
  }

  addPlant(plant: PlantProfile): void {
    const key = this.generateKey(plant.name);
    this.profiles[key] = plant;
    this.saveToDisk();
  }

  updatePlant(key: string, plant: PlantProfile): void {
    // Find the existing plant by name and update it
    const existingPlant = this.getPlant(key);
    if (existingPlant) {
      // Find the actual key in the profiles
      const actualKey = Object.keys(this.profiles).find(k => 
        this.profiles[k] && this.profiles[k].name === existingPlant.name
      );
      if (actualKey) {
        this.profiles[actualKey] = plant;
        this.saveToDisk();
      }
    }
  }

  deletePlant(key: string): void {
    // Find the existing plant by name and delete it
    const existingPlant = this.getPlant(key);
    if (existingPlant) {
      // Find the actual key in the profiles
      const actualKey = Object.keys(this.profiles).find(k => 
        this.profiles[k] && this.profiles[k].name === existingPlant.name
      );
      if (actualKey) {
        delete this.profiles[actualKey];
        this.saveToDisk();
      }
    }
  }

  private generateKey(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private async saveToDisk(): Promise<void> {
    try {
      const content = `import type { PlantProfile } from '@/types/plants';

// Default plant profiles
export const plantProfiles: Record<string, PlantProfile> = ${JSON.stringify(this.profiles, null, 2)};`;

      // Use the Fetch API to send the content to your backend
      const response = await fetch('/api/config/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, path: 'src/config/plants/index.ts' }),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving plant configuration:', error);
      throw error;
    }
  }
}

export const plantConfigService = new PlantConfigService(); 