import type { Request, Response } from 'express';
import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    arduino: {
      status: 'healthy' | 'unhealthy';
      lastReading?: string;
    };
  };
}

router.get('/', async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.0',
    services: {
      arduino: {
        status: 'unhealthy'
      }
    }
  };

  // Check Arduino connection status
  try {
    // Add your Arduino health check logic here
    // For example, check last sensor reading timestamp
    health.services.arduino = {
      status: 'healthy',
      lastReading: new Date().toISOString() // Replace with actual last reading time
    };
  } catch (error) {
    logger.error('Arduino health check failed:', error);
    health.status = 'degraded';
  }

  // If all critical services are unhealthy, mark as unhealthy
  if (Object.values(health.services).every(service => service.status === 'unhealthy')) {
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'unhealthy' ? 503 : 200;
  res.status(statusCode).json(health);
});

export default router; 