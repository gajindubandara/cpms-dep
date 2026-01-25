import express from 'express';
import { createQuotationController,
        getQuotationByIdController,
        getAllQuotationsController,
        updateQuotationController,
        deleteQuotationController
 } from '../controllers/quotationController.js';


const router = express.Router();

// All routes require authentication
router.post('/', createQuotationController);
router.get('/:quotationId', getQuotationByIdController);
router.get('/', getAllQuotationsController);
router.put('/:quotationId', updateQuotationController);
router.delete('/:quotationId', deleteQuotationController);

export default router;