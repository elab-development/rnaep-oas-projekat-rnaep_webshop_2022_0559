const request = require('supertest');
const app = require('../src/app');

describe('Trip Service Health & Metrics', () => {
  it('should return UP for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('UP');
  });

  it('should expose prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });
});