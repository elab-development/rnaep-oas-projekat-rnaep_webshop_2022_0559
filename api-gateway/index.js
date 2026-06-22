const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Dozvoljava React aplikaciji da šalje zahteve Gateway-u.
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Provera da li je Gateway pokrenut.
app.get("/", (req, res) => {
    res.send("API Gateway is running");
});

// Health-check ruta.
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "api-gateway",
        timestamp: new Date().toISOString(),
    });
});

// Auth Service
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,
    })
);

// Catalog Service
app.use(
    "/api/catalog",
    createProxyMiddleware({
        target: process.env.CATALOG_SERVICE_URL,
        changeOrigin: true,
    })
);

// Trip Service
app.use(
    "/api/trips",
    createProxyMiddleware({
        target: process.env.TRIP_SERVICE_URL,
        changeOrigin: true,
    })
);

// Analytics Service
app.use(
    "/api/analytics",
    createProxyMiddleware({
        target: process.env.ANALYTICS_SERVICE_URL,
        changeOrigin: true,
    })
);

// Ruta ne postoji na Gateway-u.
app.use((req, res) => {
    res.status(404).json({
        message: "Gateway route not found",
        path: req.originalUrl,
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});