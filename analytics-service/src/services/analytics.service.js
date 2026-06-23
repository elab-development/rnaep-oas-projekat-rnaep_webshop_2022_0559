const AnalyticsResult = require('../models/analyticsResult.model');
const { calculateStats } = require('./statsEngine');
const { mapToChartData } = require('./chartDataMapper');

const AnalyticsService = {
    async getAnalyticsByTrip(tripId) {
        const result = await AnalyticsResult.findOne({ tripId: Number(tripId) });
        if (!result) {
            // Vraćamo praznu strukturu ako još nema analitike za taj put
            return { tripId: Number(tripId), totalItems: 0, chartData: { labels: ["Hoteli", "Restorani", "Atrakcije"], values: [0, 0, 0] } };
        }
        return result;
    },

    async processTripData(tripId, items, eventType) {
        console.log(`📊 Obrađujem analitiku za Trip ID: ${tripId} (Event: ${eventType})`);
        
        const stats = calculateStats(items);
        const chartData = mapToChartData(stats.percentages);

        const updateData = {
            tripId: Number(tripId),
            ...stats,
            chartData,
            lastEventType: eventType,
            generatedAt: new Date()
        };

        // Upisuje novu ili osvežava postojeću analitiku u MongoDB-ju
        return await AnalyticsResult.findOneAndUpdate(
            { tripId: Number(tripId) },
            updateData,
            { upsert: true, new: true }
        );
    }
};

module.exports = AnalyticsService;