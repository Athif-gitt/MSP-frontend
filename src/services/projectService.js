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