import { getAllPayments } from "../daos/paymentDao.js";
import PaymentStatus from "../enums/paymentStatus.js";
import { getProjectById } from "../daos/projectDao.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";


const createEmptyKPI = () => ({
  revenue: 0,
  profit: 0,
  overdue: 0,
  cancel: 0,
  pending: 0,
});

const profitCal = async (payment) => {
  let profit = 0;
  const amount = payment.Attributes.amount;

  if (payment.Attributes.projectId != null) {
    const project = await getProjectById(payment.Attributes.projectId);

    if (!project) {
      profit = amount;
    } else if (project.Attributes.commissionPercent != null) {
      // commission deducted
      profit =
        (amount - amount * (project.Attributes.commissionPercent / 100)) *
        (project.Attributes.profitMargin / 100);
    } else {
      // no commission
      profit = amount * (project.Attributes.profitMargin / 100);
    }
  } else {
    profit = amount;
  }

  return profit;
};

const processPayment = async (kpi, payment) => {
  const amount = payment.Attributes.amount;

  switch (payment.Attributes.status) {
    case PaymentStatus.APPROVED:
      kpi.revenue += amount;
      kpi.profit += await profitCal(payment);
      break;

    case PaymentStatus.OVERDUE:
      kpi.overdue += amount;
      break;

    case PaymentStatus.REJECTED:
      kpi.cancel += amount;
      break;

    case PaymentStatus.PENDING:
      kpi.pending += amount;
      break;
  }
};

const calculatePaymentKPI = async (payments, filterFn = () => true) => {
  const kpi = createEmptyKPI();

  for (const payment of payments) {
    if (filterFn(payment)) {
      await processPayment(kpi, payment);
    }
  }

  return kpi;
};

// ALL PAYMENTS KPI
export const paymentKPIService = async () => {
  const payments = await getAllPayments();

  if (!payments.length) {
    throw new NotFoundError("No payments were found");
  }

  return calculatePaymentKPI(payments);
};

// PAYMENT KPI BY DATE RANGE
export const paymentKPIRangeService = async (startDate, endDate) => {
  const payments = await getAllPayments();

  if (!payments.length) {
    throw new NotFoundError("No payments were found");
  }
  if (!startDate) {
    throw new BadRequest("No date range specified");
  }

  return calculatePaymentKPI(payments, (payment) => {
    const paymentDate = payment.Attributes.createdAt.split("T")[0];

    return (
      (paymentDate >= startDate && paymentDate <= endDate) ||
      (paymentDate >= startDate && endDate == null)
    );
  });
};

// PROJECT LEVEL PAYMENT KPI
export const projectPaymentKPIService = async (projectId) => {
  const payments = await getAllPayments();

  if (!payments.length) {
    throw new NotFoundError("No payments were found");
  }
  if (!projectId) {
    throw new BadRequest("Project id is not specified");
  }

  return calculatePaymentKPI(
    payments,
    (payment) => payment.Attributes.projectId == projectId
  );
};
