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
import { uploadPaymentSlipToS3, deletePaymentSlipFromS3 } from "../config/s3config.js";

// Helper functions
const getAttrs = (payment) => payment?.Attributes ?? payment;
const getTimestamp = () => new Date().toISOString();
const DEBUG = process.env.NODE_ENV !== 'production';

const safeDeleteSlip = async (slipUrl) => {
  if (!slipUrl) return;
  try {
    await deletePaymentSlipFromS3(slipUrl);
  } catch (error) {
    console.warn('[Payment] Failed to delete old slip:', error.message);
  }
};

const enrichPayment = async (payment, includeClient = false) => {
  try {
    const attrs = getAttrs(payment);
    if (!attrs?.projectId) return null;

    const projectName = (await getProjectById(attrs.projectId))?.Attributes?.projectName || "Unknown Project";

    const enriched = { ...payment, projectName };

    if (includeClient && attrs?.clientId) {
      const clientName = (await getClientById(attrs.clientId))?.Attributes?.clientName || "Unknown Client";
      enriched.clientName = clientName;
    }

    return enriched;
  } catch (error) {
    console.error('[Payment] Enrichment error:', error.message);
    return {
      ...payment,
      projectName: 'Unknown Project',
      ...(includeClient && { clientName: 'Unknown Client' }),
    };
  }
};

const validatePaymentForSubmission = (attrs) => {
  if (attrs?.status === "APPROVED") {
    throw new BadRequest('Cannot submit slip for already approved payment');
  }
  if (attrs?.status === "COMPLETED") {
    throw new BadRequest('Payment slip is awaiting approval. Cannot resubmit at this time.');
  }
};

// Create payment (Admin only)
export const createPaymentService = async (createPaymentDTO, adminId) => {
  const model = mapCreatePaymentDTOtoPaymentModel(createPaymentDTO);
  model.createdBy = adminId;
  return await createPayment(model);
};

// Get payment by ID
export const getPaymentService = async (paymentId, projectId) => {
  return await getPaymentById(paymentId, projectId);
};

// Get all payments by project (Admin view)
export const getPaymentsByProjectService = async (projectId) => {
  return await getPaymentsByProjectId(projectId);
};

// Get payments for client (Client's "My Payments" section)
export const getClientPaymentsService = async (clientId) => {
  const payments = await getPaymentsByClientId(clientId);
  if (!payments?.length) return [];

  const enrichedPayments = await Promise.all(payments.map((p) => enrichPayment(p)));
  return enrichedPayments.filter(Boolean);
};

// Update payment (Admin can update amount, dueDate, description)
export const updatePaymentService = async (paymentId, projectId, updatePaymentDTO) => {
  const model = mapUpdatePaymentDTOtoPaymentModel(updatePaymentDTO);
  return await updatePayment(paymentId, projectId, model);
};

// Submit payment with slip (Client action)
export const submitPaymentSlipService = async (paymentId, projectId, fileData) => {
  const payment = await getPaymentById(paymentId, projectId);
  const attrs = getAttrs(payment);

  if (!attrs) {
    throw new NotFoundError("Payment not found or invalid data structure");
  }

  validatePaymentForSubmission(attrs);

  // Delete old slip if resubmitting
  await safeDeleteSlip(attrs.paymentSlip);

  // Upload new slip to S3
  const s3Response = await uploadPaymentSlipToS3({
    fileBuffer: fileData.buffer,
    fileName: paymentId,
    mimeType: fileData.mimetype || 'application/octet-stream',
  });

  if (DEBUG) console.log('[Payment] Slip uploaded:', s3Response.url);

  // Update payment with slip URL and completion time
  return await updatePayment(paymentId, projectId, {
    paymentSlip: s3Response.url,
    status: 'COMPLETED',
    completedAt: getTimestamp(),
  });
};

// Approve payment (Admin action)
export const approvePaymentService = async (paymentId, projectId) => {
  const payment = await getPaymentById(paymentId, projectId);
  const attrs = getAttrs(payment);

  if (attrs?.status === "APPROVED") {
    throw new BadRequest('Payment is already approved');
  }
  if (attrs?.status !== "COMPLETED") {
    throw new BadRequest('Only completed payments can be approved');
  }

  return await updatePayment(paymentId, projectId, {
    status: 'APPROVED',
    updatedAt: getTimestamp(),
  });
};

// Reject payment (Admin action)
export const rejectPaymentService = async (paymentId, projectId, reason) => {
  const payment = await getPaymentById(paymentId, projectId);
  const attrs = getAttrs(payment);

  if (attrs?.status === "REJECTED") {
    throw new BadRequest('Payment is already rejected');
  }

  // Delete slip from S3
  await safeDeleteSlip(attrs.paymentSlip);

  return await updatePayment(paymentId, projectId, {
    status: 'REJECTED',
    paymentSlip: null,
    completedAt: null,
    updatedAt: getTimestamp(),
  });
};

// Delete payment (Admin only)
export const deletePaymentService = async (paymentId, projectId) => {
  return await deletePayment(paymentId, projectId);
};

// Get all payments (Admin dashboard)
export const getAllPaymentsService = async () => {
  const payments = await getAllPayments();
  if (!payments?.length) return [];

  const enrichedPayments = await Promise.all(
    payments.map((p) => enrichPayment(p, true))
  );
  return enrichedPayments.filter(Boolean);
};
