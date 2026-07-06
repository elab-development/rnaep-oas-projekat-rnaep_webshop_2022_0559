const db = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT u.*, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = ?`, 
            [email]
        );
        return rows[0];
    }

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT u.id, u.username, u.email, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = ?`, 
            [id]
        );
        return rows[0];
    }

    async create({ username, email, passwordHash, roleId }) {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [username, email, passwordHash, roleId]
        );
        return result.insertId; 
    }

    async getAll() {
        const [rows] = await db.execute(
            `SELECT u.id, u.username, u.email, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id`
        );
        return rows;
    }

    async updateRole(userId, roleId) {
        await db.execute('UPDATE users SET role_id = ? WHERE id = ?', [roleId, userId]);
    }

    async findRoleIdByName(roleName) {
        const [rows] = await db.execute('SELECT id FROM roles WHERE name = ?', [roleName]);
        return rows[0] ? rows[0].id : null;
    }
}

module.exports = new UserRepository();