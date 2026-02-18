import { QuotationStatus } from "../enums/quotationStatus.js";

export class QuotationDTO {
  constructor({
    quotationId,
    clientId,
    clientName,
    clientEmail,
    projectId,
    projectName,
    description,
    amount,
    discount,
    datePeriod,
    featureName,
    featureCost,
    status,
    createdAt,
    updatedAt,
  } = {}) {
    const assignIfDefined = (target, key, value) => {
      if (value !== undefined) target[key] = value;
    };

    const assignEnum = (target, key, value, enumObj, fallback) => {
      if (value === undefined) return;
      target[key] = Object.values(enumObj).includes(value) ? value : fallback;
    };

    assignIfDefined(this, "quotationId", quotationId);
    assignIfDefined(this, "clientId", clientId);
    assignIfDefined(this, "clientName", clientName);
    assignIfDefined(this, "clientEmail", clientEmail);
    assignIfDefined(this, "projectId", projectId);
    assignIfDefined(this, "projectName", projectName);
    assignIfDefined(this, "description", description);
    assignIfDefined(this, "amount", amount);
    assignIfDefined(this, "discount", discount);
    assignIfDefined(this, "datePeriod", datePeriod);
    assignIfDefined(this, "featureName", featureName);
    assignIfDefined(this, "featureCost", featureCost);

    assignEnum(this, "status", status, QuotationStatus, QuotationStatus.SENT);

    assignIfDefined(this, "createdAt", createdAt);
    assignIfDefined(this, "updatedAt", updatedAt);
  }
}