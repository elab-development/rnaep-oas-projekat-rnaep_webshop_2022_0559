const identityService = require('../services/identityService');
const userRepository = require('../repositories/userRepository');
const accessControlService = require('../services/accessControlService');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Sva polja su obavezna.' });
            }
            const newUser = await identityService.registerUser({ username, email, password });
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await identityService.loginUser({ email, password });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    async me(req, res) {
        try {
            const user = await userRepository.findById(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userRepository.getAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async updateRole(req, res) {
        try {
            const { id } = req.params; 
            const { role } = req.body; 
            const updatedUser = await accessControlService.changeUserRole(id, role);
            return res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();