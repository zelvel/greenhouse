import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import healthRouter from '../health';
import { redisClient } from '../../middleware/rateLimit';

jest.mock('../../middleware/rateLimit', () => ({
  redisClient: {
    ping: jest.fn(),
  },
}));

describe('Health Check Endpoint', () => {
  const app = express();
  app.use('/health', healthRouter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 when all services are healthy', async () => {
    const mockPing = redisClient.ping as jest.MockedFunction<typeof redisClient.ping>;
    mockPing.mockResolvedValueOnce('PONG');

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'healthy',
      services: {
        redis: {
          status: 'healthy',
          latency: expect.any(Number),
        },
        arduino: {
          status: 'healthy',
          lastReading: expect.any(String),
        },
      },
    });
  });

  it('should return 503 when all services are unhealthy', async () => {
    const mockPing = redisClient.ping as jest.MockedFunction<typeof redisClient.ping>;
    mockPing.mockRejectedValueOnce(new Error('Redis connection failed'));

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      status: 'unhealthy',
      services: {
        redis: {
          status: 'unhealthy',
        },
        arduino: {
          status: 'unhealthy',
        },
      },
    });
  });

  it('should return 200 with degraded status when some services are unhealthy', async () => {
    const mockPing = redisClient.ping as jest.MockedFunction<typeof redisClient.ping>;
    mockPing.mockRejectedValueOnce(new Error('Redis connection failed'));

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'degraded',
      services: {
        redis: {
          status: 'unhealthy',
        },
        arduino: {
          status: 'healthy',
          lastReading: expect.any(String),
        },
      },
    });
  });
}); 