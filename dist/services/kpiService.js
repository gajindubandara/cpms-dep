import { getAllQuotations } from "../daos/quotationDao.js";
import { getAllInvoices } from "../daos/invoiceDao.js";
import { getAllTickets, getTicketsByQueryDateRange, getTicketsByClientId } from "../daos/ticketDao.js";
import { getAllPayments, getPaymentsByClientId } from "../daos/paymentDao.js";
import { getAllExpenses } from "../daos/expenseDao.js";
import { allProjects, projectByClientId } from '../daos/projectDao.js';
import { getAllClients } from '../daos/clientDao.js';
import PaymentStatus from "../enums/paymentStatus.js";
import { ExpenseStatus } from "../enums/expenseStatus.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";
import dayjs from "dayjs";
import { ProjectStatus } from '../enums/projectStatus.js';
import { Status as ClientStatus } from '../enums/clientStatus.js';
import { ClientType } from '../enums/clientType.js';


const createEmptyKPI = () => ({
  revenue: 0,
  overdue: 0,
  cancel: 0,
  pending: 0,
});

const processPayment = (kpi, payment) => {
  const amount = payment.Attributes?.amount || payment.amount || 0;
  let status = payment.Attributes?.status || payment.status;
  const dueDate = payment.Attributes?.dueDate || payment.dueDate;

  if (status === PaymentStatus.PENDING && dueDate) {
    if (dayjs(dueDate).startOf('day').isBefore(dayjs().startOf('day'))) {
      status = PaymentStatus.OVERDUE;
    }
  }

  switch (status) {
    case PaymentStatus.APPROVED:
      kpi.revenue += amount;
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

const calculatePaymentKPI = (payments, filterFn = () => true) => {
  const kpi = createEmptyKPI();
  for (const payment of payments) {
    if (filterFn(payment)) processPayment(kpi, payment);
  }
  return kpi;
};

const calculatePaymentKPIByCurrency = (payments, filterFn = () => true) => {
  const byCurrency = {};
  for (const payment of payments) {
    if (!filterFn(payment)) continue;
    const currency = (payment.Attributes?.currency || payment.currency || 'USD').toUpperCase();
    if (!byCurrency[currency]) byCurrency[currency] = createEmptyKPI();
    processPayment(byCurrency[currency], payment);
  }
  return byCurrency;
};

// ALL PAYMENTS KPI
export const paymentKPIService = async () => {
  const payments = await getAllPayments();
  if (!payments.length) throw new NotFoundError("No payments were found");
  return calculatePaymentKPI(payments);
};

// PAYMENT KPI BY DATE RANGE
export const paymentKPIRangeService = async (startDate, endDate) => {
  const payments = await getAllPayments();
  if (!payments.length) throw new NotFoundError("No payments were found");
  if (!startDate) throw new BadRequest("No date range specified");
  return calculatePaymentKPI(payments, (payment) => {
    const paymentDate = payment.Attributes.createdAt.split("T")[0];
    return (paymentDate >= startDate && paymentDate <= endDate) || (paymentDate >= startDate && endDate == null);
  });
};

// PROJECT LEVEL PAYMENT KPI
export const projectPaymentKPIService = async (projectId) => {
  const payments = await getAllPayments();
  if (!payments.length) throw new NotFoundError("No payments were found");
  if (!projectId) throw new BadRequest("Project id is not specified");
  return calculatePaymentKPI(payments, (payment) => payment.Attributes.projectId == projectId);
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
    let status = payment.Attributes?.status || payment.status;
    const amount = payment.Attributes?.amount || payment.amount || 0;
    const dueDate = payment.Attributes?.dueDate || payment.dueDate;

    if (status === "PENDING" && dueDate) {
      if (dayjs(dueDate).startOf('day').isBefore(dayjs().startOf('day'))) {
        status = "OVERDUE";
      }
    }

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

// Helper to calculate project progress/completion KPIs
function calculateProjectProgressKPI(projects) {
  const total = projects.length;
  let completed = 0;
  let active = 0;
  let planned = 0;
  let onHold = 0;
  for (const p of projects) {
    const status = p.Attributes?.status || p.status;
    if (status === ProjectStatus.COMPLETED) completed++;
    else if (status === ProjectStatus.ACTIVE) active++;
    else if (status === ProjectStatus.PLANNED) planned++;
    else if (status === ProjectStatus.ON_HOLD) onHold++;
  }
  return {
    total,
    completed,
    active,
    planned,
    onHold,
    percentCompleted: total ? Math.round((completed / total) * 100) : 0,
    labels: ['Completed', 'Active', 'Planned', 'On Hold'],
    data: [completed, active, planned, onHold],
  };
}

// Admin: All projects progress KPI
export const getProjectProgressKpiService = async () => {
  const projects = await allProjects();
  // Only top-level projects (featureId == 0)
  const filtered = projects.filter(p => (p.SK || '').split('#')[3] == 0);
  return calculateProjectProgressKPI(filtered);
};

// Client: Only their projects progress KPI
export const getClientProjectProgressKpiService = async (clientId) => {
  const projects = await projectByClientId(clientId);
  // Only top-level projects (featureId == 0)
  const filtered = projects.filter(p => (p.SK || '').split('#')[3] == 0);
  return calculateProjectProgressKPI(filtered);
};

// CLIENT KPI: status and type breakdown for admin dashboard
export const getClientKpiService = async () => {
  const clients = await getAllClients();
  const total = (clients || []).length;
  let active = 0;
  let inactive = 0;
  const typeCounts = {};

  for (const c of clients) {
    const status = c.Attributes?.status || c.status;
    const type = c.Attributes?.clientType || c.Attributes?.type || c.type || ClientType.UNASSIGNED;

    if (status === ClientStatus.ACTIVE) active++;
    else inactive++;

    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  const allTypes = Object.values(ClientType);
  const labels = Object.keys(typeCounts).length ? Object.keys(typeCounts) : allTypes;
  const dataArr = labels.map((l) => typeCounts[l] || 0);

  return {
    total,
    active,
    inactive,
    percentActive: total ? Math.round((active / total) * 100) : 0,
    typeCounts,
    labels,
    data: dataArr,
  };
};

// ADMIN EXPENSE KPI: grouped by currency
export const getExpenseKPIByCurrencyService = async (startDate, endDate) => {
  const expenses = await getAllExpenses();
  if (!expenses.length) return { byCurrency: {}, count: 0 };

  const byCurrency = {};
  let count = 0;
  for (const expense of expenses) {
    const createdAt = (expense.Attributes?.createdAt || expense.createdAt || '').split('T')[0];
    if (startDate && endDate && !(createdAt >= startDate && createdAt <= endDate)) continue;

    count++;
    const currency = (expense.Attributes?.currency || expense.currency || 'USD').toUpperCase();
    const amount = expense.Attributes?.amount || expense.amount || 0;
    const status = expense.Attributes?.expenseStatus || expense.expenseStatus || ExpenseStatus.PENDING;

    if (!byCurrency[currency]) byCurrency[currency] = { pending: 0, done: 0 };
    if (status === ExpenseStatus.DONE) byCurrency[currency].done += amount;
    else byCurrency[currency].pending += amount;
  }

  return { byCurrency, count };
};

// ADMIN PAYMENT KPI: grouped by currency (all payments)
export const getAdminPaymentKPIByCurrencyService = async (startDate, endDate) => {
  const payments = await getAllPayments();
  if (!payments.length) return { byCurrency: {} };

  const byCurrency = calculatePaymentKPIByCurrency(payments, (payment) => {
    if (!startDate || !endDate) return true;
    const paymentDate = (payment.Attributes?.createdAt || payment.createdAt || '').split('T')[0];
    return paymentDate && paymentDate >= startDate && paymentDate <= endDate;
  });

  return { byCurrency };
};

// CLIENT PAYMENT KPI: grouped by currency
export const getClientPaymentKpiService = async (clientId, startDate, endDate) => {
  if (!clientId) throw new BadRequest("Client id is not specified");

  const payments = await getPaymentsByClientId(clientId);
  if (!payments.length) return { byCurrency: {} };

  const byCurrency = calculatePaymentKPIByCurrency(payments, (payment) => {
    if (!startDate || !endDate) return true;
    const paymentDate = (payment.Attributes?.createdAt || payment.createdAt || '').split('T')[0];
    return paymentDate && paymentDate >= startDate && paymentDate <= endDate;
  });

  return { byCurrency };
};

// CLIENT TICKET RESPONSE KPI: tickets belonging to a client (optional date range)
export const getClientTicketResponseKpiService = async (clientId, startDate, endDate) => {
  if (!clientId) {
    throw new BadRequest("Client id is not specified");
  }

  const tickets = await getTicketsByClientId(clientId);

  if (!tickets.length) {
    return {
      total: 0,
      responded: 0,
      notResponded: 0,
      labels: ["Responded", "Not Responded"],
      data: [0, 0],
      startDate: startDate || null,
      endDate: endDate || null
    };
  }

  const filtered = (startDate && endDate)
    ? tickets.filter(t => {
        const qd = t.queryDate || (t.Attributes && t.Attributes.queryDate) || null;
        return qd && qd >= startDate && qd <= endDate;
      })
    : tickets;

  let responded = 0;
  let notResponded = 0;
  for (const ticket of filtered) {
    const adminResponse = ticket.Attributes?.adminResponse || ticket.adminResponse;
    if (adminResponse && String(adminResponse).trim() !== "") responded++;
    else notResponded++;
  }

  const total = filtered.length;
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