import { TicketStatus } from "../enums/ticketStatus.js";

export function createTicketDTO({
  ticketId,
  clientId,
  projectId,
  subject,
  message,
  status,
  adminResponse,
  createdAt,
  updatedAt,
} = {}) {
  const dto = {};

  if (ticketId !== undefined) dto.ticketId = ticketId;
  if (clientId !== undefined) dto.clientId = clientId;
  if (projectId !== undefined) dto.projectId = projectId;
  if (subject !== undefined) dto.subject = subject;
  if (message !== undefined) dto.message = message;

  if (status !== undefined) {
    dto.status = Object.values(TicketStatus).includes(status) ? status : TicketStatus.OPEN;
  }

  if (adminResponse !== undefined) dto.adminResponse = adminResponse;
  if (createdAt !== undefined) dto.createdAt = createdAt;
  if (updatedAt !== undefined) dto.updatedAt = updatedAt;

  return dto;
}
