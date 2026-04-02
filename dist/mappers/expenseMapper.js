//create expense mapper
export const mapCreateExpenseDTOtoExpenseModel = (dto) => ({
    expenseId: dto.expenseId,
    projectId: dto.projectId,
    currency: dto.currency,
    amount: dto.amount,
    expenseStatus: dto.expenseStatus,
    description: dto.description,
    paymentSlip: dto.paymentSlip,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
});

//map updateExpenseDto
export const mapUpdateExpenseDTOtoExpenseModel = (dto) => {
    const model = {};
    if (dto.projectId !== undefined) model.projectId = dto.projectId;
    if (dto.currency !== undefined) model.currency = dto.currency;
    if (dto.amount !== undefined) model.amount = dto.amount;
    if (dto.expenseStatus !== undefined) model.expenseStatus = dto.expenseStatus;
    if (dto.description !== undefined) model.description = dto.description;
    if (dto.paymentSlip !== undefined) model.paymentSlip = dto.paymentSlip;
    if (dto.updatedAt !== undefined) model.updatedAt = dto.updatedAt;
    return model;
};