import { QuotationStatus } from "../enums/quotationStatus";

export const Quotation = {
  pk: (quotationId) => `QUOTATION#${quotationId}`,
  sk: () => `QUOTATION`,
  create: (data) => ({
    PK: `QUOTATION#${data.quotationId}`,
    SK: `QUOTATION`,
    Attributes: {
      clientId: data.clientId,
      projectId: data.projectId,
      amount: data.amount,
      status: data.status ?? QuotationStatus.SENT,
      items: data.items,
      createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
  }),
};