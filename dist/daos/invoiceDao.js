import ddbDocClient from "../config/dynamodb"; 
import { Invoice } from "../models/invoiceModel.js";
import {
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { BadRequest } from "../errors/customErrors.js";

// Create Invoice
export const createInvoice = async (invoiceData) => {
    const item = Invoice.create(invoiceData);
    // Check for null/undefined invoiceId
    if (!invoiceData.invoiceId) {
        const error = new Error("invoiceId is required");
        error.statusCode = 400;
        throw error;
    }   if (item.Attributes) {
        // Remove undefined values from Attributes
        item.Attributes = Object.fromEntries(
            Object.entries(item.Attributes).filter(([_, v]) => v !== undefined)
        );
    }   const params = {
        TableName: "G2Labs-CPMS",
        Item: item, 
    };
    await ddbDocClient.send(new PutCommand(params));
    return item;
};

// Get Invoice by ID
export const getInvoiceById = async (invoiceId) => {
    if (!invoiceId) throw new BadRequest("Invoice Id is required");
    const params = {
        TableName: "G2Labs-CPMS",
        Key: {
            PK: Invoice.pk(invoiceId),
            SK: Invoice.sk(),
        },  
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
};

// Update Invoice
export const updateInvoice = async (invoiceId, updates) => {
    if (!invoiceId) throw new BadRequest("Invoice Id is required");
    if (!updates || Object.keys(updates).length === 0)
        throw new BadRequest("No updates provided");
    delete updates.invoiceId;
    delete updates.PK;
    delete updates.SK;
    updates.updatedAt = new Date().toISOString();
    // All updates go inside Attributes
    const ExpressionAttributeNames = { "#attrs": "Attributes" };
    const ExpressionAttributeValues = {};
    const UpdateExpressions = [];   
    for (const [key, value] of Object.entries(updates)) {
        ExpressionAttributeValues[`:${key}`] = value;
        UpdateExpressions.push(`#attrs.${key} = :${key}`);
    }   const params = {
        TableName: "G2Labs-CPMS",
        Key: {
            PK: Invoice.pk(invoiceId),
            SK: Invoice.sk(),
        },  
        UpdateExpression: `SET ${UpdateExpressions.join(", ")}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };  
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
};

// Delete Invoice
export const deleteInvoice = async (invoiceId) => {
    if (!invoiceId) throw new BadRequest("Invoice Id is required");
    const params = {    
        TableName: "G2Labs-CPMS",
        Key: {
            PK: Invoice.pk(invoiceId),
            SK: Invoice.sk(),
        },  
    };  
    await ddbDocClient.send(new DeleteCommand(params));
};

//Get All Invoices
export const getAllInvoices = async () => {
    const params = {
        TableName: "G2Labs-CPMS",
        FilterExpression: "begins_with(PK, :pkPrefix)",
        ExpressionAttributeValues: {
            ":pkPrefix": "INVOICE#",
        },
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items;
}