import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import configRouter from './api/config.js';
import { rateLimiter } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import healthRouter from './api/health';
import logger from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com']
    : ['http://localhost:5173'], // Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(join(__dirname, '../../dist')));

// Health check endpoint (before rate limiting)
app.use('/health', healthRouter);

// API routes
app.use('/api', (req, res, next) => {
  logger.info('API request:', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// API Routes
app.use('/api/config', configRouter);

// System status endpoint
app.get('/status', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    sensors: {
      temperature: {
        value: 23 + Math.random() * 2,
        unit: '°C',
        status: 'active'
      },
      humidity: {
        value: 55 + Math.random() * 5,
        unit: '%',
        status: 'active'
      },
      light: {
        value: 5000 + Math.random() * 1000,
        unit: 'lux',
        status: 'active'
      }
    },
    actuators: {
      fan: 0,
      pump: 0,
      light: 0,
      heater: 0,
      humidifier: 0,
      dehumidifier: 0,
      vent: 0
    }
  });
});

// Add API routes for sensors
app.get('/sensor/:type', (req, res) => {
  // Temporary mock response
  res.json({
    sensor: req.params.type,
    value: Math.random() * 100,
    unit: req.params.type === 'temperature' ? '°C' : req.params.type === 'humidity' ? '%' : 'lux',
    timestamp: new Date().toISOString(),
    status: 'active',
    metadata: {
      raw_value: Math.random() * 100,
      calibration: 1.0
    }
  });
});

// Add sensor logs endpoint
app.get('/logs/sensors', (req, res) => {
  const { type, start_time, end_time } = req.query;
  const now = new Date();
  const startDate = start_time ? new Date(start_time as string) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const endDate = end_time ? new Date(end_time as string) : now;
  const logs = [];
  
  // Calculate number of hours between start and end dates
  const hoursDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000));
  
  // Generate data points (one per hour)
  for (let i = 0; i < hoursDiff; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);
    let value, unit;
    
    switch (type) {
      case 'temperature':
        value = 20 + Math.random() * 10; // Random temperature between 20-30°C
        unit = '°C';
        break;
      case 'humidity':
        value = 40 + Math.random() * 30; // Random humidity between 40-70%
        unit = '%';
        break;
      case 'light':
        value = 1000 + Math.random() * 9000; // Random light level between 1000-10000 lux
        unit = 'lux';
        break;
      default:
        value = Math.random() * 100;
        unit = 'units';
    }
    
    logs.push({
      id: i + 1,
      type: type,
      value: value,
      unit: unit,
      timestamp: timestamp.toISOString(),
      metadata: {
        raw_value: value,
        calibration: 1.0
      }
    });
  }
  
  res.json(logs);
});

// Add actuator control endpoint
app.post('/actuator/:type', (req, res) => {
  const { type } = req.params;
  const { value } = req.body;
  
  res.json({
    actuator: type,
    value: value,
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for all other routes (SPA)
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
}); 