import { getQuotationKpiService, getInvoiceKpiService } from '../services/kpiService.js';
import { getTicketResponseKpiService } from '../services/kpiService.js';
import {paymentKPIService, paymentKPIRangeService, projectPaymentKPIService} from '../services/kpiService.js'
import dayjs from "dayjs";
import { getPaymentSummaryKpiService } from '../services/kpiService.js';
export const getPaymentKpiController = async(req, res,next)=>{
    try{
        const result = await paymentKPIService();
        res.status(200).json({success:true, data:result})
    }catch(err){
        next(err)
    }
} 

export const getPaymentKpiRangeController = async(req, res,next)=>{
    try{
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        const result = await paymentKPIRangeService(startDate,endDate);
        res.status(200).json({success:true, data:result})
    }catch(err){
        next(err)
    }
} 

export const getProjectPaymentKpiController = async(req, res,next)=>{
    try{
        const projectId = req.query.projectId
        const result = await projectPaymentKPIService(projectId);
        res.status(200).json({success:true, data:result})
    }catch(err){
        next(err)
    }
}

// KPI: Get ticket response counts (responded vs not responded)
export const getTicketResponseKpiController = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await getTicketResponseKpiService(startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// QUOTATION KPI: Total and status breakdown
export const getQuotationKpiController = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await getQuotationKpiService(startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// INVOICE KPI: Total and status breakdown
export const getInvoiceKpiController = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await getInvoiceKpiService(startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// PAYMENT KPI: Overall, yearly, and custom date range
export const getPaymentSummaryKpiController = async (req, res, next) => {
    try {
        let { startDate, endDate } = req.query;
        // Default to current year if not provided
        if (!startDate || !endDate) {
            const now = dayjs();
            startDate = now.startOf('year').format('YYYY-MM-DD');
            endDate = now.endOf('year').format('YYYY-MM-DD');
        }
        const result = await getPaymentSummaryKpiService(startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};