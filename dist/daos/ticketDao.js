import ddbDocClient from "../config/dynamodb.js";
import { Ticket } from "../models/ticketModel.js";
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { BadRequest } from "../errors/customErrors.js";

// Internal helper to update ticket Attributes for a given clientId/ticketId
async function updateTicketAttributes(clientId, ticketId, updates) {
  if (!clientId || !ticketId) throw new BadRequest("clientId and ticketId are required");
  if (!updates || Object.keys(updates).length === 0) throw new BadRequest("No updates provided");

  updates.updatedAt = new Date().toISOString();

  const ExpressionAttributeNames = { "#attrs": "Attributes" };
  const ExpressionAttributeValues = {};
  const updateParts = [];

  Object.keys(updates).forEach((key, index) => {
    const nameKey = `#attr${index}`;
    const valueKey = `:val${index}`;
    updateParts.push(`#attrs.${nameKey} = ${valueKey}`);
    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key];
  });

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `CLIENT#${clientId}`,
      SK: `TICKET#${ticketId}`,
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

// Create Ticket DAO
export const createTicket = async (data) => {
  const ticketItem = Ticket.create(data);
  const params = {
    TableName: "G2Labs-CPMS",
    Item: {
      PK: ticketItem.PK,
      SK: ticketItem.SK,
      Attributes: ticketItem.Attributes,
      queryDate: ticketItem.queryDate
    }
  };
  await ddbDocClient.send(new PutCommand(params));
  return params.Item;
};

// Get all tickets by ticketId using GSI (SK as PK)
export const getTicketsByTicketId = async (ticketId) => {
  if (!ticketId) throw new BadRequest("ticketId is required");
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "ticketid-SK-index", // GSI with SK as partition key
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "SK"
    },
    ExpressionAttributeValues: {
      ":sk": `TICKET#${ticketId}`
    }
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

// Get all tickets by queryDate using GSI (queryDate as PK)
export const getTicketsByQueryDate = async (queryDate) => {
  if (!queryDate) throw new BadRequest("queryDate is required");
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "queryDate-SK-index", // GSI with queryDate as partition key and SK as sort key
    KeyConditionExpression: "#queryDate = :queryDate AND begins_with(#sk, :skPrefix)",
    ExpressionAttributeNames: {
      "#queryDate": "queryDate",
      "#sk": "SK"
    },
    ExpressionAttributeValues: {
      ":queryDate": queryDate,
      ":skPrefix": "TICKET#"
    }
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

// Get all tickets by queryDate range using QueryCommand with type-index
export const getTicketsByQueryDateRange = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new BadRequest("startDate and endDate are required");
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    FilterExpression: "#queryDate BETWEEN :startDate AND :endDate",
    ExpressionAttributeNames: {
      "#type": "type",
      "#queryDate": "queryDate"
    },
    ExpressionAttributeValues: {
      ":typeValue": "TICKET",
      ":startDate": startDate,
      ":endDate": endDate
    }
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

// Get all tickets (query using type-index)
export const getAllTickets = async () => {
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "type-index",
    KeyConditionExpression: "#type = :typeValue",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":typeValue": "TICKET"
    }
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

// Delete ticket by clientId and ticketId
export const deleteTicket = async (clientId, ticketId) => {
  if (!clientId || !ticketId) throw new BadRequest("clientId and ticketId are required");
  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: `CLIENT#${clientId}`,
      SK: `TICKET#${ticketId}`
    },
    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    ReturnValues: "ALL_OLD"
  };
  const result = await ddbDocClient.send(new DeleteCommand(params));
  return result.Attributes;
};

// Update ticket message as client
export const updateTicketMessageAsClient = async (clientId, ticketId, updates) => {
  return updateTicketAttributes(clientId, ticketId, updates);
};

// Update ticket status and adminResponse as admin
export const updateTicketAsAdmin = async (clientId, ticketId, updates) => {
  return updateTicketAttributes(clientId, ticketId, updates);
};

// Get all tickets by clientId
export const getTicketsByClientId = async (clientId) => {
  if (!clientId) throw new BadRequest("clientId is required");
  const params = {
    TableName: "G2Labs-CPMS",
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :skPrefix)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK"
    },
    ExpressionAttributeValues: {
      ":pk": `CLIENT#${clientId}`,
      ":skPrefix": "TICKET#"
    }
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};