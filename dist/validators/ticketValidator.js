import { BadRequest } from "../errors/customErrors.js";

// Basic validation for TicketDTO-shaped data
export const validateTicketDTO = (data = {}) => {
  const { clientId, subject, message } = data;

  // clientId: required, must be a non-empty string
  if (clientId == null) {
    throw new BadRequest("clientId is required");
  }
  if (typeof clientId !== "string") {
    throw new BadRequest(
      `clientId must be a string. Received: ${typeof clientId}. Value: ${clientId}`
    );
  }
  if (clientId.trim().length === 0) {
    throw new BadRequest("clientId cannot be empty or whitespace only");
  }

  // subject: required, must be a non-empty string
  if (subject == null) {
    throw new BadRequest("subject is required");
  }
  if (typeof subject !== "string") {
    throw new BadRequest(
      `subject must be a string. Received: ${typeof subject}. Value: ${subject}`
    );
  }
  if (subject.trim().length === 0) {
    throw new BadRequest("subject cannot be empty or whitespace only");
  }

  // message: required, must be a non-empty string
  if (message == null) {
    throw new BadRequest("message is required");
  }
  if (typeof message !== "string") {
    throw new BadRequest(
      `message must be a string. Received: ${typeof message}. Value: ${message}`
    );
  }
  if (message.trim().length === 0) {
    throw new BadRequest("message cannot be empty or whitespace only");
  }

  return true;
};
