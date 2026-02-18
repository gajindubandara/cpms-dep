import { BadRequest } from "../errors/customErrors.js";
import { ProjectStatus } from "../enums/projectStatus.js";
import { IsRecurring } from "../enums/isRecurring.js";
import { BillingCycle } from "../enums/billingCycle.js";
import { Billability } from "../enums/billability.js";

// Basic validation for ProjectDTO-shaped data

function isMissing(val) {
  return val == undefined;
}

function isNotString(val) {
  return typeof val !== "string";
}

function isInvalidEnum(val, EnumObj) {
  return !Object.values(EnumObj).includes(val);
}

function validateBillableFields({ cost, finalAmount, profitMargin, commissionPercent, billingDate, billingCycle, currency }) {
  if (isMissing(cost)) throw new BadRequest("cost cannot be null");
  if (isMissing(finalAmount)) throw new BadRequest("finalAmount cannot be null");
  if (isMissing(profitMargin)) throw new BadRequest("profitMargin cannot be null");
  if (isMissing(commissionPercent)) throw new BadRequest("commissionPercent cannot be null");
  if (isMissing(billingDate)) throw new BadRequest("billingDate is required");
  if (billingCycle !== undefined && isInvalidEnum(billingCycle, BillingCycle)) {
    throw new BadRequest("Invalid billingCycle value");
  }
  if (currency == undefined || currency.trim().length === 0) throw new BadRequest("currency cannot be null");
}

export const validateProjectDTO = (data = {}) => {
  const {
    clientId,
    projectId,
    projectName,
    description,
    startDate,
    status,
    cost,
    finalAmount,
    profitMargin,
    commissionPercent,
    isRecurring,
    currency,
    billingCycle,
    billingDate,
    billability,
  } = data;

  if (isMissing(clientId)) throw new BadRequest("clientId cannot be null");
  if (isMissing(projectId)) throw new BadRequest("projectId cannot be null");
  if (isMissing(projectName) || isNotString(projectName)) throw new BadRequest("projectName must be a string");
  if (isMissing(description) || isNotString(description)) throw new BadRequest("description must be a string");
  if (isMissing(startDate)) throw new BadRequest("startDate cannot be null");
  if (isMissing(status)) throw new BadRequest("status cannot be null");
  if (isInvalidEnum(status, ProjectStatus)) throw new BadRequest("Invalid status value");
  if (isMissing(isRecurring)) throw new BadRequest("isRecurring cannot be null");
  if (isInvalidEnum(isRecurring, IsRecurring)) throw new BadRequest("Invalid isRecurring value");
  if (billability !== undefined && isInvalidEnum(billability, Billability)) throw new BadRequest("Invalid billability value");
  if (Billability.BILLABLE == billability) {
    validateBillableFields({ cost, finalAmount, profitMargin, commissionPercent, billingDate, billingCycle, currency });
  }
  return true;
};
