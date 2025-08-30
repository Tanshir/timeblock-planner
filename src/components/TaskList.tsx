
import React from 'react';

interface TaskListProps {
  tasks: string[];
  onTasksChange: (tasks: string[]) => void;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const addTask = () => {
    onTasksChange([...tasks, '']);
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    onTasksChange(newTasks);
  };

  const removeTask = (index: number) => {
    onTasksChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center group">
          <textarea
            value={task}
            onChange={(e) => updateTask(index, e.target.value)}
            className="task-item flex-1"
            placeholder="Add task..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addTask();
              }
            }}
          />
          <button
            onClick={() => removeTask(index)}
            className="ml-2 text-xs text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 no-print font-black"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addTask}
        className="add-task-btn no-print"
      >
        + Add Task
      </button>
    </div>
  );
}
