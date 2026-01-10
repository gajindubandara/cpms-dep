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
  origin: true,
  credentials: true
}));


// client routes
app.use("/clients", clientRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
