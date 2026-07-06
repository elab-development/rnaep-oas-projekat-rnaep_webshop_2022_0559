const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const sessionRepository = require('../repositories/sessionRepository');

class IdentityService {
    async registerUser({ username, email, password }) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Korisnik sa ovim email-om već postoji.');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        const defaultRoleId = await userRepository.findRoleIdByName('REGISTERED_USER');

        const userId = await userRepository.create({
            username,
            email,
            passwordHash,
            roleId: defaultRoleId
        });

        return { id: userId, username, email };
    }

    async loginUser({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Pogrešni kredencijali.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Pogrešni kredencijali.');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role_name 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await sessionRepository.createSession(user.id, token, expiresAt);

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role_name
            }
        };
    }
}

module.exports = new IdentityService();