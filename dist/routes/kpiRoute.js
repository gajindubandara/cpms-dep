import { getPaymentKpiController, getPaymentKpiRangeController, getProjectPaymentKpiController, getTicketResponseKpiController, getPaymentSummaryKpiController, getQuotationKpiController, getInvoiceKpiController, getClientKpiController, getClientPaymentKpiController, getClientTicketResponseKpiController } from '../controllers/kpiController.js'
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js'
import { authorize } from '../middlewares/authorizeAccess.js'
import { getProjectProgressKpiController, getClientProjectProgressKpiController } from '../controllers/kpiController.js';
import express from 'express'


const router = express.Router()


router.get("/projects", verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectProgressKpiController);
router.get("/clientprojects", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientProjectProgressKpiController);
router.get("/clientpayments", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientPaymentKpiController);
router.get("/clientticketres", verifyAccessToken, authorize(["g2-cpms-user", "g2-cpms-admin"]), getClientTicketResponseKpiController);
router.get("/clientkpi", verifyAccessToken, authorize(["g2-cpms-admin"]), getClientKpiController);
router.get("/payments", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiController)
router.get("/paymentsrange", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiRangeController)
router.get("/projectpayment", verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectPaymentKpiController)
router.get("/ticketres", verifyAccessToken, authorize(["g2-cpms-admin"]), getTicketResponseKpiController)
router.get("/quotations", verifyAccessToken, authorize(["g2-cpms-admin"]), getQuotationKpiController)
router.get("/invoices", verifyAccessToken, authorize(["g2-cpms-admin"]), getInvoiceKpiController)
router.get("/paymentsummary", verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentSummaryKpiController)
export default router