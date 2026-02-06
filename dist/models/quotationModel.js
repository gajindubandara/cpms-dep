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
      clientEmail: data.clientEmail,
      projectId: data.projectId,
      projectName: data.projectName,
      description: data.description,
      amount: data.amount,
      discount: data.discount,
      datePeriod: data.datePeriod,
      featureName: data.featureName,
      featureCost: data.featureCost,
      status: data.status ?? QuotationStatus.SENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }),
};