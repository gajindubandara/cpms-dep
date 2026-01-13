import { BadRequest } from "../errors/customErrors.js";
import { TicketStatus } from "../enums/ticketStatus.js";
// Basic validation for TicketDTO-shaped data
export const validateTicketDTO = (data = {}) => {
  const {
    ticketId,
    clientId,
    projectId,
    subject,
    message,
    status,
    adminResponse,
  } = data;

  if (ticketId !== undefined) {
    throw new BadRequest("ticketId must be a string");
  }

  if (clientId !== undefined) {
    throw new BadRequest("clientId must be a string");
  }

  if (projectId !== undefined) {
    throw new BadRequest("projectId must be a string");
  }

  if (subject !== undefined && typeof subject !== "string") {
    throw new BadRequest("subject must be a string");
  }

  if (message !== undefined && typeof message !== "string") {
    throw new BadRequest("message must be a string");
  }

  if (status !== undefined) {
    if (!Object.values(TicketStatus).includes(status)) {
      throw new BadRequest("Invalid status value");
    }
  }

  if (adminResponse !== undefined && typeof adminResponse !== "string") {
    throw new BadRequest("adminResponse must be a string");
  }

  return true;
};
