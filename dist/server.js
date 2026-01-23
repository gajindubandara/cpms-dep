import express from "express";
import ticketRoutes from "./routes/ticketRoute.js";
import clientRoutes from "./routes/clientRoute.js";
// import commonMiddleware from './middleware/commonMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import errorhandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import projectRoutes from "./routes/projectRoutes.js"
import paymentRoutes from "./routes/paymentRoute.js"
dotenv.config();
const app = express();
const port = 3000;
// import { Issuer, generators } from 'openid-client';

import cors from 'cors';
app.use(cors({
    origin: ['http://localhost:5173', 'https://d1ep0pzchkamyn.cloudfront.net'],
    credentials: true,
}));

app.use(express.json({ limit: '50mb' })); // To parse JSON bodies with increased limit for payment slips

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'cpms backend works' });
});

// Ticket routes
app.use("/tickets", ticketRoutes);

// Client routes
app.use("/clients", clientRoutes);

//project routes
app.use("/projects",projectRoutes)

// Payment routes
app.use("/payments", paymentRoutes);

// Auth routes
app.use("/auth", authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorhandler); 

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});