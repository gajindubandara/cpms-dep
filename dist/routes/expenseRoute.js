import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { authorize } from "../middlewares/authorizeAccess.js";
import {
  createExpense,
  getExpenseById,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getExpensesByDateRange,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", verifyAccessToken, authorize(["g2-cpms-admin"]), createExpense);
router.get("/date", verifyAccessToken, authorize(["g2-cpms-admin"]), getExpensesByDateRange);
router.get("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), getExpenseById);
router.get("/", verifyAccessToken, authorize(["g2-cpms-admin"]), getAllExpenses);
router.put("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), updateExpense);
router.delete("/:expenseId", verifyAccessToken, authorize(["g2-cpms-admin"]), deleteExpense);

export default router;
