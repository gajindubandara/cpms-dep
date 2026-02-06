import { QuotationStatus } from "../enums/quotationStatus.js";
export class QuotationDTO {
  constructor({quotationId, clientId, clientName, clientEmail, projectId, projectName, description, amount, discount, datePeriod, featureName, featureCost, status, createdAt, updatedAt} = {}) {
      if (quotationId !== undefined) this.quotationId = quotationId;
    if (clientId !== undefined) this.clientId = clientId;
    if (clientName !== undefined) this.clientName = clientName;
    if (clientEmail !== undefined) this.clientEmail = clientEmail;
    if (projectId !== undefined) this.projectId = projectId;
    if (projectName !== undefined) this.projectName = projectName;
    if (description !== undefined) this.description = description;
    if (amount !== undefined) this.amount = amount;
    if (discount !== undefined) this.discount = discount;
    if (datePeriod !== undefined) this.datePeriod = datePeriod;
    if (featureName !== undefined) this.featureName = featureName;
    if (featureCost !== undefined) this.featureCost = featureCost;

    if (status !== undefined) {
      this.status = Object.values(QuotationStatus).includes(status) ? status : QuotationStatus.SENT;
    }
    
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }
}