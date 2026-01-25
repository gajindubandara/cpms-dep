import {
    createQuotation,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    getAllQuotations,
} from "../services/quotationService.js";
import { validateQuotationDTO } from "../validators/quotationValidator.js";
import { QuotationDTO } from "../dtos/quotationDto.js";
import { NotFoundError } from "../errors/customErrors.js";

// Create Quotation Controller
export const createQuotationController = async (req, res, next) => {
    try {
        const createQuotationDTO = new QuotationDTO(req.body);
        const errors = validateQuotationDTO(createQuotationDTO);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const newQuotation = await createQuotation(createQuotationDTO);
        res.status(201).json(newQuotation);
    } catch (error) {
        next(error);
    }
};

// Get Quotation by ID Controller
export const getQuotationByIdController = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        const quotation = await getQuotationById(quotationId);
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
        const quotations = await getAllQuotations();
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
        const errors = validateQuotationDTO(updateQuotationDTO);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const updatedQuotation = await updateQuotation(quotationId, updateQuotationDTO);
        res.status(200).json(updatedQuotation);
    } catch (error) {
        next(error);
    }
};

// Delete Quotation Controller
export const deleteQuotationController = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        await deleteQuotation(quotationId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};