import { v4 as uuidv4 } from "uuid";
import {
  mapCreateProjectDTOtoProjectModel,
  mapUpdateProjectDTOtoProjectModel,
} from "../mappers/projectMapper.js";
import { createProject, getProjectById, featAll, featureByFeatId, allProjects, updateProject, updateFeature, deleteProject, deleteFeature, projectsByQueryDate } from "../daos/projectDao.js";
import { getClientById } from "../daos/clientDao.js";

//create Project
export const createprojectService = async (createProjectDTO) => {
  const projectId = uuidv4();
  const featureId = 0;
  const model = mapCreateProjectDTOtoProjectModel(createProjectDTO);

  //check if client with that id is avaialable
  const existClient = await getClientById(model.clientId);
  console.log("existing client received at projecetservice", existClient);

  return await createProject({
    ...model,
    projectId,
    featureId,
  });
};

//get project by projectId
export const getProjectService = async (projectId) => {
  if (!projectId) throw new Error("Ids are required for querying");
  return await getProjectById(projectId);
};

//create feature service
export const createFeatureService = async (dto) => {
  const model = mapCreateProjectDTOtoProjectModel(dto);
  const features =  await featAll(model.clientId,model.projectId);
  const featureIds = features.map(item => item.SK?.split("#")[3]);
  const last = Math.max(...featureIds);
  const featureId = last+1;
  return await createProject({
    ...model,
    featureId
  })
};

//get feature of a project
export const getFeatureService = async(projectId, featureId) => {
    if(!projectId || !featureId){
      throw new Error("Ids are required to get feature")
    }
    console.log("projectId"+projectId+"featureId "+featureId);
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
  console.log("featureid", featureId)

  const updates = mapUpdateProjectDTOtoProjectModel(dto)
  return updateFeature(clientId, projectId, featureId, updates);
}

//delete project
export const deleteProjectService = async (clientId, projectId) => {
  if (!clientId || !projectId) {
    throw new Error("The ids are required for query");
  }

  const features = await featAll(clientId, projectId);
  const featureIds = features.map(item => item.SK?.split("#")[3]);
  console.log(featureIds)
  // Delete each feature except "0"
  for (const featureId of featureIds) {
    if (featureId !== "0") {
      console.log("featureid: "+featureId+"clientId: "+clientId+"projectId: "+projectId)
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
    throw new Error("The ids are required for query")
  }
  console.log("featureid: "+featureId+"clientId: "+clientId+"projectId: "+projectId)
  const result = await deleteFeature(clientId, projectId, featureId);
  return result;
}


//query by date
export const getProjectsbyquerydateService = async(queryDate) => {
  if(!queryDate){
    throw new Error("valid Query date is needed to retreive information")
  }

  const projects = await projectsByQueryDate(queryDate)
  return projects;
}