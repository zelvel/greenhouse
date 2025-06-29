import { Router } from 'express';
import type { Request, Response } from 'express';
import { readFile, writeFile, readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

const plantsPath = join(__dirname, '../../../config/plants.json');
const configDir = join(__dirname, '../../../config');

/**
 * @swagger
 * /plants:
 *   get:
 *     summary: Get all active plant profiles
 *     responses:
 *       200:
 *         description: List of active plant profiles
 *   post:
 *     summary: Replace the list of active plant filenames
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *
 * /plants/save:
 *   post:
 *     summary: Add or update a plant profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantProfile'
 *     responses:
 *       200:
 *         description: Success
 *
 * /plants/{name}:
 *   delete:
 *     summary: Remove a plant from the active list (does not delete the config file)
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *
 * /presets:
 *   get:
 *     summary: List all preset plant config files (not in active list)
 *     responses:
 *       200:
 *         description: List of preset filenames
 *   post:
 *     summary: Upload a new preset config file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               content:
 *                 $ref: '#/components/schemas/PlantProfile'
 *     responses:
 *       200:
 *         description: Success
 *
 * /presets/{filename}:
 *   get:
 *     summary: Get a specific preset config file
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plant profile
 *
 * components:
 *   schemas:
 *     PlantProfile:
 *       type: object
 *       required:
 *         - name
 *         - scientificName
 *         - thresholds
 *         - growthStages
 *       properties:
 *         name:
 *           type: string
 *         scientificName:
 *           type: string
 *         thresholds:
 *           type: object
 *           properties:
 *             temperature:
 *               type: object
 *               properties:
 *                 min: { type: number }
 *                 max: { type: number }
 *                 optimal: { type: number }
 *                 unit: { type: string }
 *             humidity:
 *               type: object
 *               properties:
 *                 min: { type: number }
 *                 max: { type: number }
 *                 optimal: { type: number }
 *                 unit: { type: string }
 *             soilMoisture:
 *               type: object
 *               properties:
 *                 min: { type: number }
 *                 max: { type: number }
 *                 optimal: { type: number }
 *                 unit: { type: string }
 *             light:
 *               type: object
 *               properties:
 *                 min: { type: number }
 *                 max: { type: number }
 *                 optimal: { type: number }
 *                 unit: { type: string }
 *         growthStages:
 *           type: object
 *           properties:
 *             seedling: { type: object }
 *             vegetative: { type: object }
 *             flowering: { type: object }
 *             fruiting: { type: object }
 */

// Helper to load a plant file
async function loadPlantFile(filename: string) {
  const filePath = join(configDir, filename);
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// GET all active plant profiles
router.get('/plants', async (_req: Request, res: Response) => {
  try {
    const data = await readFile(plantsPath, 'utf-8');
    const plantFiles: string[] = JSON.parse(data);
    const plants: Record<string, unknown> = {};
    for (const file of plantFiles) {
      try {
        const plant = await loadPlantFile(file);
        plants[plant.name.toLowerCase()] = plant;
      } catch {
        // skip missing/corrupt files
      }
    }
    res.json(plants);
  } catch (error) {
    console.error('Error reading plant profiles:', error);
    res.status(500).json({ error: 'Failed to read plant profiles' });
  }
});

// POST (replace all) active plant filenames
router.post('/plants', async (req: Request, res: Response) => {
  try {
    const plantFiles: string[] = req.body;
    await writeFile(plantsPath, JSON.stringify(plantFiles, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving plant file list:', error);
    res.status(500).json({ error: 'Failed to save plant file list' });
  }
});

// POST add or update a plant
router.post('/plants/save', async (req: Request, res: Response) => {
  try {
    const plant = req.body;
    if (!plant || !plant.name) {
      return res.status(400).json({ error: 'Missing plant name' });
    }
    // Find a matching preset filename (case-insensitive, ignoring extension)
    const files = await readdir(configDir);
    const normalizedName = plant.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let filename = files.find(f => f.endsWith('.json') && f !== 'plants.json' && f.replace(/\.json$/, '') === normalizedName);
    if (!filename) {
      filename = normalizedName + '.json';
    }
    const filePath = join(configDir, filename);
    await writeFile(filePath, JSON.stringify(plant, null, 2), 'utf-8');
    // Add to plants.json if not present
    let plantFiles: string[] = [];
    try {
      plantFiles = JSON.parse(await readFile(plantsPath, 'utf-8'));
    } catch {
      // ignore error
    }
    if (!plantFiles.includes(filename)) {
      plantFiles.push(filename);
      await writeFile(plantsPath, JSON.stringify(plantFiles, null, 2), 'utf-8');
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving plant:', error);
    res.status(500).json({ error: 'Failed to save plant' });
  }
});

// DELETE a plant
router.delete('/plants/:name', async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (!name) return res.status(400).json({ error: 'Missing plant name' });
    const filename = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.json';
    // Remove from plants.json
    let plantFiles: string[] = [];
    try {
      plantFiles = JSON.parse(await readFile(plantsPath, 'utf-8'));
    } catch {
      // ignore error
    }
    plantFiles = plantFiles.filter(f => f !== filename);
    await writeFile(plantsPath, JSON.stringify(plantFiles, null, 2), 'utf-8');
    // Do NOT delete the file, just remove from active list
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing plant from active list:', error);
    res.status(500).json({ error: 'Failed to remove plant from active list' });
  }
});

// GET list of preset config files in /config (not in plants.json)
router.get('/presets', async (_req: Request, res: Response) => {
  try {
    const files = await readdir(configDir);
    let plantFiles: string[] = [];
    try {
      plantFiles = JSON.parse(await readFile(plantsPath, 'utf-8'));
    } catch {
      // ignore error
    }
    const presets = files.filter(f => extname(f) === '.json' && f !== 'plants.json' && !plantFiles.includes(f));
    res.json(presets);
  } catch (error) {
    console.error('Error listing preset files:', error);
    res.status(500).json({ error: 'Failed to list preset files' });
  }
});

// GET a specific preset config file
router.get('/presets/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string' || !filename.endsWith('.json')) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    const filePath = join(configDir, filename);
    const data = await readFile(filePath, 'utf-8');
    res.type('application/json').send(data);
  } catch (error) {
    console.error('Error reading preset file:', error);
    res.status(500).json({ error: 'Failed to read preset file' });
  }
});

// POST a new preset config file to /config
router.post('/presets', async (req: Request, res: Response) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content || !filename.endsWith('.json')) {
      return res.status(400).json({ error: 'Missing or invalid filename/content' });
    }
    const filePath = join(configDir, filename);
    await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving preset file:', error);
    res.status(500).json({ error: 'Failed to save preset file' });
  }
});

export default router; 