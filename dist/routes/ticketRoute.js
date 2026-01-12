import express from 'express';
import { createTicketController, getTicketsByTicketIdController, getAllTicketsController, deleteTicketController, getTicketsByQueryDateController, getTicketsByQueryDateRangeController, updateTicketMessageAsClientController, updateTicketAsAdminController, getTicketsByClientIdController } from '../controllers/ticketController.js';

const router = express.Router();

router.post('/create', createTicketController);
router.get('/by-ticket-id/:ticketId', getTicketsByTicketIdController);
router.get('/all', getAllTicketsController);
router.delete('/delete/:clientId/:ticketId', deleteTicketController);
router.get('/by-query-date', getTicketsByQueryDateController);
router.get('/by-query-date-range', getTicketsByQueryDateRangeController);
router.put('/:clientId/:ticketId/message', updateTicketMessageAsClientController);
router.put('/:clientId/:ticketId/admin', updateTicketAsAdminController);
router.get('/by-client/:clientId', getTicketsByClientIdController);

export default router;
