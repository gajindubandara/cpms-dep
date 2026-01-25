import { QuotationStatus} from "../enums/quotationStatus.js";

export const Quotation = {
  pk: (quotationId) => `QUOTATION#${quotationId}`,
  sk: () => `QUOTATION`,
  create: (data) => ({
    PK: `QUOTATION#${data.quotationId}`,
    SK: `QUOTATION`,
    Attributes: {
      clientId: data.clientId,
      clientName: data.clientName,
      projectId: data.projectId,
      projectName: data.projectName,
      description: data.description,
      amount: data.amount,
      status: data.status ?? QuotationStatus.SENT,
      items: data.items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }),
};