import {
  createClientService,
  updateClientService,
  getClientByIdService,
  getAllClientsService,
  getAllClientsByQueryDateService,
  deleteClientService,
} from "../services/clientService.js";
import { validateClientDTO } from "../validators/clientValidator.js";
import { ClientDTO } from "../dtos/clientDto.js";
import { NotFoundError } from "../errors/customErrors.js";

// create client
export const createClient = async (req, res, next) => {
  try {
    const dto = new ClientDTO(req.body);
    validateClientDTO(dto);
    const result = await createClientService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// update client
export const updateClient = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const dto = new ClientDTO(req.body);
    const result = await updateClientService(clientId, dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get client by id
export const getClientById = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const result = await getClientByIdService(clientId);

    if (!result) {
      throw new NotFoundError("Client not found");
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get all clients
export const getAllClients = async (req, res, next) => {
  try {
    const result = await getAllClientsService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get all clients by queryDate
export const getAllClientsByQueryDate = async (req, res, next) => {
  try {
    const queryDate = req.query.queryDate;
    const result = await getAllClientsByQueryDateService(queryDate);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// delete client
export const deleteClient = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const result = await deleteClientService(clientId);
    res.status(200).json({
      success: true,
      data: result,
      message: "Client deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
