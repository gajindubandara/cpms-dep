import {
  createClient,
  updateClient,
  getClientById,
  getAllClients,
  getAllClientsByQueryDate,
  getClientByEmail,
  deleteClient,
} from "../daos/clientDao.js";
import {
  projectByClientId,
  deleteFeature,
  deleteProject,
} from "../daos/projectDao.js";
import {
  mapCreateClientDTOtoClientModel,
  mapUpdateClientDTOtoClientModel,
} from "../mappers/clientMapper.js";

import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

//create client
export const createClientService = async (createClientDTO) => {
  const model = mapCreateClientDTOtoClientModel(createClientDTO);

  // Check if email already exists in DB
  if (model.email) {
    const existingClient = await getClientByEmail(model.email);
    if (existingClient) {
      throw new Error("Email already exists");
    }
  }
  // Create user in Cognito
  const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION_NAME });
  const password = Math.random().toString(36).slice(-10) + "!Aa1"; // simple random password
  try {
    await cognito.send(new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: model.email,
      UserAttributes: [
        { Name: "email", Value: model.email },
        { Name: "email_verified", Value: "true" }
      ],
      TemporaryPassword: password
      // Removed MessageAction: 'SUPPRESS' to enable default invitation email
    }));
  } catch (err) {
    if (err.name === "UsernameExistsException") {
      throw new Error("User already exists in Cognito");
    }
    throw new Error("Failed to create user in Cognito: " + err.message);
  }

  // Confirm user exists in Cognito and get sub
  let cognitoSub = null;
  try {
    const getUserResp = await cognito.send(new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: model.email
    }));
    const subAttr = getUserResp.UserAttributes.find(attr => attr.Name === "sub");
    cognitoSub = subAttr ? subAttr.Value : null;
  } catch (err) {
    throw new Error("User not found in Cognito after creation");
  }
  // Set clientId to Cognito sub
  const clientId = cognitoSub;
  // Create client in DB
  const createdClient = await createClient({
    ...model,
    clientId,
    cognitoPassword: password // Optionally store the generated password
  });

  // Return both client and Cognito sub
  return {
    ...createdClient,
    cognitoSub
  };
};


//update client
export const updateClientService = async (clientId, updateClientDTO) => {
  if (!clientId) throw new Error("clientId is required");

  const updates = mapUpdateClientDTOtoClientModel(updateClientDTO);

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields to update");
  }

  return await updateClient(clientId, updates);
};

//get client by id
export const getClientByIdService = async (clientId) => {
  if (!clientId) throw new Error("clientId is required");

  return await getClientById(clientId);
};

//get all clients
export const getAllClientsService = async () => {
  return await getAllClients();
};

//get all clients by queryDate
export const getAllClientsByQueryDateService = async (queryDate) => {
  if (!queryDate) throw new Error("queryDate is required");

  return await getAllClientsByQueryDate(queryDate);
};

//delete client
export const deleteClientService = async (clientId) => {
  if (!clientId) throw new Error("clientId is required");
  const projects = await projectByClientId(clientId);

  for (const element of projects) {
    const parts = element.SK.split("#");
    const featureId = parts[3];

    if (featureId !== "0") {
      await deleteFeature(
        clientId,
        element.SK.split("#")[1],
        element.SK.split("#")[3]
      );
    } else {
      await deleteProject(clientId, element.SK.split("#")[1]);
    }
  }
  return await deleteClient(clientId);
};
