import express from 'express';
import { createTicketController, getTicketsByTicketIdController, getAllTicketsController, deleteTicketController, getTicketsByQueryDateController, updateTicketMessageAsClientController, updateTicketAsAdminController, getTicketsByClientIdController } from '../controllers/ticketController.js';

const router = express.Router();

// Create ticket route
router.post('/create', createTicketController);

// Get all tickets by ticketId
router.get('/by-ticket-id/:ticketId', getTicketsByTicketIdController);

// Get all tickets
router.get('/all', getAllTicketsController);

// Delete ticket by clientId and ticketId
router.delete('/:clientId/:ticketId', deleteTicketController);

// Get tickets by queryDate
router.get('/by-query-date', getTicketsByQueryDateController);

// Update ticket message as client
router.put('/:clientId/:ticketId/message', updateTicketMessageAsClientController);

// Update ticket as admin (status, adminResponse)
router.put('/:clientId/:ticketId/admin', updateTicketAsAdminController);

// Get tickets by clientId
router.get('/by-client/:clientId', getTicketsByClientIdController);

export default router;
