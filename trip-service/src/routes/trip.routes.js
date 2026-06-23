const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');
const ownershipMiddleware = require('../middleware/ownership.middleware');

router.use(authMiddleware);

router.post('/', tripController.create);
router.get('/user/:userId', tripController.getByUser);

// Rute koje zahtevaju promenu/čitanje specifičnog putovanja štiti IDOR middleware
router.get('/:id', ownershipMiddleware, tripController.getById);
router.patch('/:id', ownershipMiddleware, tripController.update);
router.delete('/:id', ownershipMiddleware, tripController.delete);

router.post('/:id/items', ownershipMiddleware, tripController.addItem);
router.delete('/:id/items/:itemId', ownershipMiddleware, tripController.removeItem);
router.get('/:id/weather', ownershipMiddleware, tripController.getWeather);

module.exports = router;