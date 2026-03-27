import { getAllQuotations } from "../daos/quotationDao.js";
import { getAllInvoices } from "../daos/invoiceDao.js";
import { getAllTickets, getTicketsByQueryDateRange } from "../daos/ticketDao.js";
import { getAllPayments } from "../daos/paymentDao.js";
import PaymentStatus from "../enums/paymentStatus.js";
import { getProjectById } from "../daos/projectDao.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import dayjs from "dayjs";


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

  if (payment.Attributes.projectId == null) {
    profit = amount;
  } else {
    const project = await getProjectById(payment.Attributes.projectId);

    if (!project) {
      profit = amount;
    } else if (project.Attributes.commissionPercent == null) {
      // no commission
      profit = amount * (project.Attributes.profitMargin / 100);
    } else {
      // commission deducted
      profit =
        (amount - amount * (project.Attributes.commissionPercent / 100)) *
        (project.Attributes.profitMargin / 100);
    }
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

export const getTicketResponseKpiService = async (startDate, endDate) => {
  let tickets;
  if (startDate && endDate) {
    tickets = await getTicketsByQueryDateRange(startDate, endDate);
  } else {
    tickets = await getAllTickets();
  }
  let responded = 0;
  let notResponded = 0;
  for (const ticket of tickets) {
    const adminResponse = ticket.Attributes?.adminResponse || ticket.adminResponse;
    if (adminResponse && adminResponse.trim() !== "") {
      responded++;
    } else {
      notResponded++;
    }
  }
  const total = tickets.length;
  return {
    total,
    responded,
    notResponded,
    labels: ["Responded", "Not Responded"],
    data: [responded, notResponded],
    startDate: startDate || null,
    endDate: endDate || null
  };
};


// QUOTATION KPI: Total and status breakdown
export const getQuotationKpiService = async (startDate, endDate) => {
  let quotations = await getAllQuotations();
  if (startDate && endDate) {
    quotations = quotations.filter(q => {
      const createdRaw = q.Attributes?.createdAt || q.createdAt;
      const created = createdRaw ? String(createdRaw).split("T")[0] : null;
      return created && created >= startDate && created <= endDate;
    });
  }
  const total = quotations.length;
  const statusCounts = {};
  for (const q of quotations) {
    const status = q.Attributes?.status || q.status || "Unknown";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }
  return {
    total,
    statusCounts,
    startDate: startDate || null,
    endDate: endDate || null,
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts)
  };
};

// INVOICE KPI: Total and status breakdown
export const getInvoiceKpiService = async (startDate, endDate) => {
  let invoices = await getAllInvoices();
  if (startDate && endDate) {
    invoices = invoices.filter(inv => {
      const createdRaw = inv.Attributes?.createdAt || inv.createdAt;
      const created = createdRaw ? String(createdRaw).split("T")[0] : null;
      return created && created >= startDate && created <= endDate;
    });
  }
  const total = invoices.length;
  const statusCounts = {};
  for (const inv of invoices) {
    const status = inv.Attributes?.status || inv.status || "Unknown";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }
  return {
    total,
    statusCounts,
    startDate: startDate || null,
    endDate: endDate || null,
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts)
  };
};

export const getPaymentSummaryKpiService = async (startDate, endDate) => {
  const payments = await getAllPayments();
  let filtered = payments;
  if (startDate && endDate) {
    filtered = payments.filter(p => {
      const createdRaw = p.Attributes?.createdAt || p.createdAt;
      const created = createdRaw ? String(createdRaw).split("T")[0] : null;
      return created && created >= startDate && created <= endDate;
    });
  }
  let total = 0;
  let received = 0;
  let dues = 0;
  for (const payment of filtered) {
    const status = payment.Attributes?.status || payment.status;
    const amount = payment.Attributes?.amount || payment.amount || 0;
    total += amount;
    if (status === "APPROVED") {
      received += amount;
    } else if (status === "OVERDUE" || status === "PENDING") {
      dues += amount;
    }
  }
  return {
    total,
    received,
    dues,
    startDate: startDate || null,
    endDate: endDate || null,
    labels: ["Received", "Dues"],
    data: [received, dues],
    count: filtered.length
  };
};