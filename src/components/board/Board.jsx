import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";
import Column from "./Column";

const STATUSES = [
  { id: "TODO", label: "TODO" },
  { id: "IN_PROGRESS", label: "IN PROGRESS" },
  { id: "DONE", label: "DONE" },
];

const Board = ({ projectId }) => {
  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      // Axios call to the backend API matching the requirement
      const response = await api.get(`/tasks/?project=${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading board...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 m-6">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          Failed to load tasks: {error.message}
        </p>
      </div>
    );
  }

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    const status = task.status || "TODO";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto custom-scrollbar p-6 items-start h-full w-full">
        {STATUSES.map((statusObj) => (
          <Column
            key={statusObj.id}
            title={statusObj.label}
            status={statusObj.id}
            tasks={tasksByStatus[statusObj.id] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
