import React, { useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useCreateComment } from "../hooks/useCreateComment";

const CommentInput = ({ taskId }) => {
  const { user } = useAuth();
  const createComment = useCreateComment(taskId, user);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    try {
      await createComment.mutateAsync({
        taskId,
        content: trimmedContent,
      });
      setContent("");
    } catch {
      // Error state is handled by parent list section
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Add comment
      </label>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a comment..."
        className="min-h-[96px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createComment.isPending || !content.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createComment.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <SendHorizontal className="h-4 w-4" />
              Comment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
