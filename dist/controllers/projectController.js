import { ProjectDTO } from "../dtos/projectDto.js";
import {
  createprojectService,
  getProjectService,
  createFeatureService,
  getFeatureService,
  getAllProjectsService,
  updateProjectService,
  updateFeatureService,
  deleteProjectService,
  deleteFeatureService,
  getProjectsbyquerydateService,
  getClientProjectsService,
} from "../services/projectService.js";
import { validateProjectDTO } from "../validators/projectValidator.js";
import { NotFoundError } from "../errors/customErrors.js";

// create project
export const createProject = async (req, res, next) => {
  try {
    const dto = new ProjectDTO(req.body);
    validateProjectDTO(dto);
    const result = await createprojectService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get ProjectById
export const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const result = await getProjectService(projectId);

    if (!result) {
      throw new NotFoundError("Project with that id not found");
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// create feature for project
export const createFeature = async (req, res, next) => {
  try {
    const dto = new ProjectDTO(req.body);
    validateProjectDTO(dto);
    const result = await createFeatureService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// controller for getfeature
export const getFeature = async (req, res, next) => {
  try {
    const projectId = req.query.projectId;
    const featureId = req.query.featureId;
    const result = await getFeatureService(projectId, featureId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get all projects
export const getAllProjects = async (req, res, next) => {
  try {
    const result = await getAllProjectsService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// update project
export const updateProject = async (req, res, next) => {
  try {
    const dto = new ProjectDTO(req.body);
    const result = await updateProjectService(dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateFeature = async (req, res, next) => {
  try {
    const dto = new ProjectDTO(req.body);
    validateProjectDTO(dto);
    const result = await updateFeatureService(dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// delete project
export const deleteProject = async (req, res, next) => {
  try {
    const clientId = req.query.clientId;
    const projectId = req.query.projectId;
    const result = await deleteProjectService(clientId, projectId);
    res.status(200).json({
      success: true,
      data: result,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// delete feature
export const deleteFeature = async (req, res, next) => {
  try {
    const clientId = req.query.clientId;
    const projectId = req.query.projectId;
    const featureId = req.query.featureId;
    const result = await deleteFeatureService(clientId, projectId, featureId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};


// get projects by queryDate
export const getProjectsbyquerydate = async (req, res, next) => {
  try {
    const queryDate = req.query.queryDate;
    const result = await getProjectsbyquerydateService(queryDate);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// get projects by clientID
export const getClientProjects = async (req, res, next) => {
  try {
    const clientId = req.query.clientId;
    const result = await getClientProjectsService(clientId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
