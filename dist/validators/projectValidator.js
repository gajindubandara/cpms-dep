import { BadRequest } from "../errors/customErrors.js";
import { ProjectStatus } from "../enums/projectStatus.js";
import { IsRecurring } from "../enums/isRecurring.js";
import { BillingCycle } from "../enums/billingCycle.js";
import { Billability } from "../enums/billability.js";

// Basic validation for ProjectDTO-shaped data
export const validateProjectDTO = (data = {}) => {
  const {
    clientId,
    projectId,
    featureId,
    projectName,
    description,
    startDate,
    endDate,
    status,
    cost,
    profitMargin,
    commissionPercent,
    isRecurring,
    billingCycle,
    billingDate,
    billability,
  } = data;

  if (clientId !== undefined) {
    throw new BadRequest("clientId must be a string");
  }

  if (projectId !== undefined) {
    throw new BadRequest("projectId must be a string");
  }

  if (featureId !== undefined) {
    throw new BadRequest("featureId must be a number");
  }

  if (projectName !== undefined && typeof projectName !== "string") {
    throw new BadRequest("projectName must be a string");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new BadRequest("description must be a string");
  }

  if (startDate !== undefined) {
    throw new BadRequest("startDate must be a valid date string");
  }

  if (endDate !== undefined) {
    throw new BadRequest("endDate must be a valid date string");
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      throw new BadRequest("status must be a string");
    }
    if (!Object.values(ProjectStatus).includes(status)) {
      throw new BadRequest("Invalid status value");
    }
  }

  if (cost !== undefined) {
    throw new BadRequest("cost must be a number");
  }

  if (profitMargin !== undefined) {
    throw new BadRequest("profitMargin must be a number");
  }

  if (commissionPercent !== undefined) {
    throw new BadRequest("commissionPercent must be a number");
  }

  if (isRecurring !== undefined) {
    if (!Object.values(IsRecurring).includes(isRecurring)) {
      throw new BadRequest("Invalid isRecurring value");
    }
  }

  if (billingCycle !== undefined) {
    if (!Object.values(BillingCycle).includes(billingCycle)) {
      throw new BadRequest("Invalid billingCycle value");
    }
  }

  if (billingDate !== undefined && !isValidDate(billingDate)) {
    throw new BadRequest("billingDate must be a valid date string");
  }

  if (billability !== undefined) {
    if (!Object.values(Billability).includes(billability)) {
      throw new BadRequest("Invalid billability value");
    }
  }

  return true;
};

