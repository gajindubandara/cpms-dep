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

import { v4 as uuidv4 } from "uuid";

//create client
export const createClientService = async (createClientDTO) => {
  const clientId = uuidv4();

  const model = mapCreateClientDTOtoClientModel(createClientDTO);
  // Check if email already exists
  if (model.email) {
    const existingClient = await getClientByEmail(model.email);
    if (existingClient) {
      throw new Error("Email already exists");
    }
  }

  return await createClient({
    ...model,
    clientId,
  });
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
