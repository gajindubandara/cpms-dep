
import {
    createQuotationService,
    getQuotationByIdService,
    updateQuotationService,
    deleteQuotationService,
    getAllQuotationsService,
    getQuotationsByClientIdService,
} from "../services/quotationService.js";
import { createQuotationDTO } from "../dtos/quotationDto.js";
import { validateQuotationDTO, validateQuotationUpdateDTO } from "../validators/documentValidator.js";
import { NotFoundError } from "../errors/customErrors.js";
import { uploadPDFToCloudinary } from "../config/cloudinary.js";

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

// Upload Quotation PDF to Cloudinary
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

        // Upload PDF to Cloudinary
        const fileName = `quotation-${quotationId}`; // Without extension, we specify format separately
        const folderName = 'quotations';
        const cloudinaryResponse = await uploadPDFToCloudinary(
            req.file.buffer,
            fileName,
            folderName
        );

        // Update quotation with Cloudinary ID and PDF URL
        const updateData = {
            cloudinaryId: cloudinaryResponse.public_id,
            pdfUrl: cloudinaryResponse.secure_url,
        };
        
        const updatedQuotation = await updateQuotationService(quotationId, updateData);

        res.status(200).json({
            message: 'Quotation PDF uploaded successfully',
            cloudinaryId: cloudinaryResponse.public_id,
            pdfUrl: cloudinaryResponse.secure_url,
            quotation: updatedQuotation,
        });
    } catch (error) {
        next(error);
    }
};