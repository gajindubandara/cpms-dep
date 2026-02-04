// Payment Data Transfer Object
export const CreatePaymentDTO = {
  projectId: null,
  clientId: null,
  amount: null,
  dueDate: null,
  description: null,
  currency: null
};

export const UpdatePaymentDTO = {
  paymentId: null,
  amount: null,
  dueDate: null,
  description: null,
  status: null,
  currency: null
};

export const ClientPaymentDTO = {
  paymentId: null,
  projectId: null,
  projectName: null,
  amount: null,
  dueDate: null,
  status: null,
  description: null,
  paymentSlip: null,
  completedAt: null,
  currency: null
};

export const PaymentSlipDTO = {
  paymentId: null,
  paymentSlip: null,
  completedAt: null
};
