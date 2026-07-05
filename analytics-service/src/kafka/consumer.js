const { Kafka } = require('kafkajs');
const { randomUUID } = require('crypto');
const AnalyticsService = require('../services/analytics.service');

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:19092'],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || 'analytics-service-group',
});

const producer = kafka.producer();

const publishEvent = async (topic, tripId, userId, data) => {
  const event = {
    eventId: randomUUID(),
    eventType: topic,
    occurredAt: new Date().toISOString(),
    tripId: Number(tripId),
    userId: userId ? Number(userId) : null,
    data,
  };

  await producer.send({
    topic,
    messages: [
      {
        key: String(tripId),
        value: JSON.stringify(event),
      },
    ],
  });
};

const startConsumer = async () => {
  try {
    await consumer.connect();
    await producer.connect();

    console.log('Analytics Service connected to Kafka as Consumer and Producer.');

    await consumer.subscribe({ topic: 'trip-created', fromBeginning: true });
    await consumer.subscribe({ topic: 'trip-updated', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        let event;

        try {
          event = JSON.parse(message.value.toString());
        } catch (error) {
          console.error('Greška pri parsiranju Kafka poruke:', error.message);
          return;
        }

        const tripId = event.tripId || event.data?.tripId || event.data?.id;
        const userId = event.userId || event.data?.userId;
        const items = event.data?.items || [];

        if (!tripId) {
          console.error('Kafka događaj nema tripId:', event);
          return;
        }

        try {
          console.log(`Analytics obrada događaja ${topic} za trip ${tripId}`);

          const result = await AnalyticsService.processTripData(
              tripId,
              items,
              event.eventType || topic
          );

          await publishEvent('analytics-generated', tripId, userId, {
            totalItems: result.totalItems,
            counts: {
              hotels: result.hotels,
              restaurants: result.restaurants,
              attractions: result.attractions,
            },
            percentages: result.percentages,
            chartData: result.chartData,
            status: 'READY',
          });

          console.log(`Poslat analytics-generated za trip ${tripId}`);
        } catch (error) {
          console.error(`Greška tokom Analytics obrade za trip ${tripId}:`, error.message);

          await publishEvent('trip-processing-failed', tripId, userId, {
            status: 'FAILED',
            errorCode: 'ANALYTICS_PROCESSING_ERROR',
            message: error.message,
          });
        }
      },
    });
  } catch (error) {
    console.error('Fatalna greška pri inicijalizaciji Analytics Kafka consumer-a:', error);
  }
};

function calculateStats(items) {
  if (!items || !items.length) {
    return {
      hotel: '0.00',
      restaurant: '0.00',
      attraction: '0.00',
    };
  }

  const total = items.length;
  const counts = {
    HOTEL: 0,
    RESTAURANT: 0,
    ATTRACTION: 0,
  };

  items.forEach((item) => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  return {
    hotel: ((counts.HOTEL / total) * 100).toFixed(2),
    restaurant: ((counts.RESTAURANT / total) * 100).toFixed(2),
    attraction: ((counts.ATTRACTION / total) * 100).toFixed(2),
  };
}

module.exports = {
  startConsumer,
  calculateStats,
};