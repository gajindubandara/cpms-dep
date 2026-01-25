import { QuotationStatus } from "../enums/quotationStatus.js";
import {Status} from "../enums/quotationStatus.js";
import { BadRequest } from "../errors/customErrors.js";

export const validateQuotationDTO = (data = {}) => {
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
    if (!Object.values(QuotationStatus).includes(status)) {
    throw new BadRequest("Invalid status value");
  }
    if (!Array.isArray(items)) {
    throw new BadRequest("items must be an array");
  }
    return true;
};
