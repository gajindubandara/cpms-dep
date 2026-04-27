import { getDateOnly } from '../utils/dateOnly.js';

export const Document = {
  pk: (documentType, documentNumber) => `${documentType.toUpperCase()}#${documentNumber}`,
  sk: (documentType) => documentType.toUpperCase(),
  create: (data) => {
    const documentType = (data.meta?.document_type || data.document_type || '').toUpperCase();
    const documentNumber = data.meta?.document_number || data.document_number;
    const issueDate = data.meta?.issue_date || data.issueDate || data.queryDate || getDateOnly();

    // Build clientId if it exists (format: CLIENT#<id>)
    const clientId = data.clientId ? `CLIENT#${data.clientId}` : undefined;

    // Create the attributes payload - everything except showBankDetails and type-specific excluded fields
    const attributes = { ...data };

    // Always remove these system fields
    delete attributes.showBankDetails;
    delete attributes.PK;
    delete attributes.SK;
    delete attributes.type;
    delete attributes.queryDate;
    delete attributes.issueDate; // Remove issueDate at root level - keep only inside meta.issue_date
    delete attributes.clientId; // Remove raw clientId from attributes since we store it separately

    // Remove type-specific fields that shouldn't be stored
    if (documentType === 'INVOICE') {
      // Invoices don't need termsAndConditions
      delete attributes.termsAndConditions;
    } else if (documentType === 'QUOTATION') {
      // Quotations don't need bankDetails
      delete attributes.bankDetails;
    }

    return {
      PK: `${documentType}#${documentNumber}`,
      SK: documentType,
      type: documentType,
      queryDate: issueDate,
      ...(clientId && { clientId }),
      Attributes: attributes,
    };
  },
};


