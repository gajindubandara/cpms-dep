import ddbDocClient from "../config/dynamodb.js";
import { Client } from "../models/clientModel.js";
import {
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { BadRequest } from "../errors/customErrors.js";

// Utility to remove undefined values from an object
function removeUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

// create client
export const createClient = async (clientData) => {
  const item = Client.create(clientData);
  // Check for null/undefined clientId
  if (!clientData.clientId) {
    const error = new Error("clientId is required");
    error.statusCode = 400;
    throw error;
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


export const updateClient = async (clientId, updates) => {
  if (!clientId) throw new BadRequest("Client Id is required");
  if (!updates || Object.keys(updates).length === 0)
    throw new BadRequest("No updates provided");

  delete updates.clientId;
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

    // nested attribute handling
    updateParts.push(`#attrs.${nameKey} = ${valueKey}`);

    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key];
  });

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: Client.pk(clientId),
      SK: Client.sk(),
    },
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "attribute_exists(PK)",
    ReturnValues: "ALL_NEW",
  };

  const result = await ddbDocClient.send(new UpdateCommand(params));
  return result.Attributes;
};

// get client by id
export const getClientById = async (clientId) => {
  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: Client.pk(clientId),
      SK: Client.sk(),
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));
  return result.Item;
};

// get all clients
export const getAllClients = async () => {
  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "SK-index", //GSI and sk as partition key
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": "CLIENT",
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

// get all clients by queryDate (creation date)
export const getAllClientsByQueryDate = async (queryDate) => {
  if (!queryDate) throw new BadRequest("queryDate is required");

  const params = {
    TableName: "G2Labs-CPMS",
    IndexName: "queryDate-SK-index", // queryDate as GSI partition with sk
    KeyConditionExpression: "#queryDate = :queryDate AND #sk = :sk",
    ExpressionAttributeNames: {
      "#queryDate": "queryDate",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":queryDate": queryDate,
      ":sk": "CLIENT",
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items;
};

// delete client
export const deleteClient = async (clientId) => {
  if (!clientId) throw new BadRequest("Client Id is required");

  const params = {
    TableName: "G2Labs-CPMS",
    Key: {
      PK: Client.pk(clientId),
      SK: Client.sk(),
    },
    ConditionExpression: "attribute_exists(PK)",
    ReturnValues: "ALL_OLD",
  };

  const result = await ddbDocClient.send(new DeleteCommand(params));
  return result.Attributes;
};
