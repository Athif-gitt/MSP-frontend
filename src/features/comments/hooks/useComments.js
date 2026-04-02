import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";

export const getCommentsQueryKey = (taskId) => ["comments", taskId];

async function fetchComments(taskId) {
  const response = await api.get(`/tasks/${taskId}/comments/`);
  return response.data;
}

export function useComments(taskId) {
  return useQuery({
    queryKey: getCommentsQueryKey(taskId),
    queryFn: () => fetchComments(taskId),
    enabled: Boolean(taskId),
  });
}
