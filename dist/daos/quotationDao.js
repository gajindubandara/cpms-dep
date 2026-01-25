import { ddbDocClient } from "../config/dynamodb.js";
import { Quotation } from "../models/quotationModel.js";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequest } from "../errors/customErrors.js";

// Create Quotation
export const createQuotation = async (quotationData) => {
  const item = Quotation.create(quotationData);

  // Check for null/undefined quotationId
    if (!quotationData.quotationId) {
        const error = new Error("quotationId is required");
        error.statusCode = 400;
        throw error;
    } if (item.Attributes) {

    // Remove undefined values from Attributes
    item.Attributes = Object.fromEntries(
      Object.entries(item.Attributes).filter(([_, v]) => v !== undefined)
    );
  } const params = {
    TableName: "G2Labs-CPMS",
    Item: item,
    };
    await ddbDocClient.send(new PutCommand(params));
    return item;
};

// Get Quotation by ID
export const getQuotationById = async (quotationId) => {
  if (!quotationId) throw new BadRequest("Quotation Id is required");
    const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: Quotation.pk(quotationId),
      SK: Quotation.sk(),
    },
  };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
}

// Update Quotation
export const updateQuotation = async (quotationId, updates) => {
  if (!quotationId) throw new BadRequest("Quotation Id is required");
  if (!updates || Object.keys(updates).length === 0)
    throw new BadRequest("No updates provided");

    delete updates.quotationId;
    delete updates.PK;
    delete updates.SK;

    updates.updatedAt = new Date().toISOString();

    const ExpressionAttributeNames = {
    "#attrs": "Attributes",
  };
    const ExpressionAttributeValues = {};
    const updateParts = [];

    Object.keys(updates).forEach((key, index) => {
    const nameKey = `#attr${index}`;
    const valueKey = `:val${index}`;

// Nested attribute handling
    updateParts.push(`#attrs.${nameKey} = ${valueKey}`);
    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key];
  });

    const params = {
    TableName: "G2Labs-CPMS",
    Key: {
        PK: Quotation.pk(quotationId),
        SK: Quotation.sk(),
    },
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "attribute_exists(PK)",
    ReturnValues: "ALL_NEW",
  };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// Delete Quotation
export const deleteQuotation = async (quotationId) => {
  if (!quotationId) throw new BadRequest("Quotation Id is required");
    const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: Quotation.pk(quotationId),
      SK: Quotation.sk(), 
    },
        ConditionExpression: "attribute_exists(PK)",
        ReturnValues: "ALL_OLD",
  };
    const result = await ddbDocClient.send(new DeleteCommand(params));
    return result.Attributes;
}