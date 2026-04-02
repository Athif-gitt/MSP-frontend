import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { getTasksQueryKey } from "./useTasks";
import { normalizeTaskStatus, toApiTaskStatus } from "../utils/groupTasks";

function normalizeTask(task) {
  return {
    ...task,
    status: normalizeTaskStatus(task.status),
    priority: String(task.priority || "medium").toLowerCase(),
    due_date: task.due_date || null,
    assigned_to: task.assigned_to ?? null,
  };
}

function normalizeUpdates(updates) {
  const nextUpdates = { ...updates };

  if ("status" in nextUpdates) {
    nextUpdates.status = normalizeTaskStatus(nextUpdates.status);
  }

  if ("priority" in nextUpdates && nextUpdates.priority) {
    nextUpdates.priority = String(nextUpdates.priority).toLowerCase();
  }

  if ("due_date" in nextUpdates) {
    nextUpdates.due_date = nextUpdates.due_date || null;
  }

  if ("assigned_to" in nextUpdates) {
    nextUpdates.assigned_to = nextUpdates.assigned_to || null;
  }

  return nextUpdates;
}

function toApiUpdates(updates) {
  const payload = { ...updates };

  if ("status" in payload) {
    payload.status = toApiTaskStatus(payload.status);
  }

  if ("priority" in payload && payload.priority) {
    payload.priority = String(payload.priority).toUpperCase();
  }

  if ("due_date" in payload) {
    payload.due_date = payload.due_date || null;
  }

  if ("assigned_to" in payload) {
    payload.assigned_to = payload.assigned_to || null;
  }

  return payload;
}

async function patchTask({ taskId, updates }) {
  const response = await api.patch(`/tasks/${taskId}/`, toApiUpdates(updates));
  return normalizeTask(response.data);
}

export function useUpdateTask(projectId) {
  const queryClient = useQueryClient();
  const queryKey = getTasksQueryKey(projectId);

  return useMutation({
    mutationFn: patchTask,
    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData(queryKey) ?? [];
      const normalizedUpdates = normalizeUpdates(updates);

      queryClient.setQueryData(queryKey, (currentTasks = []) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...normalizedUpdates,
              }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKey, (currentTasks = []) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
