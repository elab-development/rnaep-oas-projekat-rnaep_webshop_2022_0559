const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Skupljanje podrazumevanih metrika za Prometheus 
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.use(cors());
app.use(express.json());

// Health check ruta
app.get('/health', (req, res) => {
    res.json({ service: 'analytics-service', status: 'UP', timestamp: new Date() });
});

// Ruta za metrike koju zahteva prom-client 
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});


app.use('/api/analytics', analyticsRoutes);

module.exports = app;