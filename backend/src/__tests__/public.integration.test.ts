import request from 'supertest';
import app from '../app';

describe('Public API Integration', () => {
    it('GET /api/public/companies should return 200 and a list of companies', async () => {
        const res = await request(app).get('/api/public/companies');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
