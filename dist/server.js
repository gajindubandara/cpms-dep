import express from "express";
import clientRoutes from "./routes/clientRoute.js";
// import commonMiddleware from './middleware/commonMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;
// import { Issuer, generators } from 'openid-client';

import cors from 'cors';
app.use(cors({
    origin: ['http://localhost:5173', 'https://d1ep0pzchkamyn.cloudfront.net'],
    credentials: true,
}));

app.use(express.json()); // To parse JSON bodies

// // OpenID Client setup
// let client;
//
// async function getOpenIdClient() {
//   if (!client) {
//     const issuer = await Issuer.discover(process.env.COGNITO_ISSUER);
//
//     client = new issuer.Client({
//       client_id: process.env.COGNITO_CLIENT_ID,
//       client_secret: process.env.COGNITO_CLIENT_SECRET,
//       redirect_uris: [process.env.COGNITO_REDIRECT_URI],
//       response_types: ['code']
//     });
//   }
//
//   return client;
// }
//
// // Middleware
// commonMiddleware.forEach(mw => app.use(mw));
//
// // Use the organized auth routes
// app.use('/', async (req, res, next) => {
//   try {
//     const client = await getOpenIdClient();
//     return authRoutes(client)(req, res, next);
//   } catch (err) {
//     console.error('OpenID client init failed:', err);
//     res.status(500).send('Authentication setup failed');
//   }
// });

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'cpms backend works' });
});

// Client routes
app.use("/clients", clientRoutes);

// Auth routes
app.use("/auth", authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});