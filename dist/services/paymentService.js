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
import { uploadToCloudinary } from "../config/cloudinary.js";

// Create payment (Admin only)
export const createPaymentService = async (createPaymentDTO, adminId) => {
  const model = mapCreatePaymentDTOtoPaymentModel(createPaymentDTO);
  model.createdBy = adminId;
  
  const payment = await createPayment(model);
  return payment;
};

// Get payment by ID
export const getPaymentService = async (paymentId, projectId) => {
  const payment = await getPaymentById(paymentId, projectId);
  return payment;
};

// Get all payments by project (Admin view)
export const getPaymentsByProjectService = async (projectId) => {
  const payments = await getPaymentsByProjectId(projectId);
  return payments;
};

// Get payments for client (Client's "My Payments" section)
export const getClientPaymentsService = async (clientId) => {
  const payments = await getPaymentsByClientId(clientId);
  
  if (!payments || payments.length === 0) {
    return [];
  }
  
  // Enrich payments with project and client details
  const enrichedPayments = await Promise.all(
    payments.map(async (payment) => {
      try {
        // Handle both structures: payment.Attributes and direct attributes
        const attrs = payment.Attributes || payment;
        
        if (!attrs || !attrs.projectId) {
          return null;
        }
        
        const project = await getProjectById(attrs.projectId);
        const enriched = {
          ...payment,
          projectName: project?.Attributes?.projectName || 'Unknown Project',
        };
        return enriched;
      } catch (error) {
        return {
          ...payment,
          projectName: 'Unknown Project',
        };
      }
    })
  );
  
  // Filter out null entries
  const result = enrichedPayments.filter(payment => payment !== null);
  return result;
};

// Update payment (Admin can update amount, dueDate, description)
export const updatePaymentService = async (paymentId, projectId, updatePaymentDTO) => {
  const model = mapUpdatePaymentDTOtoPaymentModel(updatePaymentDTO);
  const payment = await updatePayment(paymentId, projectId, model);
  return payment;
};

// Submit payment with slip (Client action)
export const submitPaymentSlipService = async (paymentId, projectId, fileData) => {
  // Verify payment exists
  const payment = await getPaymentById(paymentId, projectId);
  
  // Handle both structures: payment.Attributes and direct attributes
  const attrs = payment.Attributes || payment;
  
  if (!attrs) {
    throw new NotFoundError('Payment not found or invalid data structure');
  }
  
  // Allow submission for PENDING and REJECTED payments
  // Do NOT allow for APPROVED (already done) or COMPLETED (awaiting approval)
  if (attrs.status === 'APPROVED') {
    throw new BadRequest('Cannot submit slip for already approved payment');
  }

  if (attrs.status === 'COMPLETED') {
    throw new BadRequest('Payment slip is awaiting approval. Cannot resubmit at this time.');
  }

  // Upload file to Cloudinary
  const fileName = paymentId;
  const cloudinaryResponse = await uploadToCloudinary(fileData.buffer, fileName);

  // Update payment with slip URL from Cloudinary and completion time
  const updates = {
    paymentSlip: cloudinaryResponse.secure_url, // Cloudinary URL
    status: 'COMPLETED',
    completedAt: new Date().toISOString(),
  };

  const updatedPayment = await updatePayment(paymentId, projectId, updates);

  return updatedPayment;
};

// Approve payment (Admin action)
export const approvePaymentService = async (paymentId, projectId) => {
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
};

// Reject payment (Admin action)
export const rejectPaymentService = async (paymentId, projectId, reason) => {
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
};

// Delete payment (Admin only)
export const deletePaymentService = async (paymentId, projectId) => {
  const result = await deletePayment(paymentId, projectId);
  return result;
};

// Get all payments (Admin dashboard)
export const getAllPaymentsService = async () => {
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
          return null;
        }
        
        const client = await getClientById(attrs.clientId);
        const project = await getProjectById(attrs.projectId);
        
        const enriched = {
          ...payment,
          clientName: client?.Attributes?.clientName || 'Unknown Client',
          projectName: project?.Attributes?.projectName || 'Unknown Project',
        };
        
        return enriched;
      } catch (error) {
        return {
          ...payment,
          clientName: 'Unknown Client',
          projectName: 'Unknown Project',
        };
      }
    })
  );
  
  // Filter out null entries
  const result = enrichedPayments.filter(payment => payment !== null);
  return result;
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
