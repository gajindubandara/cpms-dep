import { QuotationStatus } from "../enums/quotationStatus.js";

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
  datePeriod,
  featureName,
  featureCost,
  cloudinaryId,
  status,
  createdAt,
  updatedAt,
} = {}) {
  const dto = {};
  const assignIfDefined = (key, value) => {
    if (value !== undefined) dto[key] = value;
  };
  const assignEnum = (key, value, enumObj, fallback) => {
    if (value === undefined) return;
    dto[key] = Object.values(enumObj).includes(value) ? value : fallback;
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
  assignIfDefined("datePeriod", datePeriod);
  assignIfDefined("featureName", featureName);
  assignIfDefined("featureCost", featureCost);
  assignIfDefined("cloudinaryId", cloudinaryId);
  assignEnum("status", status, QuotationStatus, QuotationStatus.SENT);
  assignIfDefined("createdAt", createdAt);
  assignIfDefined("updatedAt", updatedAt);
  return dto;
}