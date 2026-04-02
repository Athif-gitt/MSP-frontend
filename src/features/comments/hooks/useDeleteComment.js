import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { getCommentsQueryKey } from "./useComments";

async function deleteComment(commentId) {
  await api.delete(`/comments/${commentId}/`);
  return commentId;
}

export function useDeleteComment(taskId) {
  const queryClient = useQueryClient();
  const queryKey = getCommentsQueryKey(taskId);

  return useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousComments = queryClient.getQueryData(queryKey) ?? [];

      queryClient.setQueryData(queryKey, (current = []) =>
        current.filter((comment) => comment.id !== commentId)
      );

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousComments ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
