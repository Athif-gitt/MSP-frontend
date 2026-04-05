import { useMutation } from "@tanstack/react-query";
import { generateSubtasks } from "../services/aiService";

export function useGenerateSubtasks(options = {}) {
  return useMutation({
    mutationFn: ({ taskId, priorityHint }) => generateSubtasks(taskId, priorityHint),
    ...options,
  });
}
