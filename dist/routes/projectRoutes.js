import express from "express";
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

router.post("/create-project", createProject);
router.post("/create-feature", createFeature);
router.get("/clientProjects", getClientProjects);
router.delete("/delete-project",deleteProject)
router.delete("/delete-feature",deleteFeature)
router.put("/update-project", updateProject);
router.put("/update-feature", updateFeature);
router.get("/queryDate", getProjectsbyquerydate)
router.get("/get-feature", getFeature);
router.get("/get-all", getAllProjects);
router.get("/:projectId", getProjectById);
export default router;
