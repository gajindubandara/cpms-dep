import { ClientType } from "../enums/clientType.js";
import { Status } from "../enums/clientStatus.js";

export class ClientDTO {
  constructor({clientId, clientName, email, address, phone, status, clientType, createdAt, updatedAt,} = {}) {
    if (clientId !== undefined) this.clientId = clientId;
    if (clientName !== undefined) this.clientName = clientName;
    if (email !== undefined) this.email = email;
    if (address !== undefined) this.address = address;
    if (phone !== undefined) this.phone = phone;

    if (status !== undefined) {
      this.status = Object.values(Status).includes(status)? status: Status.ACTIVE;
    }

    if (clientType !== undefined) {
      this.clientType = Object.values(ClientType).includes(clientType)? clientType: ClientType.UNASSIGNED;
    }

    if (createdAt !== undefined) this.createdAt = createdAt;
    if (updatedAt !== undefined) this.updatedAt = updatedAt;
  }
}
