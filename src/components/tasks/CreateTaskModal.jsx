import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

const CreateTaskModal = ({ projectId, onClose }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/tasks/", {
        project: projectId,
        title: title.trim(),
        description: description.trim(),
        status: "TODO",
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },
    onError: (mutationError) => {
      const data = mutationError.response?.data;

      if (typeof data === "string") {
        setError(data);
        return;
      }

      if (data?.project?.length) {
        setError(data.project[0]);
        return;
      }

      if (data?.title?.length) {
        setError(data.title[0]);
        return;
      }

      if (data?.detail) {
        setError(data.detail);
        return;
      }

      setError("Failed to create task.");
    },
  });

  const handleCreate = () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setError("");
    createTaskMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-900 mb-5">
          Create Task
        </h2>

        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={createTaskMutation.isPending}
          />

          <textarea
            className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={createTaskMutation.isPending}
          />

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={createTaskMutation.isPending}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={createTaskMutation.isPending}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createTaskMutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
