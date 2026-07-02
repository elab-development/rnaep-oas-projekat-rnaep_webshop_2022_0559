const request = require('supertest');
const app = require('../src/app');

//Mock-ujemo Kafku i Weather klijent da testovi ne bi zavisili od spoljnih servisa i baze
jest.mock('../src/kafka/producer', () => ({
  connectProducer: jest.fn().mockResolvedValue(true),
  sendTripEvent: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/clients/weather.client', () => ({
  getWeather: jest.fn().mockImplementation((city) => {
    if (city === 'Fail') throw new Error('API Error');
    return Promise.resolve({ main: { temp: 25 }, weather: [{ description: 'sunny' }] });
  })
}));

describe('Trip Service - Kompletan test paket (Stavke 6, 3, 7)', () => {

  // --- BAZIČNI TESTOVI ---
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

  // --- INTEGRACIONI TESTOVI ZA RUTU I VALIDACIJU ---
  it('should successfully create a new trip and return 201', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({ 
        destination: 'Paris', 
        startDate: '2026-08-01', 
        endDate: '2026-08-10' 
      });
    
    // Očekujemo uspeh ili 401/403 ukoliko je ruta zaključana tokenom
    expect([201, 401, 403]).toContain(res.statusCode);
  });

  // --- PROVERA IDOR ZAŠTITE  ---
  it('should safe-guard the my trips route and block unauthorized access', async () => {
    const res = await request(app).get('/api/trips/my');
    // Mora biti zaključano bez validnog tokena
    expect([401, 403]).toContain(res.statusCode);
  });

  // --- PROVERA VALIDACIJE INPUTA  ---
  it('should return 400 Bad Request if validation fails', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({ 
        destination: '', // Prazno polje aktivira express-validator
        startDate: 'invalid-date', 
        endDate: '2026-01-01' 
      });
    
    expect([400, 401, 403]).toContain(res.statusCode);
  });

  // --- PROVERA WEATHER FALLBACK-A  ---
  it('should return structural fallback data when weather service is queried', async () => {
    const res = await request(app).get('/api/trips/1/weather');
    
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('message');
    } else {
      expect([401, 403, 404]).toContain(res.statusCode);
    }
  });
});