import {
  createTicketService,
  getTicketsByTicketIdService,
  getAllTicketsService,
  deleteTicketService,
  getTicketsByQueryDateService,
  updateTicketMessageAsClientService,
  updateTicketAsAdminService,
  getTicketsByClientIdService
} from "../services/ticketService.js";

import { TicketDTO } from "../dtos/ticketDto.js";

// Controller to handle ticket creation
export const createTicketController = async (req, res) => {
  try {
    const dto = new TicketDTO(req.body);
    const ticket = await createTicketService(dto);
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error('Error in createTicketController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to get all tickets by ticketId
export const getTicketsByTicketIdController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const tickets = await getTicketsByTicketIdService(ticketId);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error('Error in getTicketsByTicketIdController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to get all tickets
export const getAllTicketsController = async (req, res) => {
  try {
    const tickets = await getAllTicketsService();
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error('Error in getAllTicketsController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to delete a ticket
export const deleteTicketController = async (req, res) => {
  try {
    const { clientId, ticketId } = req.params;
    const deleted = await deleteTicketService(clientId, ticketId);
    if (deleted) {
      res.status(200).json({ success: true, data: deleted, message: "Ticket deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Ticket not found" });
    }
  } catch (err) {
    console.error('Error in deleteTicketController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to get tickets by queryDate
export const getTicketsByQueryDateController = async (req, res) => {
  try {
    const { queryDate } = req.query;
    const tickets = await getTicketsByQueryDateService(queryDate);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error('Error in getTicketsByQueryDateController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to update ticket message as client
export const updateTicketMessageAsClientController = async (req, res) => {
  try {
    const { clientId, ticketId } = req.params;
    const dto = new TicketDTO(req.body);
    const updated = await updateTicketMessageAsClientService(clientId, ticketId, dto);
    res.status(200).json({ success: true, data: updated, message: "Ticket message updated successfully" });
  } catch (err) {
    console.error('Error in updateTicketMessageAsClientController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to update ticket as admin
export const updateTicketAsAdminController = async (req, res) => {
  try {
    const { clientId, ticketId } = req.params;
    const dto = new TicketDTO(req.body);
    const updated = await updateTicketAsAdminService(clientId, ticketId, dto);
    res.status(200).json({ success: true, data: updated, message: "Ticket updated as admin successfully" });
  } catch (err) {
    console.error('Error in updateTicketAsAdminController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controller to get tickets by clientId
export const getTicketsByClientIdController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const tickets = await getTicketsByClientIdService(clientId);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error('Error in getTicketsByClientIdController:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

