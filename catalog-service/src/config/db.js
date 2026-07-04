const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI nije definisan u environment varijablama.');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database Error] Konekcija neuspešna: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;