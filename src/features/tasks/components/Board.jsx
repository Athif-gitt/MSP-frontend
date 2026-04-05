import React, { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AlertTriangle, Loader2 } from "lucide-react";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useTasks } from "../hooks/useTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";
import {
  groupTasks,
  normalizeTaskStatus,
  TASK_STATUSES,
} from "../utils/groupTasks";

function getDropStatus(over) {
  if (!over) return null;

  const columnStatus = over.data.current?.status;
  if (columnStatus) return normalizeTaskStatus(columnStatus);

  const taskStatus = over.data.current?.task?.status;
  if (taskStatus) return normalizeTaskStatus(taskStatus);

  return null;
}

function moveTask(tasks, taskId, nextStatus) {
  const normalizedNextStatus = normalizeTaskStatus(nextStatus);
  const taskToMove = tasks.find((task) => task.id === taskId);

  if (!taskToMove || normalizeTaskStatus(taskToMove.status) === normalizedNextStatus) {
    return tasks;
  }

  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          status: normalizedNextStatus,
        }
      : task
  );
}

const Board = ({ projectId }) => {
  const { data: tasks = [], isLoading, isError, error } = useTasks(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [previewTasks, setPreviewTasks] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [lastOverStatus, setLastOverStatus] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const displayTasks = previewTasks ?? tasks;
  const groupedTasks = useMemo(() => groupTasks(displayTasks), [displayTasks]);

  const activeTask = useMemo(
    () => displayTasks.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, displayTasks]
  );

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  );

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
    setLastOverStatus(normalizeTaskStatus(event.active.data.current?.task?.status));
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
    setPreviewTasks(null);
    setLastOverStatus(null);
  };

  const handleDragOver = (event) => {
    const activeTask = event.active.data.current?.task;
    const nextStatus = getDropStatus(event.over);
    const sourceTasks = previewTasks ?? tasks;

    if (
      !activeTask ||
      !nextStatus ||
      normalizeTaskStatus(activeTask.status) === nextStatus
    ) {
      return;
    }

    setLastOverStatus(nextStatus);
    setPreviewTasks(moveTask(sourceTasks, activeTask.id, nextStatus));
  };

  const handleDragEnd = (event) => {
    const draggedTask = event.active.data.current?.task;
    const nextStatus = getDropStatus(event.over) ?? lastOverStatus;

    setActiveTaskId(null);
    setLastOverStatus(null);

    if (
      !draggedTask ||
      !nextStatus ||
      normalizeTaskStatus(draggedTask.status) === nextStatus
    ) {
      setPreviewTasks(null);
      return;
    }

    updateTaskMutation.mutate(
      {
        taskId: draggedTask.id,
        updates: {
          status: nextStatus,
        },
      },
      {
        onSettled: () => {
          setPreviewTasks(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-slate-500">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading tasks...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="text-lg font-semibold text-slate-900">Failed to load board</h2>
        <p className="mt-1 text-sm text-slate-600">
          {error?.response?.data?.detail || error?.message || "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-500">
          No tasks yet. Create your first task to start organizing this board.
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6 overflow-x-auto pb-2">
          {TASK_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={groupedTasks[status]}
              disabled={updateTaskMutation.isPending}
              onTaskClick={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask ? (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTaskId(null)}
        />
      ) : null}
    </div>
  );
};

export default Board;
