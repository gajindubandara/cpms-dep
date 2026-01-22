export const mapCreateTicketDTOtoTicketModel = (dto) => ({
  clientId: dto.clientId,
  clientName: dto.clientName,
  projectId: dto.projectId,
  projectName: dto.projectName,
  subject: dto.subject,
  message: dto.message,
  status: dto.status,
  adminResponse: dto.adminResponse,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

// mapping the ClientupdateTicketDTO to TicketModel
export const mapClientUpdateTicketDTOtoTicketModel = (dto) => {
  const model = {};
  if (dto.message !== undefined) model.message = dto.message;
  if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
  return model;
};

// mapping the AdminupdateTicketDTO to TicketModel
export const mapAdminUpdateTicketDTOtoTicketModel = (dto) => {
  const model = {};
  if (dto.status !== undefined) model.status = dto.status;
  if (dto.adminResponse !== undefined) model.adminResponse = dto.adminResponse;
  if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
  return model;
};