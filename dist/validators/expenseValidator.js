import { BadRequest } from "../errors/customErrors.js";
import { ExpenseStatus } from "../enums/expenseStatus.js";

export const validateExpenseDTO = (data = {}) => {
  const { projectId, currency, amount, expenseStatus, description, paymentSlip } = data;

  if (projectId !== undefined && typeof projectId !== "string") {
    throw new BadRequest("projectId must be a string");
  }

  if (currency === undefined || typeof currency !== "string") {
    throw new BadRequest("currency must be a string");
  }

  if (amount === undefined) {
    throw new BadRequest("amount cannot be null");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new BadRequest("amount must be a positive number");
  }

  if (expenseStatus !== undefined && !Object.values(ExpenseStatus).includes(expenseStatus)) {
    throw new BadRequest("Invalid expenseStatus value");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new BadRequest("description must be a string");
  }
  if (paymentSlip !== undefined && typeof paymentSlip !== "string") {
      throw new BadRequest("paymentSlip must be a string");
  }

  return true;
};
