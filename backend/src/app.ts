import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';
import {
    securityHeaders,
    preventPollution,
    additionalSecurityHeaders,
} from './middleware/security';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for proper request handling
app.set('trust proxy', 1);

// Security Middleware
app.use(securityHeaders); // Helmet security headers
app.use(preventPollution); // Prevent HTTP Parameter Pollution
app.use(additionalSecurityHeaders); // Custom security headers

// Basic Middleware
app.use(
    cors({
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
    })
);
app.use(express.json({ limit: '50mb' })); // Increase limit for larger payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For parsing form data
app.use(cookieParser()); // Cookie parser middleware

// Basic error handler
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
