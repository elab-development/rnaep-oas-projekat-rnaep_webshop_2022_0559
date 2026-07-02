const tripService = require('../services/trip.service');

class TripController {
  async create(req, res) {
    try {
      const userId = req.userData.id || req.userData.userId;
      const trip = await tripService.createTrip(userId, req.body);
      res.status(201).json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const trip = await tripService.getTrip(req.params.id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Popravljen IDOR prema stavci 3 - ID se uzima iz tokena, a ne iz parametara URL-a
  async getByUser(req, res) {
    try {
      const userId = req.userData.id || req.userData.userId;
      const trips = await tripService.getUserTrips(userId);
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const userId = req.userData.id || req.userData.userId;
      const trip = await tripService.updateTrip(req.params.id, userId, req.body);
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await tripService.deleteTrip(req.params.id);
      res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async addItem(req, res) {
    try {
      const userId = req.userData.id || req.userData.userId;
      const trip = await tripService.addItem(req.params.id, userId, req.body);
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async removeItem(req, res) {
    try {
      const userId = req.userData.id || req.userData.userId;
      const trip = await tripService.removeItem(req.params.id, userId, req.params.itemId);
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getWeather(req, res) {
    try {
      const weather = await tripService.getTripWeather(req.params.id);
      if (!weather) return res.status(404).json({ message: 'Trip not found' });
      res.json(weather);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TripController();