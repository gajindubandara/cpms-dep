import {
  createClientService,
  updateClientService,
  getClientByIdService,
  getAllClientsService,
  getAllClientsByQueryDateService,
  deleteClientService,
} from "../services/clientService.js";

import { ClientDTO } from "../dtos/clientDto.js";

// create client
export const createClient = async (req, res) => {
  try {
    const dto = new ClientDTO(req.body);
    const result = await createClientService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update client
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const dto = new ClientDTO(req.body);
    const result = await updateClientService(clientId, dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get client by id 
export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const result = await getClientByIdService(clientId);
    if(result){
      res.status(200).json({ success: true, data: result });
    }else{
      res.status(404).json({ message: "Client not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all clients
export const getAllClients = async (req, res) => {
  try {
    const result = await getAllClientsService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all clients by queryDate
export const getAllClientsByQueryDate = async (req, res) => {
  try {
    const queryDate = req.query.queryDate;
    const result = await getAllClientsByQueryDateService(queryDate);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete client
export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const result = await deleteClientService(clientId);
    res.status(200).json({ success: true, data: result, message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
