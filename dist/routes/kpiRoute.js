import {getPaymentKpiController, getPaymentKpiRangeController, getProjectPaymentKpiController} from '../controllers/kpiController.js'
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js'
import { authorize } from '../middlewares/authorizeAccess.js'
import express from 'express'


const router = express.Router()

router.get("/getPaymentKPI",verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiController)
router.get("/getPaymentKPIRange",verifyAccessToken, authorize(["g2-cpms-admin"]), getPaymentKpiRangeController)
router.get("/getProjectPaymentKPI",verifyAccessToken, authorize(["g2-cpms-admin"]), getProjectPaymentKpiController)

export default router