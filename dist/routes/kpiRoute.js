import {getPaymentKpiController, getPaymentKpiRangeController, getProjectPaymentKpiController, getTicketResponseKpiController, getPaymentSummaryKpiController, getQuotationKpiController, getInvoiceKpiController} from '../controllers/kpiController.js'
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js'
import { authorize } from '../middlewares/authorizeAccess.js'
import express from 'express'


const router = express.Router()

router.get("/getPaymentKPI",verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiController)
router.get("/getPaymentKPIRange",verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiRangeController)
router.get("/getProjectPaymentKPI",verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectPaymentKpiController)
router.get("/getTicketResponseKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getTicketResponseKpiController)
router.get("/getQuotationKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getQuotationKpiController)
router.get("/getInvoiceKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getInvoiceKpiController)
router.get("/getPaymentSummaryKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentSummaryKpiController)
export default router