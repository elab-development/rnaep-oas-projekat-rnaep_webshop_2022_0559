const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Zabranjen pristup. Nemate odgovarajuću rolu za ovu akciju.'
            });
        }

        next();
    };
};

router.get('/', itemController.getItems);
router.get('/geocode', itemController.geocodeCity);
router.get('/:id', itemController.getItemById);

router.post('/', authorizeRoles('ADMIN', 'CONTENT_MANAGER'), itemController.createItem);
router.put('/:id', authorizeRoles('ADMIN', 'CONTENT_MANAGER'), itemController.updateItem);
router.delete('/:id', authorizeRoles('ADMIN', 'CONTENT_MANAGER'), itemController.deleteItem);

module.exports = router;