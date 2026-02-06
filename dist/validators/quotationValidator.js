export const validateQuotationUpdateDTO = (data = {}) => {
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
  if (data.discount !== undefined && (typeof data.discount !== "number" || data.discount < 0)) {
    throw new BadRequest("discount must be a non-negative number");
  }
  if (data.datePeriod !== undefined && typeof data.datePeriod !== "string") {
    throw new BadRequest("datePeriod must be a string");
  }
  if (data.featureName !== undefined && !Array.isArray(data.featureName)) {
    throw new BadRequest("featureName must be an array");
  }
  if (data.featureCost !== undefined && !Array.isArray(data.featureCost)) {
    throw new BadRequest("featureCost must be an array");
  }
  if (data.status !== undefined && !Object.values(QuotationStatus).includes(data.status)) {
    throw new BadRequest("Invalid status value");
  }
  return true;
};
import { QuotationStatus } from "../enums/quotationStatus.js";
import { BadRequest } from "../errors/customErrors.js";

export const validateQuotationDTO = (data = {}) => {
  const { clientId, projectId, amount, status, featureName, featureCost } = data;
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
    if (!Object.values(QuotationStatus).includes(status)) {
    throw new BadRequest("Invalid status value");
  }
    if (!Array.isArray(featureName)) {
    throw new BadRequest("featureName must be an array");
  }
    if (!Array.isArray(featureCost)) {
    throw new BadRequest("featureCost must be an array");
  }
    return true;
};
