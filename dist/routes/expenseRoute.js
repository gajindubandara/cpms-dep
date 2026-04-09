import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { authorize } from "../middlewares/authorizeAccess.js";
import { uploadSingle } from "../middlewares/uploadMiddleware.js";
import {
  createExpense,
  getExpenseById,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getExpensesByDateRange,
  uploadPaymentSlip,
} from "../controllers/expenseController.js";

const router = express.Router();

// Specific routes must come before parameterized routes
router.get("/date", verifyAccessToken, authorize(["g2-cpms-admin"]), getExpensesByDateRange);

// POST and general GET routes
router.post("/", verifyAccessToken, authorize(["g2-cpms-admin"]), uploadSingle, createExpense);
router.get("/", verifyAccessToken, authorize(["g2-cpms-admin"]), getAllExpenses);

// Parameterized routes - must come last
router.post("/:expenseId/payment-slip", verifyAccessToken, authorize(["g2-cpms-admin"]), uploadSingle, uploadPaymentSlip);
router.get("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), getExpenseById);
router.put("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), uploadSingle, updateExpense);
router.delete("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), deleteExpense);

export default router;
