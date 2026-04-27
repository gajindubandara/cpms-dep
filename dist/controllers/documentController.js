import {
  createDocumentService,
  updateDocumentService,
  deleteDocumentService,
  getDocumentByIdService,
  getDocumentsByTypeService,
  getDocumentsByTypeAndClientIdService,
  getDocumentsByTypeAndDateRangeService,
  getDocumentsByTypeAndClientIdAndDateRangeService,
} from "../services/documentService.js";
import { createDocumentDTO } from "../dtos/documentDto.js";
import {
  validateDocumentDTO,
  validateDocumentUpdateDTO,
} from "../validators/documentsValidator.js";
import { NotFoundError } from "../errors/customErrors.js";

/**
 * Create Document Controller
 * Accepts both Quotation and Invoice in unified format
 */
export const createDocumentController = async (req, res, next) => {
  try {
    const dto = createDocumentDTO(req.body);

    // Validate DTO based on document_type
    validateDocumentDTO(dto);

    const newDocument = await createDocumentService(dto);
    res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Documents Controller
 * Query parameters (PRIORITY):
 * 1. documentNumber - Get specific document by ID
 *    - Use 'type' or 'documentType' as the document type
 *    - Overrides all other filters
 * 2. type (REQUIRED): QUOTATION or INVOICE (without documentNumber)
 *    - clientId (OPTIONAL): Filter by client
 *    - startDate & endDate (OPTIONAL): Filter by date range
 */
export const getAllDocumentsController = async (req, res, next) => {
  try {
    const { documentType, documentNumber, type, clientId, startDate, endDate } = req.query;

    // PRIORITY 1: If documentNumber is provided, get by ID
    // Use documentType if provided, otherwise fall back to type
    if (documentNumber) {
      const docType = documentType || type;
      if (!docType) {
        return res
          .status(400)
          .json({ error: "documentType or type is required when documentNumber is provided" });
      }
      const document = await getDocumentByIdService(docType, documentNumber);
      return res.status(200).json(document);
    }

    // PRIORITY 2: Filter by type and optional filters
    // Type is mandatory when not using document ID
    if (!type) {
      return res
        .status(400)
        .json({ error: "Query parameter 'type' is required (QUOTATION or INVOICE)" });
    }

    const validTypes = ["QUOTATION", "INVOICE"];
    if (!validTypes.includes(type.toUpperCase())) {
      return res
        .status(400)
        .json({ error: "type must be QUOTATION or INVOICE" });
    }

    let documents;

    // All three filters provided (type, client ID, and date range)
    if (clientId && startDate && endDate) {
      documents = await getDocumentsByTypeAndClientIdAndDateRangeService(
        type,
        clientId,
        startDate,
        endDate
      );
    }
    // Only client ID provided
    else if (clientId) {
      documents = await getDocumentsByTypeAndClientIdService(type, clientId);
    }
    // Only date range provided
    else if (startDate && endDate) {
      documents = await getDocumentsByTypeAndDateRangeService(
        type,
        startDate,
        endDate
      );
    }
    // Only type provided
    else {
      documents = await getDocumentsByTypeService(type);
    }

    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Document Controller
 * Query: ?type=QUOTATION&documentNumber=WEB0020
 * Checks if document exists before updating
 */
export const updateDocumentController = async (req, res, next) => {
  try {
    const { type, documentNumber } = req.query;

    if (!type || !documentNumber) {
      return res
        .status(400)
        .json({ error: "Query parameters 'type' and 'documentNumber' are required" });
    }

    // Check if document exists before attempting to update
    await getDocumentByIdService(type, documentNumber);

    const dto = createDocumentDTO(req.body);

    // Validate update DTO based on document type
    validateDocumentUpdateDTO(dto, type);

    const updatedDocument = await updateDocumentService(type, documentNumber, dto);
    res.status(200).json(updatedDocument);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Document Controller
 * Query: ?type=QUOTATION&documentNumber=WEB0020
 */
export const deleteDocumentController = async (req, res, next) => {
  try {
    const { type, documentNumber } = req.query;

    if (!type || !documentNumber) {
      return res
        .status(400)
        .json({ error: "Query parameters 'type' and 'documentNumber' are required" });
    }

    await deleteDocumentService(type, documentNumber);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};



