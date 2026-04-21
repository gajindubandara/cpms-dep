import express from "express";
import {
    createInvoiceController,
    getInvoiceByIdController,
    getAllInvoicesController,
    updateInvoiceController,
    deleteInvoiceController,
    getInvoicesByClientIdController,
    getInvoicesByDateRangeController,
    uploadInvoicePDFController
} from "../controllers/invoiceController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { authorize } from "../middlewares/authorizeAccess.js";
import { uploadPDFSingle } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
// Note: Specific routes must come BEFORE parameterized routes to avoid conflicts
router.post('/', verifyAccessToken, authorize (["g2-cpms-admin"]), createInvoiceController);
router.get('/', verifyAccessToken, authorize(["g2-cpms-admin"]), getAllInvoicesController);
router.get('/by-query-date-range', verifyAccessToken, authorize(["g2-cpms-admin"]), getInvoicesByDateRangeController);
// Route to get invoices by clientId (for client dashboard)
router.get('/client/:clientId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getInvoicesByClientIdController);
router.post('/:invoiceId/upload-pdf', verifyAccessToken, authorize(["g2-cpms-admin"]), uploadPDFSingle, uploadInvoicePDFController);
router.get('/:invoiceId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getInvoiceByIdController);
router.put('/:invoiceId', verifyAccessToken, authorize (["g2-cpms-admin"]), updateInvoiceController);
router.delete('/:invoiceId', verifyAccessToken, authorize (["g2-cpms-admin"]), deleteInvoiceController);

export default router;
