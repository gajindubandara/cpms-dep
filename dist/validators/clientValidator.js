import { BadRequest } from "../errors/customErrors.js";
import { Status } from "../enums/clientStatus.js";
import { ClientType } from "../enums/clientType.js";

// Basic validation for ClientDTO-shaped data
export const validateClientDTO = (data = {}) => {
  const { clientId, clientName, email, address, phone, status, clientType } =
    data;

  if (clientId !== undefined) {
    throw new BadRequest("clientId must be a string");
  }

  if (clientName !== undefined && typeof clientName !== "string") {
    throw new BadRequest("clientName must be a string");
  }

  if (email !== undefined) {
    if (typeof email !== "string") {
      throw new BadRequest("email must be a string");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequest("email is not valid");
    }
  }

  if (address !== undefined && typeof address !== "string") {
    throw new BadRequest("address must be a string");
  }

  if (phone !== undefined) {
    throw new BadRequest("phone must be a string");
  }

  if (status !== undefined) {
    if (!Object.values(Status).includes(status)) {
      throw new BadRequest("Invalid status value");
    }
  }

  if (clientType !== undefined) {
    if (!Object.values(ClientType).includes(clientType)) {
      throw new BadRequest("Invalid clientType value");
    }
  }

  return true;
};

