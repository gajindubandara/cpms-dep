import {paymentKPIService, paymentKPIRangeService, projectPaymentKPIService} from '../services/kpiService.js'

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
