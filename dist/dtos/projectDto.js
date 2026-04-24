import { ProjectStatus } from "../enums/projectStatus.js";
import { IsRecurring } from "../enums/isRecurring.js";
import { BillingCycle } from "../enums/billingCycle.js";
import { Billability } from "../enums/billability.js";

export class ProjectDTO {
  constructor({
    clientId,
    projectId,
    featureId,
    projectName,
    description,
    startDate,
    endDate,
    status,
    cost,
    finalAmount,
    currency,
    profitMargin,
    commissionPercent,
    isRecurring,
    recurCurrency,
    recurAmount,
    billingCycle,
    billingDate,
    billability,
    createdAt,
    updatedAt,
  } = {}) {
    // Helper to assign a value only if defined
    const assignIfDefined = (target, key, value) => {
      if (value !== undefined) target[key] = value;
    };

    // Helper to assign enum-validated value or fallback
    const assignEnum = (target, key, value, enumObj, fallback) => {
      if (value === undefined) return;
      target[key] = Object.values(enumObj).includes(value) ? value : fallback;
    };

    assignIfDefined(this, "clientId", clientId);
    assignIfDefined(this, "projectId", projectId);
    // featureId default to 0 when not provided
    this.featureId = featureId ?? 0;
    assignIfDefined(this, "projectName", projectName);
    assignIfDefined(this, "description", description);
    assignIfDefined(this, "startDate", startDate);
    assignIfDefined(this, "endDate", endDate);
    assignIfDefined(this, "finalAmount", finalAmount);

    assignEnum(this, "status", status, ProjectStatus, ProjectStatus.PLANNED);
    assignIfDefined(this, "currency", currency);
    assignIfDefined(this, "cost", cost);
    assignIfDefined(this, "profitMargin", profitMargin);
    assignIfDefined(this, "commissionPercent", commissionPercent);
    assignEnum(this, "isRecurring", isRecurring, IsRecurring, IsRecurring.NO);
    assignIfDefined(this, "recurCurrency", recurCurrency);
    assignIfDefined(this, "recurAmount", recurAmount);
    assignEnum(this, "billingCycle", billingCycle, BillingCycle, BillingCycle.MONTHLY);
    assignIfDefined(this, "billingDate", billingDate);
    assignEnum(this, "billability", billability, Billability, Billability.BILLABLE);

    assignIfDefined(this, "createdAt", createdAt);
    assignIfDefined(this, "updatedAt", updatedAt);
  }
}