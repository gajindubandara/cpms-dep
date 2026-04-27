import ddbDocClient from "../config/dynamodb.js";
import { Document } from "../models/documentModel.js";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { BadRequest } from "../errors/customErrors.js";

/**
 * Check if document with same type and number already exists
 */
export const documentExists = async (documentType, documentNumber) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `${documentType.toUpperCase()}#${documentNumber}`,
      SK: documentType.toUpperCase(),
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));
  return result.Item ? true : false;
};

/**
 * Create document in DynamoDB
 */
export const createDocument = async (documentData) => {
  const { documentType, documentNumber, clientId, ...restData } = documentData;

  if (!documentType) {
    throw new BadRequest("documentType is required");
  }
  if (!documentNumber) {
    throw new BadRequest("documentNumber is required");
  }

  const item = Document.create({
    document_type: documentType,
    document_number: documentNumber,
    clientId,
    ...restData,
  });

  // Add timestamps inside Attributes
  const now = new Date().toISOString();
  if (!item.Attributes) {
    item.Attributes = {};
  }
  item.Attributes.createdAt = now;
  item.Attributes.updatedAt = now;

  // Remove undefined values from Attributes
  if (item.Attributes) {
    item.Attributes = Object.fromEntries(
      Object.entries(item.Attributes).filter(([_, v]) => v !== undefined)
    );
  }

  const params = {
    TableName: "G2Labs-CPMS",
    Item: item,
  };

  await ddbDocClient.send(new PutCommand(params));
  return item;
};

/**
 * Get document by documentType and documentNumber
 */
export const getDocumentById = async (documentType, documentNumber) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `${documentType.toUpperCase()}#${documentNumber}`,
      SK: documentType.toUpperCase(),
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));
  const item = result.Item;
  
  if (!item) return null;

  // Transform response to match desired format
  const response = {
    PK: item.PK,
    SK: item.SK,
    Attributes: item.Attributes || {},
  };

  // Add queryDate if it exists
  if (item.queryDate) {
    response.queryDate = item.queryDate;
  }

  // Add clientId if it exists
  if (item.clientId) {
    response.clientId = item.clientId;
  }

  return response;
};

/**
 * Update document
 */
export const updateDocument = async (documentType, documentNumber, updates) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");
  if (!updates || Object.keys(updates).length === 0) {
    throw new BadRequest("No updates provided");
  }

  // Extract queryDate if provided (it's a top-level attribute, not nested in Attributes)
  const queryDate = updates.queryDate;

  // Remove system fields
  delete updates.documentType;
  delete updates.documentNumber;
  delete updates.PK;
  delete updates.SK;
  delete updates.type;
  delete updates.queryDate;
  delete updates.createdAt; // Don't allow updating createdAt
  delete updates.updatedAt; // Will be set below

  // All updates go inside Attributes
  const ExpressionAttributeNames = { "#attrs": "Attributes" };
  const ExpressionAttributeValues = {};
  const UpdateExpressions = [];

  for (const [key, value] of Object.entries(updates)) {
    let nameKey = `#${key}`;
    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[`:${key}`] = value;
    UpdateExpressions.push(`#attrs.${nameKey} = :${key}`);
  }

  // Always update updatedAt inside Attributes
  const now = new Date().toISOString();
  ExpressionAttributeNames["#updatedAtKey"] = "updatedAt";
  ExpressionAttributeValues[":updatedAt"] = now;
  UpdateExpressions.push(`#attrs.#updatedAtKey = :updatedAt`);

  // If queryDate is being updated, add it as a top-level attribute
  if (queryDate) {
    ExpressionAttributeNames["#queryDate"] = "queryDate";
    ExpressionAttributeValues[":queryDate"] = queryDate;
    UpdateExpressions.push(`#queryDate = :queryDate`);
  }

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `${documentType.toUpperCase()}#${documentNumber}`,
      SK: documentType.toUpperCase(),
    },
    UpdateExpression: `SET ${UpdateExpressions.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await ddbDocClient.send(new UpdateCommand(params));
  return result.Attributes;
};

/**
 * Delete document
 */
export const deleteDocument = async (documentType, documentNumber) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!documentNumber) throw new BadRequest("documentNumber is required");

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `${documentType.toUpperCase()}#${documentNumber}`,
      SK: documentType.toUpperCase(),
    },
  };

  await ddbDocClient.send(new DeleteCommand(params));
};

/**
 * Get documents by document type (QUOTATION or INVOICE)
 */
export const getDocumentsByType = async (documentType) => {
  if (!documentType) throw new BadRequest("documentType is required");

  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    ExpressionAttributeNames: {
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":typeValue": documentType.toUpperCase(),
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

/**
 * Get documents by type and clientId
 */
export const getDocumentsByTypeAndClientId = async (
    documentType,
    clientId
) => {
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    FilterExpression: "clientId = :clientId",
    ExpressionAttributeNames: {
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":typeValue": documentType.toUpperCase(),
      ":clientId": `CLIENT#${clientId}`,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

/**
 * Get documents by type and date range
 */
export const getDocumentsByTypeAndDateRange = async (
  documentType,
  startDate,
  endDate
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!startDate || !endDate)
    throw new BadRequest("startDate and endDate are required");

  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    FilterExpression: "#queryDate BETWEEN :startDate AND :endDate",
    ExpressionAttributeNames: {
      "#type": "type",
      "#queryDate": "queryDate",
    },
    ExpressionAttributeValues: {
      ":typeValue": documentType.toUpperCase(),
      ":startDate": startDate,
      ":endDate": endDate,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

/**
 * Get documents by type, clientId, and date range
 */
export const getDocumentsByTypeAndClientIdAndDateRange = async (
  documentType,
  clientId,
  startDate,
  endDate
) => {
  if (!documentType) throw new BadRequest("documentType is required");
  if (!clientId) throw new BadRequest("clientId is required");
  if (!startDate || !endDate)
    throw new BadRequest("startDate and endDate are required");

  const formattedClientId = `CLIENT#${clientId}`;

  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    FilterExpression: "clientId = :clientId AND #queryDate BETWEEN :startDate AND :endDate",
    ExpressionAttributeNames: {
      "#type": "type",
      "#queryDate": "queryDate",
    },
    ExpressionAttributeValues: {
      ":typeValue": documentType.toUpperCase(),
      ":clientId": formattedClientId,
      ":startDate": startDate,
      ":endDate": endDate,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};


