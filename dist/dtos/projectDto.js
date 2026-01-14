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
    profitMargin,
    commissionPercent,
    isRecurring,
    billingCycle,
    billingDate,
    billability,
    createdAt,
    updatedAt,
  } = {}) {
    if (clientId !== undefined) this.clientId = clientId;
    if (projectId !== undefined) this.projectId = projectId;
    if (featureId !== undefined){ this.featureId = featureId}else{this.featureId = 0}
    if (projectName !== undefined) this.projectName = projectName;
    if (description !== undefined) this.description = description;
    if (startDate !== undefined) this.startDate = startDate;
    if (endDate !== undefined) this.endDate = endDate;
    if (finalAmount !== undefined) this.finalAmount = finalAmount;

    if (status !== undefined) {
      this.status = Object.values(ProjectStatus).includes(status)
        ? status
        : ProjectStatus.PLANNED;
    }
    if(cost !== undefined) this.cost = cost;
    if (profitMargin !== undefined) this.profitMargin = profitMargin;
    if (commissionPercent !== undefined)
      this.commissionPercent = commissionPercent;
    if (isRecurring !== undefined) {
      this.isRecurring = Object.values(IsRecurring).includes(isRecurring)
        ? isRecurring
        : IsRecurring.NO;
    }
    if (billingCycle !== undefined) {
      this.billingCycle = Object.values(BillingCycle).includes(billingCycle)
        ? billingCycle
        : BillingCycle.MONTHLY;
    }
    if (billingDate !== undefined) this.billingDate = billingDate;

    if (billability !== undefined) {
      this.billability = Object.values(Billability).includes(billability)
        ? billability
        : Billability.BILLABLE;
    }

    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }
}
