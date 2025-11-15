"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const security_1 = require("./middleware/security");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security Middleware
app.use(security_1.securityHeaders); // Helmet security headers
app.use(security_1.preventPollution); // Prevent HTTP Parameter Pollution
app.use(security_1.additionalSecurityHeaders); // Custom security headers
// Basic Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
}));
app.use(express_1.default.json({ limit: '10kb' })); // Limit request body size
app.use(express_1.default.urlencoded({ extended: true })); // For parsing form data
app.use((0, cookie_parser_1.default)()); // Cookie parser middleware
// Basic error handler
app.use((err, req, res, next) => {
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
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
