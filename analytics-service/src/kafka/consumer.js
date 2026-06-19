const { Kafka } = require('kafkajs');
const AnalyticsService = require('../services/analytics.service');
require('dotenv').config();

const kafka = new Kafka({
    clientId: 'analytics-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'analytics-service-group' });

const startConsumer = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'trip-events', fromBeginning: true });
        console.log('📥 Kafka Consumer uspešno povezan i sluša topic: trip-events');

        await consumer.run({
            eachMessage: async ({ message }) => {
                const rawData = message.value.toString();
                const event = JSON.parse(rawData);
                
                console.log(`✉️ Primljen Kafka event: ${event.eventType} za Trip ID: ${event.tripId}`);
                
                if (event.tripId) {
                    const items = event.items || [];
                    await AnalyticsService.processTripData(event.tripId, items, event.eventType);
                }
            }
        });
    } catch (error) {
        console.error('❌ Greška u Kafka Consumer-u:', error.message);
    }
};

module.exports = { startConsumer };