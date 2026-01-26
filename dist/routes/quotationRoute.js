import express from 'express';
import { createQuotationController,
        getQuotationByIdController,
        getAllQuotationsController,
        updateQuotationController,
        deleteQuotationController,
        getQuotationsByClientIdController
 } from '../controllers/quotationController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';


const router = express.Router();

// All routes require authentication
router.post('/', verifyAccessToken, authorize (["g2-cpms-admin"]), createQuotationController);
router.get('/:quotationId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getQuotationByIdController);
router.get('/', verifyAccessToken, authorize(["g2-cpms-admin"]), getAllQuotationsController);
router.get('/client/:clientId', verifyAccessToken, authorize(["g2-cpms-admin","g2-cpms-user"]), getQuotationsByClientIdController);
router.put('/:quotationId', verifyAccessToken, authorize (["g2-cpms-admin"]), updateQuotationController);
router.delete('/:quotationId', verifyAccessToken, authorize (["g2-cpms-admin"]), deleteQuotationController);
export default router;