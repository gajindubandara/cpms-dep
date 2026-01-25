import { getDateOnly } from "../utils/dateOnly.js";

// Payment Model for DynamoDB
export const Payment = {
  pk: (paymentId) => `PAYMENT#${paymentId}`,
  sk: (projectId) => `PROJECT#${projectId}`,
  
  create: (data) => ({
    PK: `PAYMENT#${data.paymentId}`,
    SK: `PROJECT#${data.projectId}`,
    Attributes: {
      paymentId: data.paymentId,
      projectId: data.projectId,
      clientId: data.clientId,
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status ?? 'PENDING',
      description: data.description || '',
      paymentSlip: data.paymentSlip || null, // Cloudinary secure URL (e.g., https://res.cloudinary.com/.../payment-slips/...)
      completedAt: data.completedAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy // Admin who created the payment
    },
    queryDate: getDateOnly()
  }),

  update: (data) => ({
    Attributes: {
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status,
      description: data.description,
      paymentSlip: data.paymentSlip, // Cloudinary secure URL
      completedAt: data.completedAt,
      updatedAt: new Date().toISOString()
    }
  })
};

export default Payment;
