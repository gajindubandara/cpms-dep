import { BadRequest } from "../errors/customErrors.js";


function isMissing(val) {
  return val == undefined;
}

function isNotString(val) {
  return typeof val !== "string";
}

function isNotNumber(val) {
  return typeof val !== "number";
}

function validateStringField(val, fieldName) {
  if (isMissing(val) || isNotString(val)) {
    throw new BadRequest(`${fieldName} must be a string`);
  }
}

function validateAmount(val) {
  if (isMissing(val) || isNotNumber(val) || val < 0) {
    throw new BadRequest("amount must be a non-negative number");
  }
}

function validateArrayField(val, fieldName) {
  if (!Array.isArray(val)) {
    throw new BadRequest(`${fieldName} must be an array`);
  }
}

export const validateInvoiceDTO = (data = {}) => {
  const { clientId, projectId, amount, items } = data;
  validateStringField(clientId, "clientId");
  validateStringField(projectId, "projectId");
  validateAmount(amount);
  validateArrayField(items, "items");
  return true;
};

export const validateInvoiceUpdateDTO = (data = {}) => {
  if (data.clientId !== undefined && typeof data.clientId !== "string") {
    throw new BadRequest("clientId must be a string");
  }
  if (data.clientEmail !== undefined && typeof data.clientEmail !== "string") {
    throw new BadRequest("clientEmail must be a string");
  }
  if (data.projectId !== undefined && typeof data.projectId !== "string") {
    throw new BadRequest("projectId must be a string");
  }
  if (data.amount !== undefined && (typeof data.amount !== "number" || data.amount < 0)) {
    throw new BadRequest("amount must be a non-negative number");
  }
  if (data.invoiceDate !== undefined && typeof data.invoiceDate !== "string") {
    throw new BadRequest("invoiceDate must be a string");
  }
  if (data.items !== undefined && !Array.isArray(data.items)) {
    throw new BadRequest("items must be an array");
  }
  return true;
};


export const validateQuotationDTO = (data = {}) => {
  const { clientId, projectId, amount, featureName, featureCost } = data;
  validateStringField(clientId, "clientId");
  validateStringField(projectId, "projectId");
  validateAmount(amount);
  validateArrayField(featureName, "featureName");
  validateArrayField(featureCost, "featureCost");
  return true;
};


function validateOptionalString(val, fieldName) {
  if (val !== undefined && isNotString(val)) {
    throw new BadRequest(`${fieldName} must be a string`);
  }
}

function validateOptionalAmount(val, fieldName) {
  if (val !== undefined && (isNotNumber(val) || val < 0)) {
    throw new BadRequest(`${fieldName} must be a non-negative number`);
  }
}

function validateOptionalArray(val, fieldName) {
  if (val !== undefined && !Array.isArray(val)) {
    throw new BadRequest(`${fieldName} must be an array`);
  }
}

export const validateQuotationUpdateDTO = (data = {}) => {
  validateOptionalString(data.clientId, "clientId");
  validateOptionalString(data.clientEmail, "clientEmail");
  validateOptionalString(data.projectId, "projectId");
  validateOptionalAmount(data.projectCost, "projectCost");
  validateOptionalAmount(data.amount, "amount");
  validateOptionalAmount(data.discount, "discount");
  validateOptionalAmount(data.discountAmount, "discountAmount");
  validateOptionalAmount(data.grandTotal, "grandTotal");
  validateOptionalString(data.quotationDate, "quotationDate");
  validateOptionalArray(data.featureName, "featureName");
  validateOptionalArray(data.featureCost, "featureCost");
  validateOptionalString(data.cloudinaryId, "cloudinaryId");
  return true;
};
