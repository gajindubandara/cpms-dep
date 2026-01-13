import express from "express";
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';
import {
  createClient,
  updateClient,
  getClientById,
  getAllClients,
  getAllClientsByQueryDate,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/",verifyAccessToken, authorize(["g2-cpms-admin"]), createClient);
router.put("/:clientId",verifyAccessToken, authorize(["g2-cpms-admin"]), updateClient);
router.get("/date",verifyAccessToken, authorize(["g2-cpms-admin"]), getAllClientsByQueryDate);
router.get("/:clientId",verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getClientById);
router.get("/",verifyAccessToken, authorize(["g2-cpms-admin"]), getAllClients);
router.delete("/:clientId",verifyAccessToken, authorize(["g2-cpms-admin"]), deleteClient);

export default router;
