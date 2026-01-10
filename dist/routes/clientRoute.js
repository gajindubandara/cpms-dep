import express from "express";
import {
  createClient,
  updateClient,
  getClientById,
  getAllClients,
  getAllClientsByQueryDate,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/createClient", createClient);
router.put("/:clientId", updateClient);
router.get("/date", getAllClientsByQueryDate);
router.get("/:clientId", getClientById);
router.get("/getAllClients", getAllClients);
router.delete("/:clientId", deleteClient);

export default router;
