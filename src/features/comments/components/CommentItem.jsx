import React, { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquareText, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useDeleteComment } from "../hooks/useDeleteComment";
import { useUpdateComment } from "../hooks/useUpdateComment";

function getInitial(email) {
  return String(email || "?").charAt(0).toUpperCase();
}

const CommentItem = ({ comment, taskId }) => {
  const { user } = useAuth();
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content || "");
  const isAuthor = user?.id && comment.author?.id === user.id;

  const timeLabel = useMemo(() => {
    const timestamp = comment.updated_at || comment.created_at;
    if (!timestamp) return "just now";

    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "just now";
    }
  }, [comment.created_at, comment.updated_at]);

  const handleSave = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || trimmedDraft === comment.content) {
      setDraft(comment.content);
      setIsEditing(false);
      return;
    }

    try {
      await updateComment.mutateAsync({
        commentId: comment.id,
        content: trimmedDraft,
      });
      setIsEditing(false);
    } catch {
      setDraft(comment.content);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      await deleteComment.mutateAsync(comment.id);
    } catch {
      // Parent query state handles rollback
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {getInitial(comment.author?.email)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {comment.author?.email || "Unknown user"}
              </p>
              <p className="text-xs text-slate-500">{timeLabel}</p>
            </div>

            {isAuthor ? (
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(comment.content);
                      setIsEditing(false);
                    }}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Edit comment"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteComment.isPending}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Delete comment"
                >
                  {deleteComment.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ) : null}
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(comment.content);
                    setIsEditing(false);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateComment.isPending || !draft.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateComment.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-700">
              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="whitespace-pre-wrap break-words">{comment.content}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default CommentItem;
