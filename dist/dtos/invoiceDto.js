import { InvoiceStatus } from "../enums/invoiceStatus.js";

export function createInvoiceDTO({
  invoiceId,
  clientId,
  clientName,
  clientEmail,
  projectId,
  projectName,
  description,
  amount,
  dateRange,
  status,
  createdAt,
  updatedAt,
  items,
} = {}) {
  const dto = {};

  const assignIfDefined = (target, key, value) => {
    if (value !== undefined) target[key] = value;
  };

  const assignEnum = (target, key, value, enumObj, fallback) => {
    if (value === undefined) return;
    target[key] = Object.values(enumObj).includes(value) ? value : fallback;
  };

  assignIfDefined(dto, "invoiceId", invoiceId);
  assignIfDefined(dto, "clientId", clientId);
  assignIfDefined(dto, "clientName", clientName);
  assignIfDefined(dto, "clientEmail", clientEmail);
  assignIfDefined(dto, "projectId", projectId);
  assignIfDefined(dto, "projectName", projectName);
  assignIfDefined(dto, "description", description);
  assignIfDefined(dto, "amount", amount);
  assignIfDefined(dto, "dateRange", dateRange);

  assignEnum(dto, "status", status, InvoiceStatus, InvoiceStatus.SENT);

  assignIfDefined(dto, "createdAt", createdAt);
  assignIfDefined(dto, "updatedAt", updatedAt);
  assignIfDefined(dto, "items", items);

  return dto;
}