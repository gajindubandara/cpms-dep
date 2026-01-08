import express from "express";
import clientRoutes from "./routes/clinetRoute.js";
import commonMiddleware from './middleware/commonMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;
import { Issuer, generators } from 'openid-client';

import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

 // Basic route
// OpenID Client setup
let client;
async function initializeClient() {
    const issuer = await Issuer.discover(process.env.COGNITO_ISSUER);
    client = new issuer.Client({
      client_id: process.env.COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET,
      redirect_uris: [process.env.COGNITO_REDIRECT_URI],
      response_types: ['code']
    });
};
initializeClient().catch(console.error);

// Middleware
commonMiddleware.forEach(mw => app.use(mw));

// Use the organized auth routes
app.use('/', (req, res, next) => authRoutes(client)(req, res, next));

// client routes
app.use("/clients", clientRoutes);

app.set('view engine', 'ejs');

// Basic route
app.get('/', (req, res) => {
  res.render('home', {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session ? req.session.userInfo : null
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});