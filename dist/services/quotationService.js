import {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    getQuotationsByClientId
} from "../daos/quotationDao.js";
import {
    mapCreateQuotationDTOtoQuotationModel,
    mapAdminUpdateQuotationDTOtoQuotationModel} from "../mappers/quotationMapper.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import { getClientById } from "../daos/clientDao.js";

// Helper function to map quotation to DTO using S3 URL directly
const mapQuotationToDTO = (quotation) => {
    if (!quotation) return quotation;
    
    // Get attributes (might be at root level or in Attributes)
    const attrs = quotation.Attributes || quotation;
    
    return {
        quotationId: quotation.quotationId,
        clientId: attrs.clientId,
        clientName: attrs.clientName,
        clientEmail: attrs.clientEmail,
        projectId: attrs.projectId,
        projectName: attrs.projectName,
        description: attrs.description,
        projectCost: attrs.projectCost,
        amount: attrs.amount,
        discount: attrs.discount,
        discountAmount: attrs.discountAmount,
        grandTotal: attrs.grandTotal,
        quotationDate: attrs.quotationDate,
        featureName: attrs.featureName,
        featureCost: attrs.featureCost,
        s3Key: attrs.s3Key,
        pdfUrl: attrs.pdfUrl,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
    };
};


// Create Quotation Service
export const createQuotationService = async (createQuotationDTO) => {
    // Validate required fields before mapping
    if (!createQuotationDTO.clientId) {
        throw new BadRequest("clientId is required");  
    }

    // Ensure projectId is mapped in the model
    if (!createQuotationDTO.projectId) {
        throw new BadRequest("projectId is required");
    }
    const model = mapCreateQuotationDTOtoQuotationModel(createQuotationDTO);
          const existClient = await getClientById(model.clientId);
      if (!existClient) {
        throw new NotFoundError("Client with that id is not available");
      }

    const createdQuotation = await createQuotation(model);
    return mapQuotationToDTO(createdQuotation);
}

// Get Quotation by ID Service
export const getQuotationByIdService = async (quotationId) => {
    const quotation = await getQuotationById(quotationId);
    return mapQuotationToDTO(quotation);
}

// Get All Quotations Service
export const getAllQuotationsService = async () => {
    const quotations = await getAllQuotations();
    return quotations.map(mapQuotationToDTO);
}

// Get Quotations by Client ID Service
export const getQuotationsByClientIdService = async (clientId) => {
    if (!clientId) throw new BadRequest("clientId is required");
    const quotations = await getQuotationsByClientId(clientId);
    
    // Map quotations to DTO and add pdfUrl
    return quotations.map(mapQuotationToDTO);
}

// Update Quotation Service
export const updateQuotationService = async (quotationId, updateQuotationDTO) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const updates = mapAdminUpdateQuotationDTOtoQuotationModel(updateQuotationDTO);

    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    } 
    const updatedQuotation = await updateQuotation(quotationId, updates);
    return mapQuotationToDTO(updatedQuotation);
}

// Delete Quotation Service
export const deleteQuotationService = async (quotationId) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const existingQuotation = await getQuotationById(quotationId);
    if (!existingQuotation) throw new NotFoundError("Quotation not found");
    return await deleteQuotation(quotationId);
}