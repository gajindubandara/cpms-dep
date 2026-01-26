import {
    createInvoice,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} from "../daos/invoiceDao.js";
import { BadRequest } from "../errors/customErrors.js";
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
        const newInvoice = await createInvoice(createInvoiceDTO);
        res.status(201).json(newInvoice);
    } catch (error) {
        next(error);
    }
};

// Get Invoice by ID Controller
export const getInvoiceByIdController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await getInvoiceById(invoiceId);
        if (!invoice) {
            throw new BadRequest("Invoice not found");
        }      res.status(200).json(invoice);
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
        const updatedInvoice = await updateInvoice(invoiceId, updateInvoiceDTO);
        res.status(200).json(updatedInvoice);
    } catch (error) {
        next(error);
    }
};

// Delete Invoice Controller
export const deleteInvoiceController = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        await deleteInvoice(invoiceId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Get All Invoices Controller
export const getAllInvoicesController = async (req, res, next) => {
    try {
        const invoices = await getAllInvoices();
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    } 
};

