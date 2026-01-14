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

  if (clientId == undefined) {
    throw new BadRequest("clientId cannot be null");
  }

  if (projectId == undefined) {
    throw new BadRequest("projectId cannot be null");
  }

  if (projectName == undefined && typeof projectName !== "string") {
    throw new BadRequest("projectName cannot be null");
  }

  if (description == undefined && typeof description !== "string") {
    throw new BadRequest("description cannot be null");
  }

  if (startDate == undefined) {
    throw new BadRequest("startDate cannot be null");
  }

  if (status == undefined) {
    if (typeof status !== "string") {
      throw new BadRequest("status must be a string");
    }
    if (!Object.values(ProjectStatus).includes(status)) {
      throw new BadRequest("Invalid status value");
    }
  }

  if (cost == undefined) {
    throw new BadRequest("cost cannot be null");
  }

  if (profitMargin == undefined) {
    throw new BadRequest("profitMargin cannot be null");
  }

  if (commissionPercent == undefined) {
    throw new BadRequest("commissionPercent cannot be null");
  }

  if (isRecurring == undefined) {
    if (!Object.values(IsRecurring).includes(isRecurring)) {
      throw new BadRequest("Invalid isRecurring value");
    }
  }

  if (billingCycle !== undefined) {
    if (!Object.values(BillingCycle).includes(billingCycle)) {
      throw new BadRequest("Invalid billingCycle value");
    }
  }

  if (billingDate == undefined) {
    throw new BadRequest("billingDate must be a valid date string");
  }

  if (billability !== undefined) {
    if (!Object.values(Billability).includes(billability)) {
      throw new BadRequest("Invalid billability value");
    }
  }

  return true;
};

