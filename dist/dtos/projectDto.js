export function createProjectDTO({
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
  billingCycle,
  billingDate,
  billability,
  createdAt,
  updatedAt,
} = {}) {
  const dto = {};
  const assignIfDefined = (key, value) => {
    if (value !== undefined) dto[key] = value;
  };
  const assignEnum = (key, value, enumObj, fallback) => {
    if (value === undefined) return;
    dto[key] = Object.values(enumObj).includes(value) ? value : fallback;
  };
  assignIfDefined("clientId", clientId);
  assignIfDefined("projectId", projectId);
  dto.featureId = featureId ?? 0;
  assignIfDefined("projectName", projectName);
  assignIfDefined("description", description);
  assignIfDefined("startDate", startDate);
  assignIfDefined("endDate", endDate);
  assignIfDefined("finalAmount", finalAmount);
  assignEnum("status", status, ProjectStatus, ProjectStatus.PLANNED);
  assignIfDefined("currency", currency);
  assignIfDefined("cost", cost);
  assignIfDefined("profitMargin", profitMargin);
  assignIfDefined("commissionPercent", commissionPercent);
  assignEnum("isRecurring", isRecurring, IsRecurring, IsRecurring.NO);
  assignEnum("billingCycle", billingCycle, BillingCycle, BillingCycle.MONTHLY);
  assignIfDefined("billingDate", billingDate);
  assignEnum("billability", billability, Billability, Billability.BILLABLE);
  assignIfDefined("createdAt", createdAt);
  assignIfDefined("updatedAt", updatedAt);
  return dto;
}
