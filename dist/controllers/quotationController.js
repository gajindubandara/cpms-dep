
import {
    createQuotationService,
    getQuotationByIdService,
    updateQuotationService,
    deleteQuotationService,
    getAllQuotationsService,
    getQuotationsByClientIdService,
    getQuotationsByDateRangeService,
} from "../services/quotationService.js";
import { createQuotationDTO } from "../dtos/quotationDto.js";
import { validateQuotationDTO, validateQuotationUpdateDTO } from "../validators/documentValidator.js";
import { NotFoundError } from "../errors/customErrors.js";
import { uploadQuotationPDFToS3 } from "../config/s3config.js";

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
            const dto = createQuotationDTO(req.body);
            const errors = validateQuotationDTO(dto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            const newQuotation = await createQuotationService(dto);
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
        const updateQuotationDTO = createQuotationDTO(req.body);
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

// Get Quotations by Date Range Controller
export const getQuotationsByDateRangeController = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const quotations = await getQuotationsByDateRangeService(startDate, endDate);
        res.status(200).json(quotations);
    } catch (error) {
        next(error);
    }
};

// Upload Quotation PDF to S3
export const uploadQuotationPDFController = async (req, res, next) => {
    try {
        const { quotationId } = req.params;
        
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }

        // Check if quotation exists
        const quotation = await getQuotationByIdService(quotationId);
        if (!quotation) {
            throw new NotFoundError('Quotation not found');
        }

        // Upload PDF to S3
        const fileName = `quotation-${quotationId}.pdf`;
        const s3Response = await uploadQuotationPDFToS3({
            fileBuffer: req.file.buffer,
            fileName: fileName,
            mimeType: 'application/pdf'
        });

        // Update quotation with S3 URL
        const updateData = {
            s3Key: s3Response.key,
            pdfUrl: s3Response.url,
        };
        
        const updatedQuotation = await updateQuotationService(quotationId, updateData);

        res.status(200).json({
            message: 'Quotation PDF uploaded successfully',
            s3Key: s3Response.key,
            pdfUrl: s3Response.url,
            quotation: updatedQuotation,
        });
    } catch (error) {
        next(error);
    }
};