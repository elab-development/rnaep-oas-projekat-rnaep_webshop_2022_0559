const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'trip-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected in Trip Service');
};

const sendTripEvent = async (topic, key, data) => {
  try {
    await producer.send({
      topic,
      messages: [{ key: String(key), value: JSON.stringify(data) }]
    });
  } catch (err) {
    console.error('Kafka send error:', err);
  }
};

module.exports = { connectProducer, sendTripEvent };