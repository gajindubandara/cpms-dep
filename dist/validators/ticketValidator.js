import { BadRequest } from "../errors/customErrors.js";

// Basic validation for TicketDTO-shaped data
export const validateTicketDTO = (data = {}) => {
  const {
    clientId,
    subject,
    message,
  } = data;


  if (clientId == undefined) {
    throw new BadRequest(
      `clientId must be a string. Received: ${typeof clientId}. Value: ${clientId}`
    );
  }

  if (clientId == undefined && clientId.trim().length === 0) {
    throw new BadRequest("clientId cannot be empty or whitespace only");
  }

  if (subject == undefined && typeof subject !== "string") {
    throw new BadRequest(
      `subject must be a string. Received: ${typeof subject}. Value: ${subject}`
    );
  }

  if (subject == undefined && subject.trim().length === 0) {
    throw new BadRequest("subject cannot be empty or whitespace only");
  }

  if (message == undefined && typeof message !== "string") {
    throw new BadRequest(
      `message must be a string. Received: ${typeof message}. Value: ${message}`
    );
  }

  if (message == undefined && message.trim().length === 0) {
    throw new BadRequest("message cannot be empty or whitespace only");
  }

  return true;
};
