import { CreatePaymentDTO, UpdatePaymentDTO } from "../dtos/paymentDto.js";

// Map CreatePaymentDTO to Payment Model
export const mapCreatePaymentDTOtoPaymentModel = (createPaymentDTO) => {
  return {
    projectId: createPaymentDTO.projectId,
    clientId: createPaymentDTO.clientId,
    amount: createPaymentDTO.amount,
    dueDate: createPaymentDTO.dueDate,
    description: createPaymentDTO.description || '',
    currency: createPaymentDTO.currency,
    status: 'PENDING',
  };
};

// Map UpdatePaymentDTO to Payment Model
export const mapUpdatePaymentDTOtoPaymentModel = (updatePaymentDTO) => {
  const model = {};
  
  if (updatePaymentDTO.amount !== undefined) model.amount = updatePaymentDTO.amount;
  if (updatePaymentDTO.dueDate !== undefined) model.dueDate = updatePaymentDTO.dueDate;
  if (updatePaymentDTO.description !== undefined) model.description = updatePaymentDTO.description;
  if (updatePaymentDTO.status !== undefined) model.status = updatePaymentDTO.status;
  if (updatePaymentDTO.currency !== undefined) model.currency = updatePaymentDTO.currency;
  
  return model;
};

// Map Payment Model to ClientPaymentDTO (for client view)
export const mapPaymentModelToClientPaymentDTO = (payment) => {
  const attrs = payment.Attributes || payment;
  return {
    paymentId: attrs.paymentId,
    projectId: attrs.projectId,
    projectName: payment.projectName || 'Unknown Project',
    amount: attrs.amount,
    dueDate: attrs.dueDate,
    status: attrs.status,
    description: attrs.description,
    paymentSlip: attrs.paymentSlip,
    completedAt: attrs.completedAt,
    currency: attrs.currency,
  };
};

// Map Payment Model to AdminPaymentDTO (for admin view)
export const mapPaymentModelToAdminPaymentDTO = (payment) => {
  const attrs = payment.Attributes || payment;
  return {
    paymentId: attrs.paymentId,
    projectId: attrs.projectId,
    projectName: payment.projectName || 'Unknown Project',
    clientId: attrs.clientId,
    clientName: payment.clientName || 'Unknown Client',
    amount: attrs.amount,
    dueDate: attrs.dueDate,
    status: attrs.status,
    description: attrs.description,
    paymentSlip: attrs.paymentSlip, // Return actual URL, not label
    completedAt: attrs.completedAt,
    currency: attrs.currency,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    createdBy: attrs.createdBy,
  };
};

export default {
  mapCreatePaymentDTOtoPaymentModel,
  mapUpdatePaymentDTOtoPaymentModel,
  mapPaymentModelToClientPaymentDTO,
  mapPaymentModelToAdminPaymentDTO,
};
