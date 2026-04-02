import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import { normalizeTaskStatus } from "../utils/groupTasks";

export const getTasksQueryKey = (projectId) => ["tasks", projectId];

function normalizeTask(task) {
  return {
    ...task,
    status: normalizeTaskStatus(task.status),
    priority: String(task.priority || "medium").toLowerCase(),
  };
}

async function fetchTasks(projectId) {
  const response = await api.get(`/tasks?project=${projectId}`);
  return response.data.map(normalizeTask);
}

export function useTasks(projectId) {
  return useQuery({
    queryKey: getTasksQueryKey(projectId),
    queryFn: () => fetchTasks(projectId),
    enabled: Boolean(projectId),
  });
}
