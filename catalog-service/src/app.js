const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

client.collectDefaultMetrics({ register: client.register });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'catalog-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.use('/api/catalog', itemRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Ruta ne postoji na Catalog Service-u.',
        path: req.originalUrl
    });
});

module.exports = app;