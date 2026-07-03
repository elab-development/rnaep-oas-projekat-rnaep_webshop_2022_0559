const catalogService = require('../services/catalogService');
const geocodeService = require('../services/geoService');

const getItems = async (req, res) => {
    try {
        const { city, category } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'Grad je obavezan parametar pretrage.' });
        }
        const items = await catalogService.getItems(city, category);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getItemById = async (req, res) => {
    try {
        const item = await catalogService.getItemById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Objekat nije pronađen.' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createItem = async (req, res) => {
    try {
        const newItem = await catalogService.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const updatedItem = await catalogService.updateItem(req.params.id, req.body);
        if (!updatedItem) return res.status(404).json({ message: 'Objekat nije pronađen za ažuriranje.' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const deletedItem = await catalogService.deleteItem(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Objekat nije pronađen za brisanje.' });
        res.json({ message: 'Objekat uspešno obrisan.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const geocodeCity = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'Grad je obavezan parametar.' });
        }

        const coordinates = await geocodeService.getCityCoordinates(city);

        if (!coordinates) {
            return res.status(404).json({ message: 'Grad nije pronađen.' });
        }

        return res.json(coordinates);

    } catch (error) {
        return res.status(500).json({ 
            message: 'Greška na servisu za geokodiranje.', 
            error: error.message 
        });
    }
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    geocodeCity
};