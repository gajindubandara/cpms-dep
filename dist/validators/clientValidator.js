import { BadRequest } from "../errors/customErrors.js";
import { Status } from "../enums/clientStatus.js";
import { ClientType } from "../enums/clientType.js";

// Basic validation for ClientDTO-shaped data
export const validateClientDTO = (data = {}) => {
  const {clientName, email, address, phone, status, clientType } =
    data;

  if (clientName == undefined && typeof clientName !== "string") {
    throw new BadRequest("clientName must be a string");
  }

  if (email == undefined) {
    if (typeof email == "string") {
      throw new BadRequest("email must be a string");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequest("email is not valid");
    }
  }

  if (address == undefined && typeof address !== "string") {
    throw new BadRequest("address cannot be null");
  }

  if (phone == undefined) {
    throw new BadRequest("phone cannot be null");
  }

  if (status == undefined) {
    if (!Object.values(Status).includes(status)) {
      throw new BadRequest("Invalid status value");
    }
  }

  if (clientType == undefined) {
    if (!Object.values(ClientType).includes(clientType)) {
      throw new BadRequest("Invalid clientType value");
    }
  }

  return true;
};

