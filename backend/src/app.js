"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var cookie_parser_1 = require("cookie-parser");
var auth_routes_1 = require("./routes/auth.routes");
var public_routes_1 = require("./routes/public.routes");
var admin_routes_1 = require("./routes/admin.routes");
var security_1 = require("./middleware/security");
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
// Trust proxy for proper request handling
app.set('trust proxy', 1);
// Security Middleware
app.use(security_1.securityHeaders); // Helmet security headers
app.use(security_1.preventPollution); // Prevent HTTP Parameter Pollution
app.use(security_1.additionalSecurityHeaders); // Custom security headers
// Basic Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3003',
        'http://localhost:5173',
        'https://uttaranewebsite-v2-3.onrender.com',
        'https://uttaranewebsite-v2-4.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
}));
app.use(express_1.default.json({ limit: '50mb' })); // Increase limit for larger payloads
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // For parsing form data
app.use((0, cookie_parser_1.default)()); // Cookie parser middleware
// Basic error handler
app.use(function (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/public', public_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Health check endpoint
app.get('/health', function (req, res) {
    res.json({ status: 'ok' });
});
exports.default = app;
