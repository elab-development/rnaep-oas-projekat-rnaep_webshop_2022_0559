require('dotenv').config();
const app = require('./app');
require('./db/mongo'); // Pokreće konekciju na MongoDB
const { startConsumer } = require('./kafka/consumer');

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
    console.log(`Analytics Service pokrenut na portu ${PORT}`);
    startConsumer();
});