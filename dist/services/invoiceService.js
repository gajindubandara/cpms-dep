import {
    createInvoice,
    getInvoiceById,
    getAllInvoices,
    updateInvoice,
    deleteInvoice,
    getInvoicesByClientId,
    getInvoicesByDateRange
} from "../daos/invoiceDao.js";

import  { BadRequest } from "../errors/customErrors.js";
import {
    mapCreateInvoiceDtoToModel,
    mapUpdateInvoiceDTOtoInvoiceModel,
} from "../mappers/invoiceMapper.js";
import { getClientById } from "../daos/clientDao.js";
import { buildNotificationMessage, sendTelegramNotification } from "../config/telegramNotificationService.js";

// Helper function to map DynamoDB invoice to DTO and use pdfUrl directly from S3
const mapInvoiceToDTO = (invoice, fallbackInvoiceId = '') => {
    if (!invoice) return invoice;
    
    // Extract invoiceId from PK (format: INVOICE#id)
    const invoiceId = invoice.invoiceId || invoice.PK?.replace('INVOICE#', '') || invoice.Attributes?.invoiceId || fallbackInvoiceId;
    
    // Get attributes (might be at root level or in Attributes)
    const attrs = invoice.Attributes || invoice;
    
    return {
        invoiceId,
        clientId: attrs.clientId,
        clientName: attrs.clientName,
        clientEmail: attrs.clientEmail,
        projectId: attrs.projectId,
        projectName: attrs.projectName,
        description: attrs.description,
        amount: attrs.amount,
        invoiceDate: attrs.invoiceDate,
        items: attrs.items,
        s3Key: attrs.s3Key,
        pdfUrl: attrs.pdfUrl,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
    };
};

// Create Invoice Service
export const createInvoiceService = async (createInvoiceDTO) => {
    // Validate required fields before mapping
    if (!createInvoiceDTO.clientId) {
        throw new BadRequest("clientId is required");
    }
    if (!createInvoiceDTO.projectId) {
        throw new BadRequest("projectId is required");
    }
    const model = mapCreateInvoiceDtoToModel(createInvoiceDTO);
    const existClient = await getClientById(model.clientId);
    if (!existClient) {
        throw new BadRequest("Client with that id is not available");
    }
    const createdInvoice = await createInvoice(model);
    const dto = mapInvoiceToDTO(createdInvoice, model.invoiceId);
    void sendTelegramNotification(
        buildNotificationMessage('New invoice created', [
            `Invoice ID: ${dto.invoiceId}`,
            `Client: ${dto.clientName || 'Unknown'}`,
            `Amount: $${Number(dto.amount || 0).toFixed(2)}`,
        ])
    );
    return dto;
}   

// Get Invoice by ID Service
export const getInvoiceByIdService = async (invoiceId) => {
    const invoice = await getInvoiceById(invoiceId);
    return mapInvoiceToDTO(invoice);
}

// Get All Invoices Service
export const getAllInvoicesService = async () => {
    const invoices = await getAllInvoices();
    return invoices.map(mapInvoiceToDTO);
}

// Get Invoices by Client ID Service
export const getInvoicesByClientIdService = async (clientId) => {
    if (!clientId) throw new BadRequest("clientId is required");
    const invoices = await getInvoicesByClientId(clientId);
    
    // Map DynamoDB structure to DTO
    return invoices.map(mapInvoiceToDTO);
}

// Update Invoice Service
export const updateInvoiceService = async (invoiceId, updateInvoiceDTO, options = {}) => {
    if (!invoiceId) throw new BadRequest("invoiceId is required");
    const { notify = true } = options;
    const updates = mapUpdateInvoiceDTOtoInvoiceModel(updateInvoiceDTO);
    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    }
    const updatedInvoice = await updateInvoice(invoiceId, updates);
    const dto = mapInvoiceToDTO(updatedInvoice, invoiceId);
    if (notify) {
        void sendTelegramNotification(
            buildNotificationMessage('Invoice updated', [
                `Invoice ID: ${invoiceId}`,
                `Client: ${dto.clientName || 'Unknown'}`,
            ])
        );
    }
    return dto;
}

// Delete Invoice Service
export const deleteInvoiceService = async (invoiceId) => {
    if (!invoiceId) throw new BadRequest("invoiceId is required");
    const existingInvoice = await getInvoiceById(invoiceId);
    if (!existingInvoice) throw new BadRequest("Invoice not found");
    return await deleteInvoice(invoiceId);
};

// Get Invoices by Date Range Service
export const getInvoicesByDateRangeService = async (startDate, endDate) => {
    if (!startDate || !endDate) throw new BadRequest("startDate and endDate are required");
    const invoices = await getInvoicesByDateRange(startDate, endDate);
    return invoices.map(mapInvoiceToDTO);
};

