const userRepository = require('../repositories/userRepository');

class AccessControlService {
    async changeUserRole(userId, newRoleName) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('Korisnik nije pronađen.');
        }

        const roleId = await userRepository.findRoleIdByName(newRoleName);
        if (!roleId) {
            throw new Error('Zahtevana uloga ne postoji u sistemu.');
        }

        await userRepository.updateRole(userId, roleId);
        
        return await userRepository.findById(userId);
    }
}

module.exports = new AccessControlService();