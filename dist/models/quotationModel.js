import { getDateOnly } from '../utils/dateOnly.js';

export const Quotation = {
  pk: (quotationId) => `QUOTATION#${quotationId}`,
  sk: () => `QUOTATION`,
  create: (data) => ({
    PK: `QUOTATION#${data.quotationId}`,
    SK: `QUOTATION`,
    type: `QUOTATION`,
    Attributes: {
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      projectId: data.projectId,
      projectName: data.projectName,
      description: data.description,
      projectCost: data.projectCost,
      amount: data.amount,
      discount: data.discount,
      discountAmount: data.discountAmount,
      grandTotal: data.grandTotal,
      quotationDate: data.quotationDate,
      featureName: data.featureName,
      featureCost: data.featureCost,
      cloudinaryId: data.cloudinaryId,
      pdfUrl: data.pdfUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    queryDate: getDateOnly(),
  }),
};