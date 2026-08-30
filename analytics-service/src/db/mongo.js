const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🍃 Analytics Service uspešno povezan na MongoDB.');
    } catch (error) {
        console.error('❌ Greška pri povezivanju na MongoDB:', error.message);
    }
};

connectDB();

module.exports = mongoose.connection;