import express from "express";
import ticketRoutes from "./routes/ticketRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import authRoutes from './routes/authRoutes.js';
import errorhandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import projectRoutes from "./routes/projectRoutes.js"
import paymentRoutes from "./routes/paymentRoute.js"
import kpiRoute from './routes/kpiRoute.js'
import reportRouter from './routes/reportRouter.js'
import expenseRoutes from './routes/expenseRoute.js'
import documentRoutes from './routes/documentRoute.js'

dotenv.config();
const app = express();
const port = 3000;

import cors from 'cors';

// Configure CORS with explicit allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://d1ep0pzchkamyn.cloudfront.net',
    'https://dev.gtwolabs.com',
    'https://test-vercel-plum-xi.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

app.use(express.json({ limit: '50mb' })); // To parse JSON bodies with increased limit for payment slips
app.use(express.urlencoded({ limit: '50mb', extended: true })); // To parse URL-encoded form data

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

// Documents routes (unified module for Quotations and Invoices)
app.use("/documents", documentRoutes);

//KPI routes
app.use("/kpi",kpiRoute)

//REPORT routes
app.use('/report', reportRouter)

//EXPENSE routes
app.use('/expenses', expenseRoutes)

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
