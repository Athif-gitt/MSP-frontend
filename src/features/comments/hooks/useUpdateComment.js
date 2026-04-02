import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { getCommentsQueryKey } from "./useComments";

async function updateComment({ commentId, content }) {
  const response = await api.patch(`/comments/${commentId}/`, { content });
  return response.data;
}

export function useUpdateComment(taskId) {
  const queryClient = useQueryClient();
  const queryKey = getCommentsQueryKey(taskId);

  return useMutation({
    mutationFn: updateComment,
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey) ?? [];

      queryClient.setQueryData(queryKey, (current = []) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content,
                updated_at: new Date().toISOString(),
              }
            : comment
        )
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComments ?? []);
    },
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(queryKey, (current = []) =>
        current.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
