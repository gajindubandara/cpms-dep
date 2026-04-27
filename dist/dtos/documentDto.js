export function createDocumentDTO({
  clientId,
  clientName,
  clientEmail,
  projectId,
  projectName,
  description,
  meta,
  items,
  projectCost,
  amount,
  discount,
  discountAmount,
  grandTotal,
  termsAndConditions,
  contactInformation,
  bankDetails,
  createdAt,
  updatedAt,
  showBankDetails, // This will be ignored
} = {}) {
  const dto = {};

  const assignIfDefined = (target, key, value) => {
    if (value !== undefined) target[key] = value;
  };

  // Core fields
  assignIfDefined(dto, "clientId", clientId);
  assignIfDefined(dto, "clientName", clientName);
  assignIfDefined(dto, "clientEmail", clientEmail);
  assignIfDefined(dto, "projectId", projectId);
  assignIfDefined(dto, "projectName", projectName);
  assignIfDefined(dto, "description", description);

  // Meta object
  assignIfDefined(dto, "meta", meta);

  // Items and costs
  assignIfDefined(dto, "items", items);
  assignIfDefined(dto, "projectCost", projectCost);
  assignIfDefined(dto, "amount", amount);
  assignIfDefined(dto, "discount", discount);
  assignIfDefined(dto, "discountAmount", discountAmount);
  assignIfDefined(dto, "grandTotal", grandTotal);

  // Document-specific fields
  assignIfDefined(dto, "termsAndConditions", termsAndConditions);
  assignIfDefined(dto, "contactInformation", contactInformation);
  assignIfDefined(dto, "bankDetails", bankDetails);

  // Timestamps
  assignIfDefined(dto, "createdAt", createdAt);
  assignIfDefined(dto, "updatedAt", updatedAt);

  // NOTE: showBankDetails is INTENTIONALLY ignored

  return dto;
}

