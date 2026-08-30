const AnalyticsService = require('../services/analytics.service');

const AnalyticsController = {
    async getByTrip(req, res) {
        try {
            const data = await AnalyticsService.getAnalyticsByTrip(req.params.tripId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async generateManual(req, res) {
        try {
            const { tripId, items } = req.body;
            const data = await AnalyticsService.processTripData(tripId, items || [], 'manual.generation');
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = AnalyticsController;