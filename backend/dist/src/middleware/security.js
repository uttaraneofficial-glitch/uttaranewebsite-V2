"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalSecurityHeaders = exports.preventPollution = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
// Basic security headers using helmet
exports.securityHeaders = (0, helmet_1.default)();
// Prevent HTTP Parameter Pollution
exports.preventPollution = (0, hpp_1.default)();
// Custom security headers
const additionalSecurityHeaders = (req, res, next) => {
    // Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Disable client-side caching for authenticated routes
    if (req.path.startsWith('/api/') && req.path !== '/api/auth/login') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
};
exports.additionalSecurityHeaders = additionalSecurityHeaders;
