import {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    getQuotationsByClientId,
    getQuotationsByDateRange
} from "../daos/quotationDao.js";
import {
    mapCreateQuotationDTOtoQuotationModel,
    mapAdminUpdateQuotationDTOtoQuotationModel} from "../mappers/quotationMapper.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import { getClientById } from "../daos/clientDao.js";
import { buildNotificationMessage, sendTelegramNotification } from "../config/telegramNotificationService.js";

// Helper function to map quotation to DTO using S3 URL directly
const mapQuotationToDTO = (quotation, fallbackQuotationId = '') => {
    if (!quotation) return quotation;
    
    // Get attributes (might be at root level or in Attributes)
    const attrs = quotation.Attributes || quotation;
    const quotationId = quotation.quotationId || quotation.PK?.replace('QUOTATION#', '') || attrs.quotationId || fallbackQuotationId;
    
    return {
        quotationId,
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
        const dto = mapQuotationToDTO(createdQuotation, model.quotationId);
        void sendTelegramNotification(
            buildNotificationMessage('New quotation created', [
                `Quotation ID: ${dto.quotationId}`,
                `Client: ${dto.clientName || 'Unknown'}`,
                `Grand Total: $${Number(dto.grandTotal || 0).toFixed(2)}`,
            ])
        );
        return dto;
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
export const updateQuotationService = async (quotationId, updateQuotationDTO, options = {}) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const { notify = true } = options;
    const updates = mapAdminUpdateQuotationDTOtoQuotationModel(updateQuotationDTO);

    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    } 
    const updatedQuotation = await updateQuotation(quotationId, updates);
        const dto = mapQuotationToDTO(updatedQuotation, quotationId);
        if (notify) {
            void sendTelegramNotification(
                buildNotificationMessage('Quotation updated', [
                    `Quotation ID: ${quotationId}`,
                    `Client: ${dto.clientName || 'Unknown'}`,
                ])
            );
        }
        return dto;
}

// Delete Quotation Service
export const deleteQuotationService = async (quotationId) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const existingQuotation = await getQuotationById(quotationId);
    if (!existingQuotation) throw new NotFoundError("Quotation not found");
    return await deleteQuotation(quotationId);
}

// Get Quotations by Date Range Service
export const getQuotationsByDateRangeService = async (startDate, endDate) => {
    if (!startDate || !endDate) throw new BadRequest("startDate and endDate are required");
    const quotations = await getQuotationsByDateRange(startDate, endDate);
    return quotations.map(mapQuotationToDTO);
}