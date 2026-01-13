import {
  createTicketService,
  getTicketsByTicketIdService,
  getAllTicketsService,
  deleteTicketService,
  getTicketsByQueryDateService,
  getTicketsByQueryDateRangeService,
  updateTicketMessageAsClientService,
  updateTicketAsAdminService,
  getTicketsByClientIdService,
} from "../services/ticketService.js";
import { validateTicketDTO } from "../validators/ticketValidator.js";
import { TicketDTO } from "../dtos/ticketDto.js";
import { NotFoundError } from "../errors/customErrors.js";

// Controller to handle ticket creation
export const createTicketController = async (req, res, next) => {
  try {
    const dto = new TicketDTO(req.body);
    validateTicketDTO(dto);
    const ticket = await createTicketService(dto);
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error("Error in createTicketController:", err);
    next(err);
  }
};

// Controller to get all tickets by ticketId
export const getTicketsByTicketIdController = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const tickets = await getTicketsByTicketIdService(ticketId);

    if (!tickets || tickets.length === 0) {
      throw new NotFoundError("Tickets not found");
    }

    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error in getTicketsByTicketIdController:", err);
    next(err);
  }
};

// Controller to get all tickets
export const getAllTicketsController = async (req, res, next) => {
  try {
    const tickets = await getAllTicketsService();
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error in getAllTicketsController:", err);
    next(err);
  }
};

// Controller to delete a ticket
export const deleteTicketController = async (req, res, next) => {
  try {
    const { clientId, ticketId } = req.params;
    const deleted = await deleteTicketService(clientId, ticketId);
    if (!deleted) {
      throw new NotFoundError("Ticket not found");
    }

    res.status(200).json({
      success: true,
      data: deleted,
      message: "Ticket deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteTicketController:", err);
    next(err);
  }
};

// Controller to get tickets by queryDate
export const getTicketsByQueryDateController = async (req, res, next) => {
  try {
    const { queryDate } = req.query;
    const tickets = await getTicketsByQueryDateService(queryDate);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error in getTicketsByQueryDateController:", err);
    next(err);
  }
};

// Controller to get tickets by queryDate range
export const getTicketsByQueryDateRangeController = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const tickets = await getTicketsByQueryDateRangeService(startDate, endDate);
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error in getTicketsByQueryDateRangeController:", err);
    next(err);
  }
};

// Controller to update ticket message as client
export const updateTicketMessageAsClientController = async (
  req,
  res,
  next
) => {
  try {
    const { clientId, ticketId } = req.params;
    const dto = new TicketDTO(req.body);
    const updated = await updateTicketMessageAsClientService(
      clientId,
      ticketId,
      dto
    );
    res.status(200).json({
      success: true,
      data: updated,
      message: "Ticket message updated successfully",
    });
  } catch (err) {
    console.error("Error in updateTicketMessageAsClientController:", err);
    next(err);
  }
};

// Controller to update ticket as admin
export const updateTicketAsAdminController = async (req, res, next) => {
  try {
    const { clientId, ticketId } = req.params;
    const dto = new TicketDTO(req.body);
    const updated = await updateTicketAsAdminService(clientId, ticketId, dto);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Ticket updated as admin successfully",
    });
  } catch (err) {
    console.error("Error in updateTicketAsAdminController:", err);
    next(err);
  }
};

// Controller to get tickets by clientId
export const getTicketsByClientIdController = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const tickets = await getTicketsByClientIdService(clientId);

    if (!tickets || tickets.length === 0) {
      throw new NotFoundError("No tickets found for this client");
    }

    res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error in getTicketsByClientIdController:", err);
    next(err);
  }
};

