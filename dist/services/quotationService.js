import {
    CreateQuotation,
    GetAllQuotations,
    GetQuotationById,
    UpdateQuotation,
    DeleteQuotation } from "../daos/quotationDao.js";

import {
    mapCreateQuotationDTOtoQuotationModel,
    mapUpdateQuotationDTOtoQuotationModel,} from "../mappers/quotationMapper.js";

import { BadRequest, NotFoundError } from "../errors/customErrors.js";

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
    return await CreateQuotation(model);
}

// Get Quotation by ID Service
export const getQuotationByIdService = async (quotationId) => {
    return await GetQuotationById(quotationId);
}

// Get All Quotations Service
export const getAllQuotationsService = async () => {
    return await GetAllQuotations();
}

// Update Quotation Service
export const updateQuotationService = async (quotationId, updateQuotationDTO) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const updates = mapUpdateQuotationDTOtoQuotationModel(updateQuotationDTO);

    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    } 
    return await UpdateQuotation(quotationId, updates);
}

// Delete Quotation Service
export const deleteQuotationService = async (quotationId) => {
    if (!quotationId) throw new BadRequest("quotationId is required");
    const existingQuotation = await GetQuotationById(quotationId);
    if (!existingQuotation) throw new NotFoundError("Quotation not found");
    return await DeleteQuotation(quotationId);
}