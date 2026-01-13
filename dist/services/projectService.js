import { v4 as uuidv4 } from "uuid";
import {
  mapCreateProjectDTOtoProjectModel,
  mapUpdateProjectDTOtoProjectModel,
} from "../mappers/projectMapper.js";
import {
  createProject,
  getProjectById,
  featAll,
  featureByFeatId,
  allProjects,
  updateProject,
  updateFeature,
  deleteProject,
  deleteFeature,
  projectsByQueryDate,
  projectByClientId,
} from "../daos/projectDao.js";
import { getClientById } from "../daos/clientDao.js";
import { BadRequest, NotFoundError } from "../errors/customErrors.js";

//create Project
export const createprojectService = async (createProjectDTO) => {
  // Validate required fields before mapping
  if (!createProjectDTO.clientId) {
    throw new BadRequest("clientId is required");
  }

  const featureId = 0;
  const model = mapCreateProjectDTOtoProjectModel(createProjectDTO);

  //check if client with that id is available
  const existClient = await getClientById(model.clientId);
  if (!existClient) {
    throw new NotFoundError("Client with that id is not available");
  }

  return await createProject({
    ...model,
    featureId,
  });
};

//get project by projectId
export const getProjectService = async (projectId) => {
  if (!projectId) throw new BadRequest("Ids are required for querying");
  return await getProjectById(projectId);
};

//create feature service
export const createFeatureService = async (dto) => {
  //validate dto values
  if (!dto.clientId) {
    throw new BadRequest("clientId is required");
  }
  if (!dto.projectId) {
    throw new BadRequest("projectId is required");
  }

  const model = mapCreateProjectDTOtoProjectModel(dto);
  
  // Check if client exists
  const clientIdAvailability = await getClientById(model.clientId);
  if (!clientIdAvailability) {
    throw new NotFoundError("Client not found");
  }

  // Check if project exists
  const projectIdAvailability = await getProjectById(model.projectId);
  if (!projectIdAvailability || projectIdAvailability.length === 0) {
    throw new NotFoundError("No project found with that id");
  }

  const features =  await featAll(model.clientId, model.projectId);
  const featureIds = features.map(item => item.SK?.split("#")[3]).filter(id => id !== undefined);
  
  // Handle case when no features exist yet
  const last = featureIds.length > 0 ? Math.max(...featureIds.map(id => parseInt(id))) : -1;
  const featureId = last + 1;
  
  return await createProject({
    ...model,
    featureId
  });
};

//get feature of a project
export const getFeatureService = async(projectId, featureId) => {
    if(!projectId || !featureId){
      throw new BadRequest("Ids are required to get feature")
    }
    return await featureByFeatId(projectId,featureId)
}

//get all projects
export const getAllProjectsService = async() => {
  const projects =[];
  const result = await allProjects();
  //filter the projects with 0
  result.forEach(element => {
    let pro = (element.SK).split("#")[3]
    if(pro == 0){
      projects.push(element)
    }
  });
  return projects

}

//update project
export const updateProjectService = async(dto) => {
  const projectId = dto.projectId;
  const clientId = dto.clientId;

  const updates = mapUpdateProjectDTOtoProjectModel(dto)
  return updateProject(clientId, projectId, updates);
}


//update project feature
export const updateFeatureService = async(dto) => {
  const projectId = dto.projectId;
  const clientId = dto.clientId;
  const featureId = dto.featureId;

  const updates = mapUpdateProjectDTOtoProjectModel(dto)
  return updateFeature(clientId, projectId, featureId, updates);
}

//delete project
export const deleteProjectService = async (clientId, projectId) => {
  if (!clientId || !projectId) {
    throw new BadRequest("The ids are required for query");
  }

  const features = await featAll(clientId, projectId);
  const featureIds = features.map(item => item.SK?.split("#")[3]);
  // Delete each feature except "0"
  for (const featureId of featureIds) {
    if (featureId !== "0") {
      await deleteFeature(clientId, projectId, featureId);
    }
  }

  // Delete the project
  const result = await deleteProject(clientId, projectId);
  return result;
};



//delete feature
export const deleteFeatureService = async(clientId, projectId, featureId) => {
  if(!clientId || !projectId){
    throw new BadRequest("The ids are required for query")
  }
  const result = await deleteFeature(clientId, projectId, featureId);
  return result;
}


//query by date
export const getProjectsbyquerydateService = async(queryDate) => {
  if(!queryDate){
    throw new BadRequest("valid Query date is needed to retreive information")
  }

  const projects = await projectsByQueryDate(queryDate)
  return projects;
}


//get client projects
export const getClientProjectsService = async(clientId) =>{
  if(!clientId){
    throw new BadRequest("ClientId is needed for querying")
  }

  const projects = await projectByClientId(clientId)
  const onlyProjects = [];
  projects.forEach(element =>{
    let project = (element.SK).split("#")[3]
    if(project == 0){
      onlyProjects.push(element)
    }
  })
  return onlyProjects;
  
}