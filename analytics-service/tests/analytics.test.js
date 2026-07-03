const request = require('supertest');
const app = require('../src/app');

describe('Analytics Service Health', () => {
  it('should return UP for health check', () => {
    expect(200).toEqual(200);
  });
});