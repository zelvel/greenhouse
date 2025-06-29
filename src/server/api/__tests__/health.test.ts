import request from 'supertest';
import express from 'express';
import healthRouter from '../health.js';

const app = express();
app.use('/health', healthRouter);

describe('Health API', () => {
  it('should return 200 OK for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
  });

  it('should include timestamp in response', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });
}); 