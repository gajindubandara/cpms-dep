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

  if (data.currency !== undefined && typeof data.currency !== 'string') {
    errors.push('currency must be a string');
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

  if (data.currency !== undefined && typeof data.currency !== 'string') {
    errors.push('currency must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePaymentSlip = (file) => {
  const errors = [];

  if (!file) {
    errors.push('File is required');
  }

  // Validate that it's a file object from multer
  if (file && !file.buffer) {
    errors.push('Invalid file upload');
  }

  // Validate file type - only allow images
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (file && file.mimetype && !allowedMimes.includes(file.mimetype)) {
    errors.push('Only PNG, JPG, and JPEG image files are allowed');
  }

  // Validate file size (5MB max)
  if (file && file.size > 5 * 1024 * 1024) {
    errors.push('File size must be less than 5MB');
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
