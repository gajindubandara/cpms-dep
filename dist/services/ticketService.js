import {
  createTicket,
  getTicketsByTicketId,
  getAllTickets,
  deleteTicket,
  getTicketsByQueryDate,
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
import { getProjectById } from "../daos/projectDao.js";

// Service to create a ticket
export const createTicketService = async (createTicketDTO) => {
  // Basic validation
  if (!createTicketDTO || typeof createTicketDTO !== 'object') {
    throw new Error('Invalid input: Ticket data is required.');
  }
  const { clientId, projectId, subject, message } = createTicketDTO;
  if (!clientId || !projectId || !subject || !message) {
    throw new Error('Missing required fields: clientId, projectId, subject, or message');
  }

  // Fetch client from DB
  const client = await getClientById(clientId);
  if (!client) {
    throw new Error('Client not found');
  }

  // Assuming a getProjectById function exists to validate project
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  try {
    // Map DTO to model input (adds/validates fields if needed)
    const ticketData = mapCreateTicketDTOtoTicketModel(createTicketDTO);
    return await createTicket(ticketData);
  } catch (err) {
    // Log and rethrow for controller to handle
    console.error('Error in createTicketService:', err);
    throw new Error('Failed to create ticket. ' + (err.message || ''));
  }
};

// Service to get all tickets by ticketId
export const getTicketsByTicketIdService = async (ticketId) => {
  if (!ticketId) throw new Error('ticketId is required');
  try {
    return await getTicketsByTicketId(ticketId);
  } catch (err) {
    console.error('Error in getTicketsByTicketIdService:', err);
    throw new Error('Failed to get tickets by ticketId. ' + (err.message || ''));
  }
};

// Service to get all tickets
export const getAllTicketsService = async () => {
  try {
    return await getAllTickets();
  } catch (err) {
    console.error('Error in getAllTicketsService:', err);
    throw new Error('Failed to get all tickets. ' + (err.message || ''));
  }
};

// Service to delete a ticket
export const deleteTicketService = async (clientId, ticketId) => {
  if (!clientId || !ticketId) throw new Error('clientId and ticketId are required');
  // Fetch ticket to check status
  const tickets = await getTicketsByTicketId(ticketId);
  const ticket = tickets.find(t => t.PK === `CLIENT#${clientId}` && t.SK === `TICKET#${ticketId}`);
  if (!ticket) throw new Error('Ticket not found');
  if (ticket.Attributes && ticket.Attributes.status === 'In Progress') {
    throw new Error('Cannot delete ticket: Ticket is In Progress');
  }
  try {
    return await deleteTicket(clientId, ticketId);
  } catch (err) {
    console.error('Error in deleteTicketService:', err);
    throw new Error('Failed to delete ticket. ' + (err.message || ''));
  }
};

// Service to get tickets by queryDate
export const getTicketsByQueryDateService = async (queryDate) => {
  if (!queryDate) throw new Error('queryDate is required');
  try {
    return await getTicketsByQueryDate(queryDate);
  } catch (err) {
    console.error('Error in getTicketsByQueryDateService:', err);
    throw new Error('Failed to get tickets by queryDate. ' + (err.message || ''));
  }
};

// Service to update ticket message as client
export const updateTicketMessageAsClientService = async (clientId, ticketId, updateDTO) => {
  if (!clientId || !ticketId) throw new Error('clientId and ticketId are required');
  // Fetch ticket to check status
  const tickets = await getTicketsByTicketId(ticketId);
  const ticket = tickets.find(t => t.PK === `CLIENT#${clientId}` && t.SK === `TICKET#${ticketId}`);
  if (!ticket) throw new Error('Ticket not found');
  if (ticket.Attributes && ticket.Attributes.status === 'In Progress') {
    throw new Error('Cannot update message: Ticket is In Progress');
  }
  const updates = mapClientUpdateTicketDTOtoTicketModel(updateDTO);
  if (Object.keys(updates).length === 0) throw new Error('No valid fields to update');
  try {
    return await updateTicketMessageAsClient(clientId, ticketId, updates);
  } catch (err) {
    console.error('Error in updateTicketMessageAsClientService:', err);
    throw new Error('Failed to update ticket message. ' + (err.message || ''));
  }
};

// Service to update ticket as admin
export const updateTicketAsAdminService = async (clientId, ticketId, updateDTO) => {
  if (!clientId || !ticketId) throw new Error('clientId and ticketId are required');
  const updates = mapAdminUpdateTicketDTOtoTicketModel(updateDTO);
  if (Object.keys(updates).length === 0) throw new Error('No valid fields to update');
  try {
    return await updateTicketAsAdmin(clientId, ticketId, updates);
  } catch (err) {
    console.error('Error in updateTicketAsAdminService:', err);
    throw new Error('Failed to update ticket as admin. ' + (err.message || ''));
  }
};

// Service to get tickets by clientId
export const getTicketsByClientIdService = async (clientId) => {
  if (!clientId) throw new Error('clientId is required');
  try {
    return await getTicketsByClientId(clientId);
  } catch (err) {
    console.error('Error in getTicketsByClientIdService:', err);
    throw new Error('Failed to get tickets by clientId. ' + (err.message || ''));
  }
};

