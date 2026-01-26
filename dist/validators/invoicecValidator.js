
import { InvoiceStatus } from "../enums/invoiceStatus.js";
import { BadRequest } from "../errors/customErrors.js";

export const validateInvoiceDTO = (data = {}) => {
  const { clientId, projectId, amount, status, items } = data;
    if (clientId == undefined || typeof clientId !== "string") {
    throw new BadRequest("clientId must be a string");
  }
    if (projectId == undefined || typeof projectId !== "string") {
    throw new BadRequest("projectId must be a string");
    }
    if (amount == undefined || typeof amount !== "number" || amount < 0) {
    throw new BadRequest("amount must be a non-negative number");
  }
    if (status == undefined) {
    throw new BadRequest("status cannot be null");
  }
    if (!Object.values(InvoiceStatus).includes(status)) {
    throw new BadRequest("Invalid status value");
  }
    if (!Array.isArray(items)) {
    throw new BadRequest("items must be an array");
  }
    return true;;
};
export const validateInvoiceUpdateDTO = (data = {}) => {
  if (data.clientId !== undefined && typeof data.clientId !== "string") {
    throw new BadRequest("clientId must be a string");
  }
    if (data.projectId !== undefined && typeof data.projectId !== "string") {   
    throw new BadRequest("projectId must be a string");
  }
    if (data.amount !== undefined && (typeof data.amount !== "number" || data.amount < 0)) {
    throw new BadRequest("amount must be a non-negative number");
  }
    if (data.status !== undefined && !Object.values(InvoiceStatus).includes(data.status)) {
    throw new BadRequest("Invalid status value");
  }
    if (data.items !== undefined && !Array.isArray(data.items)) {
    throw new BadRequest("items must be an array");
  }
    return true;
};



