import { getQuotationKpiService, getInvoiceKpiService } from '../services/kpiService.js';
import { getTicketResponseKpiService, getClientTicketResponseKpiService } from '../services/kpiService.js';
import {paymentKPIService, paymentKPIRangeService, projectPaymentKPIService, getClientPaymentKpiService} from '../services/kpiService.js'
import { getProjectProgressKpiService, getClientProjectProgressKpiService } from '../services/kpiService.js';
import { getClientKpiService } from '../services/kpiService.js';
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
        let { startDate, endDate, all } = req.query;
        // If 'all' flag is true, retrieve unfiltered (all time) data.
        if (all === 'true') {
            startDate = undefined;
            endDate = undefined;
        } else {
            // Default to current year if not provided
            if (!startDate || !endDate) {
                const now = dayjs();
                startDate = now.startOf('year').format('YYYY-MM-DD');
                endDate = now.endOf('year').format('YYYY-MM-DD');
            }
        }

        const result = await getPaymentSummaryKpiService(startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// PROJECT PROGRESS KPI: Admin (all projects)
export const getProjectProgressKpiController = async (req, res, next) => {
    try {
        const result = await getProjectProgressKpiService();
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// PROJECT PROGRESS KPI: Client (only their projects)
export const getClientProjectProgressKpiController = async (req, res, next) => {
    try {
        const clientId = req.user?.sub || req.user?.clientId;
        if (!clientId) {
            return res.status(400).json({ success: false, message: 'Client ID not found in token.' });
        }
        const result = await getClientProjectProgressKpiService(clientId);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// CLIENT: Payment KPI for the authenticated client
export const getClientPaymentKpiController = async (req, res, next) => {
    try {
        const clientId = req.user?.sub || req.user?.clientId;
        if (!clientId) return res.status(400).json({ success: false, message: 'Client ID not found in token.' });
        const { startDate, endDate } = req.query;
        const result = await getClientPaymentKpiService(clientId, startDate, endDate);
        
        // Remove profit to prevent business margin exposure to clients
        delete result.profit;
        
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// CLIENT: Ticket response KPI for the authenticated client
export const getClientTicketResponseKpiController = async (req, res, next) => {
    try {
        const clientId = req.user?.sub || req.user?.clientId;
        if (!clientId) return res.status(400).json({ success: false, message: 'Client ID not found in token.' });
        const { startDate, endDate } = req.query;
        const result = await getClientTicketResponseKpiService(clientId, startDate, endDate);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// CLIENT KPI for admin: counts by status and type
export const getClientKpiController = async (req, res, next) => {
    try {
        const result = await getClientKpiService();
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};