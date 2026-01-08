//mapping the createClientDTO TO ClientModel
export const mapCreateClientDTOtoClientModel = (dto) => ({
  clientName: dto.clientName,
  email: dto.email,
  address: dto.address,
  phone: dto.phone,
  status: dto.status,
  clientType: dto.clientType,
});

//mapping the updateClientDTO to ClientModel
export const mapUpdateClientDTOtoClientModel = (dto) => {
  const model = {};
  if (dto.clientName !== undefined) model.clientName = dto.clientName;
  if (dto.email !== undefined) model.email = dto.email;
  if (dto.address !== undefined) model.address = dto.address;
  if (dto.phone !== undefined) model.phone = dto.phone;
  if (dto.status !== undefined) model.status = dto.status;
  if (dto.clientType !== undefined) model.clientType = dto.clientType;

  return model;
};
