export function createQuotationDTO({
  quotationId,
  clientId,
  clientName,
  clientEmail,
  projectId,
  projectName,
  description,
  projectCost,
  amount,
  discount,
  discountAmount,
  grandTotal,
  quotationDate,
  featureName,
  featureCost,
  s3Key,
  pdfUrl,
  createdAt,
  updatedAt,
} = {}) {
  const dto = {};
  const assignIfDefined = (key, value) => {
    if (value !== undefined) dto[key] = value;
  };
  assignIfDefined("quotationId", quotationId);
  assignIfDefined("clientId", clientId);
  assignIfDefined("clientName", clientName);
  assignIfDefined("clientEmail", clientEmail);
  assignIfDefined("projectId", projectId);
  assignIfDefined("projectName", projectName);
  assignIfDefined("description", description);
  assignIfDefined("projectCost", projectCost);
  assignIfDefined("amount", amount);
  assignIfDefined("discount", discount);
  assignIfDefined("discountAmount", discountAmount);
  assignIfDefined("grandTotal", grandTotal);
  assignIfDefined("quotationDate", quotationDate);
  assignIfDefined("featureName", featureName);
  assignIfDefined("featureCost", featureCost);
  assignIfDefined("s3Key", s3Key);
  assignIfDefined("pdfUrl", pdfUrl);
  assignIfDefined("createdAt", createdAt);
  assignIfDefined("updatedAt", updatedAt);
  return dto;
}