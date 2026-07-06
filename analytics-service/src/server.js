require('dotenv').config();

const app = require('./app');
require('./db/mongo'); // Pokreće konekciju na MongoDB
const { startConsumer } = require('./kafka/consumer');

const PORT = process.env.PORT || 3004;

app.listen(PORT, async () => {
    console.log(`Analytics Service pokrenut na portu ${PORT}`);

    try {
        await startConsumer();
        console.log('Analytics Kafka consumer started');
    } catch (error) {
        console.error('Greška pri pokretanju Analytics Kafka consumer-a:', error);
    }
});