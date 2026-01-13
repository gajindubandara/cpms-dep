import {
  createTicket,
  getTicketsByTicketId,
  getAllTickets,
  deleteTicket,
  getTicketsByQueryDate,
  getTicketsByQueryDateRange,
  updateTicketMessageAsClient,
  updateTicketAsAdmin,
  getTicketsByClientId
} from "../daos/ticketDao.js";
import {
  mapCreateTicketDTOtoTicketModel,
  mapClientUpdateTicketDTOtoTicketModel,
  mapAdminUpdateTicketDTOtoTicketModel
} from "../mappers/ticketMapper.js";
import { getClientById } from "../daos/clientDao.js";
import { getProjectById, projectByClientId } from "../daos/projectDao.js";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFoundError,
} from "../errors/customErrors.js";

// Service to create a ticket
export const createTicketService = async (createTicketDTO) => {
  if (!createTicketDTO || typeof createTicketDTO !== 'object') {
    throw new BadRequest('Invalid input: Ticket data is required.');
  }
  const { clientId, projectId, subject, message } = createTicketDTO;
  if (!clientId || !projectId || !subject || !message) {
    throw new BadRequest('Missing required fields: clientId, projectId, subject, or message');
  }

  // Fetch client from DB
  const client = await getClientById(clientId);
  if (!client) {
    throw new NotFoundError('Client not found');
  }

  // Ensure the project belongs to the client
  const projects = await projectByClientId(clientId);
  const ownsProject = projects.some(p => p.SK && p.SK.startsWith(`PROJECT#${projectId}`));
  if (!ownsProject) {
    throw new Forbidden('Project does not belong to this client');
  }

  try {
    const ticketData = mapCreateTicketDTOtoTicketModel(createTicketDTO);
    return await createTicket(ticketData);
  } catch (err) {
    console.error('Error in createTicketService:', err);
    throw new InternalServerError('Failed to create ticket. ' + (err.message || ''));
  }
};


// Service to get all tickets by ticketId
export const getTicketsByTicketIdService = async (ticketId) => {
  if (!ticketId) throw new BadRequest('ticketId is required');
  try {
    return await getTicketsByTicketId(ticketId);
  } catch (err) {
    console.error('Error in getTicketsByTicketIdService:', err);
    throw new InternalServerError('Failed to get tickets by ticketId. ' + (err.message || ''));
  }
};


// Service to get all tickets
export const getAllTicketsService = async () => {
  try {
    return await getAllTickets();
  } catch (err) {
    console.error('Error in getAllTicketsService:', err);
    throw new InternalServerError('Failed to get all tickets. ' + (err.message || ''));
  }
};


// Service to delete a ticket
export const deleteTicketService = async (clientId, ticketId) => {
  if (!clientId || !ticketId) throw new BadRequest('clientId and ticketId are required');
  // Fetch ticket to check status
  const tickets = await getTicketsByTicketId(ticketId);
  const ticket = tickets.find(t => t.PK === `CLIENT#${clientId}` && t.SK === `TICKET#${ticketId}`);
  if (!ticket) throw new NotFoundError('Ticket not found');
  if (ticket.Attributes && ticket.Attributes.status === 'In Progress') {
    throw new Forbidden('Cannot delete ticket: Ticket is In Progress');
  }
  try {
    return await deleteTicket(clientId, ticketId);
  } catch (err) {
    console.error('Error in deleteTicketService:', err);
    throw new InternalServerError('Failed to delete ticket. ' + (err.message || ''));
  }
};


// Service to get tickets by queryDate
export const getTicketsByQueryDateService = async (queryDate) => {
  if (!queryDate) throw new BadRequest('queryDate is required');
  try {
    return await getTicketsByQueryDate(queryDate);
  } catch (err) {
    console.error('Error in getTicketsByQueryDateService:', err);
    throw new InternalServerError('Failed to get tickets by queryDate. ' + (err.message || ''));
  }
};


// Service to get tickets by queryDate range
export const getTicketsByQueryDateRangeService = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new BadRequest('startDate and endDate are required');
  try {
    return await getTicketsByQueryDateRange(startDate, endDate);
  } catch (err) {
    console.error('Error in getTicketsByQueryDateRangeService:', err);
    throw new InternalServerError('Failed to get tickets by query date range. ' + (err.message || ''));
  }
};


// Service to update ticket message as client
export const updateTicketMessageAsClientService = async (clientId, ticketId, updateDTO) => {
  if (!clientId || !ticketId) throw new BadRequest('clientId and ticketId are required');
  // Fetch ticket to check status
  const tickets = await getTicketsByTicketId(ticketId);
  const ticket = tickets.find(t => t.PK === `CLIENT#${clientId}` && t.SK === `TICKET#${ticketId}`);
  if (!ticket) throw new NotFoundError('Ticket not found');
  if (ticket.Attributes && (ticket.Attributes.status === 'In Progress' || ticket.Attributes.status === 'Resolved')) {
    throw new Forbidden('Cannot update message: Ticket is In Progress or Resolved');
  }
  const updates = mapClientUpdateTicketDTOtoTicketModel(updateDTO);
  if (Object.keys(updates).length === 0) throw new BadRequest('No valid fields to update');
  try {
    return await updateTicketMessageAsClient(clientId, ticketId, updates);
  } catch (err) {
    console.error('Error in updateTicketMessageAsClientService:', err);
    throw new InternalServerError('Failed to update ticket message. ' + (err.message || ''));
  }
};


// Service to update ticket as admin
export const updateTicketAsAdminService = async (clientId, ticketId, updateDTO) => {
  if (!clientId || !ticketId) throw new BadRequest('clientId and ticketId are required');
  const updates = mapAdminUpdateTicketDTOtoTicketModel(updateDTO);
  if (Object.keys(updates).length === 0) throw new BadRequest('No valid fields to update');
  try {
    return await updateTicketAsAdmin(clientId, ticketId, updates);
  } catch (err) {
    console.error('Error in updateTicketAsAdminService:', err);
    throw new InternalServerError('Failed to update ticket as admin. ' + (err.message || ''));
  }
};


// Service to get tickets by clientId
export const getTicketsByClientIdService = async (clientId) => {
  if (!clientId) throw new BadRequest('clientId is required');
  try {
    return await getTicketsByClientId(clientId);
  } catch (err) {
    console.error('Error in getTicketsByClientIdService:', err);
    throw new InternalServerError('Failed to get tickets by clientId. ' + (err.message || ''));
  }
};

