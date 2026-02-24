import {
    createInvoiceService,
    getInvoiceByIdService,
    getAllInvoicesService,
    updateInvoiceService,
    deleteInvoiceService,
    getInvoicesByClientIdService
} from "../services/invoiceService.js";
import { createInvoiceDTO } from "../dtos/invoiceDto.js";
import {
    validateInvoiceDTO,
    validateInvoiceUpdateDTO,
} from "../validators/documentValidator.js";
import { NotFoundError } from "../errors/customErrors.js";
import { uploadPDFToCloudinary } from "../config/cloudinary.js";

// Create Invoice Controller
export const createInvoiceController = async (req, res, next) => {
    try {
        const dto = createInvoiceDTO(req.body);
        const errors = validateInvoiceDTO(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const newInvoice = await createInvoiceService(dto);
        res.status(201).json(newInvoice);
    } catch (error) {
        next(error);
    }
};

// Get Invoice by ID Controller
export const getInvoiceByIdController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await getInvoiceByIdService(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

// Update Invoice Controller
export const updateInvoiceController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        const dto = createInvoiceDTO(req.body);
        validateInvoiceUpdateDTO(dto);
        const updatedInvoice = await updateInvoiceService(invoiceId, dto);
        res.status(200).json(updatedInvoice);
    } catch (error) {
        next(error);
    }
};

// Delete Invoice Controller
export const deleteInvoiceController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        await deleteInvoiceService(invoiceId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Get All Invoices Controller
export const getAllInvoicesController = async (req, res, next) => {
    try {
        const invoices = await getAllInvoicesService();
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

// Get Invoices by Client ID Controller
export const getInvoicesByClientIdController = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const invoices = await getInvoicesByClientIdService(clientId);
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

// Upload Invoice PDF to Cloudinary
export const uploadInvoicePDFController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }

        // Check if invoice exists
        const invoice = await getInvoiceByIdService(invoiceId);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        // Upload PDF to Cloudinary
        const fileName = `invoice-${invoiceId}`; // Without extension, we specify format separately
        const folderName = 'invoices';
        const cloudinaryResponse = await uploadPDFToCloudinary(
            req.file.buffer,
            fileName,
            folderName
        );

        // Update invoice with Cloudinary ID and PDF URL
        const updateData = {
            cloudinaryId: cloudinaryResponse.public_id,
            pdfUrl: cloudinaryResponse.secure_url,
        };
        
        const updatedInvoice = await updateInvoiceService(invoiceId, updateData);

        res.status(200).json({
            message: 'Invoice PDF uploaded successfully',
            cloudinaryId: cloudinaryResponse.public_id,
            pdfUrl: cloudinaryResponse.secure_url,
            invoice: updatedInvoice,
        });
    } catch (error) {
        next(error);
    }
};

