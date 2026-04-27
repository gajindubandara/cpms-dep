import express from "express";
import {
  createDocumentController,
  getAllDocumentsController,
  updateDocumentController,
  deleteDocumentController,
} from "../controllers/documentController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { authorize } from "../middlewares/authorizeAccess.js";

const router = express.Router();

// All routes require authentication
// Note: Specific routes must come BEFORE parameterized routes to avoid conflicts

/**
 * POST /documents
 * Create a new document (Quotation or Invoice)
 */
router.post(
  "/",
  verifyAccessToken,
  authorize(["g2-cpms-admin"]),
  createDocumentController
);

/**
 * GET /documents
 * Get all documents (both Quotations and Invoices)
 */
router.get(
  "/",
  verifyAccessToken,
  authorize(["g2-cpms-admin","g2-cpms-user"]),
  getAllDocumentsController
);

/**
 * PUT /documents
 * Update a document by type and documentNumber
 * Query: ?type=QUOTATION&documentNumber=WEB0020
 */
router.put(
  "/",
  verifyAccessToken,
  authorize(["g2-cpms-admin"]),
  updateDocumentController
);

/**
 * DELETE /documents
 * Delete a document by type and documentNumber
 * Query: ?type=QUOTATION&documentNumber=WEB0020
 */
router.delete(
  "/",
  verifyAccessToken,
  authorize(["g2-cpms-admin"]),
  deleteDocumentController
);

export default router;

