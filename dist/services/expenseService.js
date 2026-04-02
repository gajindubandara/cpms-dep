import { randomUUID } from "crypto";
import {
  createExpense,
  getExpenseById,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getExpensesByDateRange,
} from "../daos/expenseDao.js";
import {
  mapCreateExpenseDTOtoExpenseModel,
  mapUpdateExpenseDTOtoExpenseModel,
} from "../mappers/expenseMapper.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import { getProjectById } from "../daos/projectDao.js";

export const createExpenseService = async (dto) => {
  if (dto.projectId) {
    const project = await getProjectById(dto.projectId);
    if (!project) throw new NotFoundError("Project not found");
  }

  const model = mapCreateExpenseDTOtoExpenseModel({ ...dto, expenseId: randomUUID() });
  return await createExpense(model);
};

export const getExpenseByIdService = async (expenseId) => {
  if (!expenseId) throw new BadRequest("expenseId is required");

  const expense = await getExpenseById(expenseId);
  if (!expense) throw new NotFoundError("Expense not found");

  return expense;
};

export const getAllExpensesService = async () => {
  return await getAllExpenses();
};

export const updateExpenseService = async (expenseId, dto) => {
  if (!expenseId) throw new BadRequest("expenseId is required");

  const updates = mapUpdateExpenseDTOtoExpenseModel(dto);
  if (Object.keys(updates).length === 0) throw new BadRequest("No valid fields to update");

  const existing = await getExpenseById(expenseId);
  if (!existing) throw new NotFoundError("Expense not found");

  return await updateExpense(expenseId, updates);
};

export const deleteExpenseService = async (expenseId) => {
  if (!expenseId) throw new BadRequest("expenseId is required");

  const existing = await getExpenseById(expenseId);
  if (!existing) throw new NotFoundError("Expense not found");

  return await deleteExpense(expenseId);
};

export const getExpensesByDateRangeService = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new BadRequest("startDate and endDate are required");

  return await getExpensesByDateRange(startDate, endDate);
};
