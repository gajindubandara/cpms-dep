import {
  createPayment,
  getPaymentById,
  getPaymentsByProjectId,
  getPaymentsByClientId,
  updatePayment,
  deletePayment,
  getAllPayments,
} from "../daos/paymentDao.js";
import {
  mapCreatePaymentDTOtoPaymentModel,
  mapUpdatePaymentDTOtoPaymentModel,
} from "../mappers/paymentMapper.js";
import { NotFoundError, BadRequest } from "../errors/customErrors.js";
import { getClientById } from "../daos/clientDao.js";
import { getProjectById } from "../daos/projectDao.js";

// Create payment (Admin only)
export const createPaymentService = async (createPaymentDTO, adminId) => {
  try {
    const model = mapCreatePaymentDTOtoPaymentModel(createPaymentDTO);
    model.createdBy = adminId;
    
    const payment = await createPayment(model);
    return payment;
  } catch (error) {
    throw error;
  }
};

// Get payment by ID
export const getPaymentService = async (paymentId, projectId) => {
  try {
    const payment = await getPaymentById(paymentId, projectId);
    return payment;
  } catch (error) {
    throw error;
  }
};

// Get all payments by project (Admin view)
export const getPaymentsByProjectService = async (projectId) => {
  try {
    const payments = await getPaymentsByProjectId(projectId);
    return payments;
  } catch (error) {
    throw error;
  }
};

// Get payments for client (Client's "My Payments" section)
export const getClientPaymentsService = async (clientId) => {
  try {
    console.log(`[getClientPayments] Fetching payments for clientId: ${clientId}`);
    const payments = await getPaymentsByClientId(clientId);
    console.log(`[getClientPayments] Retrieved ${payments?.length || 0} payments from DAO`);
    
    if (!payments || payments.length === 0) {
      return [];
    }
    
    // Enrich payments with project and client details
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        try {
          // Handle both structures: payment.Attributes and direct attributes
          const attrs = payment.Attributes || payment;
          console.log(`[getClientPayments] Processing payment ${attrs.paymentId}:`, { status: attrs.status });
          
          if (!attrs || !attrs.projectId) {
            console.warn('Skipping invalid payment:', payment);
            return null;
          }
          
          const project = await getProjectById(attrs.projectId);
          const enriched = {
            ...payment,
            projectName: project?.Attributes?.projectName || 'Unknown Project',
          };
          console.log(`[getClientPayments] Enriched payment ${attrs.paymentId}:`, { status: enriched.Attributes?.status || enriched.status });
          return enriched;
        } catch (error) {
          console.error(`Failed to fetch project:`, error);
          return {
            ...payment,
            projectName: 'Unknown Project',
          };
        }
      })
    );
    
    // Filter out null entries
    const result = enrichedPayments.filter(payment => payment !== null);
    console.log(`[getClientPayments] Returning ${result.length} enriched payments`);
    return result;
  } catch (error) {
    console.error('Error in getClientPaymentsService:', error);
    throw error;
  }
};

// Update payment (Admin can update amount, dueDate, description)
export const updatePaymentService = async (paymentId, projectId, updatePaymentDTO) => {
  try {
    const model = mapUpdatePaymentDTOtoPaymentModel(updatePaymentDTO);
    const payment = await updatePayment(paymentId, projectId, model);
    return payment;
  } catch (error) {
    throw error;
  }
};

// Submit payment with slip (Client action)
export const submitPaymentSlipService = async (paymentId, projectId, paymentSlipData) => {
  try {
    console.log(`[submitPaymentSlip] Starting - paymentId: ${paymentId}, projectId: ${projectId}`);
    
    // Verify payment exists
    const payment = await getPaymentById(paymentId, projectId);
    console.log(`[submitPaymentSlip] Retrieved payment:`, payment);
    
    // Handle both structures: payment.Attributes and direct attributes
    const attrs = payment.Attributes || payment;
    console.log(`[submitPaymentSlip] Payment attributes:`, { status: attrs.status, clientId: attrs.clientId });
    
    if (!attrs) {
      throw new NotFoundError('Payment not found or invalid data structure');
    }
    
    if (attrs.status === 'APPROVED' || attrs.status === 'REJECTED') {
      throw new BadRequest('Cannot submit slip for already approved or rejected payment');
    }

    // Update payment with slip and completion time
    const updates = {
      paymentSlip: paymentSlipData, // Base64 encoded image or file path
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
    };

    console.log(`[submitPaymentSlip] Updating payment with status: COMPLETED`);
    const updatedPayment = await updatePayment(paymentId, projectId, updates);
    console.log(`[submitPaymentSlip] Payment updated successfully:`, updatedPayment);

    return updatedPayment;
  } catch (error) {
    throw error;
  }
};

// Approve payment (Admin action)
export const approvePaymentService = async (paymentId, projectId) => {
  try {
    const payment = await getPaymentById(paymentId, projectId);
    
    // Handle both structures: payment.Attributes and direct attributes
    const attrs = payment.Attributes || payment;

    if (attrs.status === 'APPROVED') {
      throw new BadRequest('Payment is already approved');
    }

    if (attrs.status !== 'COMPLETED') {
      throw new BadRequest('Only completed payments can be approved');
    }

    // Update payment status to APPROVED
    const updates = {
      status: 'APPROVED',
      updatedAt: new Date().toISOString(),
    };

    const approvedPayment = await updatePayment(paymentId, projectId, updates);

    return approvedPayment;
  } catch (error) {
    throw error;
  }
};

// Reject payment (Admin action)
export const rejectPaymentService = async (paymentId, projectId, reason) => {
  try {
    const payment = await getPaymentById(paymentId, projectId);
    
    // Handle both structures: payment.Attributes and direct attributes
    const attrs = payment.Attributes || payment;

    if (attrs.status === 'REJECTED') {
      throw new BadRequest('Payment is already rejected');
    }

    // Update payment status to REJECTED and clear slip
    const updates = {
      status: 'REJECTED',
      paymentSlip: null,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    };

    const rejectedPayment = await updatePayment(paymentId, projectId, updates);

    return rejectedPayment;
  } catch (error) {
    throw error;
  }
};

// Delete payment (Admin only)
export const deletePaymentService = async (paymentId, projectId) => {
  try {
    const result = await deletePayment(paymentId, projectId);
    return result;
  } catch (error) {
    throw error;
  }
};

// Get all payments (Admin dashboard)
export const getAllPaymentsService = async () => {
  try {
    const payments = await getAllPayments();
    
    if (!payments || payments.length === 0) {
      return [];
    }
    
    // Enrich payments with client and project details
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        try {
          // Handle both structures: payment.Attributes and direct attributes
          const attrs = payment.Attributes || payment;
          
          // Skip if we don't have valid payment data
          if (!attrs || !attrs.paymentId || !attrs.clientId || !attrs.projectId) {
            console.warn('Skipping invalid payment data:', payment);
            return null;
          }
          
          const client = await getClientById(attrs.clientId);
          const project = await getProjectById(attrs.projectId);
          return {
            ...payment,
            clientName: client?.Attributes?.clientName || 'Unknown Client',
            projectName: project?.Attributes?.projectName || 'Unknown Project',
          };
        } catch (error) {
          console.error(`Failed to fetch client/project for payment:`, error);
          return {
            ...payment,
            clientName: 'Unknown Client',
            projectName: 'Unknown Project',
          };
        }
      })
    );
    
    // Filter out null entries
    return enrichedPayments.filter(payment => payment !== null);
  } catch (error) {
    console.error('Error in getAllPaymentsService:', error);
    throw error;
  }
};

export default {
  createPaymentService,
  getPaymentService,
  getPaymentsByProjectService,
  getClientPaymentsService,
  updatePaymentService,
  submitPaymentSlipService,
  approvePaymentService,
  rejectPaymentService,
  deletePaymentService,
  getAllPaymentsService,
};
