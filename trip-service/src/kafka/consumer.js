const { Kafka } = require('kafkajs');
const pool = require('../config/database');

const kafka = new Kafka({
  clientId: 'trip-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

const consumer = kafka.consumer({ groupId: 'trip-service-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ['analytics-generated', 'trip-processing-failed'], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());
      const tripId = payload.tripId;
      const status = topic === 'analytics-generated' ? 'READY' : 'FAILED';

      console.log(`Received ${topic} for trip ${tripId}. Updating status to ${status}.`);
      await pool.execute('UPDATE trips SET analytics_status = ? WHERE id = ?', [status, tripId]);
    }
  });
};

module.exports = { startConsumer };