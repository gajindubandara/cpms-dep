import express from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';
import { createTicketController, getTicketsByTicketIdController, getAllTicketsController, deleteTicketController, getTicketsByQueryDateController, getTicketsByQueryDateRangeController, updateTicketMessageAsClientController, updateTicketAsAdminController, getTicketsByClientIdController } from '../controllers/ticketController.js';

const router = express.Router();

router.post('/',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), createTicketController);
router.get('/',verifyAccessToken,authorize(["g2-cpms-admin"]), getAllTicketsController);
router.get('/by-client/:clientId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getTicketsByClientIdController);
router.get('/by-query-date',verifyAccessToken,authorize(["g2-cpms-admin"]), getTicketsByQueryDateController);
router.get('/by-query-date-range',verifyAccessToken,authorize(["g2-cpms-admin"]), getTicketsByQueryDateRangeController);
router.get('/:ticketId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getTicketsByTicketIdController);
router.put('/:clientId/:ticketId/message',verifyAccessToken,authorize(["g2-cpms-user"]), updateTicketMessageAsClientController);
router.put('/:clientId/:ticketId/admin',verifyAccessToken,authorize(["g2-cpms-admin"]), updateTicketAsAdminController);
router.delete('/:clientId/:ticketId',verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), deleteTicketController);

export default router;
