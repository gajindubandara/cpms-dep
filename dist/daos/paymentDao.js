import ddbDocClient from "../config/dynamodb.js";
import { Payment } from "../models/paymentModel.js";
import {
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import { v4 as uuidv4 } from "uuid";

// Utility to remove undefined values from an object
function removeUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

// Create payment
export const createPayment = async (paymentData) => {
  const paymentId = uuidv4();
  const item = Payment.create({
    paymentId,
    ...paymentData,
  });

  if (!paymentData.projectId || !paymentData.clientId || !paymentData.amount) {
    throw new BadRequest("projectId, clientId, and amount are required");
  }

  if (item.Attributes) {
    item.Attributes = removeUndefined(item.Attributes);
  }

  const params = {
    TableName: "G2Labs-CPMS",
    Item: item,
  };

  await ddbDocClient.send(new PutCommand(params));
  return item;
};

// Get payment by ID
export const getPaymentById = async (paymentId, projectId) => {
  if (!paymentId || !projectId) {
    throw new BadRequest("paymentId and projectId are required");
  }

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `PAYMENT#${paymentId}`,
      SK: `PROJECT#${projectId}`,
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));
  if (!result.Item) {
    throw new NotFoundError("Payment not found");
  }
  return result.Item;
};

// Get all payments by projectId
export const getPaymentsByProjectId = async (projectId) => {
  if (!projectId) {
    throw new BadRequest("projectId is required");
  }

  // Use Scan with FilterExpression instead of GSI1 (which may not exist)
  const params = {
    TableName: "G2Labs-CPMS",
    FilterExpression: "begins_with(PK, :pk) AND Attributes.projectId = :projectId",
    ExpressionAttributeValues: {
      ":pk": "PAYMENT#",
      ":projectId": projectId,
    },
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items || [];
};

// Get all payments by clientId
export const getPaymentsByClientId = async (clientId) => {
  if (!clientId) {
    throw new BadRequest("clientId is required");
  }

  // Use Scan with FilterExpression to find payments by clientId
  const params = {
    TableName: "G2Labs-CPMS",
    FilterExpression: "begins_with(PK, :pk) AND Attributes.clientId = :clientId",
    ExpressionAttributeValues: {
      ":pk": "PAYMENT#",
      ":clientId": clientId,
    },
  };

  console.log('Querying payments with params:', JSON.stringify(params, null, 2)); // DEBUG
  
  const result = await ddbDocClient.send(new ScanCommand(params));
  
  console.log('Query returned items:', result.Items?.length || 0); // DEBUG
  if (result.Items && result.Items.length > 0) {
    console.log('Sample item:', JSON.stringify(result.Items[0], null, 2)); // DEBUG
  }
  
  return result.Items || [];
};

// Update payment
export const updatePayment = async (paymentId, projectId, updates) => {
  if (!paymentId || !projectId) {
    throw new BadRequest("paymentId and projectId are required");
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new BadRequest("No updates provided");
  }

  delete updates.paymentId;
  delete updates.projectId;
  delete updates.clientId;
  delete updates.PK;
  delete updates.SK;

  updates.updatedAt = new Date().toISOString();

  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const updateExpressions = [];

  // Update nested Attributes object to match data structure
  Object.entries(updates).forEach(([key, value]) => {
    ExpressionAttributeNames[`#Attributes`] = "Attributes";
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = value;
    updateExpressions.push(`#Attributes.#${key} = :${key}`);
  });

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `PAYMENT#${paymentId}`,
      SK: `PROJECT#${projectId}`,
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  console.log(`[updatePayment] Updating payment ${paymentId} with params:`, JSON.stringify(params, null, 2));
  const result = await ddbDocClient.send(new UpdateCommand(params));
  console.log(`[updatePayment] Update successful, returning:`, JSON.stringify(result.Attributes, null, 2));
  return result.Attributes;
};

// Delete payment
export const deletePayment = async (paymentId, projectId) => {
  if (!paymentId || !projectId) {
    throw new BadRequest("paymentId and projectId are required");
  }

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `PAYMENT#${paymentId}`,
      SK: `PROJECT#${projectId}`,
    },
  };

  await ddbDocClient.send(new DeleteCommand(params));
  return { message: "Payment deleted successfully" };
};

// Get all payments (admin view)
export const getAllPayments = async () => {
  const params = {
    TableName: "G2Labs-CPMS",
    FilterExpression: "begins_with(PK, :pk)",
    ExpressionAttributeValues: {
      ":pk": "PAYMENT#",
    },
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items || [];
};

export default {
  createPayment,
  getPaymentById,
  getPaymentsByProjectId,
  getPaymentsByClientId,
  updatePayment,
  deletePayment,
  getAllPayments,
};
