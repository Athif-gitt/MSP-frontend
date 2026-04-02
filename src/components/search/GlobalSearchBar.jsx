import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import useGlobalSearch from '../../hooks/useGlobalSearch';
import SearchDropdown from './SearchDropdown';

export default function GlobalSearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const debouncedQuery = useDebounce(query, 300);
    const { data, isLoading } = useGlobalSearch(debouncedQuery);

    const safeFilter = (items, key) => {
        if (!items) return [];
        const q = (debouncedQuery || "").toLowerCase().trim();
        if (!q) return items;
        return items.filter(item => {
            const val = item[key] || '';
            const subtitle = item.public_id || item.project?.name || '';
            return val.toLowerCase().includes(q) || subtitle.toLowerCase().includes(q);
        });
    };

    const projects = safeFilter(data?.projects, 'name').slice(0, 5);
    const tasks = safeFilter(data?.tasks, 'title').slice(0, 5);
    const flattenedResults = [
        ...projects.map(p => ({ type: 'project', data: p })),
        ...tasks.map(t => ({ type: 'task', data: t }))
    ];

    const showDropdown = isFocused && query.trim().length > 0;

    // Reset active index when query or data changes
    useEffect(() => {
        setActiveIndex(-1);
    }, [debouncedQuery, data]);

    // Click outside logic
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Global keyboard shortcut Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDownCapture = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDownCapture);
        return () => document.removeEventListener('keydown', handleKeyDownCapture);
    }, []);

    const handleKeyDown = (e) => {
        if (!showDropdown || flattenedResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < flattenedResults.length) {
                handleSelect(flattenedResults[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleSelect = (item) => {
        setIsFocused(false);
        setQuery('');
        
        if (item.type === 'project') {
            navigate(`/projects/${item.data.public_id || item.data.id}/board`);
        } else if (item.type === 'task') {
            const projectId = item.data.project?.public_id || item.data.project?.id || item.data.project;
            navigate(`/projects/${projectId}/board?task=${item.data.id}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full group flex items-center">
            <Search 
                size={18} 
                strokeWidth={1.5} 
                className={`absolute left-3 transition-colors z-10 ${
                    isFocused ? 'text-[#2563EB]' : 'text-slate-400'
                }`} 
            />
            
            <input
                ref={inputRef}
                type="text"
                className={`w-full bg-white border rounded-md pl-10 pr-12 py-2 text-sm transition-all outline-none text-slate-900 placeholder:text-slate-400 shadow-sm ${
                    isFocused 
                        ? 'ring-1 ring-[#2563EB] border-[#2563EB]' 
                        : 'border-[#E5E7EB] hover:border-slate-300'
                }`}
                placeholder="Search tasks, projects, or commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={showDropdown}
                aria-controls="search-dropdown"
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            />

            <div className="absolute right-3 flex items-center gap-1 z-10">
                {query.length > 0 && isFocused ? (
                    <button 
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors mr-1"
                    >
                        <X size={14} strokeWidth={2} />
                    </button>
                ) : null}
                
                {!isFocused && !query && (
                    <>
                        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded shadow-sm">⌘</kbd>
                        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded shadow-sm">K</kbd>
                    </>
                )}
            </div>

            <SearchDropdown 
                query={debouncedQuery}
                isLoading={isLoading}
                projects={projects}
                tasks={tasks}
                visible={showDropdown}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                onHover={setActiveIndex}
            />
        </div>
    );
}
