import React from 'react';
import SearchResultItem from './SearchResultItem';
import { Loader2 } from 'lucide-react';

export default function SearchDropdown({
    query,
    isLoading,
    projects,
    tasks,
    visible,
    activeIndex,
    onSelect,
    onHover,
}) {
    if (!visible) return null;

    const hasResults = projects.length > 0 || tasks.length > 0;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 max-h-[85vh] overflow-y-auto flex flex-col">
            {isLoading ? (
                <div className="flex items-center justify-center p-8 text-slate-400 font-medium text-sm gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                </div>
            ) : !hasResults && query ? (
                <div className="p-8 text-center text-sm text-slate-500">
                    No results found for matching "<span className="font-medium text-slate-700">{query}</span>"
                </div>
            ) : hasResults ? (
                <div className="py-2 flex-1 overflow-y-auto" role="listbox" id="search-dropdown">
                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <div className="mb-1">
                            <div className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Projects
                            </div>
                            {projects.map((project, idx) => (
                                <SearchResultItem
                                    key={`project-${project.id}`}
                                    item={{ type: 'project', data: project }}
                                    query={query}
                                    isActive={idx === activeIndex}
                                    onSelect={onSelect}
                                    onMouseEnter={() => onHover(idx)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Tasks Section */}
                    {tasks.length > 0 && (
                        <div>
                            {projects.length > 0 && <div className="h-px bg-slate-100 mx-4 my-1"></div>}
                            <div className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Tasks
                            </div>
                            {tasks.map((task, idx) => {
                                const globalIdx = projects.length + idx;
                                return (
                                    <SearchResultItem
                                        key={`task-${task.id}`}
                                        item={{ type: 'task', data: task }}
                                        query={query}
                                        isActive={globalIdx === activeIndex}
                                        onSelect={onSelect}
                                        onMouseEnter={() => onHover(globalIdx)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : null}
            
            {/* Footer */}
            {hasResults && (
                <div className="bg-slate-50 px-4 py-2.5 text-xs text-slate-500 flex items-center gap-4 border-t border-slate-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-sans leading-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-slate-600">↑</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-sans leading-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-slate-600">↓</kbd>
                        <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-sans leading-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-slate-600">↵</kbd>
                        <span>to select</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-sans leading-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[10px] text-slate-600">ESC</kbd>
                        <span>to close</span>
                    </div>
                </div>
            )}
        </div>
    );
}
