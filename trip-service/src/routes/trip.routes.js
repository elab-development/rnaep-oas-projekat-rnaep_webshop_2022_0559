const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); 
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');
const ownershipMiddleware = require('../middleware/ownership.middleware');

// Pomoćni middleware koji prekida zahtev ako validacija ne prođe
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validaciona pravila za kreiranje i izmenu putovanja 
const tripValidationRules = [
    body('destination')
        .notEmpty().withMessage('Destination je obavezna stavka.'),
    body('startDate')
        .isISO8601().withMessage('StartDate mora biti validan datum (ISO8601).'),
    body('endDate')
        .isISO8601().withMessage('EndDate mora biti validan datum (ISO8601).')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('EndDate mora biti hronološki posle startDate.');
            }
            return true;
        }),
    body('category')
        .isIn(['HOTEL', 'RESTAURANT', 'ATTRACTION'])
        .withMessage('Kategorija može biti samo: HOTEL, RESTAURANT ili ATTRACTION.'),
    body('plannedDate')
        .optional() // Ako se šalje stavka putovanja posebno
        .isISO8601().withMessage('PlannedDate mora biti validan datum.')
];

router.use(authMiddleware);

// Primena validacije na POST (kreiranje) i PATCH (izmenu)
router.post('/', tripValidationRules, validateRequest, tripController.create);
router.patch('/:id', ownershipMiddleware, tripValidationRules, validateRequest, tripController.update);


router.get('/my', tripController.getByUser);


router.get('/:id', ownershipMiddleware, tripController.getById);
router.delete('/:id', ownershipMiddleware, tripController.delete);

router.post('/:id/items', ownershipMiddleware, tripController.addItem);
router.delete('/:id/items/:itemId', ownershipMiddleware, tripController.removeItem);
router.get('/:id/weather', ownershipMiddleware, tripController.getWeather);

module.exports = router;