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

  if (clientId == undefined) throw new BadRequest("clientId cannot be null");
  if (projectId == undefined) throw new BadRequest("projectId cannot be null");

  if (projectName == undefined || typeof projectName !== "string") {
    throw new BadRequest("projectName must be a string");
  }

  if (description == undefined || typeof description !== "string") {
    throw new BadRequest("description must be a string");
  }

  if (startDate == undefined) throw new BadRequest("startDate cannot be null");

  if (status == undefined) throw new BadRequest("status cannot be null");
  if (!Object.values(ProjectStatus).includes(status)) {
    throw new BadRequest("Invalid status value");
  }
  if (isRecurring == undefined)
    throw new BadRequest("isRecurring cannot be null");
  if (!Object.values(IsRecurring).includes(isRecurring)) {
    throw new BadRequest("Invalid isRecurring value");
  }

  if (
    billability !== undefined &&
    !Object.values(Billability).includes(billability)
  ) {
    throw new BadRequest("Invalid billability value");
  }

  if (Billability.BILLABLE == billability) {
    if (cost == undefined) throw new BadRequest("cost cannot be null");
    if (finalAmount == undefined)
      throw new BadRequest("finalAmount cannot be null");
    if (profitMargin == undefined)
      throw new BadRequest("profitMargin cannot be null");
    if (commissionPercent == undefined)
      throw new BadRequest("commissionPercent cannot be null");

    if (billingDate == undefined) {
      throw new BadRequest("billingDate is required");
    }
    if (
      billingCycle !== undefined &&
      !Object.values(BillingCycle).includes(billingCycle)
    ) {
      throw new BadRequest("Invalid billingCycle value");
    }
    if(currency == undefined || currency.trim().length === 0) throw new BadRequest("currency cannot be null")
  }


  return true;
};
