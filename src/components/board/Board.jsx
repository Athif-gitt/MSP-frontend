import React, { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AlertCircle, Loader2 } from "lucide-react";
import Column from "./Column";
import TaskCard from "./TaskCard";
import {
  moveTaskInGroups,
  useTasks,
  useUpdateTaskStatus,
} from "../../hooks/useTasks";

const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    accent: "slate",
  },
  {
    id: "in_progress",
    title: "In Progress",
    accent: "blue",
  },
  {
    id: "done",
    title: "Done",
    accent: "emerald",
  },
];

function getDropStatus(over) {
  if (!over) return null;

  const columnStatus = over.data.current?.status;
  if (columnStatus) return columnStatus;

  const taskStatus = over.data.current?.task?.status;
  if (taskStatus) return taskStatus;

  return typeof over.id === "string" ? over.id : null;
}

const Board = ({ projectId }) => {
  const { groupedTasks, isLoading, isError, error } = useTasks(projectId);
  const updateTaskStatus = useUpdateTaskStatus(projectId);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [optimisticGroups, setOptimisticGroups] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const displayGroups = optimisticGroups ?? groupedTasks;

  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;

    const allTasks = Object.values(displayGroups).flat();
    return allTasks.find((task) => task.id === activeTaskId) ?? null;
  }, [activeTaskId, displayGroups]);

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
    setOptimisticGroups(null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const nextStatus = getDropStatus(over);
    const activeTask = active.data.current?.task;

    if (!nextStatus || !activeTask || activeTask.status === nextStatus) {
      return;
    }

    setOptimisticGroups((currentGroups) =>
      moveTaskInGroups(currentGroups ?? groupedTasks, active.id, nextStatus)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const task = active.data.current?.task;
    const nextStatus = getDropStatus(over);

    setActiveTaskId(null);

    if (!task || !nextStatus || task.status === nextStatus) {
      setOptimisticGroups(null);
      return;
    }

    updateTaskStatus.mutate(
      {
        taskId: task.id,
        status: nextStatus,
      },
      {
        onSettled: () => {
          setOptimisticGroups(null);
        },
      }
    );
  };

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
          Failed to load tasks: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 overflow-hidden">
        <div className="flex gap-6 overflow-x-auto custom-scrollbar p-6 items-start h-full w-full">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              status={column.id}
              title={column.title}
              accent={column.accent}
              tasks={displayGroups[column.id] ?? []}
              isUpdating={updateTaskStatus.isPending}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDraggingOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
