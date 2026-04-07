import api from "./api";

/*
Fetch all projects
*/
export const getProjects = async () => {
  const res = await api.get("/projects/");
  return res.data;
};

/*
Create project
*/
export const createProject = async (data) => {
  const res = await api.post("/projects/", data);
  return res.data;
};

/*
Update project
*/
export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/${id}/`, data);
  return res.data;
};

/*
Delete project
*/
export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}/`);
  return res.data;
};

/*
Fetch single project
*/
export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}/`);
  return res.data;
};

const isProjectPrimaryKey = (value) =>
  /^\d+$/.test(value) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

/*
Fetch single project by route identifier
Supports database IDs (numeric or UUID) and public_id from search results / URLs.
*/
export const getProjectByIdentifier = async (identifier) => {
  const value = String(identifier ?? "").trim();

  if (!value) {
    throw new Error("Project identifier is required");
  }

  if (isProjectPrimaryKey(value)) {
    return getProjectById(value);
  }

  const projects = await getProjects();
  const matchedProject = projects.find(
    (project) => String(project.public_id).trim().toLowerCase() === value.toLowerCase()
  );

  if (!matchedProject) {
    throw new Error(`Project not found for identifier: ${value}`);
  }

  return matchedProject;
};
