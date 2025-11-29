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
import cloudinary from './config/cloudinary';

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = [
    "https://uttarane.com",
    "https://www.uttarane.com",
    "https://uttaranewebsite-v2-4.onrender.com", // backend render URL (for testing)
    "https://uttaranewebsite-v2-3.onrender.com"  // old frontend (optional, can remove later)
];

// Trust proxy for proper request handling
app.set('trust proxy', 1);

// Security Middleware
app.use(securityHeaders); // Helmet security headers
app.use(preventPollution); // Prevent HTTP Parameter Pollution
app.use(additionalSecurityHeaders); // Custom security headers

// Basic Middleware
app.use(
    cors({
        origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
            // allow REST tools and server-to-server (no origin)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
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

// Serve static files from the frontend build directory
import path from 'path';
import compression from 'compression';

// Enable Gzip compression
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/cloudinary-test', async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            { folder: 'uttarane-test' }
        );

        res.json({
            success: true,
            url: result.secure_url,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default app;
