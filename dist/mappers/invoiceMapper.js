// Mapping Update Invoice DTO to Invoice Model (for update logic)
export const mapUpdateInvoiceDTOtoInvoiceModel = (dto) => {
  const model = {};
  if (dto.amount !== undefined) model.amount = dto.amount;
  if (dto.invoiceDate !== undefined) model.invoiceDate = dto.invoiceDate;
  if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
  if (dto.clientId !== undefined) model.clientId = dto.clientId;
  if (dto.clientName !== undefined) model.clientName = dto.clientName;
  if (dto.clientEmail !== undefined) model.clientEmail = dto.clientEmail;
  if (dto.projectId !== undefined) model.projectId = dto.projectId;
  if (dto.projectName !== undefined) model.projectName = dto.projectName;
  if (dto.description !== undefined) model.description = dto.description;
  if (dto.items !== undefined) model.items = dto.items;
  if (dto.createdAt !== undefined) model.createdAt = dto.createdAt;
  if (dto.cloudinaryId !== undefined) model.cloudinaryId = dto.cloudinaryId;
  if (dto.pdfUrl !== undefined) model.pdfUrl = dto.pdfUrl;
  return model;
};
// Mapping Create Invoice DTO to Invoice Model
export const mapCreateInvoiceDtoToModel = (dto) => {
  return {
    invoiceId: dto.invoiceId,
    clientId: dto.clientId,
    clientName: dto.clientName,
    clientEmail: dto.clientEmail,
    projectId: dto.projectId,
    projectName: dto.projectName,
    description: dto.description,
    amount: dto.amount,
    invoiceDate: dto.invoiceDate,
    items: dto.items,
    cloudinaryId: dto.cloudinaryId,
    pdfUrl: dto.pdfUrl,
  };
}

// Mapping Invoice Model to DTO (for responses)
export const mapInvoiceModelToDto = (model) => {
  return {
    invoiceId: model.invoiceId,
    clientId: model.clientId,
    clientName: model.clientName,
    clientEmail: model.clientEmail,
    projectId: model.projectId,
    projectName: model.projectName,
    description: model.description,
    amount: model.amount,
    invoiceDate: model.invoiceDate,
    items: model.items,
    // Add other fields as needed
  };
}


