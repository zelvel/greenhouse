import type { PlantProfile } from '@/types/plants';

class PlantConfigService {
  private profiles: Record<string, PlantProfile> = {};

  constructor() {
    // Load from backend on initialization
    this.loadFromServer();
  }

  private async loadFromServer() {
    try {
      const response = await fetch('/api/plants');
      if (response.ok) {
        this.profiles = await response.json();
      } else {
        this.profiles = {};
      }
    } catch (error) {
      console.error('Error loading plant profiles:', error);
      this.profiles = {};
    }
  }

  getAllPlants(): PlantProfile[] {
    return Object.values(this.profiles);
  }

  getPlant(name: string): PlantProfile | undefined {
    const normalizedName = name.toLowerCase();
    for (const [key, plant] of Object.entries(this.profiles)) {
      if (key === normalizedName || plant.name.toLowerCase() === normalizedName) {
        return plant;
      }
    }
    return undefined;
  }

  async addPlant(plant: PlantProfile): Promise<void> {
    const key = this.generateKey(plant.name);
    this.profiles[key] = plant;
    await this.saveToServer();
  }

  async updatePlant(key: string, plant: PlantProfile): Promise<void> {
    this.profiles[key] = plant;
    await this.saveToServer();
  }

  async deletePlant(key: string): Promise<void> {
    delete this.profiles[key];
    await this.saveToServer();
  }

  private generateKey(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private async saveToServer(): Promise<void> {
    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.profiles),
      });
      if (!response.ok) {
        throw new Error('Failed to save plant configuration');
      }
    } catch (error) {
      console.error('Error saving plant configuration:', error);
      throw error;
    }
  }
}

export const plantConfigService = new PlantConfigService(); 