import express from 'express';
import { createQuotationController,
        getQuotationByIdController,
        getAllQuotationsController,
        updateQuotationController,
        deleteQuotationController
 } from '../controllers/quotationController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// All routes require authentication
router.post('/', verifyAccessToken, createQuotationController);
router.get('/:quotationId', verifyAccessToken, getQuotationByIdController);
router.get('/', verifyAccessToken, getAllQuotationsController);
router.put('/:quotationId', verifyAccessToken, updateQuotationController);
router.delete('/:quotationId', verifyAccessToken, deleteQuotationController);

export default router;