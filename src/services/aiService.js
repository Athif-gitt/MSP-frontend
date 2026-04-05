import api from "./api";

export const generateSubtasks = async (taskId, priorityHint) => {
  const response = await api.post("/ai/generate-subtasks/", {
    task_id: taskId,
    priority_hint: priorityHint,
  });

  return response.data;
};

export const saveSubtasks = async (parentTaskId, subtasks) => {
  const response = await api.post("/bulk-create-subtasks/", {
    parent_task_id: parentTaskId,
    subtasks,
  });

  return response.data;
};
