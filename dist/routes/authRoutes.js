import express from 'express';
const router = express.Router();
import * as authController from '../controllers/AuthController.js';

export default (client) => {
    router.get('/', authController.checkAuth, authController.renderHome);
    router.get('/login', authController.login(client));
    router.get('/logout', authController.logout);
    router.post('/callback', authController.callback(client));
    router.post('/verify', authController.verifyToken);
    router.post('/refresh', authController.refreshToken);
    return router;
};
