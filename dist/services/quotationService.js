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

// Helper function to generate PDF URL from cloudinaryId
const generatePdfUrl = (cloudinaryId) => {
    if (!cloudinaryId) return null;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${cloudinaryId}.pdf`;
};

// Helper function to add pdfUrl to quotation
const enrichQuotationWithPdfUrl = (quotation) => {
    if (!quotation) return quotation;
    
    // Try to get cloudinaryId from multiple possible locations
    const cloudinaryId = quotation.cloudinaryId || quotation.Attributes?.cloudinaryId;
    
    return {
        ...quotation,
        pdfUrl: generatePdfUrl(cloudinaryId)
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

    return await createQuotation(model);
}

// Get Quotation by ID Service
export const getQuotationByIdService = async (quotationId) => {
    const quotation = await getQuotationById(quotationId);
    return enrichQuotationWithPdfUrl(quotation);
}

// Get All Quotations Service
export const getAllQuotationsService = async () => {
    const quotations = await getAllQuotations();
    return quotations.map(enrichQuotationWithPdfUrl);
}

// Get Quotations by Client ID Service
export const getQuotationsByClientIdService = async (clientId) => {
    if (!clientId) throw new BadRequest("clientId is required");
    const quotations = await getQuotationsByClientId(clientId);
    
    // Add pdfUrl to each quotation
    return quotations.map(enrichQuotationWithPdfUrl);
}

// Update Quotation Service
export const updateQuotationService = async (quotationId, updateQuotationDTO) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const updates = mapAdminUpdateQuotationDTOtoQuotationModel(updateQuotationDTO);

    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    } 
    return await updateQuotation(quotationId, updates);
}

// Delete Quotation Service
export const deleteQuotationService = async (quotationId) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const existingQuotation = await getQuotationById(quotationId);
    if (!existingQuotation) throw new NotFoundError("Quotation not found");
    return await deleteQuotation(quotationId);
}