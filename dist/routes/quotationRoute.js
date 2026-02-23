import express from 'express';
import { createQuotationController,
        getQuotationByIdController,
        getAllQuotationsController,
        updateQuotationController,
        deleteQuotationController,
        getQuotationsByClientIdController,
        uploadQuotationPDFController
 } from '../controllers/quotationController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';
import { uploadPDFSingle } from '../middlewares/uploadMiddleware.js';


const router = express.Router();

// All routes require authentication
// Note: Specific routes must come BEFORE parameterized routes to avoid conflicts
router.post('/', verifyAccessToken, authorize (["g2-cpms-admin"]), createQuotationController);
router.get('/', verifyAccessToken, authorize(["g2-cpms-admin"]), getAllQuotationsController);
router.get('/client/:clientId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user","client"]), getQuotationsByClientIdController);
router.post('/:quotationId/upload-pdf', verifyAccessToken, authorize(["g2-cpms-admin"]), uploadPDFSingle, uploadQuotationPDFController);
router.get('/:quotationId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getQuotationByIdController);
router.put('/:quotationId', verifyAccessToken, authorize (["g2-cpms-admin"]), updateQuotationController);
router.delete('/:quotationId', verifyAccessToken, authorize (["g2-cpms-admin"]), deleteQuotationController);
export default router;