import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommentsQueryKey } from "./useComments";
import api from "../../../services/api";

function buildTempComment(taskId, content, currentUser) {
  return {
    id: `temp-${taskId}-${Date.now()}`,
    content,
    author: currentUser
      ? {
          id: currentUser.id,
          email: currentUser.email,
        }
      : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    __optimistic: true,
  };
}

async function createComment({ taskId, content }) {
  const response = await api.post(`/tasks/${taskId}/comments/`, { content });
  return response.data;
}

export function useCreateComment(taskId, currentUser) {
  const queryClient = useQueryClient();
  const queryKey = getCommentsQueryKey(taskId);

  return useMutation({
    mutationFn: createComment,
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey) ?? [];
      const optimisticComment = buildTempComment(taskId, content, currentUser);

      queryClient.setQueryData(queryKey, (current = []) => [
        optimisticComment,
        ...current,
      ]);

      return { previousComments, optimisticCommentId: optimisticComment.id };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComments ?? []);
    },
    onSuccess: (createdComment, _variables, context) => {
      queryClient.setQueryData(queryKey, (current = []) =>
        current.map((comment) =>
          comment.id === context?.optimisticCommentId ? createdComment : comment
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
