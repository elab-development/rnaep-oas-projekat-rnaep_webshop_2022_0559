const express = require('express');
const cors = require('cors');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ service: 'analytics-service', status: 'UP', timestamp: new Date() });
});

app.use('/analytics', analyticsRoutes);

module.exports = app;