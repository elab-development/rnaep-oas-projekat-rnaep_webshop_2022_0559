const mongoose = require('mongoose');

const AnalyticsResultSchema = new mongoose.Schema({
    tripId: { type: Number, required: true, unique: true },
    totalItems: { type: Number, default: 0 },
    hotels: { type: Number, default: 0 },
    restaurants: { type: Number, default: 0 },
    attractions: { type: Number, default: 0 },
    percentages: {
        hotels: { type: Number, default: 0 },
        restaurants: { type: Number, default: 0 },
        attractions: { type: Number, default: 0 }
    },
    chartData: {
        labels: { type: [String], default: ["Hoteli", "Restorani", "Atrakcije"] },
        values: { type: [String], default: [0, 0, 0] } // String jer frontend nekad traži tekstualne procente
    },
    lastEventType: { type: String },
    generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsResult', AnalyticsResultSchema);