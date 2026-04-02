import { getPaymentKpiController, getPaymentKpiRangeController, getProjectPaymentKpiController, getTicketResponseKpiController, getPaymentSummaryKpiController, getQuotationKpiController, getInvoiceKpiController, getClientKpiController, getClientPaymentKpiController, getClientTicketResponseKpiController } from '../controllers/kpiController.js'
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js'
import { authorize } from '../middlewares/authorizeAccess.js'
import { getProjectProgressKpiController, getClientProjectProgressKpiController } from '../controllers/kpiController.js';
import express from 'express'


const router = express.Router()


router.get("/getProjectProgressKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectProgressKpiController);
router.get("/getClientProjectProgressKPI", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientProjectProgressKpiController);
router.get("/getClientPaymentKPI", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientPaymentKpiController);
router.get("/getClientTicketResponseKPI", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientTicketResponseKpiController);
router.get("/getClientKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getClientKpiController);
router.get("/getPaymentKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiController)
router.get("/getPaymentKPIRange", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiRangeController)
router.get("/getProjectPaymentKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectPaymentKpiController)
router.get("/getTicketResponseKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getTicketResponseKpiController)
router.get("/getQuotationKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getQuotationKpiController)
router.get("/getInvoiceKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getInvoiceKpiController)
router.get("/getPaymentSummaryKPI", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentSummaryKpiController)
export default router