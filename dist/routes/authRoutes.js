import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

// Auth routes
router.post('/callback', authController.callback);
router.post('/verify', authController.verifyToken);
router.post('/refresh', authController.refreshToken);

export default router;
