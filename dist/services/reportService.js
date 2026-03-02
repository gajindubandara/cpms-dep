import { paymentKPIRangeService } from '../services/kpiService.js';
import {getAllPayments} from '../daos/paymentDao.js'
import {getAllInvoices} from '../daos/invoiceDao.js'
import {getAllQuotations} from '../daos/quotationDao.js'
import { BadRequest, NotFoundError } from '../errors/customErrors.js';

// Get payment KPI (revenue, profit, etc) for a date range
export const getPaymentsKPIReportService = async (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new BadRequest("Date range is needed");
    }
    return await paymentKPIRangeService(startDate, endDate);
};

export const getPaymentsReportService = async(startDate, endDate) =>{
    const payments = await getAllPayments();
    console.log(payments)
    if(!payments.length) throw new NotFoundError("No payments found");

    if(!startDate || !endDate){
        throw new BadRequest("Date range is needed")
    }
    let rangePayments = [];
    for(let payment of payments){
        let createDate = payment.Attributes.createdAt.split('T')[0];
        if(createDate >= startDate && createDate <= endDate){
            rangePayments.push(payment);
        }
    }
    if(!rangePayments.length){
        throw new NotFoundError('No payments found on that dates')
    }
    console.log("this is range payments",rangePayments)
    return rangePayments;
}

export const getInvoicesReportService = async (startDate, endDate) => {
    const invoices = await getAllInvoices();
    console.log(invoices);
    if (!invoices.length) throw new NotFoundError("No invoices found");

    if (!startDate || !endDate) {
        throw new BadRequest("Date range is needed");
    }
    let rangeInvoices = [];
    for (let invoice of invoices) {
        let createDate = invoice.Attributes?.createdAt?.split('T')[0];
        if (createDate && createDate >= startDate && createDate <= endDate) {
            rangeInvoices.push(invoice);
        }
    }
    if (!rangeInvoices.length) {
        throw new NotFoundError('No invoices found on that dates');
    }
    console.log("this is range invoices", rangeInvoices);
    return rangeInvoices;
}

export const getQuotationsReportService = async (startDate, endDate) => {
    const quotations = await getAllQuotations();
    console.log(quotations);
    if (!quotations.length) throw new NotFoundError("No quotations found");

    if (!startDate || !endDate) {
        throw new BadRequest("Date range is needed");
    }
    let rangeQuotations = [];
    for (let quotation of quotations) {
        let createDate = quotation.createdAt?.split('T')[0];
        if (createDate && createDate >= startDate && createDate <= endDate) {
            rangeQuotations.push(quotation);
        }
    }
    if (!rangeQuotations.length) {
        throw new NotFoundError('No quotations found on that dates');
    }
    console.log("this is range quotations", rangeQuotations);
    return rangeQuotations;
}