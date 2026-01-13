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

router.post("/create-project",verifyAccessToken,authorize(["g2-cpms-admin"]), createProject);
router.post("/create-feature",verifyAccessToken,authorize(["g2-cpms-admin"]), createFeature);
router.get("/clientProjects",verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getClientProjects);
router.delete("/delete-project",verifyAccessToken,authorize(["g2-cpms-admin"]), deleteProject)
router.delete("/delete-feature",verifyAccessToken,authorize(["g2-cpms-admin"]), deleteFeature)
router.put("/update-project",verifyAccessToken,authorize(["g2-cpms-admin"]), updateProject);
router.put("/update-feature",verifyAccessToken,authorize(["g2-cpms-admin"]), updateFeature);
router.get("/queryDate",verifyAccessToken,authorize(["g2-cpms-admin"]), getProjectsbyquerydate)
router.get("/get-feature",verifyAccessToken,authorize(["g2-cpms-admin"]), getFeature);
router.get("/get-all",verifyAccessToken,authorize(["g2-cpms-admin"]), getAllProjects);
router.get("/:projectId",verifyAccessToken,authorize(["g2-cpms-admin","g2-cpms-user"]), getProjectById);
export default router;
