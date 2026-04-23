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
import { uploadExpenseSlipToS3, deletePaymentSlipFromS3 } from "../config/s3config.js";
import { buildNotificationMessage, sendTelegramNotification } from "../config/telegramNotificationService.js";

const DEBUG = process.env.NODE_ENV !== 'production';

const getExpenseId = (expense, fallbackExpenseId = '') => {
  if (!expense) return fallbackExpenseId;
  return expense.expenseId || expense.PK?.replace('EXPENSE#', '') || expense.Attributes?.expenseId || fallbackExpenseId;
};

const safeDeleteSlip = async (slipUrl) => {
  if (!slipUrl) return;
  try {
    await deletePaymentSlipFromS3(slipUrl);
  } catch (error) {
    console.warn('[Expense] Failed to delete old slip:', error.message);
  }
};

export const createExpenseService = async (dto) => {
  if (dto.projectId) {
    const project = await getProjectById(dto.projectId);
    if (!project) throw new NotFoundError("Project not found");
  }

  let paymentSlipUrl = null;

  // Upload file to S3 if provided
  if (dto.file) {
    try {
      const expenseId = randomUUID();
      const s3Response = await uploadExpenseSlipToS3({
        fileBuffer: dto.file.buffer,
        fileName: `expense-${expenseId}`,
        mimeType: dto.file.mimetype || 'application/octet-stream',
      });
      paymentSlipUrl = s3Response.url;
      if (DEBUG) console.log('[Expense] Slip uploaded:', s3Response.url);
    } catch (error) {
      throw new Error(`Failed to upload expense slip: ${error.message}`);
    }
  }

  const model = mapCreateExpenseDTOtoExpenseModel({
    ...dto,
    expenseId: randomUUID(),
    paymentSlip: paymentSlipUrl,
  });
  const created = await createExpense(model);

  void sendTelegramNotification(
    buildNotificationMessage('New expense created', [
      `Expense ID: ${getExpenseId(created, model.expenseId)}`,
      `Project ID: ${model.projectId || 'N/A'}`,
      `Amount: ${model.currency || ''} ${Number(model.amount || 0).toFixed(2)}`.trim(),
    ])
  );

  return created;
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

  const existing = await getExpenseById(expenseId);
  if (!existing) throw new NotFoundError("Expense not found");

  let paymentSlipUrl = null;

  // Upload new file to S3 if provided
  if (dto.file) {
    try {
      // Delete old slip if exists
      const existingSlip = existing?.Attributes?.paymentSlip || existing?.paymentSlip;
      await safeDeleteSlip(existingSlip);

      const s3Response = await uploadExpenseSlipToS3({
        fileBuffer: dto.file.buffer,
        fileName: `expense-${expenseId}`,
        mimeType: dto.file.mimetype || 'application/octet-stream',
      });
      paymentSlipUrl = s3Response.url;
      if (DEBUG) console.log('[Expense] Slip updated:', s3Response.url);
    } catch (error) {
      throw new Error(`Failed to upload expense slip: ${error.message}`);
    }
  }

  const updates = mapUpdateExpenseDTOtoExpenseModel({ ...dto, paymentSlip: paymentSlipUrl });
  if (Object.keys(updates).length === 0) throw new BadRequest("No valid fields to update");

  const updated = await updateExpense(expenseId, updates);

  void sendTelegramNotification(
    buildNotificationMessage('Expense updated', [
      `Expense ID: ${expenseId}`,
      `Project ID: ${updated?.Attributes?.projectId || updated?.projectId || dto.projectId || 'N/A'}`,
    ])
  );

  return updated;
};

export const deleteExpenseService = async (expenseId) => {
  if (!expenseId) throw new BadRequest("expenseId is required");

  const existing = await getExpenseById(expenseId);
  if (!existing) throw new NotFoundError("Expense not found");

  // Delete slip from S3
  const slipUrl = existing?.Attributes?.paymentSlip || existing?.paymentSlip;
  await safeDeleteSlip(slipUrl);

  return await deleteExpense(expenseId);
};

export const getExpensesByDateRangeService = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new BadRequest("startDate and endDate are required");

  return await getExpensesByDateRange(startDate, endDate);
};

// Upload payment slip to existing expense
export const uploadExpensePaymentSlipService = async (expenseId, fileData) => {
  const expense = await getExpenseById(expenseId);

  if (!expense) {
    throw new NotFoundError("Expense not found");
  }

  // Delete old slip if exists
  const existingSlip = expense?.Attributes?.paymentSlip || expense?.paymentSlip;
  await safeDeleteSlip(existingSlip);

  // Upload new slip to S3
  const s3Response = await uploadExpenseSlipToS3({
    fileBuffer: fileData.buffer,
    fileName: `expense-${expenseId}`,
    mimeType: fileData.mimetype || 'application/octet-stream',
  });

  if (DEBUG) console.log('[Expense] Slip uploaded:', s3Response.url);

  // Update expense with slip URL
  const updated = await updateExpense(expenseId, {
    paymentSlip: s3Response.url,
  });

  void sendTelegramNotification(
    buildNotificationMessage('Expense payment slip uploaded', [
      `Expense ID: ${expenseId}`,
    ])
  );

  return updated;
};

