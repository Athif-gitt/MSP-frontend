import React from 'react';

const ProjectCard = ({ project }) => {
    return (
        <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg ${project.colorBg} ${project.colorText} flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{project.icon}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 dark:hover:text-slate-200 transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400 text-sm">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">task_alt</span>
                        {project.tasks} tasks
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        Updated {project.updated}
                    </span>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {project.members && project.members.map((member, idx) => (
                        member.avatar ? (
                            <div key={idx} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url('${member.avatar}')` }}></div>
                        ) : (
                            <div key={idx} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {member.initials || `+${member.count}`}
                            </div>
                        )
                    ))}
                </div>
                <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${project.progressColor} h-full rounded-full`} style={{ width: `${project.progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
