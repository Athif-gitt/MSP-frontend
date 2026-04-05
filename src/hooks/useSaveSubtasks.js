import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSubtasks } from "../services/aiService";

export function useSaveSubtasks(options = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: ({ parentTaskId, subtasks }) => saveSubtasks(parentTaskId, subtasks),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
}
