import {
    createInvoiceService,
    getInvoiceByIdService,
    getAllInvoicesService,
    updateInvoiceService,
    deleteInvoiceService,
    getInvoicesByClientIdService
} from "../services/invoiceService.js";
import { InvoiceDTO } from "../dtos/invoiceDto.js";
import {
    validateInvoiceDTO,
    validateInvoiceUpdateDTO,
} from "../validators/invoiceValidator.js";

// Create Invoice Controller
export const createInvoiceController = async (req, res, next) => {
    try {
        const createInvoiceDTO = new InvoiceDTO(req.body);
        validateInvoiceDTO(createInvoiceDTO);
        const newInvoice = await createInvoiceService(createInvoiceDTO);
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
        const updateInvoiceDTO = new InvoiceDTO(req.body);
        validateInvoiceUpdateDTO(updateInvoiceDTO);
        const updatedInvoice = await updateInvoiceService(invoiceId, updateInvoiceDTO);
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

