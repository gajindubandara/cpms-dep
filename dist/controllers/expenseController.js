import {
  createExpenseService,
  getExpenseByIdService,
  getAllExpensesService,
  updateExpenseService,
  deleteExpenseService,
  getExpensesByDateRangeService,
} from "../services/expenseService.js";
import { createExpenseDto } from "../dtos/expenseDto.js";
import { validateExpenseDTO } from "../validators/expenseValidator.js";

// create expense
export const createExpense = async (req, res, next) => {
  try {
    const dto = createExpenseDto(req.body);
    validateExpenseDTO(dto);
    const result = await createExpenseService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get expense by id
export const getExpenseById = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const result = await getExpenseByIdService(expenseId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get all expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    const result = await getAllExpensesService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// update expense
export const updateExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const dto = createExpenseDto(req.body);
    const result = await updateExpenseService(expenseId, dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// delete expense
export const deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const result = await deleteExpenseService(expenseId);
    res.status(200).json({ success: true, data: result, message: "Expense deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// get expenses by date range
export const getExpensesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await getExpensesByDateRangeService(startDate, endDate);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
