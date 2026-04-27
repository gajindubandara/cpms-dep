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

function isNotObject(val) {
  return val === null || typeof val !== "object" || Array.isArray(val);
}

function validateStringField(val, fieldName) {
  if (isMissing(val) || isNotString(val)) {
    throw new BadRequest(`${fieldName} must be a string`);
  }
}

function validateOptionalString(val, fieldName) {
  if (val !== undefined && isNotString(val)) {
    throw new BadRequest(`${fieldName} must be a string`);
  }
}

function validateAmount(val) {
  if (isMissing(val) || isNotNumber(val) || val < 0) {
    throw new BadRequest("amount must be a non-negative number");
  }
}

function validateOptionalAmount(val, fieldName) {
  if (val !== undefined && (isNotNumber(val) || val < 0)) {
    throw new BadRequest(`${fieldName} must be a non-negative number`);
  }
}

function validateArrayField(val, fieldName) {
  if (!Array.isArray(val)) {
    throw new BadRequest(`${fieldName} must be an array`);
  }
}

function validateOptionalArray(val, fieldName) {
  if (val !== undefined && !Array.isArray(val)) {
    throw new BadRequest(`${fieldName} must be an array`);
  }
}

function validateMetaObject(meta) {
  if (isMissing(meta) || isNotObject(meta)) {
    throw new BadRequest("meta must be an object");
  }

  if (isMissing(meta.document_type)) {
    throw new BadRequest("meta.document_type is required");
  }

  const validTypes = ["Quotation", "Invoice", "QUOTATION", "INVOICE"];
  if (!validTypes.includes(meta.document_type)) {
    throw new BadRequest("meta.document_type must be 'Quotation' or 'Invoice'");
  }

  if (isMissing(meta.document_number)) {
    throw new BadRequest("meta.document_number is required");
  }

  if (isMissing(meta.issue_date)) {
    throw new BadRequest("meta.issue_date is required");
  }
}

/**
 * Validate document creation based on document_type
 */
export const validateDocumentDTO = (data = {}) => {
  const { meta, clientId, amount, items, termsAndConditions, bankDetails } = data;

  // Validate meta
  validateMetaObject(meta);

  const docType = (meta.document_type || "").toUpperCase();

  if (docType === "INVOICE") {
    // Invoice-specific validations
    validateStringField(clientId, "clientId (required for Invoice)");
    validateAmount(amount);
    validateArrayField(items, "items");

    // Invoice must have bankDetails
    if (isMissing(bankDetails) || isNotObject(bankDetails)) {
      throw new BadRequest("bankDetails is required for Invoice");
    }
  } else if (docType === "QUOTATION") {
    // Quotation-specific validations
    validateOptionalString(clientId, "clientId");
    validateAmount(amount);

    // Quotation must have termsAndConditions as an array
    validateArrayField(termsAndConditions, "termsAndConditions");
  }

  return true;
};

/**
 * Validate document update based on document_type
 */
export const validateDocumentUpdateDTO = (data = {}, documentType) => {
  // Meta and type validation (optional for updates)
  if (data.meta !== undefined) {
    validateMetaObject(data.meta);
  }

   // Common field validations
   validateOptionalString(data.clientId, "clientId");
   validateOptionalString(data.clientEmail, "clientEmail");
   validateOptionalString(data.projectId, "projectId");
   validateOptionalString(data.description, "description");
   validateOptionalAmount(data.amount, "amount");
   validateOptionalArray(data.items, "items");
   validateOptionalAmount(data.projectCost, "projectCost");
   validateOptionalAmount(data.discount, "discount");
   validateOptionalAmount(data.discountAmount, "discountAmount");
   validateOptionalAmount(data.grandTotal, "grandTotal");

   const docType = (documentType || "").toUpperCase();

   if (docType === "INVOICE") {
     if (data.bankDetails !== undefined && (data.bankDetails === null || typeof data.bankDetails !== "object" || Array.isArray(data.bankDetails))) {
       throw new BadRequest("bankDetails must be an object");
     }
   } else if (docType === "QUOTATION") {
     validateOptionalArray(data.termsAndConditions, "termsAndConditions");
   }

  return true;
};

