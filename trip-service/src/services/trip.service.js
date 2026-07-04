const tripRepository = require('../repositories/trip.repository');
const { sendTripEvent } = require('../kafka/producer');
const { getWeather } = require('../clients/weather.client');

class TripService {
  async createTrip(userId, data) {
    const { destination, startDate, endDate } = data;
    const tripId = await tripRepository.createTrip(userId, destination, startDate, endDate);
    
    const trip = await tripRepository.getTripById(tripId);
    await sendTripEvent('trip-created', tripId, {
      eventId: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: 'trip-created',
      occurredAt: new Date().toISOString(),
      tripId,
      userId,
      data: { destination, startDate, endDate, items: [] }
    });
    return trip;
  }

  async getTrip(id) {
    return await tripRepository.getTripById(id);
  }

  async getUserTrips(userId) {
    return await tripRepository.getTripsByUserId(userId);
  }

  async updateTrip(id, userId, data) {
    const { destination, startDate, endDate } = data;
    await tripRepository.updateTrip(id, destination, startDate, endDate);
    
    const trip = await tripRepository.getTripById(id);
    await sendTripEvent('trip-updated', id, {
      eventId: `evt-${Date.now()}`,
      eventType: 'trip-updated',
      occurredAt: new Date().toISOString(),
      tripId: Number(id),
      userId,
      data: { destination, startDate, endDate, items: trip.items }
    });
    return trip;
  }

  async deleteTrip(id) {
    await tripRepository.deleteTrip(id);
  }

  async addItem(tripId, userId, itemData) {
    const { catalogItemId, name, category, plannedDate } = itemData;
    await tripRepository.addItem(tripId, catalogItemId, name, category, plannedDate);
    
    const trip = await tripRepository.getTripById(tripId);
    await sendTripEvent('trip-updated', tripId, {
      eventId: `evt-${Date.now()}`,
      eventType: 'trip-updated',
      occurredAt: new Date().toISOString(),
      tripId: Number(tripId),
      userId,
      data: { destination: trip.destination, startDate: trip.start_date, endDate: trip.end_date, items: trip.items }
    });
    return trip;
  }

  async removeItem(tripId, userId, itemId) {
    await tripRepository.removeItem(tripId, itemId);
    
    const trip = await tripRepository.getTripById(tripId);
    await sendTripEvent('trip-updated', tripId, {
      eventId: `evt-${Date.now()}`,
      eventType: 'trip-updated',
      occurredAt: new Date().toISOString(),
      tripId: Number(tripId),
      userId,
      data: { destination: trip.destination, startDate: trip.start_date, endDate: trip.end_date, items: trip.items }
    });
    return trip;
  }

  // Sređena metoda sa osiguranim Fallback mehanizmom u slučaju da Circuit Breaker pukne 
  async getTripWeather(id) {
    try {
      const trip = await tripRepository.getTripById(id);
      if (!trip) return null;
      
      // Poziva klijenta koji u sebi ima implementiran opossum Circuit Breaker
      return await getWeather(trip.destination);
    } catch (err) {
      console.error(`[Circuit Breaker Fallback] Weather API nedostupan za trip ${id}:`, err.message);
      
      // Vraća se strukturirani fallback objekat umesto greške
      return {
        source: 'fallback-cache',
        destination: 'Unknown',
        message: 'Vremenska prognoza trenutno nije dostupna (Circuit Breaker aktivan).',
        temperature: 'N/A',
        summary: 'No data'
      };
    }
  }
}

module.exports = new TripService();