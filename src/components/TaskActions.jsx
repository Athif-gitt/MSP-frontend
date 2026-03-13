import React from 'react';
import { useAuth } from '../context/AuthContext';
import { canDeleteTask } from '../utils/permissions';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const TaskActions = ({ task }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/tasks/${task.id}/`),
        onSuccess: () => {
             // Let the board query invalidate
             queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
    });

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteMutation.mutate();
        }
    };

    return (
        <div className="flex gap-2 items-center shrink-0">
            {canDeleteTask(user?.role) && (
                <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete Task"
                >
                    <Trash2 className="w-[14px] h-[14px]" />
                </button>
            )}
        </div>
    );
};

export default TaskActions;
