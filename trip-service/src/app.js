const express = require('express');
const tripRoutes = require('./routes/trip.routes');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Prom-client metrike
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'trip-service' });
});

app.use('/api/trips', tripRoutes);

module.exports = app;