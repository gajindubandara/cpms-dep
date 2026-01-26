
import {
    createQuotationService,
    getQuotationByIdService,
    updateQuotationService,
    deleteQuotationService,
    getAllQuotationsService,
    getQuotationsByClientIdService,
} from "../services/quotationService.js";
import { validateQuotationDTO, validateQuotationUpdateDTO } from "../validators/quotationValidator.js";
import { QuotationDTO } from "../dtos/quotationDto.js";
import { NotFoundError } from "../errors/customErrors.js";

// Get Quotations by Client ID Controller
export const getQuotationsByClientIdController = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const quotations = await getQuotationsByClientIdService(clientId);
        res.status(200).json(quotations);
    } catch (error) {
        next(error);
    }
};

// Create Quotation Controller
export const createQuotationController = async (req, res, next) => {
    try {
        const createQuotationDTO = new QuotationDTO(req.body);
        const errors = validateQuotationDTO(createQuotationDTO);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const newQuotation = await createQuotationService(createQuotationDTO);
        res.status(201).json(newQuotation);
    } catch (error) {
        next(error);
    }
};

// Get Quotation by ID Controller
export const getQuotationByIdController = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        const quotation = await getQuotationByIdService(quotationId);
        if (!quotation) {
            throw new NotFoundError("Quotation not found");
        }
        res.status(200).json(quotation);
    } catch (error) {
        next(error);
    }
};

// Get All Quotations Controller
export const getAllQuotationsController = async (req, res, next) => {
    try {
        const quotations = await getAllQuotationsService();
        res.status(200).json(quotations);
    } catch (error) {
        next(error);
    }   
};

// Update Quotation Controller
export const updateQuotationController = async (req, res, next) => {
    try {
        const { quotationId } = req.params; 
        const updateQuotationDTO = new QuotationDTO(req.body);
        validateQuotationUpdateDTO(updateQuotationDTO);
        const updatedQuotation = await updateQuotationService(quotationId, updateQuotationDTO);
        res.status(200).json(updatedQuotation);
    } catch (error) {
        next(error);
    }
};

// Delete Quotation Controller
export const deleteQuotationController = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        await deleteQuotationService(quotationId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};