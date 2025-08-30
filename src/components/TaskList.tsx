
import React from 'react';

interface TaskListProps {
  tasks: string[];
  onTasksChange: (tasks: string[]) => void;
}

interface Task {
  text: string;
  completed: boolean;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  // Convert string array to Task objects for backward compatibility
  const taskObjects: Task[] = tasks.map(task => 
    typeof task === 'string' 
      ? { text: task, completed: false }
      : task as Task
  );

  const addTask = () => {
    const newTask = { text: '', completed: false };
    const newTasks = [...taskObjects, newTask];
    onTasksChange(newTasks.map(t => typeof t === 'string' ? t : t.text));
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...taskObjects];
    newTasks[index] = { ...newTasks[index], text: value };
    
    // Auto-add new task when user starts typing in the last empty task
    if (index === taskObjects.length - 1 && value.trim() !== '' && taskObjects[taskObjects.length - 1].text === '') {
      newTasks.push({ text: '', completed: false });
    }
    
    onTasksChange(newTasks.map(t => t.text));
  };

  const toggleTaskCompletion = (index: number) => {
    const newTasks = [...taskObjects];
    newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
    onTasksChange(newTasks.map(t => t.text));
  };

  const removeTask = (index: number) => {
    if (taskObjects.length > 1) {
      const newTasks = taskObjects.filter((_, i) => i !== index);
      onTasksChange(newTasks.map(t => t.text));
    }
  };

  return (
    <div>
      {taskObjects.map((task, index) => (
        <div key={index} className="flex items-center group">
          <button
            onClick={() => toggleTaskCompletion(index)}
            className="mr-3 w-4 h-4 border-2 border-gray-400 hover:border-black transition-colors flex-shrink-0 no-print"
            style={{
              backgroundColor: task.completed ? '#000' : 'transparent'
            }}
          >
            {task.completed && (
              <span className="text-white text-xs leading-none">✓</span>
            )}
          </button>
          <textarea
            value={task.text}
            onChange={(e) => updateTask(index, e.target.value)}
            className={`task-item flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
            placeholder="Start typing to add a task..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (task.text.trim() !== '') {
                  addTask();
                }
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
    </div>
  );
}
