import express from "express";
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';
import { authorize } from '../middlewares/authorizeAccess.js';
import {
  createProject,
  getProjectById,
  createFeature,
  getFeature,
  getAllProjects,
  updateProject,
  updateFeature,
  deleteProject,
  deleteFeature,
  getProjectsbyquerydate,
  getClientProjects
} from "../controllers/projectController.js";
const router = express.Router();

// Specific routes first
router.get("/clientProjects",verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getClientProjects);
router.get("/queryDate",verifyAccessToken,authorize(["g2-cpms-admin"]), getProjectsbyquerydate)
router.post("/",verifyAccessToken,authorize(["g2-cpms-admin"]), createProject);
router.post("/:projectId/features",verifyAccessToken,authorize(["g2-cpms-admin"]), createFeature);
router.get("/",verifyAccessToken,authorize(["g2-cpms-admin"]), getAllProjects);
router.get("/:projectId",verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getProjectById);
router.get("/:projectId/features/:featureId",verifyAccessToken,authorize(["g2-cpms-admin"]), getFeature);
router.put("/:projectId",verifyAccessToken,authorize(["g2-cpms-admin"]), updateProject);
router.put("/:projectId/features/:featureId",verifyAccessToken,authorize(["g2-cpms-admin"]), updateFeature);
router.delete("/:projectId",verifyAccessToken,authorize(["g2-cpms-admin"]), deleteProject)
router.delete("/:projectId/features/:featureId",verifyAccessToken,authorize(["g2-cpms-admin"]), deleteFeature)
export default router;
