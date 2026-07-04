const { Kafka } = require('kafkajs');


const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:19092']
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'analytics-service-group' });
const producer = kafka.producer();

const initKafka = async () => {
  try {
    await consumer.connect();
    await producer.connect(); 
    console.log('Successfully connected to Kafka as Consumer and Producer.');

    // Slušanje ispravnih topika
    await consumer.subscribe({ topic: 'trip-created', fromBeginning: true });
    await consumer.subscribe({ topic: 'trip-updated', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawValue = message.value.toString();
        let event;
        try {
          event = JSON.parse(rawValue);
        } catch (e) {
          console.error("Greška pri parsiranju poruke", e);
          return;
        }

        const items = event.data?.items || [];
        const tripId = event.data?.id || event.tripId;

        try {
          console.log(`Započeta obrada za trip: ${tripId} na topiku ${topic}`);
          
          // 1. Izračunavanje statistike
          const stats = calculateStats(items);

       

          // 3. Slanje uspeha na Kafku
          await producer.send({
            topic: 'analytics-generated',
            messages: [{
              value: JSON.stringify({
                tripId: tripId,
                status: 'SUCCESS',
                stats: stats,
                timestamp: new Date()
              })
            }]
          });
          console.log(`Uspešno poslat 'analytics-generated' za trip ${tripId}`);

        } catch (error) {
          console.error(`Greška tokom obrade tripa ${tripId}:`, error);

          // Ako padne obrada (baza ili bilo šta drugo), šalje se neuspeh na Kafku
          await producer.send({
            topic: 'trip-processing-failed',
            messages: [{
              value: JSON.stringify({
                tripId: tripId,
                status: 'FAILED',
                error: error.message,
                timestamp: new Date()
              })
            }]
          });
        }
      },
    });
  } catch (err) {
    console.error('Fatalna greška pri inicijalizaciji Kafke:', err);
  }
};

function calculateStats(items) {
  if (!items || !items.length) return { hotel: "0.00", restaurant: "0.00", attraction: "0.00" };
  
  const total = items.length;
  const counts = { HOTEL: 0, RESTAURANT: 0, ATTRACTION: 0 };
  
  items.forEach(item => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  return {
    hotel: ((counts.HOTEL / total) * 100).toFixed(2),
    restaurant: ((counts.RESTAURANT / total) * 100).toFixed(2),
    attraction: ((counts.ATTRACTION / total) * 100).toFixed(2)
  };
}

module.exports = { initKafka, calculateStats };