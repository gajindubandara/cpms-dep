import { ClientType } from "../enums/clientType.js";
import { Status } from "../enums/clientStatus.js";

export function createClientDTO({
  clientId,
  clientName,
  email,
  address,
  phone,
  status,
  clientType,
  createdAt,
  updatedAt,
} = {}) {
  const dto = {};

  const assignIfDefined = (target, key, value) => {
    if (value !== undefined) target[key] = value;
  };

  const assignEnum = (target, key, value, enumObj, fallback) => {
    if (value === undefined) return;
    target[key] = Object.values(enumObj).includes(value) ? value : fallback;
  };

  assignIfDefined(dto, "clientId", clientId);
  assignIfDefined(dto, "clientName", clientName);
  assignIfDefined(dto, "email", email);
  assignIfDefined(dto, "address", address);
  assignIfDefined(dto, "phone", phone);

  assignEnum(dto, "status", status, Status, Status.ACTIVE);
  assignEnum(dto, "clientType", clientType, ClientType, ClientType.UNASSIGNED);

  assignIfDefined(dto, "createdAt", createdAt);
  assignIfDefined(dto, "updatedAt", updatedAt);

  return dto;
}
