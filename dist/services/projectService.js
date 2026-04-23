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
import { BadRequest, NotFoundError, AlreadyExistsError } from "../errors/customErrors.js";
import { buildNotificationMessage, sendTelegramNotification } from "../config/telegramNotificationService.js";
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
  const result = await allProjects();
  const projects =[];
  //filter the projects with 0
  result.forEach(element => {
    let pro = (element.SK).split("#")[3]
    if(pro == 0){
      projects.push(element)
    }
  });

  for(const project of projects){
    if((project.SK).split("#")[1] == model.projectId){
      throw new AlreadyExistsError("Id already exists, try a new one")
    }
  }

  const created = await createProject({
    ...model,
    featureId,
  });

  void sendTelegramNotification(
    buildNotificationMessage('New project created', [
      `Project ID: ${model.projectId}`,
      `Client ID: ${model.clientId}`,
      `Project Name: ${model.projectName || 'N/A'}`,
    ])
  );

  return created;
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
  // Extract only feature IDs (exclude featureId=0 which is the base project)
  const featureIds = features
    .map(item => item.SK?.split("#")[3])
    .filter(id => id !== undefined && id !== '0')
    .map(id => Number.parseInt(id));
  
  // Find the max featureId among existing features (not the base project)
  const last = featureIds.length > 0 ? Math.max(...featureIds) : 0;
  const featureId = last + 1; // Always >= 1 for features
  
  const created = await createProject({
    ...model,
    featureId
  });

  void sendTelegramNotification(
    buildNotificationMessage('New project feature created', [
      `Project ID: ${model.projectId}`,
      `Feature ID: ${featureId}`,
      `Client ID: ${model.clientId}`,
    ])
  );

  return created;
};

//get feature of a project
export const getFeatureService = async(projectId, featureId) => {
    if(!projectId || !featureId){
      throw new BadRequest("Ids are required to get feature")
    }
    return await featureByFeatId(projectId,featureId)
}

//get all projects and features
export const getAllProjectsService = async() => {
  const result = await allProjects();
  //return all items (both projects with featureId=0 and features with featureId>0)
  return result;
}

//update project
export const updateProjectService = async(dto) => {
  const projectId = dto.projectId;
  const clientId = dto.clientId;

  const updates = mapUpdateProjectDTOtoProjectModel(dto)
  const updated = await updateProject(clientId, projectId, updates);
  void sendTelegramNotification(
    buildNotificationMessage('Project updated', [
      `Project ID: ${projectId}`,
      `Client ID: ${clientId}`,
    ])
  );
  return updated;
}


//update project feature
export const updateFeatureService = async(dto) => {
  const projectId = dto.projectId;
  const clientId = dto.clientId;
  const featureId = dto.featureId;

  const updates = mapUpdateProjectDTOtoProjectModel(dto)
  const updated = await updateFeature(clientId, projectId, featureId, updates);
  void sendTelegramNotification(
    buildNotificationMessage('Project feature updated', [
      `Project ID: ${projectId}`,
      `Feature ID: ${featureId}`,
      `Client ID: ${clientId}`,
    ])
  );
  return updated;
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


//get client projects and features
export const getClientProjectsService = async(clientId) =>{
  if(!clientId){
    throw new BadRequest("ClientId is needed for querying")
  }

  const result = await projectByClientId(clientId)
  //return all items (both projects with featureId=0 and features with featureId>0)
  return result;
}