import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/board/Board';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { ChevronLeft } from 'lucide-react';
import { getProjectById } from "../services/projectService";
import { useQuery } from "@tanstack/react-query";

const BoardPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: project, isLoading } = useQuery({
  queryKey: ["project", projectId],
  queryFn: () => getProjectById(projectId),
});

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">

            {/* Header */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-slate-200 bg-white">
                
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Projects
                    </button>

                    <div className="h-4 w-px bg-slate-200"></div>

                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                            Project Board
                        </h1>

                        <p className="text-sm text-slate-500 font-medium">
                            Project ID : {project?.public_id}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex gap-2">

                    <button className="h-8 px-3 rounded-md bg-white border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50 shadow-sm transition-colors">
                        Filter
                    </button>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-8 px-3 rounded-md bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        New Task
                    </button>

                </div>
            </header>

            {/* Board Container */}
            <div className="flex-1 overflow-hidden">
                {project ? (
                    <Board projectId={project.id} />
                ) : (
                    <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
                        <span className="text-sm font-medium">Loading project details...</span>
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {isCreateOpen && project && (
                <CreateTaskModal
                    projectId={project.id}
                    onClose={() => setIsCreateOpen(false)}
                />
            )}

        </div>
    );
};

export default BoardPage;