import { getDateOnly } from '../utils/dateOnly.js';

export const Invoice = {
  pk: (invoiceId) => `INVOICE#${invoiceId}`,
  sk: () => `INVOICE`,
    create: (data) => ({
    PK: `INVOICE#${data.invoiceId}`,
    SK: `INVOICE`,
    type: `INVOICE`,
    Attributes: {
        invoiceId: data.invoiceId,
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectId: data.projectId,
        projectName: data.projectName, 
        description: data.description,
        amount: data.amount,
        invoiceDate: data.invoiceDate,
        items: data.items,
        cloudinaryId: data.cloudinaryId,
        pdfUrl: data.pdfUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    queryDate: getDateOnly(),
  }),
};
