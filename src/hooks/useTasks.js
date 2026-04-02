import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const STATUS_ORDER = ["todo", "in_progress", "done"];

const API_STATUS_MAP = {
  todo: "TODO",
  in_progress: "IN_PROGRESS",
  done: "DONE",
};

const UI_STATUS_MAP = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  todo: "todo",
  in_progress: "in_progress",
  done: "done",
};

const EMPTY_GROUPS = {
  todo: [],
  in_progress: [],
  done: [],
};

function normalizeStatus(status) {
  return UI_STATUS_MAP[status] ?? "todo";
}

function toApiStatus(status) {
  return API_STATUS_MAP[status] ?? API_STATUS_MAP.todo;
}

function normalizeTask(task) {
  return {
    ...task,
    status: normalizeStatus(task.status),
    priority: task.priority?.toLowerCase?.() ?? "medium",
  };
}

async function fetchTasks(projectId) {
  const response = await api.get(`/tasks/?project=${projectId}`);
  return response.data.map(normalizeTask);
}

async function patchTaskStatus({ taskId, status }) {
  const response = await api.patch(`/tasks/${taskId}/`, {
    status: toApiStatus(status),
  });

  return normalizeTask(response.data);
}

export function useTasks(projectId) {
  const query = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId),
    enabled: Boolean(projectId),
  });

  const groupedTasks = useMemo(() => {
    return (query.data ?? []).reduce((groups, task) => {
      const status = normalizeStatus(task.status);
      groups[status].push(task);
      return groups;
    }, {
      todo: [],
      in_progress: [],
      done: [],
    });
  }, [query.data]);

  return {
    ...query,
    tasks: query.data ?? [],
    groupedTasks,
    statuses: STATUS_ORDER,
  };
}

export function useUpdateTaskStatus(projectId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTaskStatus,
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      const previousTasks = queryClient.getQueryData(["tasks", projectId]) ?? [];

      queryClient.setQueryData(["tasks", projectId], (current = []) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: normalizeStatus(status),
              }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId], context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", projectId], (current = []) =>
        current.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function moveTaskInGroups(groups, taskId, nextStatus) {
  const normalizedStatus = normalizeStatus(nextStatus);
  const nextGroups = {
    todo: [...(groups.todo ?? [])],
    in_progress: [...(groups.in_progress ?? [])],
    done: [...(groups.done ?? [])],
  };

  let movedTask = null;

  for (const status of STATUS_ORDER) {
    const filteredTasks = nextGroups[status].filter((task) => {
      if (task.id === taskId) {
        movedTask = {
          ...task,
          status: normalizedStatus,
        };
        return false;
      }

      return true;
    });

    nextGroups[status] = filteredTasks;
  }

  if (!movedTask) {
    return groups ?? EMPTY_GROUPS;
  }

  nextGroups[normalizedStatus] = [movedTask, ...nextGroups[normalizedStatus]];

  return nextGroups;
}
