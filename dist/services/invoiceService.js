import {
    createInvoice,  
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} from "../daos/invoiceDao.js";

import  { BadRequest } from "../errors/customErrors.js";
import {
    mapCreateInvoiceDTOtoInvoiceModel,
    mapUpdateInvoiceDTOtoInvoiceModel,
} from "../mappers/invoiceMapper.js";
import { getClientById } from "../daos/clientDao.js";

// Create Invoice Service
export const createInvoiceService = async (createInvoiceDTO) => {
    // Validate required fields before mapping
    if (!createInvoiceDTO.clientId) {
        throw new BadRequest("clientId is required");
    }
    if (!createInvoiceDTO.projectId) {
        throw new BadRequest("projectId is required");
    }
    const model = mapCreateInvoiceDTOtoInvoiceModel(createInvoiceDTO);
    const existClient = await getClientById(model.clientId);
    if (!existClient) {
        throw new BadRequest("Client with that id is not available");
    }
    return await createInvoice(model);
}   

// Get Invoice by ID Service
export const getInvoiceByIdService = async (invoiceId) => {
    return await getInvoiceById(invoiceId);
}

// Get All Invoices Service
export const getAllInvoicesService = async () => {
    return await getAllInvoices();
}

// Update Invoice Service
export const updateInvoiceService = async (invoiceId, updateInvoiceDTO) => {
    if (!invoiceId) throw new BadRequest("invoiceId is required");
    const updates = mapUpdateInvoiceDTOtoInvoiceModel(updateInvoiceDTO);
    if (Object.keys(updates).length === 0) {
        throw new BadRequest("No valid fields to update");
    }
    return await updateInvoice(invoiceId, updates);
}

// Delete Invoice Service
export const deleteInvoiceService = async (invoiceId) => {
    if (!invoiceId) throw new BadRequest("invoiceId is required");
    const existingInvoice = await getInvoiceById(invoiceId);
    if (!existingInvoice) throw new BadRequest("Invoice not found");
    return await deleteInvoice(invoiceId);
};

