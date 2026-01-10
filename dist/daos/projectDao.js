import ddbDocClient from "../config/dynamodb.js";
import { Project } from "../models/projectModel.js";
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

//crerate new project
export const createProject = async (projectData) => {
  const item = Project.create(projectData);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
  return item;
};

//project by projectId
export const getProjectById = async (projectId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: "SK-index",
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": `PROJECT#${projectId}#FEATURE#${0}`,
    },
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items;
};

//features by id(both project and feature comes handle it somehow)
export const featAll = async (clientId, projectId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND  begins_with(#sk, :skPrefix)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": `CLIENT#${clientId}`,
      ":skPrefix": `PROJECT#${projectId}`,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

//projects and features by clientID
export const projectByClientId = async (clidentId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :skPreFix)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": `CLIENT#${clidentId}`,
      ":skPreFix": "PROJECT#",
    },
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items || [];
};

//get feature by feature id
export const featureByFeatId = async (projectId, featureId) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: "SK-index",
    KeyConditionExpression: "#sk = :sk",
    ExpressionAttributeNames: {
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": `PROJECT#${projectId}#FEATURE#${featureId}`,
    },
  };
  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items;
};

//get all projects
export const allProjects = async () => {
  const params = {
    TableName: process.env.TABLE_NAME,
    FilterExpression: "begins_with(#sk,:skPreFix)",
    ExpressionAttributeNames: {
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":skPreFix": "PROJECT#",
    },
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items || [];
};

//projects by queryDate
export const projectsByQueryDate = async (queryDate) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: "queryDate-SK-index",
    KeyConditionExpression:
      "#queryDate = :queryDate AND begins_with(#sk,:skPreFix)",
    ExpressionAttributeNames: {
      "#queryDate": "queryDate",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":queryDate": queryDate,
      ":skPreFix": `PROJECT#`,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items;
};

//update project
export const updateProject = async (clientId, projectId, updates) => {
  if (!projectId) throw new Error("ProjectId Required");
  if (!updates || Object.keys(updates).length === 0)
    throw new Error("updates Required");

  //deleting indexing keys
  delete updates.projectId;
  delete updates.PK;
  delete updates.SK;

  updates.updatedAt = new Date().toISOString();

  const ExpressionAttributeNames = {
    "#attr": "Attributes",
  };
  const ExpressionAttributeValues = {};
  const updateParts = [];

  Object.keys(updates).forEach((key, index) => {
    const nameKey = `#key${index}`;
    const valueKey = `:val${index}`;

    // Build nested attribute path: Attributes.fieldName
    updateParts.push(`#attr.${nameKey} = ${valueKey}`);

    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key];
  });

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: Project.pk(clientId),
      SK: Project.sk(projectId, 0),
    },
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    ReturnValues: "ALL_NEW",
  };

  const result = await ddbDocClient.send(new UpdateCommand(params));
  return result.Attributes;
};

//update feature
export const updateFeature = async (clientId, projectId, featureId, updates) => {
  if (!projectId) throw new Error("ProjectId Required");
  if (!updates || Object.keys(updates).length === 0)
    throw new Error("updates Required");

  //deleting indexing keys
  delete updates.projectId;
  delete updates.PK;
  delete updates.SK;

  updates.updatedAt = new Date().toISOString();

  const ExpressionAttributeNames = {
    "#attr": "Attributes",
  };
  const ExpressionAttributeValues = {};
  const updateParts = [];

  Object.keys(updates).forEach((key, index) => {
    const nameKey = `#key${index}`;
    const valueKey = `:val${index}`;

    // Build nested attribute path: Attributes.fieldName
    updateParts.push(`#attr.${nameKey} = ${valueKey}`);

    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key];
  });

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: Project.pk(clientId),
      SK: Project.sk(projectId, featureId),
    },
    UpdateExpression: `SET ${updateParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "attribute_exists(PK) AND attribute_exists(SK)",
    ReturnValues: "ALL_NEW",
  };

  const result = await ddbDocClient.send(new UpdateCommand(params));
  return result.Attributes;
};

//delete project
export const deleteProject = async (clientId, projectId) => {
  if (!clientId) throw new Error("Client id is required");
  if (!projectId) throw new Error("Project id is required");

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: Project.pk(clientId),
      SK: Project.sk(projectId, 0),
    },
    ReturnValues: "ALL_OLD",
  };

  const result = await ddbDocClient.send(new DeleteCommand(params));
  if(!result.Attributes){
    throw new Error("Could not find item with that id")
  }
  return result.Attributes;
};

//delete feature
export const deleteFeature = async (clientId, projectId, featureId) => {
  if (!projectId || !clientId || !featureId) throw new Error("Project id is required");

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: Project.pk(clientId),
      SK: Project.sk(projectId, featureId),
    },
    ReturnValues: "ALL_OLD",
  };
  const result = await ddbDocClient.send(new DeleteCommand(params));
  if(!result.Attributes){
    throw new Error("Could not find item with that id")
  }
  return result.Attributes;
};
