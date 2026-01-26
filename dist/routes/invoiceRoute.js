import express from "express";
import {
    createInvoiceController,
    getInvoiceByIdController,
    getAllInvoicesController,
    updateInvoiceController,
    deleteInvoiceController,
    getInvoicesByClientIdController
} from "../controllers/invoiceController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { authorize } from "../middlewares/authorizeAccess.js";

const router = express.Router();

// All routes require authentication
router.post('/', verifyAccessToken, authorize (["g2-cpms-admin"]), createInvoiceController);
router.get('/:invoiceId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getInvoiceByIdController);
router.get('/', verifyAccessToken, authorize(["g2-cpms-admin"]), getAllInvoicesController);
// Route to get invoices by clientId (for client dashboard)
router.get('/client/:clientId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getInvoicesByClientIdController);
router.put('/:invoiceId', verifyAccessToken, authorize (["g2-cpms-admin"]), updateInvoiceController);
router.delete('/:invoiceId', verifyAccessToken, authorize (["g2-cpms-admin"]), deleteInvoiceController);

export default router;
