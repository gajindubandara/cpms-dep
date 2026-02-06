// mapping the CreateQuotationDTO to QuotationModel
export const mapCreateQuotationDTOtoQuotationModel = (dto) => ({
  quotationId: dto.quotationId,
  clientId: dto.clientId,
  clientName: dto.clientName,
  clientEmail: dto.clientEmail,
  projectId: dto.projectId,
  projectName: dto.projectName,
  description: dto.description,
  amount: dto.amount,
  discount: dto.discount,
  datePeriod: dto.datePeriod,
  featureName: dto.featureName,
  featureCost: dto.featureCost,
  status: dto.status,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});


// mapping the AdminupdateQuotationDTO to QuotationModel
export const mapAdminUpdateQuotationDTOtoQuotationModel = (dto) => {
  const model = {};
  if (dto.status !== undefined) model.status = dto.status;
  if (dto.amount !== undefined) model.amount = dto.amount;
  if (dto.discount !== undefined) model.discount = dto.discount;
  if (dto.datePeriod !== undefined) model.datePeriod = dto.datePeriod;
  if (dto.featureName !== undefined) model.featureName = dto.featureName;
  if (dto.featureCost !== undefined) model.featureCost = dto.featureCost;
  if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
  if (dto.clientId !== undefined) model.clientId = dto.clientId;
  if (dto.clientName !== undefined) model.clientName = dto.clientName;
  if (dto.clientEmail !== undefined) model.clientEmail = dto.clientEmail;
  if (dto.projectId !== undefined) model.projectId = dto.projectId;
  if (dto.projectName !== undefined) model.projectName = dto.projectName;
  if (dto.description !== undefined) model.description = dto.description;
  if (dto.createdAt !== undefined) model.createdAt = dto.createdAt;
  return model;
};
