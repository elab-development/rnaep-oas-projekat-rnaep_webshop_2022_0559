const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Naziv objekta je obavezan']
    },
    category: {
        type: String,
        required: [true, 'Kategorija je obavezna'],
        enum: ['attraction', 'hotel', 'restaurant'] ,
    },
    city: {
        type: String,
        required: [true, 'Grad je obavezan']
    },
    address: {
        type: String,
        required: [true, 'Adresa je obavezna']
    },
    description: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    tags: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    }
}, {
    timestamps: true, 
    collection: 'items' 
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;