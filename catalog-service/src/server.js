// // const path = require('path');
// // const fs = require('fs');

// // const envPath = path.resolve(__dirname, '../.env');
// // console.log(`[PROVERA] Node pokušava da čita fajl sa: ${envPath}`);
// // console.log(`[PROVERA] Da li fajl fizički postoji na toj lokaciji? ${fs.existsSync(envPath)}`);

// // if (fs.existsSync(envPath)) {
// //     const sadrzaj = fs.readFileSync(envPath, 'utf8');
// //     console.log(`[PROVERA] Prvih 15 karaktera fajla: ${sadrzaj.substring(0, 15)}...`);
// // }

// import express, { json } from 'express';
// import cors from 'cors';
// import connectDB from './config/db';
// import itemRoutes from './routes/itemRoutes';

// const app = express();
// const PORT = process.env.PORT || 4002;

// app.use(cors());
// app.use(json()); 

// app.use('/api/items', itemRoutes);


// try {
//     app.use('/api/geocode', require('./routes/geocodeRoutes')); 
// } catch (err) {
//     app.use('/api/geocode', itemRoutes); 
// }

// app.use((req, res) => {
//     res.status(404).json({ message: 'Ruta ne postoji na Catalog Mikroservisu.' });
// });

// app.listen(PORT, async () => {
//     console.log(`\x1b[36m%s\x1b[0m`, `[server] Catalog Service uspešno pokrenut na portu ${PORT}`);
//     await connectDB();
// });

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3002;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.use(cors());
app.use(express.json()); 


app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});


app.use('/api/catalog', itemRoutes);

app.listen(PORT, async () => {
    console.log(`[Server] Catalog Service uspešno pokrenut na portu ${PORT}`);
    await connectDB(); 
});



module.exports = app;