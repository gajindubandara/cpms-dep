// mapping the CreateQuotationDTO to QuotationModel
export const mapCreateQuotationDTOtoQuotationModel = (dto) => ({
  quotationId: dto.quotationId,
  clientId: dto.clientId,
  clientName: dto.clientName,
  projectId: dto.projectId,
  projectName: dto.projectName,
  description: dto.description,
  amount: dto.amount,
  status: dto.status,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  items: dto.items,
});


// mapping the AdminupdateQuotationDTO to QuotationModel
export const mapAdminUpdateQuotationDTOtoQuotationModel = (dto) => {
  const model = {};
  if (dto.status !== undefined) model.status = dto.status;
  if (dto.amount !== undefined) model.amount = dto.amount;
  if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
  if (dto.clientId !== undefined) model.clientId = dto.clientId;
  if (dto.clientName !== undefined) model.clientName = dto.clientName;
  if (dto.projectId !== undefined) model.projectId = dto.projectId;
  if (dto.projectName !== undefined) model.projectName = dto.projectName;
  if (dto.description !== undefined) model.description = dto.description;
  if (dto.items !== undefined) model.items = dto.items;
  if (dto.createdAt !== undefined) model.createdAt = dto.createdAt;
  return model;
};
