import React from 'react';
import { Folder, CheckSquare } from 'lucide-react';

const highlightText = (text, highlight) => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    
    // Escape regex characters from highlight text
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-blue-100 text-blue-900 font-medium rounded-sm px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

export default function SearchResultItem({ item, query, isActive, onSelect, onMouseEnter }) {
    const isProject = item.type === 'project';
    const Icon = isProject ? Folder : CheckSquare;
    const title = isProject ? item.data.name : item.data.title;
    const subtitle = isProject ? item.data.public_id : item.data.project?.name;

    return (
        <div
            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
            onClick={() => onSelect(item)}
            onMouseEnter={onMouseEnter}
            role="option"
            aria-selected={isActive}
        >
            <div className={`p-1.5 rounded-md ${isProject ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                <Icon size={16} strokeWidth={2} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                    {highlightText(title, query)}
                </span>
                {subtitle && (
                    <span className="text-xs text-slate-500 truncate">
                        {subtitle}
                    </span>
                )}
            </div>
            {isActive && (
                <span className="text-xs text-slate-400">
                    <kbd className="font-sans px-1.5 py-0.5 bg-slate-200 rounded">↵</kbd>
                </span>
            )}
        </div>
    );
}
