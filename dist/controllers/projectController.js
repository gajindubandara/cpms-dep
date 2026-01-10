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
  getProjectsbyquerydateService
} from "../services/projectService.js";

//create project
export const createProject = async (req, res) => {
  try {
    const dto = new ProjectDTO(req.body);
    const result = await createprojectService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get ProjectById
export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const result = await getProjectService(projectId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//create feature for project
export const createFeature = async (req, res) => {
  try {
    const dto = new ProjectDTO(req.body);

    const result = await createFeatureService(dto);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//controller for getfeature
export const getFeature = async (req, res) => {
  try {
    console.log("this is being accessed");
    const projectId = req.query.projectId;
    const featureId = req.query.featureId;
    console.log("projectId" + projectId + "featureId " + featureId);
    const result = await getFeatureService(projectId, featureId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get all projects
export const getAllProjects = async (req, res) => {
  try {
    const result = await getAllProjectsService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//update project
export const updateProject = async (req, res) => {
  try {
    const dto = new ProjectDTO(req.body);
    const result = await updateProjectService(dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const dto = new ProjectDTO(req.body);
    const result = await updateFeatureService(dto);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//delete project
export const deleteProject = async (req, res) => {
  try {
    const clientId = req.query.clientId;
    const projectId = req.query.projectId;
    const result = await deleteProjectService(clientId, projectId);
    res.status(200).json({success: true, data: result, message: "Project deleted successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: err.message});
  }
};
//delete feature
export const deleteFeature = async (req, res) => {
  try {
    const clientId = req.query.clientId;
    const projectId = req.query.projectId;
    const featureId = req.query.featureId;
    const result = await deleteFeatureService(clientId, projectId, featureId);
    res.status(200).json({success: true, data: result});
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: err.message});
  }
};


//get projects by queryDate
export const getProjectsbyquerydate = async(req,res) => {
    try{
        const queryDate = req.query.queryDate;
        const result = await getProjectsbyquerydateService(queryDate)
        res.status(200).json({success:true, data: result})
    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}