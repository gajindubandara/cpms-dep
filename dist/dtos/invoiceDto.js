export function createInvoiceDTO({
  invoiceId,
  clientId,
  clientName,
  clientEmail,
  projectId,
  projectName,
  description,
  amount,
  invoiceDate,
  createdAt,
  updatedAt,
  items,
  cloudinaryId,
  pdfUrl,
} = {}) {
  const dto = {};

  const assignIfDefined = (target, key, value) => {
    if (value !== undefined) target[key] = value;
  };

  assignIfDefined(dto, "invoiceId", invoiceId);
  assignIfDefined(dto, "clientId", clientId);
  assignIfDefined(dto, "clientName", clientName);
  assignIfDefined(dto, "clientEmail", clientEmail);
  assignIfDefined(dto, "projectId", projectId);
  assignIfDefined(dto, "projectName", projectName);
  assignIfDefined(dto, "description", description);
  assignIfDefined(dto, "amount", amount);
  assignIfDefined(dto, "invoiceDate", invoiceDate);

  assignIfDefined(dto, "createdAt", createdAt);
  assignIfDefined(dto, "updatedAt", updatedAt);
  assignIfDefined(dto, "items", items);
  assignIfDefined(dto, "cloudinaryId", cloudinaryId);
  assignIfDefined(dto, "pdfUrl", pdfUrl);

  return dto;
}