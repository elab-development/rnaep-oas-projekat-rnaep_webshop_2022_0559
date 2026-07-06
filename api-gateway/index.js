const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const promClient = require("prom-client");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;

/**
 * Service URLs
 */
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || "http://localhost:3002";
const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || "http://localhost:3003";
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || "http://localhost:3004";

/**
 * CORS configuration
 */
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:3000",
    "http://192.168.1.4:3000",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

/**
 * Prometheus metrics
 */
promClient.collectDefaultMetrics();

const httpRequestsTotal = new promClient.Counter({
    name: "api_gateway_http_requests_total",
    help: "Total number of HTTP requests handled by API Gateway",
    labelNames: ["method", "route", "status_code"],
});

const httpRequestDurationSeconds = new promClient.Histogram({
    name: "api_gateway_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();

    res.on("finish", () => {
        const route = req.path || "unknown";

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status_code: res.statusCode,
        });

        end({
            method: req.method,
            route,
            status_code: res.statusCode,
        });
    });

    next();
});

/**
 * Basic routes
 */
app.get("/", (req, res) => {
    res.send("API Gateway is running");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "api-gateway",
        timestamp: new Date().toISOString(),
    });
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

/**
 * Proxy routes
 */
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin: true,
    })
);

app.use(
    "/api/catalog",
    createProxyMiddleware({
        target: CATALOG_SERVICE_URL,
        changeOrigin: true,
    })
);

app.use(
    "/api/trips",
    createProxyMiddleware({
        target: TRIP_SERVICE_URL,
        changeOrigin: true,
    })
);

app.use(
    "/api/analytics",
    createProxyMiddleware({
        target: ANALYTICS_SERVICE_URL,
        changeOrigin: true,
    })
);

/**
 * 404 fallback
 */
app.use((req, res) => {
    res.status(404).json({
        message: "Gateway route not found",
        path: req.originalUrl,
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});