import { ExpenseStatus } from "../enums/expenseStatus.js";

const assignedIfDefined = (target, key, value) => {
    if (value !== undefined) target[key] = value;
};

const assignEnum = (target, key, value, enumObj, fallback) => {
    if (value === undefined) return;
    target[key] = Object.values(enumObj).includes(value) ? value : fallback;
};

export function createExpenseDto({
    projectId,
    currency,
    amount,
    expenseStatus,
    description,
    paymentSlip,
    file,
} = {}) {
    const dto = {};

    assignEnum(dto, "expenseStatus", expenseStatus, ExpenseStatus, ExpenseStatus.PENDING);
    assignedIfDefined(dto, "projectId", projectId);
    assignedIfDefined(dto, "currency", currency);
    assignedIfDefined(dto, "amount", amount);
    assignedIfDefined(dto, "description", description);
    assignedIfDefined(dto, "paymentSlip", paymentSlip);
    assignedIfDefined(dto, "file", file);

    return dto;
}