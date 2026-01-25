// Payment Validator

export const validateCreatePayment = (data) => {
  const errors = [];

  if (!data.projectId || typeof data.projectId !== 'string') {
    errors.push('projectId is required and must be a string');
  }

  if (!data.clientId || typeof data.clientId !== 'string') {
    errors.push('clientId is required and must be a string');
  }

  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  if (!data.dueDate || typeof data.dueDate !== 'string') {
    errors.push('dueDate is required and must be a valid date string');
  }

  // Validate date format (basic ISO check)
  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    errors.push('dueDate must be a valid ISO date string');
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push('description must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdatePayment = (data) => {
  const errors = [];

  if (data.amount !== undefined) {
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('amount must be a positive number');
    }
  }

  if (data.dueDate !== undefined) {
    if (typeof data.dueDate !== 'string' || isNaN(Date.parse(data.dueDate))) {
      errors.push('dueDate must be a valid ISO date string');
    }
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('description must be a string');
  }

  if (data.status !== undefined) {
    const validStatuses = ['PENDING', 'COMPLETED', 'APPROVED', 'REJECTED', 'OVERDUE'];
    if (!validStatuses.includes(data.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePaymentSlip = (paymentSlipData) => {
  const errors = [];

  if (!paymentSlipData) {
    errors.push('Payment slip URL is required');
  }

  // Validate that it's a string (URL from Cloudinary)
  if (paymentSlipData && typeof paymentSlipData !== 'string') {
    errors.push('Payment slip must be a valid Cloudinary URL string');
  }

  // Validate URL format
  if (paymentSlipData && typeof paymentSlipData === 'string') {
    try {
      new URL(paymentSlipData);
    } catch {
      errors.push('Payment slip must be a valid URL');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateCreatePayment,
  validateUpdatePayment,
  validatePaymentSlip,
};
