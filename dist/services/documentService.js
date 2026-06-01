import {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentById,
  getDocumentsByType,
  getDocumentsByTypeAndClientId,
  getDocumentsByTypeAndDateRange,
  getDocumentsByTypeAndClientIdAndDateRange,
  documentExists,
} from "../daos/documentDao.js";
import {
  mapDocumentDTOtoModel,
  mapDocumentModelToDTO,
  mapUpdateDocumentDTOtoModel,
  filterTypeSpecificFields,
} from "../mappers/documentMapper.js";
import { BadRequest, NotFoundError, AlreadyExistsError } from "../errors/customErrors.js";
import { getClientById } from "../daos/clientDao.js";
import { buildDocumentNotificationMessage, sendTelegramNotification } from "../config/telegramNotificationService.js";

/**
 * Helper to extract documentId from PK
 */
const extractDocumentId = (pk) => {
  if (!pk) return null;
  const parts = pk.split("#");
  return parts.slice(1).join("#");
};

/**
 * Create Document Service
 * Handles creation of both Quotations and Invoices
 */
export const createDocumentService = async (createDocumentDTO) => {
  const { meta, clientId } = createDocumentDTO;

  // Validate meta
  if (!meta || !meta.document_type || !meta.document_number) {
    throw new BadRequest(
      "meta.document_type and meta.document_number are required"
    );
  }

  const docType = (meta.document_type || "").toUpperCase();

  // Check for duplicate document number
  const exists = await documentExists(docType, meta.document_number);
  if (exists) {
    throw new AlreadyExistsError(
      `Document with type '${docType}' and number '${meta.document_number}' already exists`
    );
  }

  // Business rule: Invoice MUST have clientId
  if (docType === "INVOICE" && !clientId) {
    throw new BadRequest("clientId is required for Invoice");
  }

  // Business rule: If clientId provided, validate it exists
  if (clientId) {
    const existClient = await getClientById(clientId);
    if (!existClient) {
      throw new BadRequest("Client with that id is not available");
    }
  }

  // Transform DTO to model
  const model = mapDocumentDTOtoModel(createDocumentDTO);

   // Create in database
   const createdDocument = await createDocument(model);

    // Send Telegram notification
    void (async () => {
      const message = await buildDocumentNotificationMessage(`New ${docType} Created`, docType, createdDocument);
      await sendTelegramNotification(message);
    })();

   // Transform back to DTO format for response
   return mapDocumentModelToDTO(createdDocument);
};

/**
 * Get Document by ID Service
 */
export const getDocumentByIdService = async (documentType, documentNumber) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  const document = await getDocumentById(documentType, documentNumber);

  if (!document) {
    throw new NotFoundError("Document not found");
  }

  return mapDocumentModelToDTO(document);
};

/**
 * Get Documents by Type Service
 */
export const getDocumentsByTypeService = async (documentType) => {
  if (!documentType) throw new BadRequest("documentType is required");

  const documents = await getDocumentsByType(documentType);
  return documents.map(mapDocumentModelToDTO);
};

/**
 * Get Documents by Type and Client ID Service
 */
export const getDocumentsByTypeAndClientIdService = async (
  documentType,
  clientId
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!clientId) throw new BadRequest("clientId is required");

  const documents = await getDocumentsByTypeAndClientId(documentType, clientId);
  return documents.map(mapDocumentModelToDTO);
};

/**
 * Get Documents by Type and Date Range Service
 */
export const getDocumentsByTypeAndDateRangeService = async (
  documentType,
  startDate,
  endDate
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!startDate || !endDate)
    throw new BadRequest("startDate and endDate are required");

  const documents = await getDocumentsByTypeAndDateRange(
    documentType,
    startDate,
    endDate
  );
  return documents.map(mapDocumentModelToDTO);
};

/**
 * Get Documents by Type, Client ID, and Date Range Service
 */
export const getDocumentsByTypeAndClientIdAndDateRangeService = async (
  documentType,
  clientId,
  startDate,
  endDate
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!clientId) throw new BadRequest("clientId is required");
  if (!startDate || !endDate)
    throw new BadRequest("startDate and endDate are required");

  const documents = await getDocumentsByTypeAndClientIdAndDateRange(
    documentType,
    clientId,
    startDate,
    endDate
  );
  return documents.map(mapDocumentModelToDTO);
};

/**
 * Update Document Service
 */
export const updateDocumentService = async (
  documentType,
  documentNumber,
  updateDocumentDTO
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  // Verify document exists
  const existingDocument = await getDocumentById(documentType, documentNumber);
  if (!existingDocument) {
    throw new NotFoundError("Document not found");
  }

  // Transform updates
  let updates = mapUpdateDocumentDTOtoModel(updateDocumentDTO);

  // Filter out type-specific fields that shouldn't be stored
  updates = filterTypeSpecificFields(updates, documentType);

  if (Object.keys(updates).length === 0) {
    throw new BadRequest("No valid fields to update");
  }

  // If clientId is being changed, validate it exists
  if (updates.clientId) {
    const existClient = await getClientById(updates.clientId);
    if (!existClient) {
      throw new BadRequest("Client with that id is not available");
    }
  }

  // If issue_date in meta is being updated, also update queryDate
  if (updates.meta?.issue_date) {
    updates.queryDate = updates.meta.issue_date;
  }

   const updatedDocument = await updateDocument(
     documentType,
     documentNumber,
     updates
    );

    // Send Telegram notification
    void (async () => {
      const message = await buildDocumentNotificationMessage(`${documentType} Updated`, documentType, updatedDocument);
      await sendTelegramNotification(message);
    })();

    return mapDocumentModelToDTO(updatedDocument);
};

/**
 * Delete Document Service
 */
export const deleteDocumentService = async (documentType, documentNumber) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  const existingDocument = await getDocumentById(documentType, documentNumber);
  if (!existingDocument) {
    throw new NotFoundError("Document not found");
  }

   const deleted = await deleteDocument(documentType, documentNumber);

    // Send Telegram notification
    void (async () => {
      const message = await buildDocumentNotificationMessage(`${documentType} Deleted`, documentType, existingDocument);
      await sendTelegramNotification(message);
    })();

   return deleted;
};



