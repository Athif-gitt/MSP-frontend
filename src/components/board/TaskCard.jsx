import React from "react";
import { format } from "date-fns"; // Standard for date formatting, we will need to add this
import { CalendarIcon, ClockIcon } from "lucide-react";
import TaskActions from "../TaskActions";

const TaskCard = ({ task }) => {
  // Utility to get initials from name or assigned_to uuid
  const getInitials = (assignee) => {
    if (!assignee) return "?";
    // If it's a UUID, we just show a generic icon or the first two characters as a placeholder
    // Ideally the backend populates assignee details (name), but handling the uuid case:
    if (assignee.length > 5 && assignee.includes("-")) {
      return assignee.substring(0, 2).toUpperCase();
    }
    const names = assignee.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return assignee.substring(0, 2).toUpperCase();
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3 group"
      title={`Task: ${task.title}`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="text-sm font-medium text-slate-800 leading-snug group-hover:text-amber-600 transition-colors">
          {task.title}
        </h4>
        <div onClick={(e) => e.stopPropagation()}>
          <TaskActions task={task} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            isOverdue ? "text-red-500" : "text-slate-500"
          }`}
        >
          {task.due_date ? (
            <>
              {isOverdue ? (
                <ClockIcon className="w-3.5 h-3.5" />
              ) : (
                <CalendarIcon className="w-3.5 h-3.5" />
              )}
              <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
            </>
          ) : (
            <span className="text-slate-400">No due date</span>
          )}
        </div>

        <div
          className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-semibold text-amber-800"
          title={`Assignee: ${task.assigned_to || "Unassigned"}`}
        >
          {getInitials(task.assigned_to)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
