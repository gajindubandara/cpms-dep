import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

// Handle preflight CORS requests for all auth endpoints
router.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Auth routes
router.get('/callback', authController.callback);
router.post('/verify', authController.verifyToken);
router.post('/refresh', authController.refreshToken);

export default router;
