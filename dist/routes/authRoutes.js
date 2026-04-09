import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://d1ep0pzchkamyn.cloudfront.net',
    'https://dev.gtwolabs.com',
    'https://test-vercel-plum-xi.vercel.app'
];

// CORS middleware for auth routes
const authCorsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
};

// Apply CORS middleware to all auth routes
router.use(authCorsMiddleware);

// Auth routes
router.get('/callback', authController.callback);
router.post('/verify', authController.verifyToken);
router.post('/refresh', authController.refreshToken);

export default router;
