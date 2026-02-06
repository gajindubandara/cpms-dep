import { InvoiceStatus } from "../enums/invoiceStatus.js";
export class InvoiceDTO {
  constructor({invoiceId, clientId, clientName, clientEmail, projectId, projectName, description, amount, dateRange, status, createdAt, updatedAt, items} = {}) {
    if (invoiceId !== undefined) this.invoiceId = invoiceId;
    if (clientId !== undefined) this.clientId = clientId;
    if (clientName !== undefined) this.clientName = clientName;
    if (clientEmail !== undefined) this.clientEmail = clientEmail;
    if (projectId !== undefined) this.projectId = projectId;
    if (projectName !== undefined) this.projectName = projectName;
    if (description !== undefined) this.description = description;
    if (amount !== undefined) this.amount = amount;
    if (dateRange !== undefined) this.dateRange = dateRange;
    if (status !== undefined) {
      this.status = Object.values(InvoiceStatus).includes(status) ? status : InvoiceStatus.SENT;
    }

    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
    if (items !== undefined) this.items = items;
  }
}