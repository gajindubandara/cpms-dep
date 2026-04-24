import { getDateOnly } from "../utils/dateOnly.js";
import { ExpenseStatus } from "../enums/expenseStatus.js";

export const Expense = {
    pk: (expenseId) => `EXPENSE#${expenseId}`,
    sk: () => `EXPENSE`,
    create: (data) => ({
        PK: `EXPENSE#${data.expenseId}`,
        SK: `EXPENSE`,
        type: `EXPENSE`,
        Attributes: {
            projectId: data.projectId ?? null,
            currency: data.currency,
            amount: data.amount,
            expenseStatus: data.expenseStatus ?? ExpenseStatus.PENDING,
            description: data.description ?? null,
            paymentSlip: data.paymentSlip ?? null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        queryDate: getDateOnly(),
    })
};