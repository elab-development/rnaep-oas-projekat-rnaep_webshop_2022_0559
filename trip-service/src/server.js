const app = require('./app');
const { connectProducer } = require('./kafka/producer');
const { startConsumer } = require('./kafka/consumer');
require('dotenv').config();

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await connectProducer();
    await startConsumer();
    
    app.listen(PORT, () => {
      console.log(`Trip Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start Trip Service:', err);
    process.exit(1);
  }
};

startServer();