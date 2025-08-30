
import React from 'react';
import { TaskList } from './TaskList';

interface TimeBlockProps {
  hour: string;
  tasks: string[];
  onTimeChange: (newTime: string) => void;
  onTasksChange: (tasks: string[]) => void;
}

export function TimeBlock({ hour, tasks, onTimeChange, onTasksChange }: TimeBlockProps) {
  return (
    <div className="time-block print-border">
      <div className="time-label">
        <input
          type="text"
          value={hour}
          onChange={(e) => onTimeChange(e.target.value)}
          className="bg-transparent text-center font-black text-white placeholder-gray-300 w-full outline-none"
          placeholder="00:00"
        />
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
