
import React from 'react';
import { TaskList } from './TaskList';

interface TimeBlockProps {
  startTime: string;
  endTime: string;
  tasks: string[];
  onTimeChange: (field: 'startTime' | 'endTime', newTime: string) => void;
  onTasksChange: (tasks: string[]) => void;
  onRemove?: () => void;
}

export function TimeBlock({ 
  startTime, 
  endTime, 
  tasks, 
  onTimeChange, 
  onTasksChange, 
  onRemove 
}: TimeBlockProps) {
  return (
    <div className="time-block print-border group">
      <div className="time-label">
        <div className="flex flex-col items-center gap-1">
          <input
            type="text"
            value={startTime}
            onChange={(e) => onTimeChange('startTime', e.target.value)}
            className="bg-transparent text-center font-black text-white placeholder-gray-300 w-full outline-none text-lg"
            placeholder="00:00"
          />
          <div className="text-gray-300 font-bold text-sm">TO</div>
          <input
            type="text"
            value={endTime}
            onChange={(e) => onTimeChange('endTime', e.target.value)}
            className="bg-transparent text-center font-black text-white placeholder-gray-300 w-full outline-none text-lg"
            placeholder="00:00"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-white hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity no-print text-xs font-black"
            title="Remove this time block"
          >
            ✕
          </button>
        )}
      </div>
      <div className="task-area">
        <TaskList 
          tasks={tasks} 
          onTasksChange={onTasksChange}
        />
      </div>
    </div>
  );
}
