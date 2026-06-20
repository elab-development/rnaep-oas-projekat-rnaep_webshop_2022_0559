const Item = require('../models/ItemModels'); 
const externalDataClient = require('./externalDataClient');

const getItems = async (city, category) => {
    if (!city) {
        throw new Error('Grad je obavezan parametar pretrage.');
    }

    let filter = { city: { $regex: new RegExp("^" + city.trim() + "$", "i") } };
    if (category) {
        filter.category = category;
    }

    let localItems = await Item.find(filter);

    if (localItems.length === 0) {
        console.log(`[Catalog Service] Nema podataka u bazi za ${city}. Pokrećem TripAdvisor agregaciju preko RapidAPI-ja...`);
        
        const externalItems = await externalDataClient.fetchExternalItems(city);
        
        if (externalItems.length > 0) {
            await Item.insertMany(externalItems);
            localItems = await Item.find(filter);
        }
    }

    return localItems;
};

const getItemById = async (id) => {
    return await Item.findById(id);
};

const createItem = async (itemData) => {
    return await Item.create(itemData);
};

const updateItem = async (id, itemData) => {
    return await Item.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
};

const deleteItem = async (id) => {
    return await Item.findByIdAndDelete(id);
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};