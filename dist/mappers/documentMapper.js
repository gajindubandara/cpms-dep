/**
 * Map API DTO to DynamoDB model format
 * Handles transformation from API structure to DB structure
 */
export const mapDocumentDTOtoModel = (dto) => {
  const { meta, clientId, ...restData } = dto;

  const documentType = (meta?.document_type || "").toUpperCase();
  const documentNumber = meta?.document_number;

  return {
    documentType,
    documentNumber,
    clientId, // Will be prefixed with CLIENT# in model creation
    ...restData,
    meta, // Keep meta in the payload with issue_date inside
  };
};

/**
 * Map DynamoDB item to API DTO format
 * Handles transformation from DB structure to API response format
 * Returns nested format with PK, SK, Attributes, queryDate, and clientId
 */
export const mapDocumentModelToDTO = (dbItem) => {
  if (!dbItem) return null;

  // Build response with the required format
  const response = {
    PK: dbItem.PK,
    SK: dbItem.SK,
    Attributes: dbItem.Attributes || {},
  };

  // Add queryDate if it exists
  if (dbItem.queryDate) {
    response.queryDate = dbItem.queryDate;
  }

  // Add clientId if it exists, removing CLIENT# prefix if present
  if (dbItem.clientId) {
    response.clientId = dbItem.clientId.replace("CLIENT#", "");
  }

  return response;
};

/**
 * Map update DTO to model updates (for partial updates)
 * Note: Type-specific field filtering happens during DAO update when we know the document type
 */
export const mapUpdateDocumentDTOtoModel = (dto) => {
  const model = {};

  // Copy any defined fields
  if (dto.clientId !== undefined) model.clientId = dto.clientId;
  if (dto.clientName !== undefined) model.clientName = dto.clientName;
  if (dto.clientEmail !== undefined) model.clientEmail = dto.clientEmail;
  if (dto.projectId !== undefined) model.projectId = dto.projectId;
  if (dto.projectName !== undefined) model.projectName = dto.projectName;
  if (dto.description !== undefined) model.description = dto.description;
  if (dto.amount !== undefined) model.amount = dto.amount;
  if (dto.items !== undefined) model.items = dto.items;
  if (dto.projectCost !== undefined) model.projectCost = dto.projectCost;
  if (dto.discount !== undefined) model.discount = dto.discount;
  if (dto.discountAmount !== undefined) model.discountAmount = dto.discountAmount;
  if (dto.grandTotal !== undefined) model.grandTotal = dto.grandTotal;
  if (dto.termsAndConditions !== undefined) model.termsAndConditions = dto.termsAndConditions;
  if (dto.contactInformation !== undefined) model.contactInformation = dto.contactInformation;
  if (dto.bankDetails !== undefined) model.bankDetails = dto.bankDetails;
  if (dto.meta !== undefined) model.meta = dto.meta;

  return model;
};

/**
 * Filter type-specific fields from update model
 * Removes bankDetails from Quotations and termsAndConditions from Invoices
 */
export const filterTypeSpecificFields = (updates, documentType) => {
  const filtered = { ...updates };

  if (documentType === 'INVOICE') {
    // Invoices don't store termsAndConditions
    delete filtered.termsAndConditions;
  } else if (documentType === 'QUOTATION') {
    // Quotations don't store bankDetails
    delete filtered.bankDetails;
  }

  return filtered;
};



