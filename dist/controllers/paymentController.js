import {
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
} from "../services/paymentService.js";
import {
  mapPaymentModelToClientPaymentDTO,
  mapPaymentModelToAdminPaymentDTO,
} from "../mappers/paymentMapper.js";
import {
  validateCreatePayment,
  validateUpdatePayment,
  validatePaymentSlip,
} from "../validators/paymentValidator.js";

// Create payment (Admin only)
export const createPayment = async (req, res, next) => {
  try {
    const { projectId, clientId, amount, dueDate, description } = req.body;

    console.log('Creating payment with clientId from request:', clientId); // DEBUG
    console.log('Request body:', req.body); // DEBUG

    const validation = validateCreatePayment({
      projectId,
      clientId,
      amount,
      dueDate,
      description,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    const payment = await createPaymentService(
      { projectId, clientId, amount, dueDate, description },
      req.user?.sub
    );

    console.log('Created payment:', payment); // DEBUG

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment by ID
export const getPayment = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    const payment = await getPaymentService(paymentId, projectId);

    res.status(200).json({
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all payments by project (Admin view)
export const getPaymentsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'projectId is required',
      });
    }

    const payments = await getPaymentsByProjectService(projectId);

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Get client's payments (Client's "My Payments" section)
export const getClientPayments = async (req, res, next) => {
  try {
    const clientId = req.user?.sub; // Get user ID from JWT token

    console.log('Getting client payments for clientId:', clientId); // DEBUG
    console.log('JWT user object:', req.user); // DEBUG

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required',
      });
    }

    const payments = await getClientPaymentsService(clientId);

    console.log('Found payments:', payments.length); // DEBUG

    const mappedPayments = payments.map(mapPaymentModelToClientPaymentDTO);

    res.status(200).json({
      success: true,
      message: 'Client payments retrieved successfully',
      data: mappedPayments,
    });
  } catch (error) {
    next(error);
  }
};

// Update payment (Admin can update amount, dueDate, description)
export const updatePayment = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;
    const { amount, dueDate, description, status } = req.body;

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    const validation = validateUpdatePayment({
      amount,
      dueDate,
      description,
      status,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    const payment = await updatePaymentService(paymentId, projectId, {
      amount,
      dueDate,
      description,
      status,
    });

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Submit payment with slip (Client action)
export const submitPaymentSlip = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;

    console.log(`[submitPaymentSlip] Controller - paymentId: ${paymentId}, projectId: ${projectId}, file: ${req.file?.filename || 'none'}`);

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Validate file
    const validation = validatePaymentSlip(req.file);

    if (!validation.isValid) {
      console.log(`[submitPaymentSlip] Validation failed:`, validation.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    const payment = await submitPaymentSlipService(paymentId, projectId, req.file);
    console.log(`[submitPaymentSlip] Service returned:`, payment);

    res.status(200).json({
      success: true,
      message: 'Payment slip submitted successfully. Admin will review shortly.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Approve payment (Admin action)
export const approvePayment = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    const payment = await approvePaymentService(paymentId, projectId);

    res.status(200).json({
      success: true,
      message: 'Payment approved successfully. Notification sent to client.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Reject payment (Admin action)
export const rejectPayment = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;
    const { reason } = req.body;

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    const payment = await rejectPaymentService(paymentId, projectId, reason);

    res.status(200).json({
      success: true,
      message: 'Payment rejected. Notification sent to client.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete payment (Admin only)
export const deletePayment = async (req, res, next) => {
  try {
    const { paymentId, projectId } = req.params;

    if (!paymentId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId and projectId are required',
      });
    }

    const result = await deletePaymentService(paymentId, projectId);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all payments (Admin dashboard)
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await getAllPaymentsService();

    const mappedPayments = payments.map(mapPaymentModelToAdminPaymentDTO);

    res.status(200).json({
      success: true,
      message: 'All payments retrieved successfully',
      data: mappedPayments,
    });
  } catch (error) {
    next(error);
  }
};
