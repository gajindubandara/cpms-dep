import { QuotationStatus } from "../enums/quotationStatus.js";
export class QuotationDTO {
  constructor({quotationId, clientId, clientName, projectId, projectName, description, amount, status, createdAt, updatedAt, items} = {}) {
      if (quotationId !== undefined) this.quotationId = quotationId;
    if (clientId !== undefined) this.clientId = clientId;
    if (clientName !== undefined) this.clientName = clientName;
    if (projectId !== undefined) this.projectId = projectId;
    if (projectName !== undefined) this.projectName = projectName;
    if (description !== undefined) this.description = description;
    if (amount !== undefined) this.amount = amount;

    if (status !== undefined) {
      this.status = Object.values(QuotationStatus).includes(status) ? status : QuotationStatus.SENT;
    }
    
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
    if (items !== undefined) this.items = items;
  }
}