import { exportToCSV } from "../utils/csvExport.js";
import { getPaymentsKPIReportService, getInvoicesReportService, getPaymentsReportService, getQuotationsReportService } from "../services/reportService.js";

export const getPaymentsReportController = async (req, res, next) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    const payments = await getPaymentsReportService(startDate, endDate);
    console.log("payments filtered", payments);
    if (req.query.csv === "true") {
      // Define fields for CSV export
      const fields = [
        {label: "Client Id", value: (row) => row.Attributes.clientId},
        {label: "Payment Id", value: (row) => row.Attributes.paymentId},
        {label: "project Id", value: (row) => row.Attributes.projectId},
        {label: "Description", value: (row) => row.Attributes.description},
        {label: "currency", value: (row) => row.Attributes.currency},
        {label: "Amount", value: (row) => row.Attributes.amount},
        {label: "Due Date", value: (row) => row.Attributes.dueDate},
        {label: "Status", value: (row) => row.Attributes.status},
        {label: "Created At", value: (row) => row.Attributes.createdAt},
      ];
      return exportToCSV(payments, fields, "payments_report.csv", res);
    } else {
      return res.status(200).json({
        success: true,
        data: payments,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getInvoicesReportController = async (req, res, next) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    const invoices = await getInvoicesReportService(startDate, endDate);
    console.log("invoices filtered", invoices);
    if (req.query.csv === "true") {
      const fields = [
        { label: "Invoice ID", value: (row) => row.PK },
        { label: "Client ID", value: (row) => row.Attributes.clientId },
        { label: "Client Name", value: (row) => row.Attributes.clientName },
        { label: "Client Email", value: (row) => row.Attributes.clientEmail },
        { label: "Project ID", value: (row) => row.Attributes.projectId },
        { label: "Project Name", value: (row) => row.Attributes.projectName },
        { label: "Amount", value: (row) => row.Attributes.amount },
        { label: "Description", value: (row) => row.Attributes.description },
        { label: "Status", value: (row) => row.Attributes.status },
        { label: "Created At", value: (row) => row.Attributes.createdAt },
        { label: "Updated At", value: (row) => row.Attributes.updatedAt },
        {
          label: "Items",
          value: (row) =>
            row.Attributes.items
              .map(
                (item) =>
                  `${item.name} (Qty: ${item.quantity}, Unit Price: ${item.unitPrice}, Total: ${item.total})`,
              )
              .join("\n"),
        },
      ];
      return exportToCSV(invoices, fields, "invoices_report.csv", res);
    } else {
      return res.status(200).json({
        success: true,
        data: invoices,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getPaymentsKPIReportController = async (req, res, next) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    const kpi = await getPaymentsKPIReportService(startDate, endDate);
    if (req.query.csv === "true") {
      // kpi is an object, wrap in array for CSV
      const fields = ["revenue", "profit", "overdue", "cancel", "pending"];
      return exportToCSV([kpi], fields, "payments_kpi_report.csv", res);
    } else {
      return res.status(200).json({
        success: true,
        data: kpi,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getQuotationsReportController = async (req, res, next) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    const quotations = await getQuotationsReportService(startDate, endDate);
    console.log("quotations filtered", quotations);
    if (req.query.csv === "true") {
      const fields = [
        { label: "Quotation ID", value: (row) => row.quotationId },
        { label: "Client ID", value: (row) => row.clientId },
        { label: "Client Name", value: (row) => row.clientName },
        { label: "Client Email", value: (row) => row.clientEmail },
        { label: "Project ID", value: (row) => row.projectId },
        { label: "Project Name", value: (row) => row.projectName },
        { label: "Amount", value: (row) => row.amount },
        { label: "Description", value: (row) => row.description },
        { label: "Status", value: (row) => row.status },
        { label: "Valid Until", value: (row) => row.validUntil },
        { label: "Created At", value: (row) => row.createdAt },
        { label: "Updated At", value: (row) => row.updatedAt },
        {
          label: "Items",
          value: (row) =>
            row.items
              ?.map(
                (item) =>
                  `${item.name} (Qty: ${item.quantity}, Unit Price: ${item.unitPrice}, Total: ${item.total})`,
              )
              .join("\n") || "",
        },
      ];
      return exportToCSV(quotations, fields, "quotations_report.csv", res);
    } else {
      return res.status(200).json({
        success: true,
        data: quotations,
      });
    }
  } catch (err) {
    next(err);
  }
};
