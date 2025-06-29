import { Router } from 'express';
import type { Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

interface SaveConfigBody {
  content: string;
  path: string;
}

router.post('/save', async (req: Request<{}, {}, SaveConfigBody>, res: Response) => {
  try {
    const { content, path } = req.body;
    
    if (!content || !path) {
      return res.status(400).json({ error: 'Missing content or path' });
    }

    // Ensure the path is within the project directory
    const projectRoot = join(__dirname, '../../../');
    const safePath = join(projectRoot, path);
    if (!safePath.startsWith(projectRoot)) {
      return res.status(403).json({ error: 'Invalid path' });
    }

    await writeFile(safePath, content, 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

export default router; 