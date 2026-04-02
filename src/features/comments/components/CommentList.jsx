import React from "react";
import { AlertTriangle, Loader2, MessageCircleMore } from "lucide-react";
import { useComments } from "../hooks/useComments";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

const CommentList = ({ taskId }) => {
  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useComments(taskId);

  return (
    <section className="space-y-4 min-h-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
          <p className="text-sm text-slate-500">
            Discuss updates and leave context for this task.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {comments.length}
        </span>
      </div>

      <CommentInput taskId={taskId} />

      <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading comments...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {error?.response?.data?.detail ||
                  error?.message ||
                  "Failed to load comments."}
              </span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <MessageCircleMore className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-900">No comments yet</h4>
            <p className="mt-1 text-sm text-slate-500">
              Start the conversation on this task.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentList;
