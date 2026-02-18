import express from 'express'
import {getPaymentsReportController, getInvoicesReportController, getPaymentsKPIReportController} from '../controllers/reportController.js'

const router = express.Router();

router.get("/getPayment",getPaymentsReportController)
router.get("/getPaymentKPI",getPaymentsKPIReportController)
router.get("/getInvoice",getInvoicesReportController)

export default router;