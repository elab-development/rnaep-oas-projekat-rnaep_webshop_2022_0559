const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/catalogService', () => ({
    getItems: jest.fn(async (city, category) => {
        const items = [
            {
                _id: '1',
                name: 'Test Restaurant',
                city,
                category: 'restaurant',
                address: 'Test Address',
                location: { lat: 44.7866, lng: 20.4489 }
            },
            {
                _id: '2',
                name: 'Test Hotel',
                city,
                category: 'hotel',
                address: 'Test Address',
                location: { lat: 44.7866, lng: 20.4489 }
            }
        ];

        if (category) {
            return items.filter(item => item.category === category);
        }

        return items;
    }),

    getItemById: jest.fn(async (id) => ({
        _id: id,
        name: 'Test Item',
        city: 'Belgrade',
        category: 'restaurant',
        address: 'Test Address',
        location: { lat: 44.7866, lng: 20.4489 }
    })),

    createItem: jest.fn(async (data) => ({
        _id: '123',
        ...data
    })),

    updateItem: jest.fn(async (id, data) => ({
        _id: id,
        ...data
    })),

    deleteItem: jest.fn(async () => ({
        _id: '123'
    }))
}));

jest.mock('../src/services/geoService', () => ({
    getCityCoordinates: jest.fn(async (city) => ({
        city,
        lat: 44.7866,
        lng: 20.4489,
        displayName: `${city}, Serbia`
    }))
}));

describe('Catalog Service API Tests', () => {
    test('GET /health vraća status 200', async () => {
        const res = await request(app).get('/health');

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('UP');
        expect(res.body.service).toBe('catalog-service');
    });

    test('GET /api/catalog?city=Belgrade vraća katalog', async () => {
        const res = await request(app).get('/api/catalog?city=Belgrade');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/catalog?city=Belgrade&category=restaurant filtrira po kategoriji', async () => {
        const res = await request(app).get('/api/catalog?city=Belgrade&category=restaurant');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].category).toBe('restaurant');
    });

    test('GET /api/catalog/geocode?city=Belgrade vraća koordinate', async () => {
        const res = await request(app).get('/api/catalog/geocode?city=Belgrade');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('lat');
        expect(res.body).toHaveProperty('lng');
        expect(res.body.city).toBe('Belgrade');
    });

    test('POST /api/catalog kreira objekat ako je ADMIN', async () => {
        const res = await request(app)
            .post('/api/catalog')
            .set('x-user-role', 'ADMIN')
            .send({
                name: 'Novi restoran',
                city: 'Belgrade',
                category: 'restaurant',
                address: 'Test Address',
                location: { lat: 44.7866, lng: 20.4489 }
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Novi restoran');
    });
});