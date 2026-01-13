import express from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';
import { createTicketController, getTicketsByTicketIdController, getAllTicketsController, deleteTicketController, getTicketsByQueryDateController, getTicketsByQueryDateRangeController, updateTicketMessageAsClientController, updateTicketAsAdminController, getTicketsByClientIdController } from '../controllers/ticketController.js';

const router = express.Router();

router.post('/create',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), createTicketController);
router.get('/by-ticket-id/:ticketId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getTicketsByTicketIdController);
router.get('/all',verifyAccessToken,authorize(["g2-cpms-admin"]), getAllTicketsController);
router.delete('/delete/:clientId/:ticketId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), deleteTicketController);
router.get('/by-query-date',verifyAccessToken,authorize(["g2-cpms-admin"]), getTicketsByQueryDateController);
router.get('/by-query-date-range',verifyAccessToken,authorize(["g2-cpms-admin"]), getTicketsByQueryDateRangeController);
router.put('/:clientId/:ticketId/message',verifyAccessToken,authorize(["g2-cpms-user"]), updateTicketMessageAsClientController);
router.put('/:clientId/:ticketId/admin',verifyAccessToken,authorize(["g2-cpms-admin"]), updateTicketAsAdminController);
router.get('/by-client/:clientId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getTicketsByClientIdController);

export default router;
