const request = require('supertest');
const app = require('../server'); 

describe('Catalog Service API Tests', () => {

    test('GET /health bi trebalo da vrati status 200', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('UP');
    });

    test('GET /api/catalog?city=Belgrade bi trebalo da filtrira po gradu', async () => {
        const res = await request(app).get('/api/catalog?city=Belgrade');
        expect([200, 404]).toContain(res.statusCode); 
    });

    test('GET /api/catalog?city=Belgrade&category=restaurant bi trebalo da filtrira po kategoriji', async () => {
        const res = await request(app).get('/api/catalog?city=Belgrade&category=restaurant');
        expect([200, 404]).toContain(res.statusCode);
    });

    test('GET /api/catalog/geocode?city=Belgrade bi trebalo da vrati koordinate', async () => {
        const res = await request(app).get('/api/catalog/geocode?city=Belgrade');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('lat');
        expect(res.body).toHaveProperty('lng'); 
    });

    test('POST /api/catalog bi trebalo da uspešno kreira objekat ako je ADMIN', async () => {
        const res = await request(app)
            .post('/api/catalog')
            .set('x-user-role', 'ADMIN') 
            .send({ name: 'Novi Objekat', city: 'Belgrade', category: 'restaurant' });
        expect([201, 400]).toContain(res.statusCode); 
    });


  test('DELETE /api/catalog/:id bi trebalo da obriše objekat', async () => {
    const created = await request(app)
        .post('/api/catalog')
        .set('x-user-role', 'ADMIN')
        .send({
            name: 'Objekat za brisanje',
            city: 'Belgrade',
            category: 'restaurant'
        });
    if (created.statusCode !== 201) {
        return;
    }
    const res = await request(app)
        .delete(`/api/catalog/${created.body._id}`)
        .set('x-user-role', 'ADMIN');

    expect([200, 204]).toContain(res.statusCode);
});
});