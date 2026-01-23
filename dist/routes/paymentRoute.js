import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';

const router = express.Router();

// All routes require authentication
router.use(verifyAccessToken);

// Admin routes - Create and manage payments
router.post('/', 
  authorize(['g2-cpms-admin']), 
  paymentController.createPayment
);

// Get all payments (Admin dashboard)
router.get('/admin/all', 
  authorize(['g2-cpms-admin']), 
  paymentController.getAllPayments
);

// Get payments by project (Admin view)
router.get('/admin/project/:projectId', 
  authorize(['g2-cpms-admin']), 
  paymentController.getPaymentsByProject
);

// Get specific payment
router.get('/:paymentId/project/:projectId', 
  paymentController.getPayment
);

// Update payment (Admin only)
router.put('/:paymentId/project/:projectId', 
  authorize(['g2-cpms-admin']), 
  paymentController.updatePayment
);

// Client routes - View and submit payments
router.get('/client/my-payments', 
  authorize(['g2-cpms-user']), 
  paymentController.getClientPayments
);

// Submit payment slip (Client action)
router.post('/:paymentId/project/:projectId/submit-slip', 
  authorize(['g2-cpms-user']), 
  paymentController.submitPaymentSlip
);

// Admin routes - Approve/Reject payments
router.put('/:paymentId/project/:projectId/approve', 
  authorize(['g2-cpms-admin']), 
  paymentController.approvePayment
);

router.put('/:paymentId/project/:projectId/reject', 
  authorize(['g2-cpms-admin']), 
  paymentController.rejectPayment
);

// Delete payment (Admin only)
router.delete('/:paymentId/project/:projectId', 
  authorize(['g2-cpms-admin']), 
  paymentController.deletePayment
);

export default router;
