import { InvoiceStatus } from "../enums/invoiceStatus.js";

export const Invoice = {
  pk: (invoiceId) => `INVOICE#${invoiceId}`,
  sk: () => `INVOICE`,
    create: (data) => ({
    PK: `INVOICE#${data.invoiceId}`,
    SK: `INVOICE`,
    Attributes: {
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectId: data.projectId,
        projectName: data.projectName, 
        description: data.description,
        amount: data.amount,
        dateRange: data.dateRange,
        status: data.status ?? InvoiceStatus.SENT,
        items: data.items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
  }),
};
