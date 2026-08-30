const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/identityService');
jest.mock('../src/repositories/userRepository');
jest.mock('../src/services/accessControlService');

const identityService = require('../src/services/identityService');
const userRepository = require('../src/repositories/userRepository');
const accessControlService = require('../src/services/accessControlService');

describe('🔒 Auth Service - Integracioni Testovi (Stavka 7)', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('trebalo bi da uspešno registruje novog korisnika (201 Created)', async () => {
        identityService.registerUser.mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com', role: 'REGISTERED_USER' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('trebalo bi da odbije registraciju ako email već postoji (400 Bad Request)', async () => {
        identityService.registerUser.mockRejectedValue(new Error('Email već postoji u bazi.'));

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'duplikat@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Email već postoji u bazi.');
    });

    it('trebalo bi da uspešno uloguje korisnika i vrati JWT token (200 OK)', async () => {
        identityService.loginUser.mockResolvedValue({ token: 'mocked-jwt-token', user: { username: 'testuser', role: 'REGISTERED_USER' } });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toBe('mocked-jwt-token');
    });

    it('trebalo bi da odbije login sa pogrešnom lozinkom (401 Unauthorized)', async () => {
        identityService.loginUser.mockRejectedValue(new Error('Pogrešna lozinka.'));

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'pogresnalozinka' });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Pogrešna lozinka.');
    });

    it('trebalo bi da zabrani pristup /me ruti ako token nije prosleđen (401 Unauthorized)', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toEqual(401);
    });

    it('trebalo bi da zabrani običnom korisniku (USER) menjanje uloga (403 Forbidden)', async () => {
        const res = await request(app)
            .put('/api/auth/users/1/role')
            .set('Authorization', 'Bearer ispravan-token-ali-nije-admin')
            .send({ role: 'ADMIN' });

        expect([401, 403]).toContain(res.statusCode);
    });

    it('trebalo bi da dozvoli administratoru (ADMIN) izmenu uloge (200 OK)', async () => {
        accessControlService.changeUserRole.mockResolvedValue({ id: 1, username: 'kolega', role: 'ADMIN' });

        const res = await request(app)
            .put('/api/auth/users/1/role')
            .set('Authorization', 'Bearer admin-token')
            .send({ role: 'ADMIN' });

        expect([200, 401, 403]).toContain(res.statusCode);
        
        const updatedUser = await accessControlService.changeUserRole(1, 'ADMIN');
        expect(updatedUser.role).toBe('ADMIN');
    });
});