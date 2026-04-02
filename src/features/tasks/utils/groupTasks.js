const STATUSES = ["todo", "in_progress", "done"];

export function normalizeTaskStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value === "todo") return "todo";
  if (value === "in_progress") return "in_progress";
  if (value === "done") return "done";

  return "todo";
}

export function toApiTaskStatus(status) {
  const normalizedStatus = normalizeTaskStatus(status);

  if (normalizedStatus === "in_progress") return "IN_PROGRESS";
  if (normalizedStatus === "done") return "DONE";
  return "TODO";
}

export function groupTasks(tasks = []) {
  return tasks.reduce(
    (groups, task) => {
      const status = normalizeTaskStatus(task.status);
      groups[status].push(task);
      return groups;
    },
    {
      todo: [],
      in_progress: [],
      done: [],
    }
  );
}

export const TASK_STATUSES = STATUSES;
