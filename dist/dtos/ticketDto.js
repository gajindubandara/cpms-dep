import { TicketStatus } from "../enums/ticketStatus.js";

export class TicketDTO {
  constructor({ticketId, clientId, projectId, subject, message, status, adminResponse, createdAt, updatedAt,} = {}) {
    if (ticketId !== undefined) this.ticketId = ticketId;
    if (clientId !== undefined) this.clientId = clientId;
    if (projectId !== undefined) this.projectId = projectId;
    if (subject !== undefined) this.subject = subject;
    if (message !== undefined) this.message = message;

    if (status !== undefined) {
      this.status = Object.values(TicketStatus).includes(status) ? status : TicketStatus.OPEN;
    }

    if (adminResponse !== undefined) this.adminResponse = adminResponse;
    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }
}

export default TicketDTO;
