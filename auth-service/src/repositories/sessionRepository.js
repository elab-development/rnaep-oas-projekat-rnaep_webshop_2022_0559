const db = require('../config/db');

class SessionRepository {
    async createSession(userId, token, expiresAt) {
        await db.execute(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
    }
}

module.exports = new SessionRepository();